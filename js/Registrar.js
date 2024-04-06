let usuarios = [];
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


const formRegistro = document.getElementById("formRegistro");
if (formRegistro !== null) {
    console.log("ENTRE AL ERROR");
    formRegistro.addEventListener("submit", event => {
        event.preventDefault();
        window.location.href = "Registrar.html";
    });
}
// Función para encriptar una contraseña
async function encriptarContrasena(contrasena) {
    // Codificar la contraseña como una secuencia de bytes
    const buffer = new TextEncoder().encode(contrasena);

    // Calcular el hash utilizando SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    // Convertir el hash a una representación hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    // Devolver el hash
    return hashHex;
}

// Añadir el evento submit al formulario
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioRegistro");
    if (formulario !== null) {
        formulario.addEventListener("submit", async (event) => {
            event.preventDefault();
            const { cedula, NombreCompleto, Apellidos, correo, contrasenna, confirmarContrasenna, NumeroCelular } = obtenerDatosFormularioRegistro();
            const esValido = validarContrasenna(contrasenna) && validarCedula(cedula) && validarApellidos(Apellidos)
                && validarNombreCompleto(NombreCompleto) && validarNumeroCelular(NumeroCelular) && validarCorreoElectronico(correo);
            console.log(validarContrasenna(contrasenna) + "-" + validarCedula(cedula) + "-" + validarApellidos(Apellidos)
                + "-" + validarNombreCompleto(NombreCompleto) + "-" + validarNumeroCelular(NumeroCelular) + "-" + validarCorreoElectronico(correo));
            esValido ? manejarExito(cedula, NombreCompleto, Apellidos, correo, contrasenna, confirmarContrasenna, NumeroCelular) : manejarError();
        });
    }
});

// Obtener los datos del formulario de registro
const obtenerDatosFormularioRegistro = () => {
    const correo = document.getElementById("correo").value.trim();
    const contrasenna = document.getElementById("contrasenna").value.trim();
    const confirmarContrasenna = document.getElementById("contrasennaConfirmar").value.trim();
    const cedula = document.getElementById("cedula").value.trim();
    const NombreCompleto = document.getElementById("NombreComp").value.trim();
    const Apellidos = document.getElementById("apellido").value.trim();
    const NumeroCelular = document.getElementById("telefono").value
    return { cedula, NombreCompleto, Apellidos, NumeroCelular, correo, contrasenna, confirmarContrasenna };
};

// Función para validar la cédula de identidad
const validarCedula = (cedula) => /^\d{2}-\d{4}-\d{4}$/.test(cedula);

// Función para validar el nombre completo
const validarNombreCompleto = (nombre) => nombre.length <= 20;

// Función para validar los apellidos
const validarApellidos = (apellidos) => apellidos.length <= 30;

// Función para validar el número de celular
const validarNumeroCelular = (celular) => /^\d{4}-\d{4}$/.test(celular);

// Función para validar el correo electrónico
const validarCorreoElectronico = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

// Función para validar la contraseña
const validarContrasenna = (contrasenna) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{11,}$/.test(contrasenna);

// Función para confirmar que la contraseña y su confirmación coinciden
const confirmarContrasenna = (contrasenna, confirmacion) => contrasenna === confirmacion;


const manejarExito = async (cedula, NombreCompleto, Apellidos, correo, contrasenna, confirmarContrasenna, NumeroCelular) => {
    usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (contrasenna === confirmarContrasenna) {
        const contrasennaEncriptada = await encriptarContrasena(contrasenna);
        console.log(contrasennaEncriptada);
        let usuario = new Usuario(cedula, NombreCompleto, Apellidos, NumeroCelular, correo, contrasennaEncriptada, confirmarContrasenna);
        let usuarioRepetido = false;
        if (usuarios) {
            usuarios.forEach(user => {
                if (user.cedula === usuario.cedula || user.correo === usuario.correo || user.NumeroCelular === usuario.NumeroCelular) {
                    usuarioRepetido = true;
                }
            });
        } else {
            usuarios = [];
        }
        if (!usuarioRepetido) {
            usuarios.push(usuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            console.log("Usuarios almacenados en localStorage:", usuarios);
            alert("Registro exitoso. Por favor, inicia sesión.");
            limpiarCamposTexto();
            window.location.href = "inicioSesion.html";
        } else {
            alert("Datos ya registrados, ingrese un nuevo correo, cedula o telefono");
        }
    }
};


const manejarError = () => {
    alert("Los datos ingresados no son válidos");
};

const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='email'], #formulario input[type='password']");
    campos.forEach((campo) => campo.value = "");
};
document.addEventListener("DOMContentLoaded", () => {
    const cerrarSesionLi = document.getElementById("cerrarSesion");
    cerrarSesionLi.addEventListener("click", cerrarSesion);
});

function cerrarSesion() {
    // Eliminar el usuario activo de sessionStorage
    console.log("CERRAR SESION");
    sessionStorage.removeItem("usuarioActivo");
    // Redirigir a la página de inicio de sesión o a otra página según sea necesario
    window.location.href = "index.html";
}