// Declaración de variables globales para almacenar usuarios, médicos y citas, así como el usuario activo, los médicos filtrados y el índice del médico seleccionado
let usuarios = [];
let medicos = [];
let citas = [];
let usuarioActivo = null;
let medicosFiltradosSelect = [];
let indiceMedicoSeleccionado = -1;

// Definición de la clase Usuario para representar a los usuarios del sistema
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

// Definición de la clase CitaMedica para representar las citas médicas programadas
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

// Definición de la clase Medico para representar a los médicos del sistema
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

//Esto se usa para registrar una cita.
document.addEventListener("DOMContentLoaded", () => {
    const registrarBoton = document.getElementById("RegistrarCita");//Se obtiene el componente para ver sí hubo interacción
    if (registrarBoton !== null) {//Valida si no es null
        registrarBoton.addEventListener("click", (event) => {//Espera el evento del click
            event.preventDefault();
            const { medico, fechaCita, horaCita, especialidad, cedulaUsuario } = obtenerInformacionAgendarCita();//Se obtiene los datos del formulario
            let cita = new CitaMedica(fechaCita, horaCita, medico, especialidad, cedulaUsuario, "Registrada");//Se crea el objeto
            let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];//Se llama al LocalStorage para recuperar las citas.
            let citaRepetida = false;
            citasGuardadas.forEach(citaAux => {//Se itera comprobando que no haya una cita igual.
                if (cita.fechaCita === citaAux.fechaCita && cita.horaCita === citaAux.horaCita && citaAux.medico === cita.medico && citaAux.estadoCita !== "Cancelada") {//Se validan los datos
                    citaRepetida = true;
                    manejarErrorRegistro();//Se llama a la funcion flecha para indicar el error
                    return;//Se rompe el ciclo
                }
            });
            if (!citaRepetida) {//Sí la variable es false, significa que no hay citas repetidas
                citasGuardadas.push(cita);//Se añade a la lista
                localStorage.setItem("citas", JSON.stringify(citasGuardadas));//Se vuelven a guardar en el localStorage
                citas = JSON.parse(localStorage.getItem("citas")) || [];//Se llama a las citas que ya estan registradas.
                actualizarTabla(citas);//Se llama al metodo para actualizar la tabla de citas
                alert("Cita registrada, espere a que el medico la acepte");
            }
        });
    }
});

//Metodo para manejar el error y notificar
const manejarErrorRegistro = () => {
    alert("Ya hay una cita en esta fecha y hora");
};

