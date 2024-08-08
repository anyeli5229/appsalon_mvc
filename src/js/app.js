let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs(); //Cambia la sección cuando se presionan los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente(); 
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita

}

function mostrarSeccion() {

    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(evento) {
            paso = parseInt(evento.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    })
}

//El cambio de color en los tabs se realiza en mostrarSeccion ya que se dicha función se manda a llamar en cada click(evento) que se have el los tabs, mientras que la funcion tabs unicamente se manda a llamar en la funcion inicarApp (cuando la aplicación funciona), lo que significa que si hicieramos el cambio de eventos en la función tabs no se realizaria ningún cambio 

function botonesPaginador() {
    //Se seleccionan los botones y se asignan a una variable
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        //Si se ecuentra presionado el boton servicios en el dom que es igual a 1, entonces se agrega una clase al boton "anterior" la cual lo oculta y se le quita esa clase al boton "siguiente" el cual lo muestra
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
         //Si se ecuentra presionado el boton resumen en el dom  que es igual a 3, entonces se agrega una clase al boton "siguiente" la cual lo oculta y se le quita esa clase al boton "anterior" el cual lo muestra
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
         //Si se ecuentra presionado el boton informacion cita en el dom  que es igual a 3, entonces se le quita la clase de ocultar a ambos botones el cual los muestra
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

//FUNCIONES PARA EL PAGINADOR CAMBIE DE SECCION
function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {

        if(paso <= pasoInicial) return; 
        //Si paso es menor o igual a pasoInicial se retorna ese valor, caso contrario se resta el valor de la variable paso
        paso--;
        //Se manda a llamar el paginador para que muestre u oculte los botones
        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {

        if(paso >= pasoFinal) return;
        paso++;
        
        botonesPaginador();
    })
}
//Asinc function permite que otras funcione continuen funcionando mientras esta puede que aún no termine 
//await hace que la funcion no continue hasta que termine las líneas del código se completen pero ocupa mucha memoria por lo que lo ideal es utilizarlo solo en ciertas partes del código, await solose puede utilicar en funciones que sean asincrónas
async function consultarAPI() {
//try catch permite que la aplicación o página sigan funcionando en caso de que exista algún error en la programación p algo salga mal
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url); //fetch realiza peticiones HTTP (se pueden obtene ciertas caracteriticas o métodos como body, formdata, json etc.). Datos del servidor
        const servicios = await resultado.json(); //Obtiene el json de la url
        mostrarServicios(servicios);
    
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio; //Destructuring se separa el valor y la variable de id, de nombre y de precio

        //Se crea un parrafo con una clase nombre-servicio y en su contenido el nombre del servicio
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        //Se crea un parrafo con una clase nombre-servicio y en su contenido el precio del servicio
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        //Se crea un div con una clase servicio y id como atributo (data-id-servicio = $id)
        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        //Manera depasar un dato a una función, ya que si sólo se manda a llamar la funcion principal, mostraría, todos los servicios de la base de datos (asociarlo por medio de un callback) 
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        //Mostrar los elementos en pantalla
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        //Agregar servicioDiv en el div vacío generado en el archivo de /view/cita/index.php
        document.querySelector('#servicios').appendChild(servicioDiv);

    });
}

function seleccionarServicio(servicio) {
    //Servicio es el objeto seleccionado 
    //Servicios es el objeto que tiene la información de la cita
    const { id } = servicio;//Extraer (separa) el arreglo de id
    const { servicios } = cita; //Extraer (separa) el arreglo de servicios

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado 
    //servicios.some itera sobre todos los elementos de servicios y verifica si un elementoya existe en el arreglo
    //agregado.id es lo que se tiene en memoria y id es el elemento seleccionado (id es igual a servicio.id pero se realiza el destructuring en la linea 163 por lo que únicamente queda como id)
    if( servicios.some( agregado => agregado.id === id ) ) {
        // Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        //cita.servicios toma el valor del arreglo de servicio actual y le agrega el nuevo objeto, ... roma una copia de lo que hay en el arregloy lo agrega a un nuevo objeto y reescribe en citas, en su propiedad de servicios
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
    // console.log(cita);
}

//La diferencia de includes y de some, es que includes únicamente se le pasan los valores en un arreglo de la variable, miestras que some necesitauna función, un callback

function idCliente() {
    //Se accede al valor del nombre que el usuario colocó al iniciar sesión
    cita.id = document.querySelector('#id').value;
}
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(evento) {

        //Manda a llamar una función de javascript (new Date) que permite obtner el valor del dia, se le pasa el dia seleccionado y retorna un número de acuerdo al dia, lunes = 1, martes = 2, etc.
        const dia = new Date(evento.target.value).getUTCDay();
        //Si el día seleccionado incluye sabádos o domingos [6,0] muestra un mensaje de error
        if( [6, 0].includes(dia) ) {
            evento.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            //Si el día seleccionado es válido, se guarda en el arreglo de la cita
            cita.fecha = evento.target.value;
        }
        
    });
}

