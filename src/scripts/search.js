document.addEventListener("DOMContentLoaded", () => {
  let data = null;

  const searchInput = document.getElementById("search");
  const searchForm = document.querySelector(".search-bar");
  const resultsBox = document.getElementById("search-results");

  const continentTranslations = {
    es: {
        Europa: "Europa",
        Asia: "Asia",
        África: "África",
        Oceanía: "Oceanía",
        "América del Norte": "América del Norte",
        "América del Sur": "América del Sur"
    },
    en: {
        Europa: "Europe",
        Asia: "Asia",
        África: "Africa",
        Oceanía: "Oceania",
        "América del Norte": "North America",
        "América del Sur": "South America"
    }
};


  // Evitar recarga del formulario
  searchForm.addEventListener("submit", (e) => e.preventDefault());

  // Cargar el JSON
  fetch("../assets/ciudades-del-mundo.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} al cargar JSON`);
      return res.json();
    })
    .then((json) => {
      data = json;
      console.log("JSON cargado OK ✅");
    })
    .catch((err) => {
      console.error("Error cargando JSON:", err);

      // Esto te lo enseña en la web para que sepas que es el fetch
      resultsBox.innerHTML = `
        <div class="search-item disabled">
          No se puede cargar el listado de destinos (JSON). <br>
          Abre la web con Live Server / localhost (no file://).
        </div>
      `;
    });

  // Normalizar texto (tildes)
  const norm = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  searchInput.addEventListener("input", () => {
    const queryRaw = searchInput.value.trim();
    const query = norm(queryRaw);

    resultsBox.innerHTML = "";

    if (!query) return;
    if (!data) return; // si aún no cargó, no busques

    const results = [];

    data.continents.forEach((continent) => {
      const contName = continent.name || "";
      if (norm(contName).includes(query)) {
        results.push({
          type: "continent",
          label: translateContinent(contName),
          link: `continent.html?name=${encodeURIComponent(contName)}`
        });
      }

      (continent.countries || []).forEach((country) => {
        const countryName = country.name || "";
        if (norm(countryName).includes(query)) {
          results.push({
            type: "country",
            label: `${country.name} · ${translateContinent(contName)}`,
            link: `country.html?country=${encodeURIComponent(country.name)}`
          });
        }

        (country.cities || []).forEach((city) => {
          const cityName = city.name || "";
          if (norm(cityName).includes(query)) {
            results.push({
              type: "city",
              label: `${cityName} · ${countryName}`,
              link: `city.html?city=${encodeURIComponent(cityName)}`
            });
          }
        });
      });
    });

    if (results.length > 0) {
      results.forEach((r) => {
        const item = document.createElement("div");
        item.className = `search-item ${r.type}`;
        item.textContent = r.label;
        item.addEventListener("click", () => {
          window.location.href = r.link;
        });
        resultsBox.appendChild(item);
      });
      return;
    }

    function translateContinent(name) {
        const lang = localStorage.getItem("language") || "es";
        return continentTranslations[lang]?.[name] || name;
    }


    // País existe pero no está disponible en la web (lista de ejemplo)
    const knownCountries = [
      "letonia", "lituania", "finlandia", "irlanda", "croacia",
      "serbia", "eslovaquia", "ucrania", "bielorrusia"
    ];

    if (knownCountries.includes(query)) {
      resultsBox.innerHTML = `
        <div class="search-item disabled">
          El destino existe, pero no está disponible en la web
        </div>
      `;
    } else {
      resultsBox.innerHTML = `
        <div class="search-item disabled">
          No se han encontrado resultados
        </div>
      `;
    }
  });

  // Cerrar resultados al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!searchForm.contains(e.target)) resultsBox.innerHTML = "";
  });
});
