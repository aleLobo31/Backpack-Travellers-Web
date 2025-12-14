document.addEventListener("DOMContentLoaded", () => {

    const usuarioActivo = sessionStorage.getItem("usuarioActivo");

    // URL actual (con parámetros)
    const currentUrl = window.location.href;

    // Si NO hay sesión → guardar destino y mandar a login
    if (!usuarioActivo) {
        sessionStorage.setItem("redirectAfterAuth", currentUrl);
        window.location.href = "login.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const type = params.get("type");
    const price = params.get("price");

    if (!city || !type || !price) {
        window.location.href = "main-page.html";
        return;
    }

    initPackInfo();
    initCalendar();
    initCompanions();
    initPets();
    initAllergies();
    initPaymentForm();

});

// Meses del Año
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Capturamos la fecha actual
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Declaramos variables para seleccionar el intervalo temporal
let selectedStartDate = null;
let selectedEndDate = null;

function initPackInfo() {
    const params = new URLSearchParams(window.location.search);
    const cityName = params.get("city");
    const packType = params.get("type");
    const packPrice = params.get("price");

    if (!cityName || !packType) return;

    const packNameEl = document.querySelector(".pack-name");
    const packPriceEl = document.querySelector(".pack-price");

    if (packNameEl) packNameEl.textContent = `Pack ${packType}: ${cityName}`;
    if (packPriceEl) packPriceEl.textContent = `${packPrice}€`;

    fetch("../assets/ciudades-del-mundo.json")
        .then(response => {
            if (!response.ok) throw new Error("Error cargando JSON");
            return response.json();
        })
        .then(data => {
            const continents = data.continents || data;
            let foundCity = null;

            if (Array.isArray(continents)) {
                continents.some(continent => {
                    return continent.countries.some(country => {
                        const city = country.cities.find(c => c.name === cityName);
                        if (city) {
                            foundCity = city;
                            return true;
                        }
                        return false;
                    });
                });
            }

            if (foundCity) {
                const imgEl = document.querySelector(".pack-image img");
                if (imgEl) {
                    const imgSrc = (foundCity.image && foundCity.image.url) 
                                   ? foundCity.image.url 
                                   : (foundCity.banner ? foundCity.banner.image : "");
                    
                    if (imgSrc) imgEl.src = imgSrc;
                    imgEl.alt = `Viaje a ${foundCity.name}`;
                }

                const lemaEl = document.querySelector(".pack-lema p");
                if (lemaEl) {
                    lemaEl.textContent = foundCity.motto || foundCity.description || `¡Disfruta de ${cityName}!`;
                }
            }
        })
        .catch(error => console.error(error));
}

function renderCalendar(month, year) {
    // Extraemos los elementos del DOM
    const calendarBody = document.getElementById('calendar-body');
    const calendarMonth = document.getElementById('calendar-month');
    
    calendarBody.innerHTML = '';
    calendarMonth.textContent = `${months[month]} ${year}`;

    // Calculamos el primer día del mes
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Ajustar para empezar en lunes

    /*
     * Generamos la tabla del calendario dinámicamente.
     * 
     * Estructura HTML esperada (pack-buy-page.html):
     *   <table class="calendar-table">
     *     <thead>
     *       <tr><th>L</th><th>M</th>...<th>D</th></tr> // Cabecera fija con días de la semana
     *     </thead>
     *     <tbody id="calendar-body">
     *       <!-- Filas generadas aquí -->
     *     </tbody>
     *   </table>
     * 
     * Lógica del bucle:
     *   - i: representa cada fila (semana), máximo 6 filas por mes
     *   - j: representa cada columna (día de la semana, L=0 a D=6)
     *   - Creamos celdas vacías hasta llegar al primer día del mes (startDay)
     *   - Cada celda contiene un <span> con el número del día y data-date="YYYY-MM-DD"
     *   - Añadimos clases CSS según el estado: 'disabled' (pasado), 'today', 'selected', 'in-range'
     */
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');

            // Primera semana: celdas vacías antes del primer día del mes
            if (i === 0 && j < startDay) {
                cell.textContent = '';
            // Días que exceden el mes: celdas vacías al final
            } else if (date > daysInMonth) {
                cell.textContent = '';
            // Día válido: creamos el span con la información del día
            } else {
                // Creamos un span para guardar el día
                const span = document.createElement('span');
                span.textContent = date;

                // Guardamos la fecha en formato ISO (YYYY-MM-DD) para facilitar comparaciones
                span.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

                const today = new Date();
                const cellDate = new Date(year, month, date);
                
                // Si la fecha es anterior a hoy, la deshabilitamos visualmente
                // Si no, añadimos el evento click para poder seleccionarla
                if (cellDate < today.setHours(0,0,0,0)) {
                    span.classList.add('disabled');
                } else {
                    span.addEventListener('click', () => selectDate(span));
                }

                // Si la fecha coincide con el día actual, la marcamos como 'today'
                if (date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    span.classList.add('today');
                }

                // Marcar fechas seleccionadas
                if (selectedStartDate && span.dataset.date === selectedStartDate) {
                    span.classList.add('selected');
                }
                if (selectedEndDate && span.dataset.date === selectedEndDate) {
                    span.classList.add('selected');
                }

                // Marcar rango
                if (selectedStartDate && selectedEndDate) {
                    const start = new Date(selectedStartDate);
                    const end = new Date(selectedEndDate);
                    if (cellDate > start && cellDate < end) {
                        span.classList.add('in-range');
                    }
                }

                // Añadimos el span al td y avanzamos al siguiente día
                cell.appendChild(span);
                date++;
            }

            // Añadimos la celda (td) a la fila (tr)
            row.appendChild(cell);
        }

        // Añadimos la fila completa al tbody y si ya no hay más días, salimos del bucle
        calendarBody.appendChild(row);
        if (date > daysInMonth) break;
    }
}

