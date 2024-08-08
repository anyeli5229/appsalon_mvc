<?php 

namespace Controllers;
use Model\Usuario;
use MVC\Router;
use Classes\Email;

class LoginController {
    public static function login(Router $router) {
        $alertas = [];
        //Si el método es POST
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();

            if(empty($alertas)) {
                //Comprobar que exista el usuario
                $usuario = Usuario::where('email' , $auth->email);
                
                if($usuario) {
                    //Verificar password
                    if($usuario->comprobarPasswordAndVerificado($auth->password)) {
                        //Autenticar usuario
                        session_start();
                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre ." " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;
                       
                        //Rediccionamiento
                        if($usuario->admin === "1") {
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location: /admin');
                        } else {
                            header('Location: /cita');
                        }

                    }
                } else {
                    Usuario::setAlerta('error', 'Usuario no encontrado');
                }
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/login', [
            'alertas' => $alertas,
        ]);
    }

    public static function logout() {
        iniciarSession();
        $_SESSION = [];
        header('Location: /');
    }

 
    public static function olvide(Router $router) {
         $alertas = [];
         //Si el método es POST
         if($_SERVER['REQUEST_METHOD'] === 'POST') {
             //Crear una nueva instancia de Usuario con los datos del POST
             $auth = new Usuario($_POST);

             //Las alertas van a ir tomando el resultado de la función validarEmail la cual toma el valor de un string dependiendo del campo que se encuentre vacío en el formulario (post)
             $alertas = $auth->validarEmail();

             if(empty($alertas)) {
                 //Verificar el email en la base de datos
                 $usuario = Usuario::where('email', $auth->email);
                 //Verificar al usuario y que se encuentre confirmado
                 if($usuario && $usuario->confirmado === "1") {
                     //Generar token
                     $usuario->crearToken();
                     $usuario->guardar();
                     //Enviar email de recuperación
                     $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                     $email->enviarInstrucciones();
                
                     //Mostrar mensaje de éxito
                     Usuario::setAlerta('exito', 'Te hemos enviado un email a '. $usuario->email.' para recuperar tu contraseña');
                 } else {
                 //El usuario no existe o no se encuentra confirmado
                     Usuario::setAlerta('error', 'El usuario no se encuentra registrado o no está confirmado');
                 }
             }
         } 

         $alertas = Usuario::getAlertas();  
         $router->render('auth/olvide-password',[
             'alertas' => $alertas,
         ]);
     }
    


    public static function recuperar(Router $router) {

        $alertas  = [];
        $error = false;

        $token =s($_GET['token']);
        //Buscar usuario por su token
        $usuario = Usuario::where('token', $token);
        
        if(empty($usuario)) {
            //Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token no válido');
            $error = true;
        }
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
          //Leer password y guardarlo
          $password = new Usuario($_POST);
          $alertas = $password->validarPassword();

          if(empty($alertas)) {
            $usuario->password = null;
            $usuario->password = $password->password;
            $usuario->hashPassword();
            $usuario->token = null;

            $resultado = $usuario->guardar();
            if($resultado) {
                header('Location: /');
            }

          }


        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/recuperar-password', [
            'alertas' => $alertas,
            'error' => $error
        ]);
    }

    public static function crear(Router $router) {
        //Instancia de usuario (datos vacios)
        $usuario = new Usuario;

        //Alertas vacías
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            //Va iterando y sincronizando los valores que hay en la instancia de Usuario con los valores del post
            $usuario->sincronizar($_POST);
            //Las alertas van a ir tomando el resultado de la función validarNuevaCuenta la cual toma el valor de un string dependiendo del campo que se encuentre vacío en el fromulario (post)
            $alertas = $usuario->validarNuevaCuenta();

            //Revisar que las cuentas estén vacías
            if(empty($alertas)) {
                //Verificar que el usuario no este verificado
                $resultado = $usuario->usuarioExistente();
                //Si existe un objeto en num_rows retornado en la variable $resultado desde el modelo de Usuario entonces se genera una nueva variable de $alertas (la cual se pasa a la vista) en donde se instancia el modelo de Usuario con la función de getAlertas y así manda el mensaje de error a la vista 
                if($resultado->num_rows) {
                    //Usuario ya está registrado
                    $alertas = Usuario::getAlertas();
                } else {
                    //El usuario no está registrado, etnonces se crea uno
                    //Hashear password
                    $usuario->hashPassword();
                    //Generar token único
                    $usuario->crearToken();
                    //Enviar email de confirmación
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->enviarConfirmacion();
                    
                    //Crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado) {
                        header('Location: /mensaje');
                    }
                }
                
            }
        }
        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas,
        ]);
    }

    public static function mensaje(Router $router) {
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router) {
        $alertas = [];
        $token = s($_GET['token']);
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            //Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token no válido');
        } else {
            //Modificar a usuario confirmado
            $usuario->confirmado = 1;
            $usuario->token = '';
            $usuario->actualizar();
            //Mostrar mensaje de éxito
            Usuario::setAlerta('exito', 'Cuenta confirmada correctamente');
        }
        //Obtener alertas
        $alertas = Usuario::getAlertas();
        //Renderizar las vistas
        $router->render('auth/confirmar-cuenta',[
            'alertas' => $alertas
        ]);
    }
}
