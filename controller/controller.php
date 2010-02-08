<?php
$ajax = array();

if ($o_login != '' && $pass != '') {
   $whattodo = 'login';
}

$params['id_usuario'] = $_SESSION['id_usuario'];
$params['id_tipo_usuario'] = $_SESSION['id_tipo_usuario'];


switch ($whattodo) {

   case 'save_myounf' :
      require './controller/save_myounf.php';
   break;

   default:
      unset($_SESSION['working'][1]);
      //$_SESSION['whattodo'] = 'login';
      fetch_login_page ();
   break;

}
?>
