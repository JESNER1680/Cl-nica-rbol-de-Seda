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

document.addEventListener("DOMContentLoaded", () => {
    const registrarBoton = document.getElementById("RegistrarCita");
    if (registrarBoton !== null) {
        registrarBoton.addEventListener("click", (event) => {
            event.preventDefault();
            const { medico, fechaCita, horaCita, especialidad, cedulaUsuario } = obtenerInformacionAgendarCita();
            let cita = new CitaMedica(fechaCita, horaCita, medico, especialidad, cedulaUsuario, "Registrada");
            let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
            let citaRepetida = false;
            citasGuardadas.forEach(citaAux => {
                if (cita.fechaCita === citaAux.fechaCita && cita.horaCita === citaAux.horaCita && citaAux.medico === cita.medico) {
                    citaRepetida = true;
                    manejarErrorRegistro();
                    return;
                }
            });
            if (!citaRepetida) {
                citasGuardadas.push(cita);
                localStorage.setItem("citas", JSON.stringify(citasGuardadas));
                citas = JSON.parse(localStorage.getItem("citas")) || [];
                actualizarTabla(citas);
                console.log(cita);
            }
        });
    }
});

const manejarErrorRegistro = () => {
    alert("Ya hay una cita en esta fecha y hora");
};

const eliminarCita = (citaCancelada) => {

    let citasProgramadas = JSON.parse(localStorage.getItem("citas")) || [];
    if (citasProgramadas.some(cita => cita.medico === citaCancelada.medico && cita.fechaCita === citaCancelada.fechaCita && cita.horaCita === citaCancelada.horaCita)) {
        const indice = citasProgramadas.findIndex(cita => cita.medico === citaCancelada.medico && cita.fechaCita === citaCancelada.fechaCita && cita.horaCita === citaCancelada.horaCita);
        let miElemento = document.getElementById("" + citasProgramadas[indice].fechaCita);
        console.log(miElemento);
        if (miElemento) {
            miElemento.className = "day";
        }
        citasProgramadas[indice].estadoCita = "Cancelada";
        localStorage.setItem("citas", JSON.stringify(citasProgramadas));
        citasProgramadas = JSON.parse(localStorage.getItem("citas")) || [];
        actualizarTabla(citasProgramadas, citaCancelada);
    }
}
const obtenerInformacionAgendarCita = () => {
    //const medico = medicos[indexSelecionado];
    const medico = document.getElementById("medicos").value;
    const fechaCita = document.getElementById("fechaCita").value.trim();
    const horaCita = document.getElementById("horaCita").value;
    const especialidad = document.getElementById("especialidad").value;
    let usuario = sessionStorage.getItem("usuarioActivo");
    let cedulaUsuario = usuarioActivo.cedula;
    return {
        medico,
        fechaCita,
        horaCita,
        especialidad,
        cedulaUsuario
    };
};
const filtrarMedico = (filtro, tipoFiltrado) => {
    medicos = [];
    medicosFiltradosSelect = [];
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));
    const selectMedicos = document.getElementById("medicos");
    selectMedicos.innerHTML = '';

    if (medicosLista) {
        medicos.push(...medicosLista);
    }

    let medicosFiltrados = medicos.filter(medico => medico[tipoFiltrado] === filtro);

    if (selectMedicos) {
        if (medicosFiltrados.length > 0) {
            medicosFiltrados.forEach(medico => {
                const option = document.createElement("option");
                option.value = medico.nombreCompleto;
                option.textContent = medico.nombreCompleto;
                selectMedicos.appendChild(option);
                medicosFiltradosSelect.push(medico);
                indiceMedicoSeleccionado = 0;
            });
        } else {
            console.log("No hay registros");
        }
    }
}
const filtrarMedicoActualizar = (filtro, tipoFiltrado) => {
    medicos = [];
    medicosFiltradosSelect = [];
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));
    const selectMedicos = document.getElementById("medicosActualizar");

    selectMedicos.innerHTML = '';

    if (medicosLista) {
        medicos.push(...medicosLista);
    }

    let medicosFiltrados = medicos.filter(medico => medico[tipoFiltrado] === filtro);

    if (selectMedicos) {
        if (medicosFiltrados.length > 0) {
            medicosFiltrados.forEach(medico => {
                const option = document.createElement("option");
                option.value = medico.nombreCompleto;
                option.textContent = medico.nombreCompleto;
                selectMedicos.appendChild(option);
                medicosFiltradosSelect.push(medico);
                indiceMedicoSeleccionado = 0;
            });
        } else {
            console.log("No hay registros");
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));
    const selectEspecialidad = document.getElementById("especialidad");
    if (medicosLista) {
        medicos.push(...medicosLista);
    }
    if (selectEspecialidad !== null) {
        if (medicos.length > 0) {
            const especialidadesUnicas = new Set();

            medicos.forEach(medico => {
                if (!especialidadesUnicas.has(medico.especialidad)) {
                    const option = document.createElement("option");
                    option.value = medico.especialidad;
                    option.textContent = medico.especialidad;
                    selectEspecialidad.appendChild(option);
                    especialidadesUnicas.add(medico.especialidad);
                }
            });
        } else {
            console.log("No hay registros");
        }
    }
});
function actualizarTabla(citas, citaDesactualizada) {
    const tabla = document.getElementById("ContenidoTablaCitas");

    tabla.innerHTML = '';

    if (usuarioActivo) {
        citas.forEach(cita => {
            console.log("Usuario cita" + cita.cedulaUsuario + "  Usuario activo: " + usuarioActivo.cedula);
            if (cita.cedulaUsuario === usuarioActivo.cedula && cita.estadoCita !== "Cancelada") {
                const fila = tabla.insertRow();

                const fechaCell = fila.insertCell(0);
                fechaCell.textContent = cita.fechaCita;

                const horaCell = fila.insertCell(1);
                horaCell.textContent = cita.horaCita;

                const MedicoCell = fila.insertCell(2);
                MedicoCell.textContent = cita.medico;

                const editarCell = fila.insertCell(3);
                const editarBoton = document.createElement('button');
                editarBoton.textContent = 'Editar';
                editarBoton.addEventListener('click', () => {
                    mostrarModal(cita);
                });
                editarCell.appendChild(editarBoton);

                const cancelarCell = fila.insertCell(4);
                const cancelarBoton = document.createElement('button');
                cancelarBoton.textContent = 'Cancelar';
                cancelarBoton.addEventListener('click', () => {
                    eliminarCita(cita);

                });
                cancelarCell.appendChild(cancelarBoton);
                let citaActual = document.getElementById(cita.fechaCita);
                console.log("Cita vieja: " + cita.fechaCita);
                if (citaActual) {
                    citaActual.className = "dayCita"
                }
            }

        });
    }
}

