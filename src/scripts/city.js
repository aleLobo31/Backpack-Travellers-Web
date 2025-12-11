// --------------------------------------------
// 1. Obtener ciudad desde la URL
// --------------------------------------------
const params = new URLSearchParams(window.location.search);
const cityName = params.get("city");

// --------------------------------------------
// 2. Cargar JSON
// --------------------------------------------
fetch("../assets/ciudades-del-mundo.json")
  .then(res => res.json())
  .then(data => {
    let selectedCity = null;
    let selectedCountry = null;

    for (const continent of data.continents) {
      for (const country of continent.countries) {
        const city = country.cities.find(c => c.name === cityName);
        if (city) {
          selectedCity = city;
          selectedCountry = country;
        }
      }
    }

    if (!selectedCity) {
      console.error("Ciudad no encontrada");
      return;
    }

    renderBanner(selectedCity, selectedCountry);
    renderDetail(selectedCity);
    renderPacks(selectedCity);
  });


// --------------------------------------------
// 3. Banner
// --------------------------------------------
function renderBanner(city, country) {
  document.getElementById("city-banner-img").src = city.image.url;
  document.getElementById("city-title").textContent = `${city.name}, ${country.name}`;

  // Lema (motto)
  document.getElementById("city-slogan").textContent =
    city.motto ? `"${city.motto}"` : `"Lema no disponible"`;
}


// --------------------------------------------
// 4. Detalle
// --------------------------------------------
function renderDetail(city) {
  document.getElementById("city-vertical-img").src = city.image.url;

  // Descripción larga
  document.getElementById("city-description-text").textContent =
    city.description_extended || city.description;

  // Pie de foto (footer)
  const footerElement = document.getElementById("city-footer");
  if (footerElement) {
    footerElement.textContent = city.footer || "";
  }
}


// --------------------------------------------
// 5. Packs (precios inventados)
// --------------------------------------------
function renderPacks(city) {
  const img1 = document.getElementById("city-pack-img-1");
  const img2 = document.getElementById("city-pack-img-2");
  const img3 = document.getElementById("city-pack-img-3");

  img1.src = city.image.url;
  img2.src = city.image.url;
  img3.src = city.image.url;

  document.getElementById("pack-price-1").textContent = "150€";
  document.getElementById("pack-price-2").textContent = "420€";
  document.getElementById("pack-price-3").textContent = "900€";
}
