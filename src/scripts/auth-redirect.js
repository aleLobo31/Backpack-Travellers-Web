function goToPurchase(targetUrl) {
    const usuarioActivo = sessionStorage.getItem("usuarioActivo");

    if (!usuarioActivo) {
        // Guardamos a dónde quería ir
        sessionStorage.setItem("redirectAfterAuth", targetUrl);
        window.location.href = "login.html";
        return;
    }

    // Si hay sesión, seguimos normal
    window.location.href = targetUrl;
}
