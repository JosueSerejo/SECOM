/* CONTROLE DE LIBERAÇÃO DO FORMULÁRIO */
// Mude para 'true' para liberar o formulário e esconder o aviso
const inscricoesAbertas = false; 

document.addEventListener("DOMContentLoaded", () => {
    const avisoBreve = document.getElementById("form-coming-soon");
    const formulario = document.getElementById("meu-form");

    if (inscricoesAbertas) {
        if (avisoBreve) avisoBreve.style.display = "none";
        if (formulario) formulario.style.display = "flex"; 
    } else {
        if (avisoBreve) avisoBreve.style.display = "block";
        if (formulario) formulario.style.display = "none";
    }
});

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