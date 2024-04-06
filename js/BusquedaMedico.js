// Declaramos una variable 'medicosGeneral' que almacenará todos los médicos disponibles.
let medicosGeneral = [];

// Declaramos las variables 'index', 'paginaActual' y 'medicosPorPagina' para manejar la paginación de resultados.
let index = 0; // Índice inicial para la paginación.
let paginaActual = 1; // Página actual mostrada.
const medicosPorPagina = 5; // Número de médicos a mostrar por página.

// Declaramos la variable 'usuarioActivo' para almacenar la información del usuario que ha iniciado sesión.
let usuarioActivo = null;

// Definimos la clase 'Medico' con sus respectivas propiedades.
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

// Agregamos un event listener que se ejecuta cuando el DOM ha sido completamente cargado.
document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el elemento select con el id "tipoFiltrado".
    const selectTipoFiltrado = document.getElementById("tipoFiltrado");
    // Verificamos si el elemento select existe.
    if (selectTipoFiltrado !== null) {
        // Agregamos un event listener que se ejecuta cuando cambia el valor seleccionado en el select.
        selectTipoFiltrado.addEventListener("change", () => {
            // Obtenemos el valor seleccionado en el select.
            const tipoFiltradoSeleccionado = selectTipoFiltrado.value;
            // Llamamos a la función 'cargarResultados' para obtener los médicos filtrados según el tipo seleccionado.
            const medicosFiltrados = cargarResultados('', tipoFiltradoSeleccionado);
            // Llamamos a la función 'crearTabla' para crear y mostrar una tabla con los médicos filtrados.
            crearTabla(medicosFiltrados);
        });
    }
});


//Evento para ver cuando se presiona un boton
document.addEventListener("DOMContentLoaded", () => {
    const buscarMedico = document.getElementById("formularioBusquedaMedico");//Se obtiene el elemento
    if (buscarMedico !== null) {//Se valida que no sea null
        buscarMedico.addEventListener("submit", (event) => {//Si ha sido presionado, que se realize la acción
            event.preventDefault();

            const { filtro, tipoFiltrado } = obtenerDatosFormularioBusquedaMedico();//Se obtienen los valores del formulario
            mostrarResultados(filtro, tipoFiltrado);//Se llama a la función
        });
    }

    //Se obtiene los elementos de los botones para moverse
    const botonAnterior = document.getElementById("botonAnterior");
    const botonSiguiente = document.getElementById("botonSiguiente");
    //Se valida que no sean nulos
    if (botonAnterior !== null && botonSiguiente !== null) {
        botonAnterior.addEventListener("click", () => {//Sí se ha presionado, se llama a la funció mostrar resultado
            if (paginaActual > 1) {//Se valida que la pagina sea mayor a  1.
                paginaActual--;
                mostrarResultados();//Se llama a la función
            }
        });

        botonSiguiente.addEventListener("click", () => {//Sí se ha presionado, se llama a la funció mostrar resultado
            const medicosFiltrados = cargarResultados();//Se llama a la función que retorna medicos
            const totalPaginas = Math.ceil(medicosFiltrados.length / medicosPorPagina);//Se hace la operación
            if (paginaActual < totalPaginas) {//Se valida que la pagina actual sea menor al total de paginas
                paginaActual++;//Se suma 1 sí se cumple el if
                mostrarResultados();//Se llama a la función 
            }
        });
    }
});

//Funcion para obtener los datos del formulario
const obtenerDatosFormularioBusquedaMedico = () => {
    const filtro = document.getElementById("datoFiltro").value.trim();
    const tipoFiltrado = document.getElementById("tipoFiltrado").value.trim();
    return { filtro, tipoFiltrado };
};

const mostrarResultados = () => {
    const { filtro, tipoFiltrado } = obtenerDatosFormularioBusquedaMedico();//Se obtienen los datos
    const medicosFiltrados = cargarResultados(filtro, tipoFiltrado);
    crearTabla(medicosFiltrados);//Se llama a la función para crear la tabla
};


