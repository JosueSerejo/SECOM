/* --- VII SECOM 2026 - CONTROLE DE LIBERAÇÃO DOS FORMULÁRIOS --- */
const inscricoesAbertas = true;
const submissoesAbertas = false;

document.addEventListener("DOMContentLoaded", () => {
    const formElement = document.getElementById("meu-form");
    const isSubmissionPage = document.body.classList.contains("submission-page");

    /* 1. LÓGICA DE EXIBIÇÃO/BLOQUEIO (ABERTO/FECHADO) */
    if (isSubmissionPage) {
        const badgeText = document.querySelector("#submission .inscricao-badge");
        if (!submissoesAbertas && formElement) {
            if (badgeText) {
                badgeText.innerHTML = `<span class="badge-dot" style="background: #ff3333; box-shadow: 0 0 6px #ff3333;"></span> Submissões Encerradas`;
                badgeText.style.color = "#ff5555";
                badgeText.style.background = "rgba(255, 51, 51, 0.1)";
                badgeText.style.borderColor = "rgba(255, 51, 51, 0.3)";
            }
            formElement.style.display = "none";
            const formContainer = formElement.parentElement;
            const avisoEncerrado = document.createElement("div");
            avisoEncerrado.className = "embed-notice";
            avisoEncerrado.innerHTML = `
                <div class="embed-icon"><i data-lucide="calendar-x"></i></div>
                <h4>Submissões Encerradas!</h4>
                <p>O prazo para envio de trabalhos para a VII SECOM foi encerrado.</p>
            `;
            formContainer.appendChild(avisoEncerrado);
            lucide.createIcons();
        }
    } else {
        const badgeContainer = document.getElementById("inscricao-status-badge");
        const badgeDot = document.getElementById("inscricao-status-dot");
        const badgeText = document.getElementById("inscricao-status-text");
        const formContainer = document.getElementById("form-content");

        if (inscricoesAbertas) {
            if (formElement) formElement.style.display = "flex";
            if (badgeText) badgeText.innerText = "Inscrições Abertas";
        } else {
            if (formElement) formElement.style.display = "none";
            if (badgeText) badgeText.innerText = "Inscrições não iniciadas";
            if (badgeDot) {
                badgeDot.style.background = "#ff3333";
                badgeDot.style.boxShadow = "0 0 6px #ff3333";
            }
            if (badgeContainer) {
                badgeContainer.style.background = "rgba(255, 51, 51, 0.1)";
                badgeContainer.style.borderColor = "rgba(255, 51, 51, 0.3)";
                badgeContainer.style.color = "#ff5555";
            }
            if (formContainer && !document.getElementById("form-coming-soon")) {
                const avisoBreve = document.createElement("div");
                avisoBreve.className = "embed-notice";
                avisoBreve.id = "form-coming-soon";
                avisoBreve.innerHTML = `
                    <div class="embed-icon"><i data-lucide="calendar-clock"></i></div>
                    <h4>Inscrições em Breve!</h4>
                    <p>O formulário para inscrições será liberado nos próximos dias.</p>
                `;
                formContainer.appendChild(avisoBreve);
                lucide.createIcons();
            }
        }
    }

    /* 2. LÓGICA DE ENVIO (SUBMIT) */
    if (formElement) {
        formElement.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formContent = document.getElementById("form-content");

            // Feedback visual de carregamento
            formContent.innerHTML = `
                <div class="inscricao-sucesso">
                    <div class="sucesso-icon"><i data-lucide="loader-2" class="spin"></i></div>
                    <h2>Enviando...</h2>
                    <p>Por favor, aguarde enquanto processamos sua solicitação.</p>
                </div>
            `;
            lucide.createIcons();

            if (isSubmissionPage) {
                /* --- ENVIO PARA APPS SCRIPT (SUBMISSÃO DE TRABALHOS) --- */
                const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyxnXS5CKyPiTVthWlNFSGQTtMAGohgECx5xN89PzZoZuavIM8yG1c6ytofMe71tZVN/exec";

                try {
                    const formData = new FormData(formElement);
                    const data = {};

                    data.autor = formData.get("entry.743009220");
                    data.email = formData.get("entry.1485760061");
                    data.telefone = formData.get("entry.1636520307");
                    data.cidadeEstado = formData.get("entry.1763209583");
                    data.instituicao = formData.get("entry.701128269");
                    data.modalidade = formData.get("entry.1033813828");
                    data.areaTematica = formData.get("entry.1013045063");
                    data.subarea = formData.get("entry.1725331058");
                    data.titulo = formData.get("entry.1795756907");

                    const fileInput = formElement.querySelector('input[type="file"]');
                    if (fileInput && fileInput.files.length > 0) {
                        const file = fileInput.files[0];
                        data.fileName = file.name;
                        data.fileData = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.readAsDataURL(file);
                        });
                    }

                    const response = await fetch(GAS_WEB_APP_URL, {
                        method: "POST",
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (result.status === "success") {
                        formContent.innerHTML = `
                            <div class="inscricao-sucesso">
                                <div class="sucesso-icon"><i data-lucide="circle-check-big"></i></div>
                                <h2>Submissão Realizada!</h2>
                                <p>Seu trabalho foi enviado com sucesso para a <strong>VII SECOM</strong>.</p>
                                <p class="sucesso-sub">Você receberá uma confirmação por e-mail em breve.</p>
                            </div>
                        `;
                    } else {
                        throw new Error(result.message || "Erro no servidor.");
                    }
                } catch (error) {
                    formContent.innerHTML = `
                        <div class="inscricao-sucesso">
                            <div class="sucesso-icon"><i data-lucide="circle-x" style="color: #ff3333;"></i></div>
                            <h2>Erro no Envio</h2>
                            <p>Ocorreu um problema ao processar sua submissão. Por favor, tente novamente.</p>
                        </div>
                    `;
                }
            } else {
                /* --- ENVIO PARA GOOGLE FORMS (INSCRIÇÃO GERAL) --- */
                const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScKlTQu_f74VmnoF0hJyN5ZRAJuC_8u5FmEH5luwzwCu-hydQ/formResponse";
                const formData = new FormData(formElement);

                try {
                    await fetch(FORM_URL, {
                        method: "POST",
                        mode: "no-cors",
                        body: formData
                    });

                    formContent.innerHTML = `
                        <div class="inscricao-sucesso">
                            <div class="sucesso-icon"><i data-lucide="circle-check-big"></i></div>
                            <h2>Inscrição Realizada!</h2>
                            <p>Sua inscrição na <strong>SECOM 2026</strong> foi confirmada.</p>
                            <p class="sucesso-sub">Acompanhe as novidades do evento pelo seu e-mail.</p>
                        </div>
                    `;
                } catch (error) {
                    formContent.innerHTML = `
                        <div class="inscricao-sucesso">
                            <div class="sucesso-icon"><i data-lucide="circle-x" style="color: #ff3333;"></i></div>
                            <h2>Erro no Envio</h2>
                            <p>Não foi possível completar sua inscrição. Tente novamente.</p>
                        </div>
                    `;
                }
            }
            lucide.createIcons();
        });
    }

    /* 3. VALIDAÇÃO, MÁSCARAS E CAMPOS DINÂMICOS */
    const pdfInput = document.getElementById("pdf-file");
    if (pdfInput) {
        pdfInput.addEventListener("change", function() {
            const file = this.files[0];
            if (file && file.type !== "application/pdf") {
                alert("Atenção: Por favor, selecione apenas arquivos no formato PDF.");
                this.value = "";
            }
        });
    }

    const emailInput = document.querySelector('input[type="email"]');
    const telefoneInput = document.querySelector('input[type="tel"]');
    const autorInput = document.querySelector('input[name="entry.743009220"]');

    document.querySelectorAll('select.instituicao-select').forEach(instituicaoSelect => {
        const nameOriginal = instituicaoSelect.name;
        const groupContainer = instituicaoSelect.parentElement;

        instituicaoSelect.addEventListener("change", (e) => {
            let extraInput = groupContainer.querySelector(".instituicao-outro-input");
            if (e.target.value === "Outra") {
                if (!extraInput) {
                    extraInput = document.createElement("input");
                    extraInput.type = "text";
                    extraInput.className = "instituicao-outro-input";
                    extraInput.placeholder = "Digite o nome da sua instituição";
                    extraInput.required = true;
                    extraInput.style.marginTop = "0.8rem";
                    groupContainer.appendChild(extraInput);
                }
                instituicaoSelect.removeAttribute("name");
                extraInput.name = nameOriginal;
                extraInput.focus();
            } else {
                if (extraInput) extraInput.remove();
                instituicaoSelect.name = nameOriginal;
            }
        });
    });

    if (telefoneInput) {
        telefoneInput.addEventListener("input", (e) => {
            let valor = e.target.value.replace(/\D/g, "");
            valor = valor.substring(0, 11);
            if (valor.length <= 10) {
                valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
                valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
            } else {
                valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
                valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
            }
            e.target.value = valor;
        });
    }

    if (autorInput) {
        autorInput.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[0-9]/g, "");
        });
    }

    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            emailInput.style.border = !emailRegex.test(emailInput.value) ? "2px solid red" : "";
        });
    }

    /* 4. SELEÇÃO DINÂMICA DE SUBÁREAS */
    const areaSelect = document.getElementById("area-select");
    const subareaGroup = document.getElementById("subarea-group");
    const subareaSelect = document.getElementById("subarea-select");

    // Dicionário mapeando cada Área Maior às suas respectivas Subáreas
    const subareasPorArea = {
        "Inteligência Artificial e Dados": [
            "Ciência de Dados", "Inteligência Artificial", "Mineração de Dados",
            "Otimização", "Processamento de Imagens", "Reconhecimento de Padrões"
        ],
        "Infraestrutura e Redes": [
            "Arquitetura de Computadores", "Avaliação de Desempenho", "Computação em Nuvem",
            "Redes de Computadores", "Sistemas Distribuídos", "Computação Móvel", "Sistemas Operacionais"
        ],
        "Engenharia de Software": [
            "Banco de Dados", "Qualidade de Software", "Segurança da Informação",
            "Sistemas de Informação", "Sistemas Hipermídia, Multimídia e Web"
        ],
        "Computação Aplicada": [
            "Bioinformática", "Biotecnologia", "Computação Aplicada à Saúde",
            "Informática Industrial", "Informática Pública"
        ],
        "Informática e Sociedade": [
            "Análise de Aprendizagem", "Educação em Informática",
            "Inclusão Digital", "Informática na Educação"
        ],
        "Interação, Mídia e Jogos": [
            "Computação Gráfica", "Interação Humano-Computador", "Jogos e Gamificação"
        ],
        "Sistemas Físicos e Robótica": [
            "Internet das Coisas (IoT)", "Robótica"
        ],
        "Empreendedorismo": [
            "Empreendedorismo e Inovação"
        ]
    };

    if (areaSelect && subareaSelect && subareaGroup) {
        areaSelect.addEventListener("change", (e) => {
            const areaSelecionada = e.target.value;
            const subareas = subareasPorArea[areaSelecionada];

            // Limpa as opções anteriores (mantém apenas a primeira desabilitada)
            subareaSelect.innerHTML = '<option value="" disabled selected>Selecionar subárea</option>';

            if (subareas && subareas.length > 0) {
                // Popula o select com as subáreas corretas
                subareas.forEach(subarea => {
                    const option = document.createElement("option");
                    option.value = subarea;
                    option.textContent = subarea;
                    subareaSelect.appendChild(option);
                });

                // Exibe o campo e o torna obrigatório
                subareaGroup.style.display = "flex";
                subareaSelect.required = true;
            } else {
                // Esconde o campo se não houver subárea e remove a obrigatoriedade
                subareaGroup.style.display = "none";
                subareaSelect.required = false;
            }
        });
    }
});