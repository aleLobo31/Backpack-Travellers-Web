document.addEventListener("DOMContentLoaded", () => {

    const packs = [
        {
            title: "Austria · Viena · 7 días",
            price: "Desde 1.150€",
            image: "https://images.unsplash.com/photo-1519923041107-e4dc8d9193da?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Japón · Kioto · 15 días",
            price: "Desde 2.250€",
            image: "https://images.unsplash.com/photo-1602897387777-f89c6b7e4a9e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Marruecos · Chefchaouen · Fin de semana",
            price: "Desde 300€",
            image: "https://images.unsplash.com/flagged/photo-1555169048-3c4845cfcf1c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Canadá · Quebec · 7 días",
            price: "Desde 1.600€",
            image: "https://images.unsplash.com/photo-1710881710078-d25d578fedc3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Perú · Cuzco · 15 días",
            price: "Desde 2.000€",
            image: "https://images.unsplash.com/photo-1724224842062-e81ff62325fb?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    let currentIndex = 0;
    let autoSlide;

    const packCard  = document.querySelector(".pack-card");
    const packTitle = document.querySelector(".pack-title");
    const packPrice = document.querySelector(".pack-price");

    const btnLeft  = document.querySelector(".carousel-btn.left");
    const btnRight = document.querySelector(".carousel-btn.right");

    if (!packCard || !btnLeft || !btnRight) return;

    // Renderizar pack actual
    function renderPack(index) {
        const pack = packs[index];
        packCard.style.backgroundImage = `url("${pack.image}")`;
        packTitle.textContent = pack.title;
        packPrice.textContent = pack.price;
    }

    function nextPack() {
        currentIndex = (currentIndex + 1) % packs.length;
        renderPack(currentIndex);
    }

    function prevPack() {
        currentIndex = (currentIndex - 1 + packs.length) % packs.length;
        renderPack(currentIndex);
    }

    function startAutoSlide() {
        autoSlide = setInterval(nextPack, 3000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        startAutoSlide();
    }

    // Flechas
    btnRight.addEventListener("click", () => {
        nextPack();
        resetAutoSlide();
    });

    btnLeft.addEventListener("click", () => {
        prevPack();
        resetAutoSlide();
    });

    // Inicialización
    renderPack(currentIndex);
    startAutoSlide();
});
