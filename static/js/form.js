/* CONTROLE DE LIBERAÇÃO DO FORMULÁRIO */
const inscricoesAbertas = false;

document.addEventListener("DOMContentLoaded", () => {
    const avisoBreve = document.getElementById("form-coming-soon");
    const formulario = document.getElementById("meu-form");

    // Elementos do Badge de Status
    const badgeContainer = document.getElementById("inscricao-status-badge");
    const badgeDot = document.getElementById("inscricao-status-dot");
    const badgeText = document.getElementById("inscricao-status-text");

    if (inscricoesAbertas) {
        if (avisoBreve) avisoBreve.style.display = "none";
        if (formulario) formulario.style.display = "flex";

        // Status Aberto (Mantém o padrão verde do seu CSS)
        if (badgeText) badgeText.innerText = "Inscrições Abertas";
    } else {
        if (avisoBreve) avisoBreve.style.display = "block";
        if (formulario) formulario.style.display = "none";

        // Status Fechado (Muda o texto e força a cor vermelha sem mexer no CSS)
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
    }
});

/* CONEXÃO DO GOOGLE FORMS */
// ... o restante do seu código continua idêntico abaixo

/* CONEXÃO DO GOOGLE FORMS */
const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScKlTQu_f74VmnoF0hJyN5ZRAJuC_8u5FmEH5luwzwCu-hydQ/formResponse";
const form = document.getElementById("meu-form");

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


/* VALIDAÇÃO DE FORMULÁRIO */

document.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.querySelector('input[type="email"]');
    const telefoneInput = document.querySelector('input[type="tel"]');
    const nomeInput = document.querySelector('input[type="text"]');

    /* MÁSCARA TELEFONE */
    telefoneInput.addEventListener("input", (e) => {

        let valor = e.target.value.replace(/\D/g, "");

        valor = valor.substring(0, 11);

        if (valor.length <= 10) {

            valor = valor.replace(
                /^(\d{2})(\d)/g,
                "($1) $2"
            );

            valor = valor.replace(
                /(\d{4})(\d)/,
                "$1-$2"
            );

        } else {

            valor = valor.replace(
                /^(\d{2})(\d)/g,
                "($1) $2"
            );

            valor = valor.replace(
                /(\d{5})(\d)/,
                "$1-$2"
            );
        }

        e.target.value = valor;
    });

    /* REMOVER NÚMEROS DO NOME */
    nomeInput.addEventListener("input", (e) => {

        e.target.value = e.target.value.replace(/[0-9]/g, "");

    });

    /* VALIDAR EMAIL */
    emailInput.addEventListener("blur", () => {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailInput.value)) {

            emailInput.style.border = "2px solid red";

        } else {

            emailInput.style.border = "";

        }

    });

});