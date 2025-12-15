document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".login-form");
    if (!form) return;

    const userInput = document.getElementById("user");
    const passInput = document.getElementById("pass");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = userInput.value.trim();
        const password = passInput.value;
        
        function mostrarModalInfo(texto, onClose = null) {
            const modal = document.getElementById("modal-info");
            const textoEl = document.getElementById("modal-info-texto");
            const btnOk = document.getElementById("modal-info-ok");

            textoEl.textContent = texto;
            modal.classList.add("visible");

            btnOk.onclick = () => {
                modal.classList.remove("visible");
                if (onClose) onClose();
            };
        }


        if (!usuario || !password) {
            mostrarModalInfo("Por favor, introduce usuario y contraseña.");
            return;
        }

        // Leer usuarios guardados
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar coincidencia
        const usuarioEncontrado = usuarios.find(
            u => u.usuario === usuario && u.password === password
        );

        if (!usuarioEncontrado) {
            mostrarModalInfo("Usuario o contraseña incorrectos.");
            userInput.focus();
            return;
        }

        // Guardar sesión activa
        sessionStorage.setItem("usuarioActivo", usuarioEncontrado.usuario);

        mostrarModalInfo(`Bienvenido/a, ${usuarioEncontrado.nombre}`);

        // Redirección inteligente
        setTimeout(() => {
            const redirectUrl = sessionStorage.getItem("redirectAfterAuth");

            if (redirectUrl) {
                sessionStorage.removeItem("redirectAfterAuth");
                window.location.href = redirectUrl;
            } else {
                window.location.href = "main-page.html";
            }
        }, 800);

    });
});
