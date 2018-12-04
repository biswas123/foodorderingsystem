<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 

// include database and object files
include_once '../Config/Connection.php';
include_once '../Objects/Items.php';
 
// instantiate database 
$connection = new Connection();
$db = $connection->getConnection();
 
// initialize object
$items = new Items($db);
 
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name)) {

    $items->name = $data->name;
    if($items->create()){
        http_response_code(200);
        echo json_encode(array("Success"));
    } else{
        http_response_code(500);
        echo json_encode(array("Error"));
    }
}

?>