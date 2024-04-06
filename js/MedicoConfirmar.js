// Se declara una lista vacía de médicos y una lista para almacenar citas.
let medicos = [];
var citas = [];

// Se agrega un evento de escucha que se activa cuando el contenido HTML se ha cargado completamente.
document.addEventListener("DOMContentLoaded", () => {
    // Se llama a la función tablaCitas cuando se carga completamente el contenido HTML.
    tablaCitas();
});

// Función encargada de generar y mostrar la tabla de citas médicas.
const tablaCitas = () => {
    // Se obtienen las citas guardadas del almacenamiento local del navegador, o se inicializa como un array vacío si no hay citas guardadas.
    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
    citas = [];
    // Se obtiene el elemento de la tabla donde se mostrarán las citas.
    const tabla = document.getElementById("informacionTabla");

    if (tabla) {
        // Se limpia el contenido de la tabla.
        tabla.innerHTML = '';
        // Si hay citas guardadas en el almacenamiento local.
        if (citasGuardadas) {
            // Para cada cita guardada.
            citasGuardadas.forEach(cita => {
                // Si la cita está registrada.
                if (cita.estadoCita === "Registrada") {
                    // Se muestra la cita en la tabla.
                    const fila = tabla.insertRow();

                    // Se crea una celda para mostrar la cédula del usuario.
                    const fechaCell = fila.insertCell(0);
                    fechaCell.textContent = cita.cedulaUsuario;

                    // Se crea una celda para mostrar la fecha de la cita.
                    const horaCell = fila.insertCell(1);
                    horaCell.textContent = cita.fechaCita;

                    // Se crea un botón para confirmar la cita.
                    const editarCell = fila.insertCell(2);
                    const editarBoton = document.createElement('button');
                    editarBoton.textContent = 'Confirmar';
                    // Se agrega un evento de clic al botón para cambiar el estado de la cita a "Confirmada".
                    editarBoton.addEventListener('click', () => {
                        cambiarEstadoCita(cita);
                        // Se elimina la fila de la tabla.
                        tabla.removeChild(fila);
                    });
                    editarCell.appendChild(editarBoton);

                    // Se crea un botón para cancelar la cita.
                    const cancelarCell = fila.insertCell(3);
                    const cancelarBoton = document.createElement('button');
                    cancelarBoton.textContent = 'Cancelar';
                    // Se agrega un evento de clic al botón para cambiar el estado de la cita a "Cancelada".
                    cancelarBoton.addEventListener('click', () => {
                        cambiarEstadoCitaCancelar(cita);
                        // Se elimina la fila de la tabla.
                        tabla.removeChild(fila);
                    });
                    cancelarCell.appendChild(cancelarBoton);
                } else {
                    // Si la cita no está registrada, se agrega a la lista de citas y se actualiza el almacenamiento local.
                    citas.push(cita);
                }
            });
        }
    }
}

// Función para cambiar el estado de una cita a "Confirmada".
const cambiarEstadoCita = (cita) => {
    cita.estadoCita = "Confirmada"
    // Se añade la cita modificada a la lista de citas y se actualiza el almacenamiento local.
    citas.push(cita);
    localStorage.setItem("citas", JSON.stringify(citas));
};

// Función para cambiar el estado de una cita a "Cancelada".
const cambiarEstadoCitaCancelar = (cita) => {
    cita.estadoCita = "Cancelada"
    // Se añade la cita modificada a la lista de citas y se actualiza el almacenamiento local.
    citas.push(cita);
    localStorage.setItem("citas", JSON.stringify(citas));
};
