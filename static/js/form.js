/* --- VII SECOM 2026 - CONTROLE DE LIBERAÇÃO DOS FORMULÁRIOS --- */
const inscricoesAbertas = false;  // Inscrições do index.html (abrem depois)
const submissoesAbertas = true;   // Submissões do submission.html (já liberado, fecha primeiro)

document.addEventListener("DOMContentLoaded", () => {
    const formInscricao = document.getElementById("meu-form");
    const isSubmissionPage = document.body.classList.contains("submission-page");

    if (isSubmissionPage) {
        /* --- LÓGICA DA PÁGINA DE SUBMISSÃO (submission.html) --- */
        const badgeText = document.querySelector("#submission .inscricao-badge");

        if (!submissoesAbertas && formInscricao) {
            if (badgeText) {
                badgeText.innerHTML = `<span class="badge-dot" style="background: #ff3333; box-shadow: 0 0 6px #ff3333;"></span> Submissões Encerradas`;
                badgeText.style.color = "#ff5555";
                badgeText.style.background = "rgba(255, 51, 51, 0.1)";
                badgeText.style.borderColor = "rgba(255, 51, 51, 0.3)";
            }

            formInscricao.style.display = "none";

            const formContainer = formInscricao.parentElement;
            const avisoEncerrado = document.createElement("div");
            avisoEncerrado.className = "embed-notice";
            avisoEncerrado.id = "form-coming-soon";
            avisoEncerrado.innerHTML = `
                <div class="embed-icon">
                    <i data-lucide="calendar-x"></i>
                </div>
                <h4>Submissões Encerradas!</h4>
                <p>O prazo para envio de trabalhos para a VII SECOM foi encerrado.</p>
            `;

            formContainer.appendChild(avisoEncerrado);
            lucide.createIcons();
        }
    } else {
        /* --- LÓGICA DA PÁGINA PRINCIPAL (index.html) --- */
        const badgeContainer = document.getElementById("inscricao-status-badge");
        const badgeDot = document.getElementById("inscricao-status-dot");
        const badgeText = document.getElementById("inscricao-status-text");
        const formContainer = document.getElementById("form-content");

        if (inscricoesAbertas) {
            if (formInscricao) formInscricao.style.display = "flex";
            if (badgeText) badgeText.innerText = "Inscrições Abertas";
        } else {
            if (formInscricao) formInscricao.style.display = "none";

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
                    <div class="embed-icon">
                        <i data-lucide="calendar-clock"></i>
                    </div>
                    <h4>Inscrições em Breve!</h4>
                    <p>O formulário para inscrições na VII SECOM será liberado nos próximos dias. Fique atento ao cronograma do evento!</p>
                `;
                formContainer.appendChild(avisoBreve);
                lucide.createIcons();
            }
        }
    }
});

/* --- CONEXÃO DO GOOGLE FORMS (INDEX.HTML) - MANTIDO INTACTO E PROTEGIDO --- */
const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScKlTQu_f74VmnoF0hJyN5ZRAJuC_8u5FmEH5luwzwCu-hydQ/formResponse";
const form = document.getElementById("meu-form");

if (form && !document.body.classList.contains("submission-page")) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        await fetch(FORM_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        const formContent = document.getElementById("form-content");
        formContent.innerHTML = `
            <div class="inscricao-sucesso">
                <div class="sucesso-icon">
                    <i data-lucide="circle-check-big"></i>
                </div>
                <h2>Inscrição Realizada!</h2>
                <p>Sua inscrição na <strong>SECOM 2026</strong> foi confirmada com sucesso.</p>
                <p class="sucesso-sub">Fique de olho no seu e-mail para mais informações sobre o evento.</p>
            </div>
        `;
        lucide.createIcons();
    });
}

/* --- CONEXÃO EXCLUSIVA DA PÁGINA DE SUBMISSÃO (submission.html) com Apps Script --- */
document.addEventListener("DOMContentLoaded", () => {
    const formSubmissao = document.getElementById("meu-form");
    const isSubmissionPage = document.body.classList.contains("submission-page");

    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxnXS5CKyPiTVthWlNFSGQTtMAGohgECx5xN89PzZoZuavIM8yG1c6ytofMe71tZVN/exec";

    if (isSubmissionPage && formSubmissao) {
        formSubmissao.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = formSubmissao.querySelector(".submit-btn");
            const fileInput = document.getElementById("pdf-file");

            if (!fileInput || fileInput.files.length === 0) {
                alert("Por favor, selecione um arquivo PDF para o seu trabalho.");
                return;
            }

            const file = fileInput.files[0];

            if (file.type !== "application/pdf") {
                alert("O sistema aceita apenas arquivos no formato PDF.");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerText = "Processando e Enviando...";

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const fileDataUri = reader.result;

                const payload = {
                    autor: formSubmissao.querySelector('input[name="entry.743009220"]').value,
                    email: formSubmissao.querySelector('input[name="entry.1485760061"]').value,
                    telefone: formSubmissao.querySelector('input[name="entry.1636520307"]').value,

                    // CORREÇÃO: Agora captura usando o número exato do seu HTML
                    cidadeEstado: formSubmissao.querySelector('input[name="entry.1763209583"]').value,

                    instituicao: formSubmissao.querySelector('select[name="entry.701128269"]')?.value || document.getElementById("instituicao-outro-input")?.value || "",
                    modalidade: formSubmissao.querySelector('select[name="entry.1033813828"]').value,
                    areaTematica: formSubmissao.querySelector('select[name="entry.1013045063"]').value,
                    titulo: formSubmissao.querySelector('input[name="entry.1795756907"]').value,

                    // O arquivo convertido pelo FileReader
                    fileData: fileDataUri,
                    fileName: file.name
                };

                try {
                    const response = await fetch(APPS_SCRIPT_URL, {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type": "text/plain;charset=utf-8"
                        },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();

                    if (result.status === "success") {
                        document.getElementById("form-content").innerHTML = `
                            <div class="inscricao-sucesso" style="text-align: center; padding: 40px 20px;">
                                <div class="sucesso-icon" style="font-size: 48px; color: #45faca; margin-bottom: 20px;">
                                    <i data-lucide="circle-check-big"></i>
                                </div>
                                <h2 style="font-family: 'Orbitron', sans-serif; color: #fff;">Submissão Realizada!</h2>
                                <p style="color: #8899bb; margin-top: 10px;">O artigo foi enviado com sucesso para a banca avaliadora.</p>
                                <p style="font-size: 0.9rem; color: #4a5568; margin-top: 5px;">Um e-mail de confirmação foi despachado para você.</p>
                            </div>
                        `;
                        lucide.createIcons();
                    } else {
                        throw new Error(result.message);
                    }

                } catch (error) {
                    console.error("Erro na submissão:", error);
                    alert("Houve um erro técnico ao submeter o seu trabalho. Tente novamente mais tarde.");
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Enviar Trabalho";
                }
            };

            reader.onerror = () => {
                alert("Erro ao ler o arquivo selecionado.");
                submitBtn.disabled = false;
                submitBtn.innerText = "Enviar Trabalho";
            };
        });
    }
});

/* --- VALIDAÇÃO DE FORMULÁRIO GENÉRICA E CAMPOS DINÂMICO --- */
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector('input[type="email"]');
    const telefoneInput = document.querySelector('input[type="tel"]');
    const autorInput = document.querySelector('input[name="entry.743009220"]');

    const substituicaoSelect = document.querySelector('select[name="entry.701128269"]');

    if (substituicaoSelect) {
        const nameOriginal = "entry.701128269";
        const groupContainer = substituicaoSelect.parentElement;

        substituicaoSelect.addEventListener("change", (e) => {
            let extraInput = document.getElementById("instituicao-outro-input");

            if (e.target.value === "Outra") {
                if (!extraInput) {
                    extraInput = document.createElement("input");
                    extraInput.type = "text";
                    extraInput.id = "instituicao-outro-input";
                    extraInput.placeholder = "Digite o nome da sua instituição";
                    extraInput.required = true;
                    extraInput.style.marginTop = "0.8rem";

                    groupContainer.appendChild(extraInput);
                }

                substituicaoSelect.removeAttribute("name");
                extraInput.name = nameOriginal;
                extraInput.focus();
            } else {
                if (extraInput) {
                    extraInput.remove();
                }
                substituicaoSelect.name = nameOriginal;
            }
        });
    }

    /* MÁSCARA TELEFONE */
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

    /* REMOVER NÚMEROS APENAS DO CAMPO DE NOME DO AUTOR */
    if (autorInput) {
        autorInput.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[0-9]/g, "");
        });
    }

    /* VALIDAR EMAIL */
    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(emailInput.value)) {
                emailInput.style.border = "2px solid red";
            } else {
                emailInput.style.border = "";
            }
        });
    }
});