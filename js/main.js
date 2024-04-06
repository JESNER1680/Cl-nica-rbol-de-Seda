// Declaramos las siguientes variables para almacenar información relacionada con el sistema.
let usuarios = []; // Almacena información de los usuarios registrados.
const medicos = []; // Almacena información de los médicos registrados. (constante)
const citas = []; // Almacena información de las citas médicas agendadas. (constante)
let usuarioActivo = null; // Almacena la información del usuario que ha iniciado sesión.
let contadorIntentosContra = 0; // Contador de intentos de inicio de sesión fallidos.

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
    constructor(nombreCompleto, identificacion, especialidad, ubicacion, horarios, informacionContacto, resenasCalificaciones, biografia) {
        this.nombreCompleto = nombreCompleto;
        this.especialidad = especialidad;
        this.ubicacion = ubicacion;
        this.horarios = horarios;
        this.informacionContacto = informacionContacto;
        this.resenasCalificaciones = resenasCalificaciones;
        this.biografia = biografia;
        this.identificacion = identificacion;
    }
}

//Evento que escuha cuando se presiona el submit del registro
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario");//se optiene el elemento segun el id
    if (formulario !== null) {//Se valida que no sea null
        formulario.addEventListener("submit", (event) => { // Se escuha el evento del submit
            event.preventDefault();

            const { correo, contrasenna } = obtenerDatosFormulario();//Se obtienen los datos
            usuarios = JSON.parse(localStorage.getItem("usuarios"));//Se obtienen los usuarios registrados
            const esValido = validarContrasenna(contrasenna) && validarCedula(correo);//Se valida los datos
            esValido ? manejarExito(correo, contrasenna) : manejarError(correo, contrasenna);//Se verifica sí han cumplido el filtro.
        });
    }
});

//Funcion para obtener los datos del formulario
const obtenerDatosFormulario = () => {
    const correo = document.getElementById("cedula").value.trim();
    const contrasenna = document.getElementById("contrasenna").value.trim();
    return { correo, contrasenna };//Se retornan los valores
};
//Se valida la contraseña por medio de expresiones regualares
const validarContrasenna = (contrasenna) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/.test(contrasenna);
//Se valida la cedula por medio de expresiones regualares
const validarCedula = (cedula) => /^\d{2}-\d{4}-\d{4}$/.test(cedula);

//funcion asincrona para encriptar las contraseñas
async function encriptarContrasena(contrasena) {
    // Convertimos la contraseña en una secuencia de bytes
    const buffer = new TextEncoder().encode(contrasena);

    // Utilizamos el método digest para calcular el hash SHA-256 del buffer.
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    // Convertimos el hash resultante de un buffer a un array de bytes.
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convertimos cada byte del hash a su representación hexadecimal y los concatenamos para formar el hash en formato hexadecimal.
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    // Devolvemos el hash en formato hexadecimal.
    return hashHex;
}

//Funcion para manejar el exito, recibe la cedula y la contraseña
const manejarExito = async (cedula, contrasenna) => {
    const contrasennaEncriptada = await encriptarContrasena(contrasenna);
    if (usuarios) {//Se valida si la lista no es null
        for (const usuario of usuarios) {// for para iterar
            if (usuario.cedula === cedula && usuario.contrasenna === contrasennaEncriptada) {//Condición del if para buscar sí los datos existen en algun usuario
                usuarioActivo = usuario;//Se guarda el usuario, en el usuario activo
                sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));//Se guarda el usuario activo
                alert("Iniciar sesión exitoso");//Enviar mensaje de exito
                limpiarCamposTexto();//Se limpian los campos
                window.location.href = "AgendarCita.html";//Se redirije a la pagina indicada
                return;//Se rompe el ciclo
            }
        }
        manejarError(cedula, contrasenna);//Se llama al metodo de error
    }
};

