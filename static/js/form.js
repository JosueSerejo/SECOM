/* CONTROLE DE LIBERAÇÃO DOS FORMULÁRIOS */
const inscricoesAbertas = false;  // Inscrições do index.html (abrem depois)
const submissoesAbertas = true;   // Submissões do submission.html (já liberado, fecha primeiro)

document.addEventListener("DOMContentLoaded", () => {
    const formInscricao = document.getElementById("meu-form");
    const isSubmissionPage = document.body.classList.contains("submission-page");

    if (isSubmissionPage) {
        /* ==========================================================================
           LÓGICA DA PÁGINA DE SUBMISSÃO (submission.html)
           ========================================================================== */
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
        /* ==========================================================================
           LÓGICA DA PÁGINA PRINCIPAL (index.html)
           ========================================================================== */
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

/* ==========================================================================
   CONEXÃO DO GOOGLE FORMS (INDEX.HTML) - MANTIDO INTACTO E PROTEGIDO
   ========================================================================== */
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

/* ==========================================================================
   VALIDAÇÃO DE FORMULÁRIO GENÉRICA E CAMPOS DINÂMICOS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector('input[type="email"]');
    const telefoneInput = document.querySelector('input[type="tel"]');
    const nomeInput = document.querySelector('input[type="text"]');
    
    // Campo de Instituição (Exclusivo do submission.html)
    const instituicaoSelect = document.querySelector('select[name="entry.701128269"]');

    /* CAMPO DINÂMICO: OUTRA INSTITUIÇÃO */
    if (instituicaoSelect) {
        const nameOriginal = "entry.701128269";
        const groupContainer = instituicaoSelect.parentElement; // Container da div .group

        instituicaoSelect.addEventListener("change", (e) => {
            let extraInput = document.getElementById("instituicao-outro-input");

            if (e.target.value === "Outra") {
                // Se o input ainda não existir, cria ele
                if (!extraInput) {
                    extraInput = document.createElement("input");
                    extraInput.type = "text";
                    extraInput.id = "instituicao-outro-input";
                    extraInput.placeholder = "Digite o nome da sua instituição";
                    extraInput.required = true;
                    extraInput.style.marginTop = "0.8rem"; // Mantém o espaçamento visual do seu CSS
                    
                    groupContainer.appendChild(extraInput);
                }
                
                // Transfere o name para o input de texto para enviar o valor digitado
                instituicaoSelect.removeAttribute("name");
                extraInput.name = nameOriginal;
                extraInput.focus();

            } else {
                // Se escolheu outra opção válida, remove o input de texto se ele existir
                if (extraInput) {
                    extraInput.remove();
                }
                // Devolve o name original para o select
                instituicaoSelect.name = nameOriginal;
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

    /* REMOVER NÚMEROS DO NOME */
    if (nomeInput) {
        nomeInput.addEventListener("input", (e) => {
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