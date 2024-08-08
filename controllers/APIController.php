<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function guardar() {
        
        // Almacena la Cita y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();
        $id = $resultado['id'];
        // Almacena la Cita y los servicios

        // Almacena los Servicios con el ID de la Cita
        // explode convierte un string a un arreglo
        $idServicios = explode(",", $_POST['servicios']); //toma el separador (",") y los datos a separar ($_POST['servicios'])
        // Se itera sobre los valores del arreglo creado con explode
        foreach($idServicios as $idServicio) {
             $args = [
                'citasid' => $id,
                'serviciosid' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
         }
         //Se retorna una respuesta
         echo json_encode(['resultado' => $resultado]);
    }

    public static function eliminar() {
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }

}