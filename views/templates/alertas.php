<?php 
    foreach($alertas as $key => $mensajes):
        foreach ($mensajes as $mensaje):
?>

    <div class="alerta <?php echo $key; ?>">
        <?php echo $mensaje; ?>
    </div>

<?php 
        endforeach;
    endforeach;
?>

<!-- Se itera sobre las alertas (el arreglo principal) donde el valor de $key es el arreglo de ["error"] y el valor de $mensajes es el segundo arreglo con el string de los mensajes en la función de validarNuevaCuenta y se vuelve a iterar y el valor de $mensaje toma el valor solo el valor del arreglo con el string de error
 Primer iteracion ambos son arreglos, segunda iteracion el primero es un arreglo y el segundo ya es un string -->