//funcion para ver el error
const manejarError = async (cedula, contrasenna) => {
    const contrasennaEncriptada = await encriptarContrasena(contrasenna);//Se encripta la contraseña
    if (usuarios) {//Se valida que no sea null la lista de users
        for (const usuario of usuarios) {//Se itera en la lista
            if (usuario.cedula === cedula && usuario.contrasena !== contrasennaEncriptada) {// Se valida sí se cumple con la condición
                contadorIntentosContra++;//Sí digita datos incorrectos, se suma uno al contador, para darle una advertencia
                if (contadorIntentosContra === 3) {//Sí el contador es igual a 3, se le oculta el boton de iniciar hasta que se cumpla cierto tiempo
                    const botonRegistrar = document.getElementById("botonIngresar");//Se obtiene el elemento boton
                    const labelTiempo = document.getElementById("tiempo");//Se obtiene el elemento Label
                    if (botonRegistrar) {//Sí no es null
                        botonRegistrar.style.display = "none" // Se oculta del usuario
                    }
                    if (labelTiempo) {//Sí no es null
                        labelTiempo.style.display = "flex"// Se muestra el Label
                    }
                    iniciarTemporizador();//Se inicia el termporizador
                }
            }
        }
    }
    alert("Los datos ingresados no son válidos");//Se envia un mensaje de advertencia
};
// Esta función se utiliza para iniciar un temporizador con una cuenta regresiva de 10 segundos.
const iniciarTemporizador = () => {
    let tiempo = 10; // Inicializamos el tiempo en 10 segundos.
    console.log(tiempo); // Imprimimos el tiempo inicial en la consola.
    const labelTiempo = document.getElementById("tiempo"); // Obtenemos el elemento con el id "tiempo" del documento HTML.

    // Iniciamos un temporizador que se ejecuta cada segundo.
    const temporizador = setInterval(() => {
        tiempo--; // Reducimos el tiempo en 1 segundo en cada iteración.
        if (labelTiempo) {
            labelTiempo.textContent = "" + tiempo; // Actualizamos el contenido del elemento "labelTiempo" con el tiempo restante.
        }
        // Cuando el tiempo llega a cero, detenemos el temporizador y realizamos ciertas acciones.
        if (tiempo === 0) {
            clearInterval(temporizador); // Detenemos el temporizador.
            // Mostramos el botón de registrar (si existe) y ocultamos el contador de tiempo.
            const botonRegistrar = document.getElementById("botonIngresar");
            if (botonRegistrar) {
                botonRegistrar.style.display = "flex";
            }
            if (labelTiempo) {
                labelTiempo.style.display = "none";
            }
            contadorIntentosContra = 0; // Reiniciamos el contador de intentos de contraseña.
        }
    }, 1000); // El temporizador se ejecuta cada 1000 milisegundos (1 segundo).
};

const limpiarCamposTexto = () => {//Se limpian los campos de texto
    const campos = document.querySelectorAll("#formulario input[type='email'], #formulario input[type='password']");
    campos.forEach((campo) => campo.value = "");//Se itera y se limpian los campos
};

