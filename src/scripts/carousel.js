document.addEventListener("DOMContentLoaded", () => {

    const packs = [
        {
        title: "Austria · Viena",
        duration: { type: "days", value: 7 },
        price: 1150,
        image: "https://images.unsplash.com/photo-1519923041107-e4dc8d9193da"
        },
        {
        title: "Japón · Kioto",
        duration: { type: "days", value: 15 },
        price: 2250,
        image: "https://images.unsplash.com/photo-1602897387777-f89c6b7e4a9e"
        },
        {
        title: "Marruecos · Chefchaouen",
        duration: { type: "weekend" },
        price: 300,
        image: "https://images.unsplash.com/flagged/photo-1555169048-3c4845cfcf1c"
        },
        {
        title: "Canadá · Quebec",
        duration: { type: "days", value: 7 },
        price: 1600,
        image: "https://images.unsplash.com/photo-1710881710078-d25d578fedc3"
        },
        {
        title: "Perú · Cuzco",
        duration: { type: "days", value: 15 },
        price: 2000,
        image: "https://images.unsplash.com/photo-1724224842062-e81ff62325fb"
        }
    ];

    preloadImages(packs);

    function preloadImages(packs) {
        packs.forEach(pack => {
            const img = new Image();
            img.src = pack.image;
        });
    }

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
        packTitle.textContent = `${pack.title} · ${formatDuration(pack.duration)}`;
        packPrice.textContent = formatPrice(pack.price);
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

    function formatPrice(amount) {
        const lang = localStorage.getItem("language") || "es";

        if (lang === "en") {
            return `From €${amount.toLocaleString("en-US")}`;
        }

        // Español (por defecto)
        return `Desde ${amount.toLocaleString("es-ES")}€`;
    }

    function formatDuration(duration) {
        const lang = localStorage.getItem("language") || "es";

        if (duration.type === "weekend") {
            return lang === "en" ? "Weekend" : "Fin de semana";
        }

        if (duration.type === "days") {
            if (lang === "en") {
            return `${duration.value} days`;
            }
            return `${duration.value} días`;
        }

        return "";
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

document.addEventListener("languageChanged", () => {
  renderPack(currentIndex);
});
