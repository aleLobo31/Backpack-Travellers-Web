// Footer hamburger menu logic for responsive footer

document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('footer-hamburger-btn');
    const menu = document.getElementById('footer-menu-mobile');

    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (menu.classList.contains('active')) {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.classList.remove('active');
            }
        }
    });

    // Optional: close on resize above 768px
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            menu.classList.remove('active');
        }
    });
});
