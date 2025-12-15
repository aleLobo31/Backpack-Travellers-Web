async function loadPage() {
    // --------------------------------------------
    // 1. Leer parámetros de la URL
    // --------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const countryID = urlParams.get("country");

    if (!countryID) {
        console.error("No se ha proporcionado el país en la URL");
        return;
    }

    // --------------------------------------------
    // 2. Cargar JSON de seguridad
    // --------------------------------------------
    const response = await fetch('db/sec-countries.json');
    const db = await response.json();

    // --------------------------------------------
    // 3. Buscar continente y país en el JSON
    // --------------------------------------------
    let continent = null;
    let country = null;

    for (const cont of db.continents) {
        const foundCountry = cont.countries.find(c => c.name === countryID);
        if (foundCountry) {
            continent = cont;
            country = foundCountry;
            break;
        }
    }

    if (!continent || !country) {
        console.error("País o continente no encontrado en el JSON");
        return;
    }

    // --------------------------------------------
    // 4. Actualizar breadcrumbs
    // --------------------------------------------
    const continentDOM = document.getElementById('sec-continent');
    const countryDOM = document.getElementById('sec-country');

    continentDOM.textContent = continent.name;
    countryDOM.textContent = country.name;


    continentDOM.href = `continent.html?name=${encodeURIComponent(continent.name)}`; 
    countryDOM.href = `country.html?country=${encodeURIComponent(country.name)}`;

    // --------------------------------------------
    // 5. Actualizar bandera
    // --------------------------------------------
    const flagDOM = document.getElementById('sec-flag');
    flagDOM.src = `images/flags/${country.name}.png`;
    flagDOM.alt = `Bandera de ${country.name}`;

    // --------------------------------------------
    // 6. Título de la página
    // --------------------------------------------
    const titleDOM = document.getElementById('sec-title');
    titleDOM.textContent = 'Seguridad en ' + country.name;

    // --------------------------------------------
    // 7. Rellenar secciones de seguridad
    // --------------------------------------------
    const secciones = ['sec0', 'sec1', 'sec2', 'sec3', 'sec4'];
    let j = 1;

    for (let i = 0; i < secciones.length; i++) {
        const bloque = country.secciones[secciones[i]]?.items || [];

        for (const q of bloque) {
            const answer = document.getElementById('sec' + j);

            if (!answer) {
                j++;
                continue;
            }

            // Caso especial: nivel de riesgo
            if (j === 1) {
                const riesgo = parseInt(q.respuesta);
                if (!isNaN(riesgo) && riesgo > 0) {
                    answer.textContent = '[' + '🔴'.repeat(riesgo) + ']';
                } else {
                    answer.textContent = q.respuesta || 'No se dispone de información aún';
                }
            } else {
                answer.textContent = q.respuesta || 'No se dispone de información aún';
            }

            j++;
        }
    }
}

// --------------------------------------------
// Invocar carga
// --------------------------------------------
loadPage();
