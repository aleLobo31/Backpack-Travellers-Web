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

    // Buscar país en todos los continentes
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

    // Actualizar cabecera (bandera + título + subtítulo)
    updateCountryHeader(selectedCountry);

    // Pintar tarjetas de ciudades en filas de 2
    renderCities(selectedCountry);
  })
  .catch(err => console.error("Error cargando el JSON:", err));


// --------------------------------------------
// 3. Actualizar cabecera con bandera
// --------------------------------------------
function updateCountryHeader(country) {
  const nameEl = document.getElementById("country-name");
  const subtitleEl = document.getElementById("country-subtitle");
  const flagEl = document.getElementById("country-flag");

  if (nameEl) {
    nameEl.textContent = country.name;
  }

  if (subtitleEl) {
    subtitleEl.textContent = `Descubre ${country.name} a través de sus ciudades más fascinantes.`;
  }

  if (flagEl) {
    flagEl.src = `../assets/flags/${country.name}.png`;
    flagEl.alt = `Bandera de ${country.name}`;
  }
}


// --------------------------------------------
// 4. Renderizar ciudades en filas de máximo 2
// --------------------------------------------
function renderCities(country) {
  const container = document.getElementById("cities-container");
  if (!container) return;

  container.innerHTML = "";

  const cities = country.cities;

  // Recorremos las ciudades de dos en dos
  for (let i = 0; i < cities.length; i += 2) {
    const row = document.createElement("div");
    row.classList.add("city-row");

    // Primera ciudad
    row.appendChild(createCityCard(cities[i]));

    // Segunda ciudad si existe
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
      <h3 class="city-name">${city.name}</h3>

      <p class="city-description">${city.description}</p>

      <div class="city-footer">
        <div class="city-separator"></div>
        <a class="pill-button primary">¡Quiero viajar!</a>
      </div>
    </div>
  `;

  return card;
}

