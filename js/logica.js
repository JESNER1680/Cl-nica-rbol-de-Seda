//evento para obtener el usuario activo
document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivoString = sessionStorage.getItem("usuarioActivo");//Obtenemos el usuario activo
    if (usuarioActivoString) {//Validamos que no sea null
        usuarioActivo = JSON.parse(usuarioActivoString);//Convertimos el valor en un objeto
        const cerrarSesionLi = document.getElementById("cerrarSesion");//Obtenemos el elemento

        cerrarSesionLi.style.display = "inline-block";//habilitamos la opcion de cerrar secion
        const elementosMostrar = document.querySelectorAll("#agendarCita,#animacion, #busquedaMedico, #preguntasFrec, #servicios");//Seleccionamos todos los componentes que cumplan con los valores
        elementosMostrar.forEach(elemento => {//Habiliamos todas las opciones cuando inicias sesion
            elemento.style.display = "inline-block";//Lo hacemos visible
        });
    } else {//Caso contrario que no haya usuario activo, hacemos lo contrario, deshabilitamos las opciones.
        const elementosMostrar = document.querySelectorAll("#agendarCita,#inicioSesion,  #animacion, #busquedaMedico, #preguntasFrec, #servicios");
        elementosMostrar.forEach(elemento => {
            elemento.style.display = "none";//Las ocultamos
        });
        console.log("No hay usuario activo almacenado en sessionStorage");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cerrarSesionLi = document.getElementById("cerrarSesion");//Obtenemos el elemento con el id
    cerrarSesionLi.addEventListener("click", cerrarSesion);//Vemos sí hubo un evento de click
});

const cerrarSesion = () => {//Cerramos la sesion del usuarioActivo
    sessionStorage.removeItem("usuarioActivo");//Limpiamos al usuario activo
    window.location.href = "index.html";//Nos redirije a la pagina de inicio
}
//evento para recuperar la contraseña cuando se presione el boton
document.addEventListener("DOMContentLoaded", function () {
    var botonRecuperar = document.getElementById("botonRecuperar");
    if (botonRecuperar) {
        botonRecuperar.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Se ha enviado un correo electrónico de recuperación de contraseña.");
        });
    }
});
