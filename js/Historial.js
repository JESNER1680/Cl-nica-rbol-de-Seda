// Declaramos las siguientes variables para almacenar información relacionada con el sistema.
let usuarios = []; // Almacena información de los usuarios registrados.
let medicos = []; // Almacena información de los médicos registrados.
let citas = []; // Almacena información de las citas médicas agendadas.
let usuarioActivo = null; // Almacena la información del usuario que ha iniciado sesión.
let medicosFiltradosSelect = []; // Almacena médicos filtrados seleccionados.
let indiceMedicoSeleccionado = -1; // Índice del médico seleccionado en la lista.

// Definimos la clase 'Usuario' para representar a los usuarios del sistema.
class Usuario {
    constructor(cedula, NombreCompleto, Apellidos, NumeroCelular, correo, contrasenna, confirmarContrasenna) {
        this.cedula = cedula;
        this.NombreCompleto = NombreCompleto;
        this.Apellidos = Apellidos;
        this.NumeroCelular = NumeroCelular;
        this.correo = correo;
        this.contrasenna = contrasenna;
        this.confirmarContrasenna = confirmarContrasenna;
    }
}

// Definimos la clase 'CitaMedica' para representar las citas médicas.
class CitaMedica {
    constructor(fechaCita, horaCita, medico, especialidad, cedulaUsuario, estadoCita) {
        this.fechaCita = fechaCita;
        this.horaCita = horaCita;
        this.medico = medico;
        this.especialidad = especialidad;
        this.cedulaUsuario = cedulaUsuario;
        this.estadoCita = estadoCita;
    }
}

// Definimos la clase 'Medico' para representar a los médicos del sistema.
class Medico {
    constructor(nombreCompleto, especialidad, ubicacion, horarios, informacionContacto, resenasCalificaciones, biografia) {
        this.nombreCompleto = nombreCompleto;
        this.especialidad = especialidad;
        this.ubicacion = ubicacion;
        this.horarios = horarios;
        this.informacionContacto = informacionContacto;
        this.resenasCalificaciones = resenasCalificaciones;
        this.biografia = biografia;
    }
}



const crearTabla = (citas) => {//Se crea la tabla, recibe la lista de citas
    const tabla = document.getElementById('informacionTabla');//Se obtiene el elemento segun el id
    tabla.innerHTML = '';//Se limpia el elemento

    if (usuarioActivo) {//Se valida que no sea null
        citas.forEach(cita => {// Se itera en la lista
            if (cita.cedulaUsuario === usuarioActivo.cedula) {// Se valida la condición sí el usuario activo tiene citas
                const fila = tabla.insertRow();//Se crea una fila

                //Se le dan los valores y se insertan en sus respectivas celdas
                const fechaCitaCell = fila.insertCell(0);
                fechaCitaCell.textContent = cita.fechaCita;
                const medicoCell = fila.insertCell(1);
                medicoCell.textContent = cita.medico;
                const especialidadCell = fila.insertCell(2);
                especialidadCell.textContent = cita.especialidad;
                const estadoCell = fila.insertCell(3);
                estadoCell.textContent = cita.estadoCita;
            }
        });
    }
};

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
        citas = JSON.parse(localStorage.getItem("citas")) || [];// Se obtiene las citas
        crearTabla(citas);
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