/*
 * Gestiona la selección de fechas para crear un rango (inicio - fin).
 * 
 * Comportamiento:
 *   - Primer click: establece la fecha de inicio (selectedStartDate)
 *   - Segundo click: establece la fecha de fin (selectedEndDate)
 *   - Si ya hay un rango seleccionado, el siguiente click reinicia la selección
 *   - Si la segunda fecha es anterior a la primera, las intercambia automáticamente
 * 
 * Al finalizar, vuelve a renderizar el calendario para reflejar la selección.
 */
function selectDate(span) {
    const date = span.dataset.date;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // Primera selección o reinicio (si ya había un rango completo)
        selectedStartDate = date;
        selectedEndDate = null;
    } else {
        // Segunda selección: determinamos orden correcto del rango
        if (new Date(date) < new Date(selectedStartDate)) {
            // Si la nueva fecha es anterior, intercambiamos
            selectedEndDate = selectedStartDate;
            selectedStartDate = date;
        } else {
            selectedEndDate = date;
        }
    }

    // Re-renderizamos para mostrar el rango seleccionado
    renderCalendar(currentMonth, currentYear);
}

/*
 * Muestra un modal de error con un mensaje personalizado.
 * 
 * Crea dinámicamente un div con la clase 'error-modal' que contiene:
 *   - Un título con icono de advertencia
 *   - El mensaje de error pasado como parámetro
 *   - Un botón "Aceptar" que cierra el modal al hacer click
 * 
 * El modal se añade al body y se elimina del DOM cuando el usuario lo cierra.
 * Los estilos del modal están definidos en pack-buy-styles.css (.error-modal)
 */
function showError(message) {
    const errorModal = document.createElement('div');
    errorModal.classList.add('error-modal');
    errorModal.innerHTML = `
        <div class="error-modal-content">
            <h3>⚠ Atención</h3>
            <p>${message}</p>
            <button class="btn-modal-close">Aceptar</button>
        </div>
    `;
    document.body.appendChild(errorModal);

    errorModal.querySelector('.btn-modal-close').addEventListener('click', () => {
        errorModal.remove();
    });
}

function validateForm() {
    // Extraemos los elementos del form
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const tipoTarjeta = document.getElementById('tipo-tarjeta').value;
    const numeroTarjetaVal = document.getElementById('numero-tarjeta').value.replace(/\s/g, '');
    const titular = document.getElementById('titular').value.trim();
    const expiracion = document.getElementById('expiracion').value;
    const cvvVal = document.getElementById('cvv').value.trim();

    // Validar nombre completo (mínimo 3 caracteres)
    if (nombre.length < 3) {
        showError('El nombre debe tener al menos 3 caracteres.');
        return false;
    }

    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        showError('El correo electrónico debe tener el formato <nombre>@<dominio>.<extensión>.');
        return false;
    }

    // Validar tipo de tarjeta
    if (!tipoTarjeta) {
        showError('Debe seleccionar un tipo de tarjeta.');
        return false;
    }

    // Validar número de tarjeta (13, 15, 16 o 19 dígitos)
    const validLengths = [13, 15, 16, 19];
    if (!validLengths.includes(numeroTarjetaVal.length)) {
        showError('El número de tarjeta debe tener 13, 15, 16 o 19 dígitos.');
        return false;
    }

    // Validar nombre del titular (mínimo 3 caracteres)
    if (titular.length < 3) {
        showError('El nombre del titular debe tener al menos 3 caracteres.');
        return false;
    }

    // Validar fecha de caducidad (no expirada)
    if (!expiracion) {
        showError('Debe seleccionar una fecha de caducidad.');
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(expiracion);
    // Comprobamos que la tarjeta no esté expirada
    if (expirationDate < today) {
        showError('La fecha de caducidad ha expirado.');
        return false;
    }

    // Validar CVV (3 dígitos)
    if (cvvVal.length !== 3 || !/^\d{3}$/.test(cvvVal)) {
        showError('El CVV debe tener exactamente 3 dígitos.');
        return false;
    }

    return true;
}

