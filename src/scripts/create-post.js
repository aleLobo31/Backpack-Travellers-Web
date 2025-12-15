// --------------------------------------------
// 1. Variables globales
// --------------------------------------------
let selectedCategories = ['Compañeros de viaje', 'Presupuesto y ahorros', 'Viajar con mascotas'];

// --------------------------------------------
// 2. Inicialización
// --------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeForm();
});

// --------------------------------------------
// 3. Configurar event listeners
// --------------------------------------------
function setupEventListeners() {
    const form = document.getElementById('create-post-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Contador de caracteres para título
    const titleInput = document.getElementById('post-title');
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            updateCharCounter('title-counter', this.value.length, 100);
        });
    }
    
    // Contador de caracteres para contenido
    const contentInput = document.getElementById('post-content');
    if (contentInput) {
        contentInput.addEventListener('input', function() {
            updateCharCounter('content-counter', this.value.length, 2000);
        });
    }
    
    // Categorías checkboxes
    const categoryCheckboxes = document.querySelectorAll('input[name="categories"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedCategories();
        });
    });
    
    // Subir imagen
    const imageInput = document.getElementById('post-image');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    // Botón de subir imagen
    const uploadLabel = document.querySelector('.upload-label');
    if (uploadLabel) {
        uploadLabel.addEventListener('click', function(e) {
            e.preventDefault();
            imageInput.click();
        });
    }
}

// --------------------------------------------
// 4. Inicializar formulario
// --------------------------------------------
function initializeForm() {
    // Inicializar contadores
    updateCharCounter('title-counter', 0, 100);
    updateCharCounter('content-counter', 0, 2000);
    
    // Marcar categorías seleccionadas por defecto
    const defaultCategories = [];
    const categoryCheckboxes = document.querySelectorAll('input[name="categories"]');
    
    categoryCheckboxes.forEach(checkbox => {
        if (defaultCategories.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });
}

// --------------------------------------------
// 5. Actualizar contador de caracteres
// --------------------------------------------
function updateCharCounter(counterId, currentLength, maxLength) {
    const counter = document.getElementById(counterId);
    if (counter) {
        counter.textContent = `${currentLength}/${maxLength}`;
        
        // Cambiar color si se acerca al límite
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#cc3333';
        } else if (currentLength > maxLength * 0.7) {
            counter.style.color = '#a26a33';
        } else {
            counter.style.color = '#665b4f;';
        }
    }
}

// --------------------------------------------
// 6. Actualizar categorías seleccionadas
// --------------------------------------------
function updateSelectedCategories() {
    selectedCategories = [];
    const checkboxes = document.querySelectorAll('input[name="categories"]:checked');
    
    checkboxes.forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });
    
    console.log('Categorías seleccionadas:', selectedCategories);
}

// --------------------------------------------
// 7. Manejar subida de imagen
// --------------------------------------------
function handleImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('image-preview');
    
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.match('image.*')) {
        alert('Por favor, selecciona solo archivos de imagen (JPG, PNG, GIF)');
        event.target.value = '';
        return;
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB.');
        event.target.value = '';
        return;
    }
    
    // Mostrar preview
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `
            <img src="${e.target.result}" alt="Preview de la imagen">
            <button class="remove-image" onclick="removeImage()">✕</button>
        `;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// --------------------------------------------
// 8. Remover imagen
// --------------------------------------------
function removeImage() {
    const imageInput = document.getElementById('post-image');
    const preview = document.getElementById('image-preview');
    
    imageInput.value = '';
    preview.innerHTML = '';
    preview.style.display = 'none';
}

// --------------------------------------------
// 9. Manejar envío del formulario
// --------------------------------------------
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const imageInput = document.getElementById('post-image');
    
    // Validaciones
    if (!title) {
        alert('Por favor, introduce un título para tu post');
        document.getElementById('post-title').focus();
        return;
    }
    
    if (title.length > 100) {
        alert('El título no puede tener más de 100 caracteres');
        document.getElementById('post-title').focus();
        return;
    }
    
    if (!content) {
        alert('Por favor, escribe el contenido de tu post');
        document.getElementById('post-content').focus();
        return;
    }
    
    if (content.length > 2000) {
        alert('El contenido no puede tener más de 2000 caracteres');
        document.getElementById('post-content').focus();
        return;
    }
    
    if (selectedCategories.length === 0) {
        alert('Por favor, selecciona al menos una categoría');
        return;
    }
    
    // Preparar datos del post
    const newPost = {
        id: Date.now(), // ID temporal
        title: title,
        description: content.substring(0, 150) + '...', // Descripción corta
        author: 'Usuario Actual',
        date: new Date().toISOString(),
        category: selectedCategories[0], // Primera categoría como principal
        categories: selectedCategories,
        verified: false,
        likes: 0,
        comments: 0,
        content: content,
        image: imageInput.files[0] ? {
            url: URL.createObjectURL(imageInput.files[0]),
            name: imageInput.files[0].name
        } : null
    };
    
    console.log('Nuevo post creado:', newPost);

    // Mostrar mensaje de éxito
    showSuccessMessage();
    
    // Redirigir al foro después de 2 segundos
    setTimeout(() => {
        window.location.href = 'forum-page.html';
    }, 2000);
}

// --------------------------------------------
// 10. Mostrar mensaje de éxito
// --------------------------------------------
function showSuccessMessage() {
    // Crear overlay de éxito
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    successOverlay.innerHTML = `
        <div class="success-message">
            <div class="success-icon">✓</div>
            <h3>¡Post creado exitosamente!</h3>
            <p>Tu post ha sido publicado y aparecerá en el foro.</p>
            <p>Redirigiendo al foro...</p>
        </div>
    `;
    
    // Estilos inline para el overlay
    successOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    // Estilos inline para el mensaje
    const successMessage = successOverlay.querySelector('.success-message');
    successMessage.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;
    
    const successIcon = successOverlay.querySelector('.success-icon');
    successIcon.style.cssText = `
        font-size: 4rem;
        color: #2d5a2d;
        margin-bottom: 1rem;
    `;
    
    successOverlay.querySelector('h3').style.cssText = `
        color: #2d5a2d;
        margin-bottom: 1rem;
        font-size: 1.8rem;
    `;
    
    successOverlay.querySelector('p').style.cssText = `
        color: #5a4a3a;
        margin-bottom: 0.5rem;
    `;
    
    document.body.appendChild(successOverlay);
    
    // Remover después de 2 segundos
    setTimeout(() => {
        successOverlay.remove();
    }, 2000);
}