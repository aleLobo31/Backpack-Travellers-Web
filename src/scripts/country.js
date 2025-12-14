// --------------------------------------------
// 1. Obtener país desde la URL
// --------------------------------------------
const params = new URLSearchParams(window.location.search);
const countryName = params.get("country");

// --------------------------------------------
// 2. Cargar JSON
// --------------------------------------------
fetch("../assets/ciudades-del-mundo.json")
  .then(res => res.json())
  .then(data => {
    const continents = data.continents;

    let selectedCountry = null;

    for (const continent of continents) {
      const found = continent.countries.find(c => c.name === countryName);
      if (found) {
        selectedCountry = found;
        break;
      }
    }

    if (!selectedCountry) {
      console.error("País no encontrado:", countryName);
      document.getElementById("country-name").textContent = "País no encontrado";
      return;
    }

    // Actualizar cabecera del país
    updateCountryHeader(selectedCountry);

    // Renderizar ciudades
    renderCities(selectedCountry);

    // Botón de seguridad
    setupSecurityButton(selectedCountry);
  })
  .catch(err => console.error("Error cargando el JSON:", err));


// --------------------------------------------
// 3. Banner + encabezado del país
// --------------------------------------------
function updateCountryHeader(country) {
  const nameEl = document.getElementById("country-name");
  const subtitleEl = document.getElementById("country-subtitle");
  const flagEl = document.getElementById("country-flag");
  const bannerEl = document.querySelector(".country-header-banner");

  // Título del país
  nameEl.textContent = country.name;

  // Subtítulo → descripción del país (larga si existe)
  subtitleEl.textContent = country.description_extended || country.description;

  // Bandera
  flagEl.src = `../assets/flags/${country.name}.png`;
  flagEl.alt = `Bandera de ${country.name}`;

  // Imagen del banner → usamos la imagen de la primera ciudad
  if (country.banner && country.banner.image) {
    bannerEl.style.backgroundImage = `
      linear-gradient(rgba(58, 47, 34, 0.55), rgba(58, 47, 34, 0.55)),
      url('${country.banner.image}')
    `;
  } else {
    // Fallback si algún país no tiene banner
    bannerEl.style.backgroundImage = `
      linear-gradient(rgba(58, 47, 34, 0.55), rgba(58, 47, 34, 0.55)),
      url('../assets/default-country-banner.jpg')
    `;
  }
}


// --------------------------------------------
// 4. Renderizar ciudades en filas de máximo 2
// --------------------------------------------
function renderCities(country) {
  const container = document.getElementById("cities-container");
  container.innerHTML = "";

  const cities = country.cities;

  for (let i = 0; i < cities.length; i += 2) {
    const row = document.createElement("div");
    row.classList.add("city-row");

    row.appendChild(createCityCard(cities[i]));

    if (cities[i + 1]) {
      row.appendChild(createCityCard(cities[i + 1]));
    }

    container.appendChild(row);
  }
}


// --------------------------------------------
// 5. Crear tarjeta individual de ciudad
// --------------------------------------------
function createCityCard(city) {
  const card = document.createElement("article");
  card.classList.add("city-card");

  card.innerHTML = `
    <div class="city-image">
      <img src="${city.image.url}" alt="${city.image.alt}">
    </div>

    <div class="city-info">
      <h2 class="city-name">${city.name}</h2>

      <p class="city-description">${city.description}</p>

      <div class="city-footer">
        <div class="city-separator"></div>
        <a class="pill-button primary city-btn">¡Quiero viajar!</a>
      </div>
    </div>
  `;

  // Redirección a city.html
  card.querySelector(".city-btn").addEventListener("click", () => {
    window.location.href = `city.html?city=${encodeURIComponent(city.name)}`;
  });

  return card;
}


// --------------------------------------------
// 6. Botón de seguridad
// --------------------------------------------
function setupSecurityButton(country) {
  const btn = document.getElementById("safety-button");

  btn.addEventListener("click", () => {
    // CORRECCIÓN: Asegúrate de que el nombre del archivo HTML es correcto.
    // He puesto "security-page.html" porque así parece llamarse tu archivo.
    window.location.href = `security-page.html?country=${encodeURIComponent(country.name)}`;
  });
}
