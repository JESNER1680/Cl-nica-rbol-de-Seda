
let usuarios = [];
let medicos = [];
let citas = [];
let usuarioActivo = null;
let medicosFiltradosSelect = [];
let indiceMedicoSeleccionado = -1;
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


const crearTabla = (citas) => {
    const tabla = document.getElementById('informacionTabla');
    tabla.innerHTML = '';

    if (usuarioActivo) {
        citas.forEach(cita => {
            if (cita.cedulaUsuario === usuarioActivo.cedula) {
                const fila = tabla.insertRow();

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

document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivoString = sessionStorage.getItem("usuarioActivo");
    if (usuarioActivoString) {
        usuarioActivo = JSON.parse(usuarioActivoString);
        const cerrarSesionLi = document.getElementById("cerrarSesion");

        cerrarSesionLi.style.display = "inline-block";
        const elementosMostrar = document.querySelectorAll("#agendarCita,#animacion, #busquedaMedico, #preguntasFrec, #servicios");
        elementosMostrar.forEach(elemento => {
            elemento.style.display = "inline-block";
        });
        citas = JSON.parse(localStorage.getItem("citas")) || [];
        crearTabla(citas);
        console.log("Usuario activo recuperado:", usuarioActivo);
    } else {
        const elementosMostrar = document.querySelectorAll("#agendarCita,#iniciarSesion,  #animacion, #busquedaMedico, #preguntasFrec, #servicios");
        elementosMostrar.forEach(elemento => {
            elemento.style.display = "none";
        });
        console.log("No hay usuario activo almacenado en sessionStorage");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const cerrarSesionLi = document.getElementById("cerrarSesion");
    cerrarSesionLi.addEventListener("click", cerrarSesion);
});

function cerrarSesion() {
    console.log("CERRAR SESION");
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}