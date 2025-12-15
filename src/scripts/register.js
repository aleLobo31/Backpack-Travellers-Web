document.addEventListener("DOMContentLoaded", () => {
    // --- REFERENCIAS AL DOM ---
    const form          = document.querySelector(".register-grid");
    if (!form) return; 

    const nombreInput   = document.querySelector("#nombre");
    const apellidosInput= document.querySelector("#apellidos");
    const emailInput    = document.querySelector("#email");
    const usuarioInput  = document.querySelector("#usuario");
    const passInput     = document.querySelector("#pass");
    const pass2Input    = document.querySelector("#pass2");
    const fechaInput    = document.querySelector("#fecha");
    const imagenInput   = document.querySelector("#imagen");
    const privacidadChk = document.querySelector("#privacidad");
    const btnGuardar    = document.querySelector(".boton-guardar");
    const fileLabel     = document.querySelector("#file-archivo-sel");
    const btnImagen     = document.querySelector("#btn-imagen");


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

    // --- HABILITAR/DESHABILITAR BOTÓN SEGÚN POLÍTICA ---
    if (privacidadChk && btnGuardar) {
        btnGuardar.disabled = !privacidadChk.checked;

        privacidadChk.addEventListener("change", () => {
            btnGuardar.disabled = !privacidadChk.checked;
        });
    }

    // --- ABRIR SELECTOR DE ARCHIVOS ---
    if (btnImagen && imagenInput) {
        btnImagen.addEventListener("click", () => {
            imagenInput.click();
        });
    }

    // --- MOSTRAR NOMBRE DEL ARCHIVO SELECCIONADO ---
    if (imagenInput && fileLabel) {
        imagenInput.addEventListener("change", () => {
            if (imagenInput.files.length > 0) {
                const nombreArchivo = imagenInput.files[0].name;
                fileLabel.textContent = `Imagen seleccionada: ${nombreArchivo}`;
                fileLabel.style.color = "#3a2f22";
                fileLabel.style.fontStyle = "normal";
            } else {
                fileLabel.textContent = "Ningún archivo seleccionado";
                fileLabel.style.color = "#6c5b4a";
                fileLabel.style.fontStyle = "italic";
            }
        });
    }

    // --- SUBMIT CON VALIDACIONES EN CASCADA ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1) Comprobar que ningún campo obligatorio esté vacío
        const campos = [
            nombreInput,
            apellidosInput,
            emailInput,
            usuarioInput,
            passInput,
            pass2Input,
            fechaInput,
            imagenInput
        ];

        const campoVacio = campos.find(el => {
            if (!el) return true;
            if (el.type === "file") {
                return !el.files || el.files.length === 0;
            }
            return el.value.trim() === "";
        });

        if (campoVacio) {
            mostrarModalInfo("Por favor, completa todos los campos obligatorios antes de continuar.");
            campoVacio.focus();
            return;
        }

        // 2) Nombre (mínimo 3 caracteres)
        const nombre = nombreInput.value.trim();
        if (nombre.length < 3) {
            mostrarModalInfo("El nombre debe tener al menos 3 caracteres.");
            nombreInput.focus();
            return;
        }

        // 3) Apellidos (al menos dos palabras, cada una de 3 caracteres mínimo)
        const apellidos = apellidosInput.value.trim();
        const partesApellidos = apellidos.split(" ").filter(p => p !== "");

        if (partesApellidos.length < 2 || partesApellidos.some(p => p.length < 3)) {
            mostrarModalInfo("Introduce al menos dos apellidos de tres caracteres cada uno.");
            apellidosInput.focus();
            return;
        }

        // 4) Email (formato válido)
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            mostrarModalInfo("El correo electrónico no tiene un formato válido (nombre@dominio.extensión).");
            emailInput.focus();
            return;
        }

        // 5) Nombre de usuario (mínimo 5 caracteres)
        const usuario = usuarioInput.value.trim();
        if (usuario.length < 5) {
            mostrarModalInfo("El nombre de usuario debe tener al menos 5 caracteres.");
            usuarioInput.focus();
            return;
        }

        // 6) Contraseña (8 caracteres, 2 números, 1 mayúscula, 1 minúscula, 1 símbolo)
        const password = passInput.value;
        const password2 = pass2Input.value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){2,})(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            mostrarModalInfo("La contraseña debe tener al menos 8 caracteres, 2 números, 1 mayúscula, 1 minúscula y 1 carácter especial.");
            passInput.focus();
            return;
        }

        // 7) Confirmación de contraseña
        if (password !== password2) {
            mostrarModalInfo("Las contraseñas no coinciden.");
            pass2Input.focus();
            return;
        }

        // 8) Fecha de nacimiento (no futuro, >= 12 años, año razonable)
        const fechaNacStr = fechaInput.value;
        if (!fechaNacStr) {
            mostrarModalInfo("Selecciona una fecha de nacimiento.");
            fechaInput.focus();
            return;
        }

        const fechaNac = new Date(fechaNacStr);
        const hoy = new Date();

        // Fecha en el futuro
        if (fechaNac >= hoy) {
            mostrarModalInfo("La fecha de nacimiento no puede ser en el futuro.");
            fechaInput.focus();
            return;
        }

        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad < 12) {
            mostrarModalInfo("Debes tener al menos 12 años para registrarte.");
            fechaInput.focus();
            return;
        }

        if (fechaNac.getFullYear() < 1900) {
            mostrarModalInfo("La fecha de nacimiento introducida no es válida.");
            fechaInput.focus();
            return;
        }

        // 9) Imagen de perfil (obligatoria + extensión válida)
        const archivo = imagenInput.files[0];
        if (!archivo) {
            mostrarModalInfo("Selecciona una imagen de perfil.");
            btnImagen.focus(); 
            return;
        }

        const extension = archivo.name.split(".").pop().toLowerCase();
        const extensionesValidas = ["webp", "png", "jpg", "jpeg"];
        if (!extensionesValidas.includes(extension)) {
            mostrarModalInfo("La imagen de perfil debe ser .webp, .png, .jpg o .jpeg.");
            btnImagen.focus();
            return;
        }

        // 10) Política de privacidad
        if (!privacidadChk.checked) {
            mostrarModalInfo("Debes aceptar la política de privacidad para continuar.");
            privacidadChk.focus();
            return;
        }

        // 11) Comprobar que no exista ya el usuario o el email
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const yaExiste = usuarios.some(u => u.usuario === usuario || u.email === email);
        if (yaExiste) {
            mostrarModalInfo("El usuario o el correo ya están registrados. Prueba con otros datos.");
            usuarioInput.focus();
            return;
        }

        // 12) Si todo OK: leer la imagen en Base64 y guardar en localStorage
        const reader = new FileReader();

        reader.onload = function (ev) {
            const usuarioObj = {
                nombre,
                apellidos,
                email,
                fecha: fechaNacStr,
                usuario,
                password,
                imagenBase64: ev.target.result
            };

            usuarios.push(usuarioObj);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            // Iniciar sesión automáticamente
            sessionStorage.setItem("usuarioActivo", usuario);

            mostrarModalInfo("Registro completado con éxito. ¡Bienvenido/a!");

            // Redirección inteligente tras registro
            setTimeout(() => {
                const redirectUrl = sessionStorage.getItem("redirectAfterAuth");

                if (redirectUrl) {
                    sessionStorage.removeItem("redirectAfterAuth");
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = "main-page.html";
                }
            }, 1000);
        };

        reader.onerror = function () {
            mostrarModalInfo("Se ha producido un error al procesar la imagen. Inténtalo de nuevo.");
        };

        reader.readAsDataURL(archivo);
    });
});
