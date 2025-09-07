import axios from "axios";

const instance = axios.create({
    //baseURL: "/api",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
    },
    withCredentials: true, // ¡Crucial para cookies de sesión!
});

// Interceptor para CSRF Token (obligatorio en Breeze)
instance.interceptors.request.use((config) => {
    // Laravel pone el token CSRF en un meta tag
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    console.log('CSRF Token:', token); // Verifica que obtiene el token
    console.log('Request URL:', config.url); // Verifica la URL

    if (token) {
        config.headers["X-CSRF-TOKEN"] = token; // Header requerido
    }

    return config;
});

export default instance;