const jsonMedicos = [//JSON con los medicos quemados
    {
        "nombreCompleto": "Juan",
        "identificacion": "01-2222-2222",
        "especialidad": "Cardiología",
        "ubicacion": "Hospital Central",
        "horarios": {
            "lunes": "8:00 - 12:00",
            "martes": "8:00 - 12:00",
            "miercoles": "8:00 - 12:00",
            "jueves": "8:00 - 12:00",
            "viernes": "8:00 - 12:00"
        },
        "informacionContacto": {
            "telefono": "123-456-7890",
            "correoElectronico": "drjuanperez@example.com"
        },
        "resenasCalificaciones": [
            { "paciente": "María", "calificacion": 5, "comentario": "Excelente médico, muy atento y profesional." },
            { "paciente": "Pedro", "calificacion": 4, "comentario": "Buen trato y explicaciones claras." },
            { "paciente": "Ana", "calificacion": 5, "comentario": "Muy recomendado, me ayudó mucho con mi problema cardíaco." }
        ],
        "biografia": "El Dr. Juan Pérez es un cardiólogo con más de 10 años de experiencia en el tratamiento de enfermedades cardíacas. Ha trabajado en varios hospitales reconocidos y se especializa en el diagnóstico y tratamiento de afecciones del corazón."
    },
    {
        "nombreCompleto": "José",
        "identificacion": "04-5555-5555",
        "especialidad": "Cardiología",
        "ubicacion": "Hospital Cardíaco",
        "horarios": {
            "lunes": "8:00 - 15:00",
            "martes": "8:00 - 15:00",
            "miércoles": "8:00 - 15:00",
            "jueves": "8:00 - 15:00",
            "viernes": "8:00 - 12:00"
        },
        "informacionContacto": {
            "telefono": "123-456-7890",
            "correoElectronico": "drjoserodriguez@example.com"
        },
        "resenasCalificaciones": [
            { "paciente": "María", "calificacion": 5, "comentario": "Atención excepcional, me ayudó mucho con mi problema cardíaco." },
            { "paciente": "Pedro", "calificacion": 4, "comentario": "Muy profesional, pero a veces las citas son difíciles de programar." },
            { "paciente": "Ana", "calificacion": 5, "comentario": "Excelente cardiólogo, lo recomiendo ampliamente." }
        ],
        "biografia": "El Dr. José Rodríguez es un cardiólogo altamente calificado con años de experiencia en el tratamiento de enfermedades cardíacas. Su enfoque es brindar atención personalizada y efectiva a cada paciente, priorizando su salud y bienestar."
    },
    {
        "nombreCompleto": "Laura Pérez",
        "identificacion": "05-6666-6666",
        "especialidad": "Psicología",
        "ubicacion": "Consultorio Psicológico Integrativo",
        "horarios": {
            "lunes": "10:00 - 18:00",
            "martes": "10:00 - 18:00",
            "miércoles": "10:00 - 18:00",
            "jueves": "10:00 - 18:00",
            "viernes": "10:00 - 14:00"
        },
        "informacionContacto": {
            "telefono": "987-654-3210",
            "correoElectronico": "laurapsicologa@example.com"
        },
        "resenasCalificaciones": [
            { "paciente": "Carlos", "calificacion": 5, "comentario": "Excelente atención, me ayudó a superar mis problemas de ansiedad." },
            { "paciente": "Sofía", "calificacion": 4, "comentario": "Muy empática, pero a veces las sesiones son cortas." },
            { "paciente": "Andrés", "calificacion": 5, "comentario": "Gran psicóloga, me ha ayudado mucho a entenderme mejor." }
        ],
        "biografia": "La Dra. Laura Pérez es una psicóloga comprometida con el bienestar emocional de sus pacientes. Ofrece terapias personalizadas y herramientas efectivas para enfrentar y superar los desafíos mentales y emocionales."
    },
    {
        "nombreCompleto": "David",
        "identificacion": "06-7777-7777",
        "especialidad": "Dermatología",
        "ubicacion": "Clínica de Dermatología Integral",
        "horarios": {
            "lunes": "9:00 - 16:00",
            "martes": "9:00 - 16:00",
            "miércoles": "9:00 - 16:00",
            "jueves": "9:00 - 16:00",
            "viernes": "9:00 - 13:00"
        },
        "informacionContacto": {
            "telefono": "654-321-0987",
            "correoElectronico": "davidmartinezderma@example.com"
        },
        "resenasCalificaciones": [
            { "paciente": "Laura", "calificacion": 5, "comentario": "Excelente dermatólogo, resolvió mi problema de piel en poco tiempo." },
            { "paciente": "Ana", "calificacion": 4, "comentario": "Buena atención, pero a veces la espera es larga." },
            { "paciente": "Pedro", "calificacion": 5, "comentario": "Muy profesional y amable, lo recomiendo totalmente." }
        ],
        "biografia": "El Dr. David Martínez es un dermatólogo experto en el tratamiento de enfermedades de la piel. Su enfoque es proporcionar soluciones efectivas y personalizadas para cada paciente, garantizando resultados satisfactorios y una piel saludable."
    },
    {
        "nombreCompleto": "Elena",
        "identificacion": "07-8888-8888",
        "especialidad": "Ginecología",
        "ubicacion": "Centro Médico Ginecológico",
        "horarios": {
            "lunes": "8:00 - 15:00",
            "martes": "8:00 - 15:00",
            "miércoles": "8:00 - 15:00",
            "jueves": "8:00 - 15:00",
            "viernes": "8:00 - 12:00"
        },
        "informacionContacto": {
            "telefono": "321-654-0987",
            "correoElectronico": "elena_gine@example.com"
        },
        "resenasCalificaciones": [
            { "paciente": "María", "calificacion": 5, "comentario": "Muy profesional y atenta, me hizo sentir cómoda durante la consulta." },
            { "paciente": "Sara", "calificacion": 4, "comentario": "Excelente ginecóloga, pero a veces es difícil conseguir cita." },
            { "paciente": "Javier", "calificacion": 5, "comentario": "Gran médica, me explicó todo detalladamente y resolvió mis dudas." }
        ],
        "biografia": "La Dra. Elena Sánchez es una ginecóloga comprometida con la salud y bienestar de las mujeres. Ofrece atención integral y personalizada, asegurando el cuidado óptimo de la salud reproductiva y ginecológica."
    },
    {
        "nombreCompleto": "Roberto",
        "identificacion": "08-9999-9999",
        "especialidad": "Oftalmología",
        "ubicacion": "Clínica Oftalmológica Visión Clara",
        "horarios": {
            "lunes": "10:00 - 18:00",
            "martes": "10:00 - 18:00",
            "miércoles": "10:00 - 18:00",
            "jueves": "10:00 - 18:00",
            "viernes": "10:00 - 14:00"
        },
        "informacionContacto": {
            "telefono": "789-012-3456",
            "correoElectronico": "robertogarcia@example.com"
        },
        "resenasCalificaciones": [
            { "paciente": "Carlos", "calificacion": 5, "comentario": "Muy buen oftalmólogo, me realizó una cirugía de cataratas con excelentes resultados." },
            { "paciente": "Luisa", "calificacion": 4, "comentario": "Buena atención, pero a veces la espera en la consulta es larga." },
            { "paciente": "María", "calificacion": 5, "comentario": "Excelente profesional, me ayudó a mejorar mi visión considerablemente." }
        ],
        "biografia": "El Dr. Roberto García es un oftalmólogo con amplia experiencia en el diagnóstico y tratamiento de enfermedades oculares. Se dedica a proporcionar soluciones efectivas y personalizadas para cada paciente, asegurando una visión óptima y saludable."
    }
];



