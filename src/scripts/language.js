document.addEventListener("DOMContentLoaded", () => {

  const translations = {
    es: {
      nav: {
        home: "Home",
        continents: "Continentes",
        forum: "Foro",
        about: "¿Quiénes somos?"
      },
      auth: {
        login: "Iniciar sesión",
        register: "Registrarse"
      },
      hero: {
        title: "CAMINO DE ULISES",
        subtitle: "Si la aventura te llama, cógele el teléfono",
        search: "🔍︎ Buscar destinos...",
        searchBtn: "Buscar"
      },
      intro: "Cada aventura comienza con un primer paso",
      carousel: {
        prev: "Anterior",
        next: "Siguiente",
        buy: "Comprar"
      },
      continents: {
        title: "Explora por continente",
        europe: "Europa",
        asia: "Asia",
        africa: "África",
        oceania: "Oceanía",
        northAmerica: "América del Norte",
        southAmerica: "América del Sur"
      },
      footer: {
        about: "¿Quiénes somos?",
        privacy: "Política de privacidad",
        faq: "FAQs",
        contact: "Contacto"
      }
    },

    en: {
      nav: {
        home: "Home",
        continents: "Continents",
        forum: "Forum",
        about: "About us"
      },
      auth: {
        login: "Log in",
        register: "Sign up"
      },
      hero: {
        title: "ULYSSES' JOURNEY",
        subtitle: "If adventure calls you, pick up the phone",
        search: "🔍︎ Search destinations...",
        searchBtn: "Search"
      },
      intro: "Every adventure begins with a first step",
      carousel: {
        prev: "Previous",
        next: "Next",
        buy: "Buy"
      },
      continents: {
        title: "Explore by continent",
        europe: "Europe",
        asia: "Asia",
        africa: "Africa",
        oceania: "Oceania",
        northAmerica: "North America",
        southAmerica: "South America"
      },
      footer: {
        about: "About us",
        privacy: "Privacy policy",
        faq: "FAQs",
        contact: "Contact"
      }
    }
  };

  function getValue(obj, path) {
    return path.split(".").reduce((o, k) => o?.[k], obj);
  }

  function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      const value = getValue(dict, key);
      if (value) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const value = getValue(dict, key);
      if (value) el.placeholder = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const key = el.dataset.i18nAria;
      const value = getValue(dict, key);
      if (value) el.setAttribute("aria-label", value);
    });

    localStorage.setItem("language", lang);
  }

  // Menú idioma
  const langBtn = document.getElementById("language-btn");
  const langMenu = document.getElementById("language-menu");

  langBtn.addEventListener("click", e => {
    e.stopPropagation();
    langMenu.classList.toggle("active");
  });

  langMenu.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.lang);
      langMenu.classList.remove("active");
    });
  });

  document.addEventListener("click", () => {
    langMenu.classList.remove("active");
  });

  applyLanguage(localStorage.getItem("language") || "es");
  // Avisar al carrusel de que cambió el idioma
  document.dispatchEvent(new Event("languageChanged"));

});
