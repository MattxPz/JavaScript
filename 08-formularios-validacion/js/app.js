import { validarCampo, limpiarEstilo } from './validacion.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const inputs = form.querySelectorAll("input, select");
    const btnSubmit = document.getElementById("submitBtn");

    // --- FUNCIONALIDAD: Autoguardado ---
    const cargarDatos = () => {
        const guardado = JSON.parse(sessionStorage.getItem("registro_temporal"));
        if (guardado) {
            Object.keys(guardado).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && input.type !== "password") input.value = guardado[key];
            });
        }
    };

    const guardarDatos = () => {
        const data = Object.fromEntries(new FormData(form).entries());
        delete data.password;
        delete data.confirm_password;
        sessionStorage.setItem("registro_temporal", JSON.stringify(data));
    };

    // --- FUNCIONALIDAD: Máscara Teléfono ---
    const aplicarMascara = (e) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 10) v = v.slice(0, 10);
        if (v.length > 6) e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
        else if (v.length > 2) e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        else e.target.value = v;
    };

    // --- Validación en Tiempo Real ---
    inputs.forEach(input => {
        input.addEventListener("focusout", () => validarCampo(input));
        
        input.addEventListener("input", (e) => {
            limpiarEstilo(input);
            if (input.id === "telefono") aplicarMascara(e);
            guardarDatos();
        });
    });

    // --- Manejo del Envío ---
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // OBLIGATORIO [cite: 27]

        let esFormValido = true;
        inputs.forEach(input => {
            if (!validarCampo(input)) esFormValido = false;
        });

        if (esFormValido) {
            // Uso de FormData y Object.fromEntries [cite: 29]
            const formData = new FormData(form);
            const datosFinales = Object.fromEntries(formData.entries());
            
            // Verificación manual de checkbox (necesaria para Object.fromEntries)
            datosFinales.terminos = form.querySelector('#terminos').checked;

            console.log("¡Éxito! Datos capturados:", datosFinales);
            alert("¡Registro completado exitosamente!");
            
            sessionStorage.removeItem("registro_temporal");
            form.reset();
            inputs.forEach(i => limpiarEstilo(i));
        } else {
            console.error("Error: Revisa los campos en rojo.");
        }
    });

    cargarDatos();
});