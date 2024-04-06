let medicosGeneral = [];
let index = 0;
let paginaActual = 1;
const medicosPorPagina = 5;
let usuarioActivo = null;
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
document.addEventListener("DOMContentLoaded", () => {
    const selectTipoFiltrado = document.getElementById("tipoFiltrado");

    if (selectTipoFiltrado !== null) {
        selectTipoFiltrado.addEventListener("change", () => {
            const tipoFiltradoSeleccionado = selectTipoFiltrado.value;
            console.log(tipoFiltradoSeleccionado);
            const medicosFiltrados = cargarResultados('', tipoFiltradoSeleccionado);
            crearTabla(medicosFiltrados);

        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const buscarMedico = document.getElementById("formularioBusquedaMedico");
    if (buscarMedico !== null) {
        buscarMedico.addEventListener("submit", (event) => {
            event.preventDefault();

            const { filtro, tipoFiltrado } = obtenerDatosFormularioBusquedaMedico();
            mostrarResultados(filtro, tipoFiltrado);
        });
    }

    const botonAnterior = document.getElementById("botonAnterior");
    const botonSiguiente = document.getElementById("botonSiguiente");

    if (botonAnterior !== null && botonSiguiente !== null) {
        botonAnterior.addEventListener("click", () => {
            if (paginaActual > 1) {
                paginaActual--;
                mostrarResultados();
            }
        });

        botonSiguiente.addEventListener("click", () => {
            const medicosFiltrados = cargarResultados();
            const totalPaginas = Math.ceil(medicosFiltrados.length / medicosPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                mostrarResultados();
            }
        });
    }
});

const obtenerDatosFormularioBusquedaMedico = () => {
    const filtro = document.getElementById("datoFiltro").value.trim();
    const tipoFiltrado = document.getElementById("tipoFiltrado").value.trim();
    return { filtro, tipoFiltrado };
};

const mostrarResultados = () => {
    const { filtro, tipoFiltrado } = obtenerDatosFormularioBusquedaMedico();
    const medicosFiltrados = cargarResultados(filtro, tipoFiltrado);
    crearTabla(medicosFiltrados);
};

const cargarResultados = (filtro, tipoFiltrado) => {
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));
    if (!medicosLista) {
        return [];
    }

    const medicos = [...medicosLista];
    let medicosFiltrados = medicos;
    if (filtro !== '') {
        medicosFiltrados = medicos.filter(medico => medico[tipoFiltrado] === filtro);
    }

    switch (tipoFiltrado) {
        case 'nombreCompleto':
            medicosFiltrados.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
            break;
        case 'especialidad':
            medicosFiltrados.sort((a, b) => a.especialidad.localeCompare(b.especialidad));
            break;
        case 'ubicacion':
            medicosFiltrados.sort((a, b) => a.ubicacion.localeCompare(b.ubicacion));
            break;
        case 'identificacion':
            medicosFiltrados.sort((a, b) => a.identificacion.localeCompare(b.identificacion));
            break;
        default:
            break;
    }

    return medicosFiltrados;
};

const mostrarModal = (medico) => {
    const contentModal = document.getElementById('content-modal');
    if (contentModal !== null) {
        contentModal.innerHTML = '';

        const cerrarButton = document.createElement('button');
        cerrarButton.textContent = 'Cerrar';
        cerrarButton.addEventListener('click', cerrarModal);
        contentModal.appendChild(cerrarButton);

        const nombreElement = document.createElement('h2');
        nombreElement.textContent = medico.nombreCompleto;
        contentModal.appendChild(nombreElement);

        const especialidadElement = document.createElement('p');
        especialidadElement.textContent = "Especialidad: " + medico.especialidad;
        contentModal.appendChild(especialidadElement);

        const ubicacionElement = document.createElement('p');
        ubicacionElement.textContent = "Ubicación: " + medico.ubicacion;
        contentModal.appendChild(ubicacionElement);

        const horariosElement = document.createElement('p');
        horariosElement.textContent = "Horarios: " + JSON.stringify(medico.horarios);
        contentModal.appendChild(horariosElement);

        const contactoElement = document.createElement('p');
        contactoElement.textContent = "Información de Contacto: Teléfono: " + medico.informacionContacto.telefono + ", Correo Electrónico: " + medico.informacionContacto.correoElectronico;
        contentModal.appendChild(contactoElement);

        const reseñasElement = document.createElement('p');
        reseñasElement.textContent = "Reseñas y Calificaciones:";
        contentModal.appendChild(reseñasElement);

        const ulElement = document.createElement('ul');
        medico.resenasCalificaciones.forEach(resena => {
            const liElement = document.createElement('li');
            liElement.textContent = resena.paciente + ": " + resena.comentario + " (Calificación: " + resena.calificacion + ")";
            ulElement.appendChild(liElement);
        });
        contentModal.appendChild(ulElement);

        const biografiaElement = document.createElement('p');
        biografiaElement.textContent = "Biografía: " + medico.biografia;
        contentModal.appendChild(biografiaElement);
    }

    const containerModal = document.querySelector('.container-modal');
    if (containerModal !== null) {
        containerModal.style.display = 'flex';
    }
};

const cerrarModal = () => {
    const containerModal = document.querySelector('.container-modal');
    if (containerModal !== null) {
        containerModal.style.display = 'none';
    }
};

const crearTabla = (medicosFiltrados) => {
    const tabla = document.getElementById('informacionTabla');
    tabla.innerHTML = '';

    const inicio = (paginaActual - 1) * medicosPorPagina;
    const fin = paginaActual * medicosPorPagina;

    const medicosPagina = medicosFiltrados.slice(inicio, fin);

    medicosPagina.forEach(medico => {
        const fila = tabla.insertRow();

        const nombreMedicoCell = fila.insertCell(0);
        nombreMedicoCell.textContent = medico.nombreCompleto;
        const identificacionCell = fila.insertCell(1);
        identificacionCell.textContent = medico.identificacion;
        const ubicacionCell = fila.insertCell(2);
        ubicacionCell.textContent = medico.ubicacion;
        const especialidadCell = fila.insertCell(3);
        especialidadCell.textContent = medico.especialidad;

        const botonCell = fila.insertCell(4);
        const boton = document.createElement('button');
        boton.textContent = 'Ver perfil';
        boton.addEventListener('click', () => {
            mostrarModal(medico);
        });
        botonCell.appendChild(boton);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const inputDatoFiltro = document.getElementById("datoFiltro");

    if (inputDatoFiltro !== null) {
        inputDatoFiltro.addEventListener("input", () => {
            const filtro = inputDatoFiltro.value.trim();
            const tipoFiltrado = document.getElementById("tipoFiltrado").value.trim();
            filtrarOpcionesAutocompletado(filtro, tipoFiltrado);
        });
    }
});
const filtrarOpcionesAutocompletado = (filtro, tipoFiltrado) => {
    const dataList = document.getElementById("opcionesAutocompletado");
    dataList.innerHTML = '';

    const medicosLista = JSON.parse(localStorage.getItem("medicos")) || [];
    const medicos = [...medicosLista];
    let opciones = [];
    switch (tipoFiltrado) {
        case 'nombreCompleto':
            opciones = medicos.map(medico => medico.nombreCompleto);
            break;
        case 'especialidad':
            opciones = medicos.map(medico => medico.especialidad);
            break;
        case 'ubicacion':
            opciones = medicos.map(medico => medico.ubicacion);
            break;
        case 'identificacion':
            opciones = medicos.map(medico => medico.identificacion);
            break;
        default:
            break;
    }

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        dataList.appendChild(option);
    });
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
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}