function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const tareas_id = getQueryParam('id');

const confirmBtn = document.getElementById("ConfirmBtn");

document.getElementById('ConfirmBtn').addEventListener('click', async function () {
    const nombre = document.getElementById('nuevoNombre');
    const duracion = document.getElementById('nuevaDuracion');

    const nombreError = document.getElementById('nombreError');
    const duracionError = document.getElementById('duracionError');

    // Reset errors
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.style.display = 'none');

    let isValid = true;

    // Validations
    if (nombre.value.trim() === '') {
        nombreError.textContent = 'El nombre es obligatorio.';
        nombreError.style.display = 'block';
        isValid = false;
    }
    if (nombre.value.length < 2 || nombre.value.length > 50) {
        nombreError.textContent = 'El nombre es demasiado corto o largo.';
        nombreError.style.display = 'block';
        isValid = false;
    }
     if (duracion.value.trim() === '') {
        duracionError.textContent = 'La duracion es obligatoria.';
        duracionError.style.display = 'block';
        isValid = false;
    }
    if (duracion.value.length < 2 || duracion.value.length > 50) {
        duracionError.textContent = 'La duracion es demasiado corta o larga.';
    }



    if (isValid) {
        const tareaBuscada = {
            nombre: nombre.value,
            duracion: duracion.value,

        };
        console.log("aprobo los campos, ", tareas_id)
        const responseAlta = await fetch(`https://localhost/back/tareas/${tareas_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tareaBuscada),
        });

        if (responseAlta.ok) {
            window.location.href = '../../index.html'
        }
        alert('Todos los campos son válidos.');
    }
});

document.getElementById('cancelBtn').addEventListener('click', function () {
    window.alert('Los datos no se han guardado');
    window.location.href = `../../index.html`;
});