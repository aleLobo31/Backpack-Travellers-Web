// --------------------------------------------
// 1. Variables globales y estado
// --------------------------------------------
let allPosts = [];
let filteredPosts = [];
let currentFilters = {
  categories: [],
  verifiedOnly: false,
  sortBy: "popular"
};

// --------------------------------------------
// 2. Inicialización al cargar la página
// --------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  loadPosts();
  setupEventListeners();
});

// --------------------------------------------
// 3. Cargar posts desde JSON
// --------------------------------------------
async function loadPosts() {
  try {
    const response = await fetch('db/posts.json');
    const data = await response.json();
    allPosts = data.posts;
    
    // Aplicar filtros iniciales
    initializeCheckboxes();
    applyFilters();
    renderPosts();
  } catch (error) {
    console.error('Error cargando los posts:', error);
    showError();
  }
}

// --------------------------------------------
// 4. Configurar listeners para checkboxes
// --------------------------------------------
function setupEventListeners() {
  // Listeners para checkboxes de categorías
  const categoryCheckboxes = document.querySelectorAll('.categories-list input[type="checkbox"]');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateCategoryFilters();
      applyFilters();
      renderPosts();
    });
  });

  // Listeners para checkboxes de filtros
  const filterCheckboxes = document.querySelectorAll('.filters-list input[type="checkbox"]');
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateGeneralFilters();
      applyFilters();
      renderPosts();
    });
  });

  // Botón "Aportar al foro"
  const contributeBtn = document.querySelector('.btn-contribute');
  if (contributeBtn) {
    contributeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'create-post-page.html';
    });
  }
}

// --------------------------------------------
// 5. Actualizar filtros de categorías
// --------------------------------------------
function updateCategoryFilters() {
  const selectedCategories = [];
  const checkboxes = document.querySelectorAll('.categories-list input[type="checkbox"]:checked');
  
  checkboxes.forEach(checkbox => {
    const label = checkbox.parentElement.textContent.trim();
    selectedCategories.push(label);
  });
  
  currentFilters.categories = selectedCategories;
}

// --------------------------------------------
// 6. Actualizar filtros generales
// --------------------------------------------
function updateGeneralFilters() {
  console.log('🔄 Actualizando filtros generales...');
  
  // Obtener TODOS los checkboxes de la lista de filtros
  const filterCheckboxes = document.querySelectorAll('.filters-list input[type="checkbox"]');
  console.log('Checkboxes encontrados:', filterCheckboxes.length);
  
  // Mostrar qué encontramos
  filterCheckboxes.forEach((checkbox, index) => {
    const label = checkbox.parentElement?.textContent?.trim() || `Checkbox ${index}`;
    console.log(`[${index}] ${label}:`, checkbox.checked);
  });
  
  // Filtro "Sólo post verificados" (primer checkbox)
  if (filterCheckboxes[0]) {
    currentFilters.verifiedOnly = filterCheckboxes[0].checked;
    console.log('✅ Sólo verificados:', currentFilters.verifiedOnly);
  } else {
    console.warn('⚠️ No se encontró checkbox "Sólo post verificados"');
    currentFilters.verifiedOnly = false;
  }

  // Filtros de ordenación
  const recentCheckbox = filterCheckboxes[1]; // Segundo checkbox
  const commentedCheckbox = filterCheckboxes[2]; // Tercer checkbox
  
  console.log('📊 Estado checkboxes (índices):');
  console.log('- Más reciente [1]:', recentCheckbox?.checked);
  console.log('- Más comentados [2]:', commentedCheckbox?.checked);
  
  // LÓGICA CORREGIDA CON ÍNDICES
  if (recentCheckbox && recentCheckbox.checked) {
    currentFilters.sortBy = "recent";
    console.log('📅 Ordenando por: MÁS RECIENTE');
  } 
  else if (commentedCheckbox && commentedCheckbox.checked) {
    currentFilters.sortBy = "commented";
    console.log('💬 Ordenando por: MÁS COMENTADOS');
  }
  else {
    currentFilters.sortBy = "popular";
    console.log('🔥 Ordenando por: MÁS POPULARES (default)');
  }
  
  console.log('🔧 sortBy actual:', currentFilters.sortBy);
}

// --------------------------------------------
// 7. Aplicar filtros a los posts
// --------------------------------------------
function applyFilters() {
  // 1. Filtrar por categorías seleccionadas
  let posts = allPosts.filter(post => 
    currentFilters.categories.length === 0 || 
    currentFilters.categories.includes(post.category)
  );

  // 2. Filtrar por posts verificados (si está activado)
  if (currentFilters.verifiedOnly) {
    posts = posts.filter(post => post.verified);
  }

  // 3. Ordenar según el criterio seleccionado
  switch (currentFilters.sortBy) {
    case "recent":
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "commented":
      posts.sort((a, b) => b.comments - a.comments);
      break;
    case "popular":
      posts.sort((a, b) => b.likes - a.likes);
      break;
    default:
      posts.sort((a, b) => b.likes - a.likes);
  }

  filteredPosts = posts;
}