const mostrarModal = (cita) => {
    const contentModal = document.getElementById('content-modal');
    if (contentModal !== null) {
        contentModal.innerHTML = '';

        const formulario = document.createElement('div');
        formulario.classList.add('formulario');

        const titulo = document.createElement('h2');
        titulo.textContent = 'Actualizar Cita';
        formulario.appendChild(titulo);

        const form = document.createElement('form');
        form.id = 'formulario';

        const divEspecialidad = document.createElement('div');
        divEspecialidad.classList.add('usuarios');
        const labelEspecialidad = document.createElement('label');
        labelEspecialidad.setAttribute('for', 'especialidad');
        labelEspecialidad.textContent = 'Especialidad:';
        const selectEspecialidad = document.createElement('select');
        selectEspecialidad.name = 'especialidad';
        selectEspecialidad.id = 'especialidadActualizar';
        divEspecialidad.appendChild(labelEspecialidad);
        divEspecialidad.appendChild(selectEspecialidad);
        form.appendChild(divEspecialidad);
        form.appendChild(document.createElement('br'));

        const divMedicos = document.createElement('div');
        divMedicos.classList.add('usuarios');
        const labelMedicos = document.createElement('label');
        labelMedicos.setAttribute('for', 'medicos');
        labelMedicos.textContent = 'Médicos:';
        const selectMedicos = document.createElement('select');
        selectMedicos.name = 'medicos';
        selectMedicos.id = 'medicosActualizar';
        divMedicos.appendChild(labelMedicos);
        divMedicos.appendChild(selectMedicos);
        form.appendChild(divMedicos);

        form.appendChild(document.createElement('br'));

        const divFechaCita = document.createElement('div');
        divFechaCita.classList.add('usuarios');
        const labelFechaCita = document.createElement('label');
        labelFechaCita.setAttribute('for', 'fechaCita');
        labelFechaCita.textContent = 'Fecha de la cita:';
        const inputFechaCita = document.createElement('input');
        inputFechaCita.id = 'fechaCitaActualizar';
        inputFechaCita.type = 'date';
        inputFechaCita.value = cita.fechaCita;
        inputFechaCita.required = true;
        divFechaCita.appendChild(labelFechaCita);
        divFechaCita.appendChild(inputFechaCita);
        form.appendChild(divFechaCita);

        form.appendChild(document.createElement('br'));

        const divHoraCita = document.createElement('div');
        divHoraCita.classList.add('usuarios');
        const labelHoraCita = document.createElement('label');
        labelHoraCita.setAttribute('for', 'horaCita');
        labelHoraCita.textContent = 'Hora de la cita:';
        const inputHoraCita = document.createElement('input');
        inputHoraCita.id = 'horaCitaActualizada';
        inputHoraCita.type = 'time';
        inputHoraCita.value = cita.horaCita;
        inputHoraCita.required = true;
        divHoraCita.appendChild(labelHoraCita);
        divHoraCita.appendChild(inputHoraCita);
        form.appendChild(divHoraCita);

        form.appendChild(document.createElement('br'));

        const botonActualizarCita = document.createElement('button');
        botonActualizarCita.id = 'actualizarCita';
        botonActualizarCita.textContent = 'Actualizar';
        botonActualizarCita.addEventListener('click', function (event) {
            event.preventDefault();
            const fechaActualizada = document.getElementById("fechaCitaActualizar").value;
            const especialidadActualizada = document.getElementById("especialidadActualizar");
            const especialidad = especialidadActualizada.value;
            const medicoActualizado = document.getElementById("medicosActualizar");
            const medico = medicoActualizado.value;
            const horaActualizada = document.getElementById("horaCitaActualizada").value;
            let citaActualizada = new CitaMedica(fechaActualizada, horaActualizada, medico, especialidad, usuarioActivo.cedula, "Registrada");
            actualizarCita(cita, citaActualizada);

        });
        form.appendChild(botonActualizarCita);


        formulario.appendChild(form);

        contentModal.appendChild(formulario);
        const cerrarButton = document.createElement('button');
        cerrarButton.textContent = 'Cerrar';
        cerrarButton.addEventListener('click', cerrarModal);
        contentModal.appendChild(cerrarButton);

        const selectEspecialidadActualizar = document.getElementById("especialidadActualizar");
        if (selectEspecialidadActualizar) {
            if (medicos.length > 0) {
                const especialidadesUnicas = new Set();
                const option = document.createElement("option");
                option.value = cita.especialidad;
                option.textContent = cita.especialidad;
                selectEspecialidadActualizar.appendChild(option);
                especialidadesUnicas.add(cita.especialidad);

                const selectEspecialidadActua = document.getElementById("especialidadActualizar");
                const especialidadAct = 'especialidad';
                const tipoFiltradoSeleccionado = selectEspecialidadActua.value;
                console.log(tipoFiltradoSeleccionado);
                filtrarMedicoActualizar(tipoFiltradoSeleccionado, especialidadAct);
                medicos.forEach(medico => {
                    if (!especialidadesUnicas.has(medico.especialidad)) {
                        const option = document.createElement("option");
                        option.value = medico.especialidad;
                        option.textContent = medico.especialidad;
                        selectEspecialidadActualizar.appendChild(option);
                        especialidadesUnicas.add(medico.especialidad);
                    }
                });
            } else {
                console.log("No hay registros");
            }

            const selectEspecialidadActua = document.getElementById("especialidadActualizar");
            const especialidadAct = 'especialidad';

            if (selectEspecialidadActua !== null) {
                selectEspecialidadActua.addEventListener("change", () => {
                    const tipoFiltradoSeleccionado = selectEspecialidadActua.value;
                    console.log(tipoFiltradoSeleccionado);
                    filtrarMedicoActualizar(tipoFiltradoSeleccionado, especialidadAct);

                });
            }


        }
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

const actualizarCita = (cita, citaActualizada) => {
    let citas = JSON.parse(localStorage.getItem("citas")) || [];

    const index = citas.findIndex(c => c.fechaCita === cita.fechaCita && c.horaCita === cita.horaCita);
    let citaRepetida = false;
    citas.forEach(citaAux => {
        if (citaActualizada.fechaCita === citaAux.fechaCita && citaActualizada.horaCita === citaAux.horaCita && citaAux.medico === citaActualizada.medico) {
            citaRepetida = true;
            manejarErrorRegistro();
            return;
        }
    });
    if (!citaRepetida) {
        if (index !== -1) {
            citas.splice(index, 1, citaActualizada);

            localStorage.setItem("citas", JSON.stringify(citas));
            citas = JSON.parse(localStorage.getItem("citas")) || [];
            let miElemento = document.getElementById(cita.fechaCita);
            if (miElemento) {
                miElemento.className = "day";
                if (citaActualizada) {
                    let citaActual = document.getElementById(citaActualizada.fechaCita);
                    console.log("Cita vieja: " + citaActualizada.fechaCita);
                    if (citaActual) {
                        citaActual.className = "dayCita"
                    }
                }
            }
            actualizarTabla(citas, cita);
            cerrarModal();
        } else {
            console.log("La cita a actualizar no fue encontrada");
        }
    }
};



document.addEventListener("DOMContentLoaded", () => {
    const selectEspecialidad = document.getElementById("especialidad");
    const especialidad = 'especialidad';
    if (selectEspecialidad !== null) {
        selectEspecialidad.addEventListener("change", () => {
            const tipoFiltradoSeleccionado = selectEspecialidad.value;
            console.log(tipoFiltradoSeleccionado);
            filtrarMedico(tipoFiltradoSeleccionado, especialidad);

        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const selectMedicos = document.getElementById("medicos");
    if (selectMedicos !== null) {
        selectMedicos.addEventListener("change", () => {
            const indiceMedicoSeleccionado = selectMedicos.selectedIndex;
            console.log("Índice del médico seleccionado:", indiceMedicoSeleccionado);
        });
    }
});

const daysContainer = document.querySelector(".days"),
    nextBtn = document.querySelector(".next-btn"),
    prevBtn = document.querySelector(".prev-btn"),
    month = document.querySelector(".month"),
    todayBtn = document.querySelector(".today-btn");

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const fecha = new Date();

let mesActual = fecha.getMonth();

let añoActual = fecha.getFullYear();

function renderizarCalendario() {

    let citasProgramadas = JSON.parse(localStorage.getItem("citas")) || [];
    fecha.setDate(1);
    const primerDia = new Date(añoActual, mesActual, 1);
    const ultimoDia = new Date(añoActual, mesActual + 1, 0);
    const indiceUltimoDia = ultimoDia.getDay();
    const fechaUltimoDia = ultimoDia.getDate();
    const ultimoDiaMesAnterior = new Date(añoActual, mesActual, 0);
    const fechaUltimoDiaMesAnterior = ultimoDiaMesAnterior.getDate();
    const diasSiguientes = 7 - indiceUltimoDia - 1;

    month.innerHTML = `${meses[mesActual]} ${añoActual}`;

    let htmlDias = "";

    for (let x = primerDia.getDay(); x > 0; x--) {
        htmlDias += `<div class="day prev">${fechaUltimoDiaMesAnterior - x + 1}</div>`;
    }
    var fechaFormateada = "";
    for (let i = 1; i <= fechaUltimoDia; i++) {
        var dia = i.toString().padStart(2, '0');
        var mes = (mesActual + 1).toString().padStart(2, '0');
        var fechaFormateada = añoActual + '-' + mes + '-' + dia;
        if (
            i === new Date().getDate() &&
            mesActual === new Date().getMonth() &&
            añoActual === new Date().getFullYear()
        ) {
            htmlDias += `<div class="day today" id="${fechaFormateada}">${i}</div>`;
        } else {
            htmlDias += `<div class="day" id="${fechaFormateada}" ">${i}</div>`;
        }
    }

    for (let j = 1; j <= diasSiguientes; j++) {
        htmlDias += `<div class="day next">${j}</div>`;
    }

    ocultarBtnHoy();
    daysContainer.innerHTML = htmlDias;
    citasProgramadas.forEach(cita => {
        let citaDiv = document.getElementById(cita.fechaCita);
        if (citaDiv && cita.estadoCita !== "Cancelada") {
            if (usuarioActivo) {
                if (cita.cedulaUsuario === usuarioActivo.cedula) {

                    citaDiv.classList = "dayCita";
                }
            }
        }
    });

}

renderizarCalendario();

nextBtn.addEventListener("click", () => {
    mesActual++;
    if (mesActual > 11) {
        mesActual = 0;
        añoActual++;
    }
    renderizarCalendario();
});

prevBtn.addEventListener("click", () => {
    mesActual--;
    if (mesActual < 0) {
        mesActual = 11;
        añoActual--;
    }
    renderizarCalendario();
});

todayBtn.addEventListener("click", () => {
    mesActual = fecha.getMonth();
    añoActual = fecha.getFullYear();
    renderizarCalendario();
});


function ocultarBtnHoy() {
    if (
        mesActual === new Date().getMonth() &&
        añoActual === new Date().getFullYear()
    ) {
        todayBtn.style.display = "none";
    } else {
        todayBtn.style.display = "flex";
    }
}

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
        actualizarTabla(citas);
    } else {
        const elementosMostrar = document.querySelectorAll("#agendarCita,#inicioSesion,  #animacion, #busquedaMedico, #preguntasFrec, #servicios");
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

