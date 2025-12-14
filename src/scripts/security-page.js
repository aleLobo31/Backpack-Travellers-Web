async function loadPage() {
    // Obtenemos una lista con los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);

    // Extraemos el nombre del continente actual
    // const continentID = url_params.get("continentID");
    const continentID = 'América del Sur';

    // Extraemos el nombre del país actual
    // const countryID = url_params.get("countryID");
    const countryID = 'Brasil';

    // Cargamos el JSON con los datos
    const response = await fetch('../assets/sec-countries.json');
    const db = await response.json();

    // Actualizamos las "breadcrumbs"
    const continentDOM = document.getElementById('sec-continent');
    continentDOM.textContent = continentID; 
    const countryDOM = document.getElementById('sec-country');
    countryDOM.textContent = countryID;

    // Actualizamos la Bandera
    const flagPath = `../assets/flags/${countryID}.png`;
    const flagDOM = document.getElementById('sec-flag');
    flagDOM.src = flagPath;
    flagDOM.alt = `Bandera de ${countryID}`;

    // Actualizamos el Título de la página
    const titleDOM = document.getElementById('sec-title');
    titleDOM.textContent = 'Seguridad en ' + countryID;

    // Buscamos el continente y el país en el JSON
    const continent = db.continents.find(c => c.name === continentID);
    const country = continent.countries.find(c => c.name === countryID);

    // Para las 5 secciones extraigo sus respuestas y las cambio en el DOM
    const secciones = ['sec0', 'sec1', 'sec2', 'sec3', 'sec4'];
    let j = 1;
    for(let i = 0; i < secciones.length; i++) {
        const seccion = country.secciones[secciones[i]].items;
        for(const q of seccion) {
            const answer = document.getElementById('sec'+j);
            
            // Caso especial: nivel de riesgo (j=1)
            if(j === 1) {
                const riesgo = parseInt(q.respuesta);
                if(!isNaN(riesgo) && riesgo > 0) {
                    answer.textContent = '['+ '🔴'.repeat(riesgo) + ']';
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

// Invocamos la función
loadPage();