//Metodo para eliminar las citas
const eliminarCita = (citaCancelada) => {

    let citasProgramadas = JSON.parse(localStorage.getItem("citas")) || [];//Se recuperan las citas
    //If que valida cual cita es la que cumple con los datos.
    if (citasProgramadas.some(cita => cita.medico === citaCancelada.medico && cita.fechaCita === citaCancelada.fechaCita && cita.horaCita === citaCancelada.horaCita)) {
        //Obtenemos el indice de la cita que queremos cancelar
        const indice = citasProgramadas.findIndex(cita => cita.medico === citaCancelada.medico && cita.fechaCita === citaCancelada.fechaCita && cita.horaCita === citaCancelada.horaCita);
        let miElemento = document.getElementById("" + citasProgramadas[indice].fechaCita);//Obtenemos el elemento con el id de la fecha 
        if (miElemento) {//Comprobamos que no sea nula
            miElemento.className = "day";//Cambiamos el nombre de la clase a day,  que es un elemento normal.
        }
        citasProgramadas[indice].estadoCita = "Cancelada";//Cambiamos el estado de la cita
        localStorage.setItem("citas", JSON.stringify(citasProgramadas));//Guardamos la cita de nuevo
        citasProgramadas = JSON.parse(localStorage.getItem("citas")) || [];//Volvemos a obtener las citas
        actualizarTabla(citasProgramadas, citaCancelada);//Llamamos a la función flecha para actualizar la tabla
    }
}
const obtenerInformacionAgendarCita = () => {//Funcion para obtener los datos del formulario
    const medico = document.getElementById("medicos").value;
    const fechaCita = document.getElementById("fechaCita").value.trim();
    const horaCita = document.getElementById("horaCita").value;
    const especialidad = document.getElementById("especialidad").value;
    let cedulaUsuario = usuarioActivo.cedula;
    return {//Retornamos los valores
        medico,
        fechaCita,
        horaCita,
        especialidad,
        cedulaUsuario
    };
};
const filtrarMedico = (filtro, tipoFiltrado) => {//Funcion para filtrar 
    medicos = [];//Limpaimos la lista
    medicosFiltradosSelect = [];//Lista para los medicos filtrados
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));//Obtenermos los medicos
    const selectMedicos = document.getElementById("medicos");//Selecionamos el elemento con el id medicos
    selectMedicos.innerHTML = '';//Limpiamos el componente

    if (medicosLista) {//Verificamos que la lista no sea null
        medicos.push(...medicosLista);//Introducimos todos los medicos en la lista
    }

    let medicosFiltrados = medicos.filter(medico => medico[tipoFiltrado] === filtro);//Filtramos los medicos

    if (selectMedicos) {//Validamos que no sea null
        if (medicosFiltrados.length > 0) {//validamos que haya por lo menos 1 medico
            medicosFiltrados.forEach(medico => {//ciclo para agregar las opciones en el elemento
                const option = document.createElement("option");
                option.value = medico.nombreCompleto;
                option.textContent = medico.nombreCompleto;//Concatenamos el valor del nombre del medico
                selectMedicos.appendChild(option);
                medicosFiltradosSelect.push(medico);//Añadimos al medico que cumple con los requisitos
                indiceMedicoSeleccionado = 0;
            });
        } else {
            console.log("No hay registros");
        }
    }
}
const filtrarMedicoActualizar = (filtro, tipoFiltrado) => {//Funcion para flitrar a los medicos
    //Se limian las listas
    medicos = [];
    medicosFiltradosSelect = [];
    //Se obtiene a los medicos guardados
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));
    const selectMedicos = document.getElementById("medicosActualizar");//Se obtiene el elemento con el id

    selectMedicos.innerHTML = '';//Se limpia el elemento

    if (medicosLista) {//se valida que no sea null
        medicos.push(...medicosLista);//Se guardan los medicos en la lista
    }

    let medicosFiltrados = medicos.filter(medico => medico[tipoFiltrado] === filtro);//Filtramos a los medicos

    if (selectMedicos) {//valida que no sea null
        if (medicosFiltrados.length > 0) {//valida que haya un medico por lo menos
            medicosFiltrados.forEach(medico => {//Se itera para crear las opciones para el elemento
                const option = document.createElement("option");
                option.value = medico.nombreCompleto;
                option.textContent = medico.nombreCompleto;
                selectMedicos.appendChild(option);
                medicosFiltradosSelect.push(medico);//Se añade a la lista
                indiceMedicoSeleccionado = 0;
            });
        } else {
            console.log("No hay registros");
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));//Guardamos los medicos en la localStorage en una lista
    const selectEspecialidad = document.getElementById("especialidad");//obtenemos el elemento con el id
    if (medicosLista) {//Validamos que no sea null
        medicos.push(...medicosLista);//Guardamos los medicos en otra lista
    }
    if (selectEspecialidad !== null) {//Validamos que no sea null
        if (medicos.length > 0) {//Validamos que haya un por lo menos un medico
            const especialidadesUnicas = new Set();//Declaramos un objeto para almacenar datos ya iterados

            medicos.forEach(medico => {//Hacemos el ciclo
                if (!especialidadesUnicas.has(medico.especialidad)) {// Hacemos la validación, sí medico.especialidad ya ha sido añadido al objeto.
                    const option = document.createElement("option");//Se crea una option
                    option.value = medico.especialidad;//Se da el valor
                    option.textContent = medico.especialidad;//se da el valor del contenido
                    selectEspecialidad.appendChild(option);//se añade la opcion
                    especialidadesUnicas.add(medico.especialidad);//Se añade al objeto para que no se repita la opción.
                }
            });
        } else {
            console.log("No hay registros");
        }
    }
});
function actualizarTabla(citas) {//Metodo para actualizar la tabla
    const tabla = document.getElementById("ContenidoTablaCitas");// se obtiene el elemento 

    tabla.innerHTML = '';//Se limpia 

    if (usuarioActivo) {// Se valida que no sea null
        citas.forEach(cita => {
            if (cita.cedulaUsuario === usuarioActivo.cedula && cita.estadoCita === "Confirmada") {//Se valioda sí el usaurio de la cita coincide con el usuarioActivo y sí la cita esta confirmada
                const fila = tabla.insertRow();//Se inserta una fila

                const fechaCell = fila.insertCell(0);//Se inserta en la celda i y así sucesivamente
                fechaCell.textContent = cita.fechaCita;//Le damos el valor a la celda, y las de abajo siguen el mismo patron

                const horaCell = fila.insertCell(1);
                horaCell.textContent = cita.horaCita;

                const MedicoCell = fila.insertCell(2);
                MedicoCell.textContent = cita.medico;

                const editarCell = fila.insertCell(3);
                const editarBoton = document.createElement('button');//Añadimos un boton a la celda para poder cancelar o actualizar las citas
                editarBoton.textContent = 'Editar';//Le damos valor
                editarBoton.addEventListener('click', () => {//vemos sí hay un evento de click para realizar la acción
                    mostrarModal(cita);//Llamamos a una funcion para representar el modal
                });
                editarCell.appendChild(editarBoton);//Agregamos elboton a la celda

                const cancelarCell = fila.insertCell(4);//Esto sigue los mismos pasos que arriba
                const cancelarBoton = document.createElement('button');
                cancelarBoton.textContent = 'Cancelar';
                cancelarBoton.addEventListener('click', () => {
                    eliminarCita(cita);//Se llama a la función para eliminar una cita

                });
                cancelarCell.appendChild(cancelarBoton);//Se añade el boton
                let citaActual = document.getElementById(cita.fechaCita);//Se obtiene el elemento del calendario con el id indicado
                if (citaActual) {//Si no es null
                    citaActual.className = "dayCita"//Cambiamos el valor de la clase
                }
            }

        });
    }
}