function seleccionarHora() {
    //Se selecciona el id de hora
    const inputHora = document.querySelector('#hora');
    //Se accede al evento mediante un callback que permite cambiar resetear o cambiar el valor según sea necesario
    inputHora.addEventListener('input', function(evento) {


        const horaCita = evento.target.value;
        //Split permite separar una cadena de texto, en este caso se separan las horas de los minutos en forma de un arreglo eje. ['22', '10'], y se selecciona el valor del arreglo 0, que serían las horas
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18) {
            evento.target.value = '';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
        } else {
            cita.hora = evento.target.value;
        }
    })
}


function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // Previene que se generen más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        // Eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
  
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el Contenido de Resumen y si pasa la validación ya no se muetra la alerta, ya que sin el while la alerta quedaría presente todo el tiempo
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }
    //Object.values itera sobre los elementos de un objeto en este caso sobre el objeto de cita y checa si hay un string vacío, lo que significa que faltan datos o si en el apartado de servicios, el tamaño de ese objeto es 0 (length = cantidad de elementos seleccionados en un objeto)se muetra una alerta 
    if(Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    } 

    // Una vez pasada la validación se formatea el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio; //Destructuring{}
        //Se crea un div con la calse contenedor-servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        //Se crea un parrafo con el nombre del cliente
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        //Se crea un parrafo donde se le inyecta la variable del precio y por eso se usa innerHTML
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;
        //Se agregan ambos parrafos al div creado previeamente
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        //Y todo se agrega al div principal del index.php(cita)
        resumen.appendChild(contenedorServicio);
    });

    // Heading para Cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    //Se crea un objeto de la fecha que se instancia con el método Date para acceder al mes, dia y año por separados
    const fechaObj = new Date(fecha); //(1)
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2; //Se agrega un +2 porque cada que se usa una instancia de Date, para obtener la fecha hay un desface de un dia, y se utiliza dos veces la instancia de Date
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia)); //(2) UTC retorna los elementos en formato UTC
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones); //Regresa una fecha fomateada en un idioma en especifico

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    
    const { id, fecha, hora, servicios } = cita;
    //map coloca las coincidencias de la variable hacía la nueva variable, la diferencia de un forEach, es que este, sólo itera sobre los valores. map devuelve un nuevo arreglo con los resultados de la función que se le pasa como parámetro
    // En este caso se está pasando la función que toma un servicio y devuelve el id del servicio
    // El resultado es un nuevo arreglo con los ids de los servicios que se van a enviar al servidor
    const idServicios = servicios.map( servicio => servicio.id );
    //console.log(idServicios);
    //FormData es una función que permite colocar datos y despues mandarlos hacía un servidor, contiene toda la información que se va a mandar
    const datos = new FormData();
    //Append es la forma de agregar datos hacia el FormData
    datos.append('usuarioid', id);
    datos.append('fecha', fecha);//'fecha' es la forma en la cual se accede al dato en el método post --> $_POST['fecha'] y fecah es la variable 
    datos.append('hora', hora );
    datos.append('servicios', idServicios);
    //Es la manera para observar que datos se están enviando a la base de datos --> console.log([...datos]);

    try {//try/catch permite asegurar que se entre a la url soportada o que deje de funcionar en caso de que exista un error en el servidor
        // Petición hacia la api
        const url = '/api/citas'
        //El método POST se utiliza para enviar datos al servidor y depende del index/public. Se puede usar también PUT para actualizar datos y DELETE para borrarlos.
        // body: datos --> Es la forma de que fetch lee los datos del FormData y así poderlos leer con $_POST, es el cuerpo de la petición que se va a mandar
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado);
        //resultado.resultado proviene del arreglo de ActiveRecord para insertar los datos, es la manera de acceder a esa llave y retorna un true o false
        //Si los datos fueron insertados correctamente en la base de datos entonces muestra un mensaje/alerta de exito
        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload(); //Se recarga la pagina para evitar que se manden datos duplicados
                }, 2000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        })
    }

    
    // console.log([...datos]);

}
