<?php

namespace Model;

class Usuario extends ActiveRecord {
    //Base de datos
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'confirmado', 'token'];

    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    //Constructor
    public function __construct($args = []){
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre']?? '';
        $this->apellido = $args['apellido']?? '';
        $this->email = $args['email']?? '';
        $this->password = $args['password']?? '';
        $this->telefono = $args['telefono']?? '';
        $this->admin = $args['admin']?? 0;
        $this->confirmado = $args['confirmado']?? 0;
        $this->token = $args['token']?? '';
    }

    //Mensajes de validación para la creación de una cuenta
    public function validarNuevaCuenta() {
        if(!$this->nombre) {
            //Se le agregan dos arreglos uno con un string de error y otro vacío que toma el mensaje
            self::$alertas['error'][] = 'El nombre del usuario es obligatorio';
        }
        if(!$this->apellido) {
            self::$alertas['error'][] = 'El apellido del usuario es obligatorio';
        }
        if(!$this->email) {
            self::$alertas['error'][] = 'El email del usuario es obligatorio';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'El password del usuario es obligatorio';
        }else if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }
        return self::$alertas;
    }

    public function validarLogin() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El email es Obligatorio';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password es Obligatorio';
        } else if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }

        return self::$alertas;
    }

    public function validarEmail() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El email es Obligatorio';
        }
        return self::$alertas;
    }

    public function validarPassword() {
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password es Obligatorio';
        } else if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }
        return self::$alertas;
    }
    //Revisa si el usuario ya existe
    public function usuarioExistente() {
        //Consulta SQL para verificar si el email ya está en uso
        $query = " SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";
        //Ejecutar la consulta
        $resultado = self::$db->query($query);
        //Si hay resultados, eso significa que el email ya está en uso y se agrega un mensaje de error
        if($resultado->num_rows) {
            self::$alertas['error'][] = 'El usuario ya se encuentra registrado';
        }
        return $resultado;
    }

    public function hashPassword() {
        $this->password = password_hash( $this->password, PASSWORD_BCRYPT);
    }
    
    public function crearToken() {
        $this->token = uniqid();
    }

    public function comprobarPasswordAndVerificado($password) {
        $resultado = password_verify($password, $this->password);
        //debuguear($resultado);
        if(!$resultado || !$this->confirmado) {
            self::$alertas['error'][] = 'El password no coincide o el usuario aún no ha confirmado su cuenta';
        } else {
            return true;
        }
    }

    
}

