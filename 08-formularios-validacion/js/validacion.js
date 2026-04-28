// 1. Expresiones Regulares
const regexNombre = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^\d{10}$/;
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

/**
 * Valida un campo individual y aplica feedback visual en el DOM
 */
export const validarCampo = (campo) => {
    let esValido = true;
    let mensaje = "";
    const valor = campo.value.trim();

    if (campo.id === "nombre") {
        if (!valor) { mensaje = "El nombre es obligatorio."; esValido = false; }
        else if (!regexNombre.test(valor)) { mensaje = "Mínimo 3 letras, sin números."; esValido = false; }
    } 
    else if (campo.id === "email") {
        if (!valor) { mensaje = "El correo es obligatorio."; esValido = false; }
        else if (!regexEmail.test(valor)) { mensaje = "Correo electrónico no válido."; esValido = false; }
    } 
    else if (campo.id === "telefono") {
        const soloNumeros = valor.replace(/\D/g, "");
        if (soloNumeros.length !== 10) { mensaje = "Deben ser exactamente 10 dígitos."; esValido = false; }
    } 
    else if (campo.id === "fecha_nacimiento") {
        if (!valor) { mensaje = "La fecha es obligatoria."; esValido = false; }
        else {
            const hoy = new Date();
            const fechaNac = new Date(valor);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            if (edad < 18) { mensaje = "Debes ser mayor de edad (18+)."; esValido = false; }
        }
    } 
    else if (campo.id === "password") {
        if (!regexPassword.test(valor)) {
            mensaje = "Min. 8 caracteres, Mayúscula y Número.";
            esValido = false;
        }
        actualizarFuerzaPassword(valor);
    } 
    else if (campo.id === "confirm_password") {
        const pass = document.getElementById("password").value;
        if (valor !== pass || valor === "") { mensaje = "Las contraseñas no coinciden."; esValido = false; }
    }
    else if (campo.id === "terminos") {
        if (!campo.checked) { mensaje = "Debes aceptar los términos."; esValido = false; }
    }

    aplicarFeedback(campo, esValido, mensaje);
    return esValido;
};

const aplicarFeedback = (campo, esValido, mensaje) => {
    const contenedor = campo.parentElement;
    let errorSpan = contenedor.querySelector(".error-message");

    if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = "error-message";
        contenedor.appendChild(errorSpan);
    }

    if (esValido && (campo.value !== "" || campo.type === "checkbox")) {
        campo.classList.add("valido");
        campo.classList.remove("invalido");
        errorSpan.textContent = "";
    } else if (!esValido) {
        campo.classList.add("invalido");
        campo.classList.remove("valido");
        errorSpan.textContent = mensaje;
    }
};

export const limpiarEstilo = (campo) => {
    campo.classList.remove("valido", "invalido");
    const errorSpan = campo.parentElement.querySelector(".error-message");
    if (errorSpan) errorSpan.textContent = "";
};

const actualizarFuerzaPassword = (pass) => {
    const indicador = document.getElementById("password-strength");
    let fuerza = 0;
    if (pass.length >= 8) fuerza++;
    if (/[A-Z]/.test(pass)) fuerza++;
    if (/[0-9]/.test(pass)) fuerza++;
    if (/[^A-Za-z0-9]/.test(pass)) fuerza++;

    const niveles = ["Muy débil", "Débil", "Media", "Fuerte"];
    const colores = ["#e74c3c", "#f39c12", "#f1c40f", "#2ecc71"];
    
    indicador.textContent = pass ? `Fuerza: ${niveles[fuerza - 1] || niveles[0]}` : "";
    indicador.style.color = colores[fuerza - 1] || colores[0];
};