/*
 * Inicializa el calendario: botones de navegación y renderizado inicial.
 * 
 * Estructura HTML esperada (pack-buy-page.html):
 *   <button id="prev-month">&lt;</button>
 *   <span id="calendar-month">Mes</span>
 *   <button id="next-month">&gt;</button>
 * 
 * Comportamiento:
 *   - Botón "prev-month": retrocede un mes (si es enero, pasa a diciembre del año anterior)
 *   - Botón "next-month": avanza un mes (si es diciembre, pasa a enero del año siguiente)
 *   - Al final, renderiza el calendario del mes actual
 */
function initCalendar() {
    // Extraemos los botones para retroceder o avanzar
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    // Evento para retroceder un mes y volver a renderizar
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Evento para avanzar un mes y volver a renderizar
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Renderizado inicial del calendario
    renderCalendar(currentMonth, currentYear);
}

/*
 * Inicializa la sección de acompañantes: permite añadir y eliminar acompañantes dinámicamente.
 * 
 * Estructura HTML esperada (pack-buy-page.html):
 *   <button id="add-companion">Añadir acompañante</button>
 *   <div id="companions-list"></div> - Contenedor donde se añaden los formularios
 * 
 * Comportamiento:
 *   - Al hacer click en "add-companion", se crea un nuevo formulario con:
 *     · Cabecera con número de acompañante y botón de eliminar (×)
 *     · Inputs para nombre, apellidos y correo electrónico
 *   - Cada formulario tiene un contador único (companionCount) para identificar los inputs
 *   - El botón "×" elimina ese acompañante específico del DOM
 * 
 * Los estilos están en pack-buy-styles.css (.companion-item-form, .companion-row, etc.)
 */
function initCompanions() {
    // Extraemos la lista de acompañantes y el botón de agregar
    const addCompanionBtn = document.getElementById('add-companion');
    const companionsList = document.getElementById('companions-list');

    // Declaramos un contador para saber cuántos acompañanetes hay
    let companionCount = 0;

    addCompanionBtn.addEventListener('click', () => {
        companionCount++;
        const item = document.createElement('div');
        item.classList.add('companion-item-form');
        item.innerHTML = `
            <div class="companion-item-header">
                <span>Acompañante ${companionCount}</span>
                <button class="btn-remove" type="button">&times;</button>
            </div>
            <div class="companion-row">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" name="comp-nombre-${companionCount}" placeholder="Nombre">
                </div>
                <div class="form-group">
                    <label>Apellido/s</label>
                    <input type="text" name="comp-apellidos-${companionCount}" placeholder="Apellido/s">
                </div>
            </div>
            <div class="form-group">
                <label>Correo Electrónico</label>
                <input type="email" name="comp-correo-${companionCount}" placeholder="correo@ejemplo.com">
            </div>
        `;

        // Evento para eliminar este acompañante específico
        item.querySelector('.btn-remove').addEventListener('click', () => {
            item.remove();
        });

        // Agregamos el acompañante a la lista
        companionsList.appendChild(item);
    });
}

/*
 * Inicializa la sección de mascotas: permite añadir y eliminar mascotas dinámicamente.
 * 
 * Estructura HTML esperada (pack-buy-page.html):
 *   <button id="add-pet">Añadir mascota</button>
 *   <div id="pets-list"></div> - Contenedor donde se añaden los formularios
 * 
 * Comportamiento:
 *   - Al hacer click en "add-pet", se crea un nuevo formulario con:
 *     · Cabecera con número de mascota y botón de eliminar (×)
 *     · Input para el tipo de mascota (perro, gato, etc.)
 *     · Select para el tamaño (pequeño, mediano, grande)
 *   - Cada formulario tiene un contador único (petCount) para identificar los inputs
 *   - El botón "×" elimina esa mascota específica del DOM
 * 
 * Los estilos están en pack-buy-styles.css (.pet-item-form, .companion-row, etc.)
 */
