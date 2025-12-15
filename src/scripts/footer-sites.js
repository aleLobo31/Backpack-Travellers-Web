// Leer parámetro de URL
const params = new URLSearchParams(window.location.search);
const section = params.get("section");

// Elementos donde insertaremos cosas
const titleEl = document.getElementById("footer-page-title");
const contentEl = document.getElementById("footer-dynamic-content");
const bannerEl = document.querySelector(".footer-banner");

// Diccionario con contenido por sección
const pageData = {
    "quienes-somos": {
        title: "¿Quiénes somos?",
        img: "images/quienes_somos.png",
        content: `
            <h2>Nuestra misión</h2>
            <p>
            Camino de Ulises nace con la idea de inspirar, acompañar y guiar a personas que buscan descubrir
            el mundo de una forma diferente: más humana, más consciente y más cercana a la esencia del viaje.
            No vendemos viajes, sino experiencias que dejan huella.
            </p>

            <h2>Un equipo hecho de viajeros</h2>
            <p>
            Somos un grupo de apasionados del turismo cultural, la fotografía, la historia y la aventura.
            Cada destino, cada recomendación y cada guía que encuentras aquí está creada por personas que
            han vivido lo que cuentan. Creemos en compartir caminos reales, no folletos.
            </p>

            <h2>Nuestros valores</h2>
            <ul>
                <li><strong>Autenticidad:</strong> Contenido creado a partir de experiencias reales.</li>
                <li><strong>Respeto:</strong> Fomentamos un turismo responsable y sostenible.</li>
                <li><strong>Comunidad:</strong> Creamos un espacio donde todos pueden aportar y aprender.</li>
                <li><strong>Accesibilidad:</strong> Queremos que viajar esté al alcance de todos.</li>
            </ul>

            <p>
            Gracias por formar parte del viaje. Como Ulises, creemos que lo importante no es solo el destino,
            sino el camino.
            </p>

        `
    },

    "privacidad": {
        title: "Política de privacidad",
        img: "images/privacidad.png",
        content: `
            <h2>Cómo tratamos tus datos</h2>
            <p>
            La protección de tu información es una prioridad absoluta para nosotros.
            No compartimos, vendemos ni cedemos tus datos a terceros bajo ningún concepto.
            Solo recopilamos la información necesaria para que puedas registrarte, personalizar tu cuenta
            y participar en la comunidad.
            </p>

            <h2>¿Qué datos recopilamos?</h2>
            <ul>
                <li>Nombre y apellidos</li>
                <li>Correo electrónico</li>
                <li>Nombre de usuario</li>
                <li>Imagen de perfil (opcional)</li>
                <li>Información de navegación en la web (cookies propias)</li>
            </ul>

            <h2>¿Para qué los utilizamos?</h2>
            <ul>
                <li>Gestionar tu cuenta personal</li>
                <li>Mejorar la experiencia de navegación</li>
                <li>Ofrecer contenido personalizado</li>
                <li>Garantizar la seguridad del sistema</li>
            </ul>

            <h2>Tus derechos</h2>
            <p>
            Puedes solicitar en cualquier momento: acceso, rectificación, eliminación o limitación
            del tratamiento de tus datos. Escríbenos a
            <strong>privacidad@caminodeulises.com</strong> y atenderemos tu solicitud.
            </p>

        `
    },

    "faq": {
        title: "Preguntas frecuentes",
        img: "images/FAQs.png",
        content: `
            <h2>Preguntas frecuentes</h2>

            <h3>¿Cómo creo una cuenta?</h3>
            <p>
            Ve a la página de registro, completa tus datos y acepta la política de privacidad.
            Podrás acceder inmediatamente.
            </p>

            <h3>¿Puedo cambiar mi foto de perfil?</h3>
            <p>
            Sí. Desde tu página de usuario puedes subir una nueva imagen cuando quieras.
            </p>

            <h3>¿Los packs de viaje son reales?</h3>
            <p>
            Nuestros packs son propuestas inspiracionales basadas en experiencias y recomendaciones.
            No constituyen reservas ni servicios turísticos oficiales.
            </p>

            <h3>¿Cómo funciona el sistema de favoritos?</h3>
            <p>
            Cuando marcas un pack con el icono de “like”, se guarda en tu perfil para que puedas
            consultarlo más tarde.
            </p>

            <h3>¿Puedo borrar mi cuenta?</h3>
            <p>
            Sí. Escríbenos a <strong>soporte@caminodeulises.com</strong> y gestionaremos la eliminación
            completa de tus datos.
            </p>

        `
    },

    "contacto": {
        title: "Contacto",
        img: "images/contacto.png",
        content: `
            <h2>¿Necesitas ayuda?</h2>
            <p>
            Estamos aquí para ayudarte. Puedes escribirnos si tienes dudas, sugerencias,
            problemas técnicos o quieres colaborar con Camino de Ulises.
            </p>

            <h2>Correo de soporte</h2>
            <p>
            <strong>soporte@caminodeulises.com</strong>
            </p>

            <h2>Horario de atención</h2>
            <p>
            De lunes a viernes, 9:00 a 18:00 (CET).
            Intentamos responder siempre en menos de 24 horas.
            </p>

            <h2>Colaboraciones</h2>
            <p>
            Si eres creador de contenido, guía turístico o fotógrafo y quieres colaborar,
            cuéntanos tu proyecto en  
            <strong>colabora@caminodeulises.com</strong>
            </p>
        `
    }
};


// Si sección existe → cargamos datos
if (pageData[section]) {
    const { title, img, content } = pageData[section];

    titleEl.textContent = title;
    bannerEl.style.backgroundImage = `url('${img}')`;
    contentEl.innerHTML = content;
} else {
    // Si no existe la sección → página por defecto
    titleEl.textContent = "Información";
    contentEl.innerHTML = "<p>Elige un enlace del footer para ver información.</p>";
}
