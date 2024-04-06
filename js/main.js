let usuarios = [];
const medicos = [];
const citas = [];
let usuarioActivo = null;
let contadorIntentosContra = 0;
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

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario");
    if (formulario !== null) {
        formulario.addEventListener("submit", (event) => {
            event.preventDefault();

            const { correo, contrasenna } = obtenerDatosFormulario();
            console.log(correo + "  " + contrasenna);
            usuarios = JSON.parse(localStorage.getItem("usuarios"));
            const esValido = validarContrasenna(contrasenna) && validarCedula(correo);
            esValido ? manejarExito(correo, contrasenna) : manejarError(correo, contrasenna);
            console.log("Usuario no encontrado o credenciales incorrectas");
        });
    }
});

const obtenerDatosFormulario = () => {
    const correo = document.getElementById("cedula").value.trim();
    const contrasenna = document.getElementById("contrasenna").value.trim();
    return { correo, contrasenna };
};

const validarContrasenna = (contrasenna) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/.test(contrasenna);

const validarCedula = (cedula) => /^\d{2}-\d{4}-\d{4}$/.test(cedula);
async function encriptarContrasena(contrasena) {
    const buffer = new TextEncoder().encode(contrasena);

    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
const manejarExito = async (correo, contrasenna) => {
    const contrasennaEncriptada = await encriptarContrasena(contrasenna);
    if (usuarios) {
        for (const usuario of usuarios) {
            if (usuario.cedula === correo && usuario.contrasenna === contrasennaEncriptada) {
                usuarioActivo = usuario;
                sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
                console.log("Nombre Usuario: " + usuario.cedula);
                alert("Iniciar sesión exitoso");
                limpiarCamposTexto();
                window.location.href = "AgendarCita.html";
                return;
            }
        }
        manejarError(correo, contrasenna);
    }
};
const manejarError = async (correo, contrasenna) => {
    const contrasennaEncriptada = await encriptarContrasena(contrasenna);
    if (usuarios) {
        for (const usuario of usuarios) {
            if (usuario.cedula === correo && usuario.contrasena !== contrasennaEncriptada) {
                contadorIntentosContra++;
                if (contadorIntentosContra === 3) {
                    const botonRegistrar = document.getElementById("botonIngresar");
                    const labelTiempo = document.getElementById("tiempo");
                    if (botonRegistrar) {
                        botonRegistrar.style.display = "none"
                    }
                    if (labelTiempo) {
                        labelTiempo.style.display = "flex"
                    }
                    iniciarTemporizador();
                }
            }
        }
    }
    alert("Los datos ingresados no son válidos");
};
const iniciarTemporizador = () => {
    let tiempo = 10;
    console.log(tiempo);
    const labelTiempo = document.getElementById("tiempo");
    const temporizador = setInterval(() => {
        tiempo--;
        if (labelTiempo) {
            labelTiempo.textContent = "" + tiempo;
        }
        console.log(tiempo);
        if (tiempo === 0) {
            clearInterval(temporizador);
            console.log("¡Tiempo terminado!");

            const botonRegistrar = document.getElementById("botonIngresar");
            if (botonRegistrar) {
                botonRegistrar.style.display = "flex";
            }
            if (labelTiempo) {
                labelTiempo.style.display = "none";
            }
            contadorIntentosContra = 0;
        }
    }, 1000);
};

const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='email'], #formulario input[type='password']");
    campos.forEach((campo) => campo.value = "");
};

const jsonMedicos = [
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



jsonMedicos.forEach(medico => {
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
const jsonMedicosString = JSON.stringify(medicos);
localStorage.setItem('medicos', jsonMedicosString);
document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivoString = sessionStorage.getItem("usuarioActivo");
    if (usuarioActivoString) {
        usuarioActivo = JSON.parse(usuarioActivoString);
        const cerrarSesionLi = document.getElementById("cerrarSesion");

        cerrarSesionLi.style.display = "inline-block";

        const inicioSesio = document.getElementById("iniciarSesion");

        inicioSesio.style.display = "none";
        const elementosMostrar = document.querySelectorAll("#agendarCita,#animacion, #busquedaMedico, #preguntasFrec, #servicios");
        // Mostrar cada elemento
        elementosMostrar.forEach(elemento => {
            elemento.style.display = "inline-block";
        });
        console.log("Usuario activo recuperado:", usuarioActivo);
    } else {
        const elementosMostrar = document.querySelectorAll("#agendarCita,  #animacion, #busquedaMedico, #preguntasFrec, #servicios");
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