function initPets() {
    // Extraemos la lista de mascotas y el botón de agregar
    const addPetBtn = document.getElementById('add-pet');
    const petsList = document.getElementById('pets-list');

    // Declaramos un contador para saber cuántas mascotas hay
    let petCount = 0;

    addPetBtn.addEventListener('click', () => {
        petCount++;
        const item = document.createElement('div');
        item.classList.add('pet-item-form');
        item.innerHTML = `
            <div class="pet-item-header">
                <span>Mascota ${petCount}</span>
                <button class="btn-remove" type="button">&times;</button>
            </div>
            <div class="companion-row">
                <div class="form-group">
                    <label>Tipo</label>
                    <input type="text" name="pet-tipo-${petCount}" placeholder="Perro, gato...">
                </div>
                <div class="form-group">
                    <label>Tamaño</label>
                    <select name="pet-tamano-${petCount}">
                        <option value="">Seleccionar...</option>
                        <option value="pequeno">Pequeño</option>
                        <option value="mediano">Mediano</option>
                        <option value="grande">Grande</option>
                    </select>
                </div>
            </div>
        `;

        // Evento para eliminar esta mascota específica
        item.querySelector('.btn-remove').addEventListener('click', () => {
            item.remove();
        });

        // Agregamos la mascota a la lista
        petsList.appendChild(item);
    });
}

/*
 * Inicializa la sección de alergias: habilita/deshabilita el input según el checkbox.
 * 
 * Estructura HTML esperada (pack-buy-page.html):
 *   <input type="checkbox" id="has-allergies">
 *   <input type="text" id="allergies-input" disabled>
 * 
 * Comportamiento:
 *   - Si el checkbox está marcado: habilita el input y le da el foco
 *   - Si el checkbox está desmarcado: deshabilita el input y limpia su contenido
 * 
 * Los estilos están en pack-buy-styles.css (.allergies-section)
 */
function initAllergies() {
    // Extraemos el checkbox y el input de alergias
    const hasAllergies = document.getElementById('has-allergies');
    const allergiesInput = document.getElementById('allergies-input');

    // Evento para habilitar/deshabilitar el input según el checkbox
    hasAllergies.addEventListener('change', () => {
        allergiesInput.disabled = !hasAllergies.checked;
        if (!hasAllergies.checked) {
            // Si se desmarca, limpiamos el contenido
            allergiesInput.value = '';
        } else {
            // Si se marca, enfocamos el input para facilitar la escritura
            allergiesInput.focus();
        }
    });
}

/*
 * Inicializa el formulario de pago: formato de tarjeta, CVV y submit.
 * 
 * Estructura HTML esperada (pack-buy-page.html):
 *   <form id="purchase-form">
 *     <input type="text" id="numero-tarjeta">
 *     <input type="text" id="cvv">
 *     <button type="submit">Comprar</button>
 *   </form>
 * 
 * Comportamiento:
 *   - Número de tarjeta: formatea automáticamente en grupos de 4 dígitos (1234 5678 9012 3456)
 *     · Elimina cualquier carácter que no sea dígito
 *     · Inserta un espacio cada 4 dígitos para mejorar la legibilidad
 *   - CVV: restringe la entrada a exactamente 3 dígitos numéricos
 *   - Submit: previene el envío por defecto y valida el formulario con validateForm()
 *     · Si la validación es exitosa, muestra un modal de éxito
 *     · El botón "Aceptar" del modal cierra el modal y resetea el formulario
 * 
 * Los estilos del modal están en pack-buy-styles.css (.success-modal, .success-modal-content)
 */
function initPaymentForm() {
    // Establecemos el formato de la tarjeta: elimina no-dígitos y agrupa en bloques de 4
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    numeroTarjeta.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });

    // Restringimos el CVV a 3 dígitos numéricos
    const cvv = document.getElementById('cvv');
    cvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });

    // Al pulsar "Comprar" validamos los campos y mostramos el modal de éxito si todo es correcto
    const purchaseForm = document.getElementById('purchase-form');
    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Mostrar ventana de éxito
            const successModal = document.createElement('div');
            successModal.classList.add('success-modal');
            successModal.innerHTML = `
                <div class="success-modal-content">
                    <h3>✓ Compra realizada</h3>
                    <p>Su compra se ha procesado correctamente.</p>
                    <button class="btn-modal-close">Aceptar</button>
                </div>
            `;
            document.body.appendChild(successModal);

            successModal.querySelector('.btn-modal-close').addEventListener('click', () => {
                successModal.remove();
                purchaseForm.reset();
            });
        }
    });
}

