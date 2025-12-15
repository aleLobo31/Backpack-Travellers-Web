// --------------------------------------------
// 1. Obtener ciudad desde la URL
// --------------------------------------------
const params = new URLSearchParams(window.location.search);
const cityName = params.get("city");

// --------------------------------------------
// 2. Cargar JSON
// --------------------------------------------
fetch("db/ciudades-del-mundo.json")
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
    renderPacks(selectedCity, selectedCountry);
  });


// --------------------------------------------
// 3. Banner
// --------------------------------------------
function renderBanner(city, country) {
  const bannerImg = document.getElementById("city-banner-img");

  // Usamos el banner específico de la ciudad
  if (city.banner && city.banner.image) {
    bannerImg.src = city.banner.image;
    bannerImg.alt = city.banner.alt || city.name;
  } else {
    // Fallback por seguridad
    bannerImg.src = city.image.url;
    bannerImg.alt = city.image.alt || city.name;
  }

  document.getElementById("city-title").textContent =
    `${city.name}, ${country.name}`;

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
// 5. Packs (LÓGICA REAL DE PRECIOS + REDIRECCIÓN)
// --------------------------------------------
function renderPacks(city, country) {
  const img1 = document.getElementById("city-pack-img-1");
  const img2 = document.getElementById("city-pack-img-2");
  const img3 = document.getElementById("city-pack-img-3");

  img1.src = city.image.url;
  img2.src = city.image.url;
  img3.src = city.image.url;

  const prices = city.prices || country.prices || { weekend: 0, week: 0, days_15: 0 };

  document.getElementById("pack-price-1").textContent = `${prices.weekend}€`;
  document.getElementById("pack-price-2").textContent = `${prices.week}€`;
  document.getElementById("pack-price-3").textContent = `${prices.days_15}€`;

  const buyButtons = document.querySelectorAll(".pack-button");

  // Botón 1: Fin de semana
  buyButtons[0].onclick = () => {
    goToPurchase(
      `pack-buy-page.html?city=${encodeURIComponent(city.name)}&type=Fin de semana&price=${prices.weekend}`
    );
  };

  // Botón 2: 7 días
  buyButtons[1].onclick = () => {
    goToPurchase(
      `pack-buy-page.html?city=${encodeURIComponent(city.name)}&type=7 días&price=${prices.week}`
    );
  };

  // Botón 3: 15 días
  buyButtons[2].onclick = () => {
    goToPurchase(
      `pack-buy-page.html?city=${encodeURIComponent(city.name)}&type=15 días&price=${prices.days_15}`
    );
  };
}