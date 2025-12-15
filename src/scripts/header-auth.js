document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTOS BASE
    ========================= */
    const userArea = document.getElementById("user-area");
    const mobileAuth = document.getElementById("mobile-auth");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    const usuarioActivo = sessionStorage.getItem("usuarioActivo");

    if (!userArea) return;

    /* =========================
       MODALES
    ========================= */
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

    /* =========================
       NO LOGUEADO
    ========================= */
    if (!usuarioActivo) {
        const authHTML = `
            <a href="login.html" class="btn-login" data-i18n="auth.login">
                Iniciar sesión
            </a>
            <a href="register-page.html" class="btn-register" data-i18n="auth.register">
                Registrarse
            </a>
        `;

        // Desktop
        userArea.innerHTML = authHTML;

        // Mobile
        if (mobileAuth) {
            mobileAuth.innerHTML = authHTML;
        }

        aplicarIdiomaHeader();
        initHamburger();
        return;
    }

    /* =========================
       LOGUEADO
    ========================= */
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.usuario === usuarioActivo);

    if (!usuario) {
        sessionStorage.removeItem("usuarioActivo");
        location.reload();
        return;
    }

    // Desktop
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

    // Mobile
    if (mobileAuth) {
        mobileAuth.innerHTML = `
            <span class="user-name">${usuario.usuario}</span>
            <button class="logout-btn" id="mobile-logout-btn" data-i18n="auth.logout">
                Cerrar sesión
            </button>
        `;

        document.getElementById("mobile-logout-btn").addEventListener("click", () => {
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
    }

    aplicarIdiomaHeader();
    initHamburger();

    /* =========================
       FUNCIONES AUXILIARES
    ========================= */
    function aplicarIdiomaHeader() {
        const lang = localStorage.getItem("language") || "es";
        document.dispatchEvent(
            new CustomEvent("forceLanguage", { detail: lang })
        );
    }

    function initHamburger() {
        if (!hamburgerBtn || !mobileMenu) return;

        hamburgerBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
        });
    }

});