//En este metodo creamos un model, creamos componente de HTMLL y les asignamos valores, como se explico anteriormente
const mostrarModal = (cita) => {
    const contentModal = document.getElementById('content-modal');
    if (contentModal !== null) {//Validamos que no sea null
        contentModal.innerHTML = '';//Limpiamos la lista

        const formulario = document.createElement('div');//Creamos un div
        formulario.classList.add('formulario');//Damos valor al conjunto de clases

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
            let citaActualizada = new CitaMedica(fechaActualizada, horaActualizada, medico, especialidad, usuarioActivo.cedula, "Confirmada");//Creamos una cita, cuando se activa el evento del click del boton actualizar
            actualizarCita(cita, citaActualizada);//LLamamos  a la función para actualizar

        });
        form.appendChild(botonActualizarCita);


        formulario.appendChild(form);

        contentModal.appendChild(formulario);
        const cerrarButton = document.createElement('button');
        cerrarButton.textContent = 'Cerrar';
        cerrarButton.addEventListener('click', cerrarModal);
        contentModal.appendChild(cerrarButton);

        const selectEspecialidadActualizar = document.getElementById("especialidadActualizar");//Obtenemos el elemento especificado
        if (selectEspecialidadActualizar) {//Validamos que no sea null
            if (medicos.length > 0) {//Validamos que haya por lo menos un medico
                const especialidadesUnicas = new Set();//Realizamos acciones explicadas  anteriormente.
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

            const selectEspecialidadActua = document.getElementById("especialidadActualizar");//Obtenemos el elemento con la id especificada
            const especialidadAct = 'especialidad';//Declaramos esta variable para usarla como el tipoDeFiltro

            if (selectEspecialidadActua !== null) {//Validamos que no sea null
                selectEspecialidadActua.addEventListener("change", () => {//Vemos sí hubo un evento de cambio en elemento select
                    const tipoFiltradoSeleccionado = selectEspecialidadActua.value;
                    filtrarMedicoActualizar(tipoFiltradoSeleccionado, especialidadAct);

                });
            }


        }
    }

    const containerModal = document.querySelector('.container-modal');//Obtenemos el elemento con el id especificado
    if (containerModal !== null) {//Validamos que no sea null
        containerModal.style.display = 'flex';//Damos el display para que sea visible
    }
};

