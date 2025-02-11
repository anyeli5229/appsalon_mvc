<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function iniciarSession() {
    if(!isset($_SESSION)){
        session_start();
    }  
}

function esUltimo(string $actual, string $proximo): bool {
    if($actual !== $proximo) {
        return true;
    }
    return false;
}

//Función que verifica si el usuario está autenticado
function isauth () : void {
    if(!isset($_SESSION['login'])) {
        header('Location: /');
    }
}

function isAdmin () : void {
    if(!isset($_SESSION['admin'])) {
        header('Location: /');
    }
}