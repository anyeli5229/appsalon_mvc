<?php

namespace Model;

class CitaServicio extends ACtiveRecord {
    //Base de datos
    protected static $tabla = 'citasservicios';
    protected static $columnasDB = ['id', 'citasid', 'serviciosid'];

    public $id;
    public $citasid;
    public $serviciosid;
    

    public function __construct ($args=[]) {
        $this->id = $args['id'] ?? null;
        $this->citasid = $args['citasid'] ?? '';
        $this->serviciosid = $args['serviciosid'] ?? null;
    }
}