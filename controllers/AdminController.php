<?php

namespace Controllers;

use Model\AdminCita;
use MVC\Router;

class AdminController {
    public static function index(Router $router) {
        iniciarSession();
        isAdmin();
        $fecha = $_GET['fecha'] ?? date('Y-m-d'); //Se obtiene la fecha actual o la fecha de la url (fecha seleccionada enel calendario)
        $fechas = explode('-', $fecha);// Se separa la fecha y se obtiene un arreglo

        //Se colocan los valores del arreglo dentro de la función (mes, dia y año respectivamente) checkdate que retorna un tru o false dependiendo de si existe o o no dicha fecha, está función sirve para evitar que se coloquen fecha que no existen en la url
        if(!checkdate( $fechas[1], $fechas[2], $fechas[0])) {
            header('Location: /404' );
        }

        //Consultar la base de datos
        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioid=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citasservicios ";
        $consulta .= " ON citasservicios.citasid=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citasservicios.serviciosid ";
        $consulta .= " WHERE fecha =  '{$fecha}' ";

        $citas = AdminCita::SQL($consulta);

        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }
}