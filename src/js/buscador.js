document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    buscarPorFecha();
}

function buscarPorFecha() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', function(evento) {
        const fechaSeleccionada = evento.target.value;

        window.location = `?fecha=${fechaSeleccionada}`;//Se redirecciona al usuario, se coloca en la url el dato de la fecha seleccionada
    });
}