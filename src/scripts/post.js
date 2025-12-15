// --------------------------------------------
// 1. Variables globales
// --------------------------------------------
let currentPost = null;
let allPosts = [];
let currentPostId = null;

// --------------------------------------------
// 2. Inicialización
// --------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID del post desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('id');
    
    if (currentPostId) {
        loadPostData();
    } else {
        showError('No se especificó un post válido');
    }
    
    setupEventListeners();
});

// --------------------------------------------
// 3. Cargar datos del post
// --------------------------------------------
async function loadPostData() {
    try {
        // Cargar todos los posts
        const response = await fetch('db/posts.json');
        const data = await response.json();
        allPosts = data.posts;
        
        // Encontrar el post actual
        currentPost = allPosts.find(post => post.id == currentPostId);
        
        if (currentPost) {
            renderPostDetail();
            loadComments();
        } else {
            showError('Post no encontrado');
        }
    } catch (error) {
        console.error('Error cargando el post:', error);
        showError('No se pudo cargar el post. Por favor, intenta más tarde.');
    }
}

// --------------------------------------------
// 4. Renderizar detalle del post
// --------------------------------------------
function renderPostDetail() {
    if (!currentPost) return;
    
    // Actualizar información básica
    document.getElementById('post-title').textContent = currentPost.title;
    document.getElementById('post-author').textContent = currentPost.author;
    document.getElementById('post-date').textContent = formatDate(currentPost.date);
    document.getElementById('post-description').textContent = currentPost.description;
    document.getElementById('like-count').textContent = `${currentPost.likes} personas`;
    document.getElementById('comments-count').textContent = currentPost.comments || 0;
    
    // Mostrar badge de verificado si corresponde
    const verifiedBadge = document.getElementById('post-verified');
    if (currentPost.verified) {
        verifiedBadge.style.display = 'inline-flex';
    }
    
    // Mostrar imagen si existe
    if (currentPost.image) {
        const imageContainer = document.getElementById('post-image-container');
        const postImage = document.getElementById('post-image');
        
        postImage.src = currentPost.image.url;
        postImage.alt = currentPost.image.alt || currentPost.title;
        imageContainer.style.display = 'block';
    }
    
    // Cargar contenido extendido si existe
    if (currentPost.content) {
        const extendedContent = document.getElementById('post-extended-content');
        extendedContent.innerHTML = currentPost.content;
    }
}

// --------------------------------------------
// 5. Formatear fecha
// --------------------------------------------
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// --------------------------------------------
// 6. Cargar comentarios
// --------------------------------------------
function loadComments() {
    const commentsList = document.getElementById('comments-list');
    
    if (currentPost.commentsData && currentPost.commentsData.length > 0) {
        commentsList.innerHTML = currentPost.commentsData.map(comment => `
            <div class="comment-item">
                <div class="comment-avatar">
                    <span class="avatar-small">👤</span>
                </div>
                <div class="comment-content-wrapper">
                    <div class="comment-author-info">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${formatDate(comment.date)}</span>
                    </div>
                    <div class="comment-text">
                        ${comment.content}
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        commentsList.innerHTML = `
            <div class="no-comments">
                <p>No hay comentarios todavía.</p>
            </div>
        `;
    }
}

// --------------------------------------------
// 7. Configurar event listeners
// --------------------------------------------
function setupEventListeners() {
    // Botón de like
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            if (!currentPost) return;
            
            const hasLiked = this.classList.toggle('liked');
            const likesElement = document.getElementById('like-count');
            let currentLikes = parseInt(currentPost.likes) || 0;
            
            if (hasLiked) {
                currentLikes += 1;
                this.querySelector('.like-text').textContent = 'Te ha gustado este post';
            } else {
                currentLikes -= 1;
                this.querySelector('.like-text').textContent = 'Me ha gustado este post';
            }
            
            likesElement.textContent = `${currentLikes} ${currentLikes === 1 ? 'persona' : 'personas'}`;
            
            // Actualizar en el objeto currentPost
            currentPost.likes = currentLikes;
        });
    }
    
    // Botón de subir imagen
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            // Simular subida de imagen
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                if (e.target.files && e.target.files[0]) {
                    alert(`Imagen "${e.target.files[0].name}" seleccionada para subir`);
                }
            };
            input.click();
        });
    }
    
    // Enviar comentario
    const submitCommentBtn = document.getElementById('submit-comment');
    const commentInput = document.getElementById('comment-input');
    
    if (submitCommentBtn && commentInput) {
        submitCommentBtn.addEventListener('click', function() {
            const commentText = commentInput.value.trim();
            
            if (!commentText) {
                alert('Por favor, escribe un comentario antes de enviar.');
                return;
            }
            
            addNewComment(commentText);
            commentInput.value = '';
        });
        
        // Permitir enviar con Ctrl+Enter
        commentInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                submitCommentBtn.click();
            }
        });
    }
}

// --------------------------------------------
// 8. Añadir nuevo comentario
// --------------------------------------------
function addNewComment(text) {
    const commentsList = document.getElementById('comments-list');
    const noCommentsDiv = commentsList.querySelector('.no-comments');
    
    if (noCommentsDiv) {
        noCommentsDiv.remove();
    }
    
    // Crear nuevo comentario
    const newComment = {
        id: Date.now(),
        author: 'Tú',
        date: new Date().toISOString(),
        content: text
    };
    
    // Crear HTML del comentario
    const commentHTML = `
        <div class="comment-item">
            <div class="comment-avatar">
                <span class="avatar-small">👤</span>
            </div>
            <div class="comment-content-wrapper">
                <div class="comment-author-info">
                    <span class="comment-author">${newComment.author}</span>
                    <span class="comment-date">Ahora mismo</span>
                </div>
                <div class="comment-text">
                    ${newComment.content}
                </div>
            </div>
        </div>
    `;
    
    // Añadir al inicio de la lista
    commentsList.insertAdjacentHTML('afterbegin', commentHTML);
    
    // Actualizar contador
    const commentsCount = document.getElementById('comments-count');
    const currentComments = parseInt(commentsCount.textContent) || 0;
    commentsCount.textContent = currentComments + 1;
    
    // Actualizar en el objeto currentPost
    currentPost.comments = (currentPost.comments || 0) + 1;
}

// --------------------------------------------
// 9. Mostrar errores
// --------------------------------------------
function showError(message) {
    const main = document.querySelector('.post-detail-main');
    if (!main) return;
    
    main.innerHTML = `
        <div class="error-container">
            <h2>Error</h2>
            <p>${message}</p>
            <a href="forum-page.html" class="btn-contribute" style="display: inline-block; margin-top: 1rem;">
                ← Volver al foro
            </a>
        </div>
    `;
}