jsonMedicos.forEach(medico => {// Se pasa el JSON a objetos medicos.
    medicos.push(new Medico(
        medico.nombreCompleto,
        medico.identificacion,
        medico.especialidad,
        medico.ubicacion,
        medico.horarios,
        medico.informacionContacto,
        medico.resenasCalificaciones,
        medico.biografia
    ));
});

const jsonMedicosString = JSON.stringify(medicos);//Se guardan los medicos en el localStorage
localStorage.setItem('medicos', jsonMedicosString);//Se guardan

//evento para obtener el usuario activo
document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivoString = sessionStorage.getItem("usuarioActivo");//Obtenemos el usuario activo
    if (usuarioActivoString) {//Validamos que no sea null
        usuarioActivo = JSON.parse(usuarioActivoString);//Obtenemos el usuario Actico
        const cerrarSesionLi = document.getElementById("cerrarSesion");//Mostramos el icono de cerrar cesión

        cerrarSesionLi.style.display = "inline-block";// Lo mostramos

        const inicioSesio = document.getElementById("iniciarSesion");//Obtenemos el elemento por su id

        inicioSesio.style.display = "none";//Lo ocultamos
        const elementosMostrar = document.querySelectorAll("#agendarCita,#animacion, #busquedaMedico, #preguntasFrec, #servicios");
        elementosMostrar.forEach(elemento => {//Iteramos y mostramos las opciones
            elemento.style.display = "inline-block";
        });
    } else {//Caso contrario ocultamos las opciones
        const elementosMostrar = document.querySelectorAll("#agendarCita,  #animacion, #busquedaMedico, #preguntasFrec, #servicios");
        elementosMostrar.forEach(elemento => {
            elemento.style.display = "none";
        });
    }
});

//Cerramos sesion
document.addEventListener("DOMContentLoaded", () => {
    const cerrarSesionLi = document.getElementById("cerrarSesion");
    cerrarSesionLi.addEventListener("click", cerrarSesion);
});

//Funcion para borrar el usuario Activo
const cerrarSesion = () => {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}