const cerrarModal = () => {//funcion para cerrar el modal
    const containerModal = document.querySelector('.container-modal');//Obtenemos el elemento
    if (containerModal !== null) {//Validamos que no sea null
        containerModal.style.display = 'none';//Ocultamos el model
    }
};

const actualizarCita = (cita, citaActualizada) => {//Funcion para actualizar las citas
    let citas = JSON.parse(localStorage.getItem("citas")) || [];//Obtenemos las citas

    const index = citas.findIndex(c => c.fechaCita === cita.fechaCita && c.horaCita === cita.horaCita);// Encontramos la cita que cumple con las especificaciones
    let citaRepetida = false;//Variable para ver sí una cita esta repetida
    citas.forEach(citaAux => {//Iteramos para buscar sí ya hay una cita con esos datps
        if (citaActualizada.fechaCita === citaAux.fechaCita && citaActualizada.horaCita === citaAux.horaCita && citaAux.medico === citaActualizada.medico) {
            citaRepetida = true;//Sí ya hay una cita, cambiamos el valor de la variable, así sabemos que ya hay una cita.
            manejarErrorRegistro();//Llamamos al metodo para manejar el error
            return;//Rompemos el ciclo
        }
    });
    if (!citaRepetida) {//Hacemos la validación sí la cita ya esta repetida
        if (index !== -1) {//Validamos que el indice sea compatible. Sí es -1 es que la cita no existia
            citas.splice(index, 1, citaActualizada);//Remplazamos la cita por la cita actualizada

            localStorage.setItem("citas", JSON.stringify(citas));//Guardamos los datos.
            citas = JSON.parse(localStorage.getItem("citas")) || [];//Obtenemos las citas
            let miElemento = document.getElementById(cita.fechaCita);//Obtenemos un elemento con el id, para cambiar el valor de la clase
            if (miElemento) {//Valdamos que no sea null
                miElemento.className = "day";//Cambiamos el valor de la clase
                if (citaActualizada) {//Validamos que no sea null
                    let citaActual = document.getElementById(citaActualizada.fechaCita);//Obtenemos un elemento con el id especificado
                    if (citaActual && citaActualizada.estadoCita === "") {//Validamos que no sea null
                        citaActual.className = "dayCita"//cambiamos el valor de la clase
                    }
                }
            }
            actualizarTabla(citas, cita);//Actaulizamos la tabla
            cerrarModal();//Cerramos el modal
        } else {
            console.log("La cita a actualizar no fue encontrada");
        }
    }
};



//Obtenemos la el elemento especialidad cuando se cambia de opción, esto se logra gracias al evento change del select
document.addEventListener("DOMContentLoaded", () => {
    const selectEspecialidad = document.getElementById("especialidad");
    const especialidad = 'especialidad';
    if (selectEspecialidad !== null) {//Validamos que no sea null
        selectEspecialidad.addEventListener("change", () => {
            const tipoFiltradoSeleccionado = selectEspecialidad.value;//Obtenemos el valor
            filtrarMedico(tipoFiltradoSeleccionado, especialidad);//Llamamos al metodo para filtrar los medicos

        });
    }
});

const daysContainer = document.querySelector(".days"),// se busca al primer elemento llamado .days
    nextBtn = document.querySelector(".next-btn"),// se busca al primer elemento llamado .next-btn
    prevBtn = document.querySelector(".prev-btn"),// se busca al primer elemento llamado .prev-btn
    month = document.querySelector(".month"),// se busca al primer elemento llamado .month
    todayBtn = document.querySelector(".today-btn");// se busca al primer elemento llamado .today-btn

