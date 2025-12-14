document.addEventListener("DOMContentLoaded", () => {

    const userArea = document.getElementById("user-area");
    if (!userArea) return;

    const usuarioActivo = sessionStorage.getItem("usuarioActivo");

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

    function mostrarModalConfirm(texto, onConfirm = null) {
        const modal = document.getElementById("modal-confirm");
        const textoEl = document.getElementById("modal-confirm-texto");
        const btnOk = document.getElementById("modal-confirm-ok");
        const btnCancel = document.getElementById("modal-confirm-cancel");

        textoEl.textContent = texto;
        modal.classList.add("visible");

        btnCancel.onclick = () => {
            modal.classList.remove("visible");
        };

        btnOk.onclick = () => {
            modal.classList.remove("visible");
            if (onConfirm) onConfirm();
        };
    }


    // Si NO hay sesión → mostrar login / register
    if (!usuarioActivo) {
        userArea.innerHTML = `
            <a href="login.html" class="btn-login" data-i18n="auth.login">Iniciar sesión</a>
            <a href="register-page.html" class="btn-register" data-i18n="auth.register">Registrarse</a>
        `;
        return;
    }

    // Si HAY sesión → cargar usuario completo
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.usuario === usuarioActivo);

    if (!usuario) {
        // fallback de seguridad
        sessionStorage.removeItem("usuarioActivo");
        location.reload();
        return;
    }

    // Renderizar info del usuario
    userArea.innerHTML = `
        <span class="user-name">${usuario.usuario}</span>

        <button class="logout-btn" id="logout-btn" data-i18n="auth.logout">
            Cerrar sesión
        </button>

        <img 
            src="${usuario.imagenBase64}" 
            alt="Foto de perfil"
            class="user-avatar"
        >
    `;

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        mostrarModalConfirm(
            "¿Está seguro de que quiere cerrar sesión?",
            () => {
                sessionStorage.removeItem("usuarioActivo");

                mostrarModalInfo("Sesión cerrada correctamente", () => {
                    window.location.href = "main-page.html";
                });
            }
        );
    });

    // Reaplicar idioma al header dinámico
    const lang = localStorage.getItem("language") || "es";
    document.dispatchEvent(new CustomEvent("forceLanguage", { detail: lang }));

});