//Funcion para cargar los medicos segun el  filtro
const cargarResultados = (filtro, tipoFiltrado) => {
    const medicosLista = JSON.parse(localStorage.getItem("medicos"));//Se obtienen los medicos
    if (!medicosLista) {// Se valida  que no sea null
        return [];//retorna una lista vacia.
    }

    const medicos = [...medicosLista];//Se guardan los medicos
    let medicosFiltrados = medicos;//Se iguala a una lista de medicos Filtrados
    if (filtro !== '') {//Se valida que no sea vacio
        medicosFiltrados = medicos.filter(medico => medico[tipoFiltrado] === filtro);//Se filtran los medicos
    }

    switch (tipoFiltrado) {//Switch para ver el tipo de ordenación que queremos.
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

    return medicosFiltrados;//Retornamos los medicos
};


//Funcion para crear el modal, se le pasa un medico
const mostrarModal = (medico) => {
    const contentModal = document.getElementById('content-modal');//Se obtiene el elemento segun su id
    if (contentModal !== null) {//Se valida que no sea null
        contentModal.innerHTML = '';//Se limpia el elemento

        //Se crean los elementos necesarios y se les da valor y funcionalidad
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

    const containerModal = document.querySelector('.container-modal');//Se seleciona el elemento modal
    if (containerModal !== null) {//Se valida que no sea null
        containerModal.style.display = 'flex';//Se muestra el modal
    }
};

const cerrarModal = () => {//Funcion para cerrar el modal
    const containerModal = document.querySelector('.container-modal');//Se obtiene el elemento
    if (containerModal !== null) {//Se valida que no sea null
        containerModal.style.display = 'none';//Se esconde el modal
    }
};

//Funcion para crear la tabla de los medicos
const crearTabla = (medicosFiltrados) => {//Recibe una lista de medicos ya filtrados
    const tabla = document.getElementById('informacionTabla');//Se obtiene el elemento de la tabla
    tabla.innerHTML = '';//Se limpia el componente

    const inicio = (paginaActual - 1) * medicosPorPagina;//variable para ver en que pagina se empieza y se hace una operación matematica.
    const fin = paginaActual * medicosPorPagina;//Fin de la pagina, se hace una operación.

    const medicosPagina = medicosFiltrados.slice(inicio, fin);//Partimos la lista desde la pagina de inicio a la de fin

    medicosPagina.forEach(medico => {//Iteramos sobre los medicos ya filtrados
        const fila = tabla.insertRow();//Agregamos una fila

        //Empezamos a insertar valores de los medicos en sus respectivas celdas
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

//Evento para obtener un elemento 
document.addEventListener("DOMContentLoaded", () => {
    const inputDatoFiltro = document.getElementById("datoFiltro");//Se obtiene el elemento segun su id

    if (inputDatoFiltro !== null) {//Se valida que no sea null
        inputDatoFiltro.addEventListener("input", () => {
            const tipoFiltrado = document.getElementById("tipoFiltrado").value.trim();//Obtenmos el valor del elemento seleccionado
            filtrarOpcionesAutocompletado(tipoFiltrado);//Se llama a la función para autocompletar
        });
    }
});


const filtrarOpcionesAutocompletado = (tipoFiltrado) => {//funcion para filtrar los medicos y el autocompletado
    const dataList = document.getElementById("opcionesAutocompletado");//Obtenemos el elemento para autocompletar
    dataList.innerHTML = '';//Limpiamos el hmtl

    const medicosLista = JSON.parse(localStorage.getItem("medicos")) || [];//Obtenemos los medicos guardados
    const medicos = [...medicosLista];//Guardamos los medicos en una lista
    let opciones = [];//Limpiamos la lista de opciones
    switch (tipoFiltrado) {//switch para verificar el tipo de filtro que se quiere usar
        case 'nombreCompleto':
            opciones = medicos.map(medico => medico.nombreCompleto);//Iteramos por todos los medicos para buscar el que coincida
            break;
        case 'especialidad':
            opciones = medicos.map(medico => medico.especialidad);//Iteramos por todos los medicos para buscar el que coincida
            break;
        case 'ubicacion':
            opciones = medicos.map(medico => medico.ubicacion);//Iteramos por todos los medicos para buscar el que coincida
            break;
        case 'identificacion':
            opciones = medicos.map(medico => medico.identificacion);//Iteramos por todos los medicos para buscar el que coincida
            break;
        default://Opcion defuault
            break;//se rompe la condicion
    }

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        dataList.appendChild(option);
    });
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