const meses = [//Lista con los meses de año
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

//Lista  con lo días de la semana
const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
//Declaramos la fecha de actual
const fecha = new Date();
//Obtenemos el mes
let mesActual = fecha.getMonth();
//Obtebemos el año
let añoActual = fecha.getFullYear();


const renderizarCalendario = () => {
    let citasProgramadas = JSON.parse(localStorage.getItem("citas")) || []; // Obtiene las citas programadas del almacenamiento local
    fecha.setDate(1); // Establece el día del mes en 1
    const primerDia = new Date(añoActual, mesActual, 1); // Obtiene el primer día del mes
    const ultimoDia = new Date(añoActual, mesActual + 1, 0); // Obtiene el último día del mes
    const indiceUltimoDia = ultimoDia.getDay(); // Obtiene el índice del último día de la semana
    const fechaUltimoDia = ultimoDia.getDate(); // Obtiene el número del último día del mes
    const ultimoDiaMesAnterior = new Date(añoActual, mesActual, 0); // Obtiene el último día del mes anterior
    const fechaUltimoDiaMesAnterior = ultimoDiaMesAnterior.getDate(); // Obtiene el número del último día del mes anterior
    const diasSiguientes = 7 - indiceUltimoDia - 1; // Calcula el número de días de la siguiente semana

    month.innerHTML = `${meses[mesActual]} ${añoActual}`; // Actualiza el mes y el año mostrado en el calendario

    let htmlDias = ""; // Variable para almacenar el HTML de los días del calendario

    // Bucle para generar los días del mes anterior que se muestran en la primera semana del calendario
    for (let x = primerDia.getDay(); x > 0; x--) {
        htmlDias += `<div class="day prev">${fechaUltimoDiaMesAnterior - x + 1}</div>`;
    }

    var fechaFormateada = ""; // Variable para almacenar la fecha formateada

    // Bucle para generar los días del mes actual
    for (let i = 1; i <= fechaUltimoDia; i++) {
        // Formatea la fecha
        var dia = i.toString().padStart(2, '0');
        var mes = (mesActual + 1).toString().padStart(2, '0');
        var fechaFormateada = añoActual + '-' + mes + '-' + dia;

        // Agrega el HTML del día actual o futuro al calendario
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

    // Bucle para generar los días de la siguiente semana que se muestran en la última semana del calendario
    for (let j = 1; j <= diasSiguientes; j++) {
        htmlDias += `<div class="day next">${j}</div>`;
    }

    ocultarBtnHoy(); // Oculta el botón "Hoy" si el mes actual es el mes mostrado en el calendario

    daysContainer.innerHTML = htmlDias; // Agrega el HTML generado al contenedor de los días del calendario

    // Itera sobre las citas programadas y resalta los días con citas
    citasProgramadas.forEach(cita => {
        let citaDiv = document.getElementById(cita.fechaCita);
        if (citaDiv && cita.estadoCita !== "Cancelada" && cita.estadoCita !== "Registrada") {
            if (usuarioActivo) {
                if (cita.cedulaUsuario === usuarioActivo.cedula) {
                    citaDiv.classList = "dayCita";
                }
            }
        }
    });
}

// Llama a la función para renderizar el calendario cuando se carga la página
renderizarCalendario();

// Agrega un listener de eventos al botón "Siguiente" para avanzar al siguiente mes
nextBtn.addEventListener("click", () => {
    mesActual++;
    if (mesActual > 11) {
        mesActual = 0;
        añoActual++;
    }
    renderizarCalendario();
});

// Agrega un listener de eventos al botón "Anterior" para retroceder al mes anterior
prevBtn.addEventListener("click", () => {
    mesActual--;
    if (mesActual < 0) {
        mesActual = 11;
        añoActual--;
    }
    renderizarCalendario();
});

// Agrega un listener de eventos al botón "Hoy" para regresar al mes y año actual
todayBtn.addEventListener("click", () => {
    mesActual = fecha.getMonth();
    añoActual = fecha.getFullYear();
    renderizarCalendario();
});

// Función para ocultar el botón "Hoy" si el mes actual es el mes mostrado en el calendario
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
        citas = JSON.parse(localStorage.getItem("citas")) || [];//Obtenemos las citas
        actualizarTabla(citas);//Actaulizamos la tabla con las citas
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