// --------------------------------------------
// 8. Renderizar posts en el DOM
// --------------------------------------------
function renderPosts() {
  const postsSection = document.querySelector('.posts-section');
  if (!postsSection) return;

  // Encontrar el contenedor de posts o crearlo
  let postsContainer = postsSection.querySelector('.posts-container');
  if (!postsContainer) {
    postsContainer = document.createElement('div');
    postsContainer.className = 'posts-container';
    postsSection.appendChild(postsContainer);
  }

  // Limpiar posts existentes
  postsContainer.innerHTML = '';

  // Si no hay posts que mostrar
if (filteredPosts.length === 0) {
  const noPostsMsg = document.createElement('div');
  noPostsMsg.className = 'no-posts';
  noPostsMsg.innerHTML = `
    <p>No hay posts que coincidan con los filtros seleccionados.</p>
    <button class="btn-contribute" id="create-first-post" style="margin-top: 1rem;">
      ¡Sé el primero en publicar!
    </button>
  `;
  postsContainer.appendChild(noPostsMsg);

  document.getElementById('create-first-post').addEventListener('click', function() {
    window.location.href = 'create-post-page.html';
  });

  return;
}

  // Renderizar cada post
  filteredPosts.forEach((post, index) => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);

    // Añadir separador entre posts (excepto después del último)
    if (index < filteredPosts.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'post-divider';
      postsContainer.appendChild(divider);
    }
  });
}

// --------------------------------------------
// 9. Crear elemento HTML para un post
// --------------------------------------------
function createPostElement(post) {
  const postElement = document.createElement('article');
  postElement.className = 'forum-post';
  postElement.dataset.id = post.id;
  postElement.dataset.category = post.category;

  // Formatear fecha
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Crear badge de verificado si corresponde
  const verifiedBadge = post.verified 
    ? `<span class="verified-badge">(Post verificado)</span>`
    : '';

  // Crear badges de interacción
  const interactionBadges = `
    <div class="post-meta">
      <span class="post-stat"><span class="icon">💬</span> ${post.comments} comentarios</span>
      <span class="post-stat"><span class="icon">👍</span> ${post.likes} likes</span>
      <span class="post-stat"><span class="icon">📅</span> ${formattedDate}</span>
    </div>
  `;

  postElement.innerHTML = `
    <h3 class="post-title">${post.title}</h3>
    <p class="post-description">${post.description}</p>
    ${interactionBadges}
    <div class="post-footer">
      <span class="post-author">Por: ${post.author}</span>
      ${verifiedBadge}
    </div>
  `;

  // Añadir event listener para hacer clic en el post
  postElement.addEventListener('click', function() {
    console.log('Redirigiendo al post:', post.id);
    window.location.href = `post-page.html?id=${post.id}`;
  });

  return postElement;
}

// --------------------------------------------
// 10. Manejar errores
// --------------------------------------------
function showError() {
  const postsSection = document.querySelector('.posts-section');
  if (!postsSection) return;

  postsSection.innerHTML = `
    <h2 class="posts-title">Posts populares</h2>
    <div class="error-message">
      <p>⚠️ No se pudieron cargar los posts. Por favor, intenta más tarde.</p>
    </div>
  `;
}

// --------------------------------------------
// 11. Inicializar checkboxes según estado actual
// --------------------------------------------
function initializeCheckboxes() {
  console.log('Inicializando checkboxes...');
  
  // 1. CATEGORÍAS - Desmarcar TODOS los checkboxes
  const categoryCheckboxes = document.querySelectorAll('.categories-list input[type="checkbox"]');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  console.log(`${categoryCheckboxes.length} categorías desmarcadas`);
  
  // 2. FILTROS - Desmarcar TODOS los checkboxes
  const filterCheckboxes = document.querySelectorAll('.filters-list input[type="checkbox"]');
  
  // Desmarcar "Sólo post verificados"
  if (filterCheckboxes[0]) {
    filterCheckboxes[0].checked = false; // currentFilters.verifiedOnly es false
  }
  
  // Desmarcar "Más reciente" 
  if (filterCheckboxes[1]) {
    filterCheckboxes[1].checked = false;
  }
  
  // Desmarcar "Más comentados"
  if (filterCheckboxes[2]) {
    filterCheckboxes[2].checked = false;
  }
}

// --------------------------------------------
// 12. Actualizar contador de posts mostrados
// --------------------------------------------
function updatePostsCounter() {
  const counterElement = document.getElementById('posts-counter');
  if (counterElement) {
    counterElement.textContent = `Mostrando ${filteredPosts.length} de ${allPosts.length} posts`;
  }
}
