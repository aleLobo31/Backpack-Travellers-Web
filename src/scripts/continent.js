// --------------------------------------------
// 1. Obtener el continente desde la URL
// --------------------------------------------
const params = new URLSearchParams(window.location.search);
const continentName = params.get("name");

if (!continentName) {
  document.getElementById("continent-title").textContent = "Continente no especificado";
  throw new Error("Falta el parámetro '?name=' en la URL");
}

// --------------------------------------------
// 2. Cargar JSON
// --------------------------------------------
fetch("../assets/ciudades-del-mundo.json")
  .then(res => res.json())
  .then(data => {
    const continent = data.continents.find(c => c.name === continentName);

    if (!continent) {
      document.getElementById("continent-title").textContent = "Continente no encontrado";
      return;
    }

    renderBanner(continent);
    renderTitle(continent);
    renderCountries(continent);
  });

// --------------------------------------------
// 3. Renderizar banner dinámico
// --------------------------------------------
function renderBanner(continent) {
  const bannerImg = document.getElementById("banner-image");
  const title = document.getElementById("continent-title");
  const quote = document.getElementById("continent-quote");

  const firstCountry = continent.countries[0];
  const firstCity = firstCountry.cities[0];

  bannerImg.src = firstCity.image.url;
  title.textContent = continent.name;

  quote.textContent =
    `Explora la diversidad, la cultura y los paisajes únicos de ${continent.name}.`;
}

// --------------------------------------------
// 4. Renderizar título
// --------------------------------------------
function renderTitle(continent) {
  document.getElementById("section-title").textContent = `Países de ${continent.name}`;
}

// --------------------------------------------
// 5. Renderizar países
// --------------------------------------------
function renderCountries(continent) {
  const container = document.getElementById("countries-container");
  container.innerHTML = "";

  const countries = continent.countries;

  for (let i = 0; i < countries.length; i += 2) {
    const row = document.createElement("div");
    row.classList.add("country-row");

    row.appendChild(createCountryCard(countries[i]));

    if (countries[i + 1]) row.appendChild(createCountryCard(countries[i + 1]));

    container.appendChild(row);
  }
}

// --------------------------------------------
// 6. Crear tarjeta individual de país
// --------------------------------------------
function createCountryCard(country) {
  const card = document.createElement("article");
  card.classList.add("country-card");

  const city = country.cities[0];

  card.innerHTML = `
    <div class="country-image">
      <img src="${city.image.url}" alt="${city.image.alt}">
    </div>

    <div class="country-info">
      <div>
        <h3 class="country-name">${country.name}</h3>
        <p class="country-description">${city.description}</p>
      </div>

      <div class="country-actions">
        <a href="country.html?country=${encodeURIComponent(country.name)}"
           class="pill-button primary">¡Quiero viajar!</a>

        <a href="security.html?country=${encodeURIComponent(country.name)}"
           class="pill-button">¿Es seguro?</a>
      </div>
    </div>
  `;

  return card;
}
