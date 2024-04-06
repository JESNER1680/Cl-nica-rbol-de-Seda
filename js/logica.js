// Recuperar usuario activo almacenado en sessionStorage cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivoString = sessionStorage.getItem("usuarioActivo");
    if (usuarioActivoString) {
        usuarioActivo = JSON.parse(usuarioActivoString);
        const cerrarSesionLi = document.getElementById("cerrarSesion");

        cerrarSesionLi.style.display = "inline-block";
        const elementosMostrar = document.querySelectorAll("#agendarCita, #busquedaMedico, #preguntasFrec, #servicios");
        // Mostrar cada elemento
        elementosMostrar.forEach(elemento => {
            elemento.style.display = "inline-block";
        });
        console.log("Usuario activo recuperado:", usuarioActivo);
    } else {
        const elementosMostrar = document.querySelectorAll("#agendarCita,#busquedaMedico, #preguntasFrec, #servicios");
        // Mostrar cada elemento
        elementosMostrar.forEach(elemento => {
            elemento.style.display = "none";
        });
        console.log("No hay usuario activo almacenado en sessionStorage");
    }
});
document.addEventListener("DOMContentLoaded", function () {
    var botonRecuperar = document.getElementById("botonRecuperar");
    if (botonRecuperar) {
        botonRecuperar.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Se ha enviado un correo electrónico de recuperación de contraseña.");
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const cerrarSesionLi = document.getElementById("cerrarSesion");
    cerrarSesionLi.addEventListener("click", cerrarSesion);
});

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}