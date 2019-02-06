<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}"); exit(0); 
}
    

// include database and object files
include_once '../config/connection.php';
include_once '../objects/items.php';
 
// instantiate database 
$connection = new Connection();
$db = $connection->getConnection();
 
// initialize object
$Items = new Items($db);
 
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->itemId)){

    $Items->itemId = $data->itemId; 
    if($returnVal = $Items->read_one()){
        http_response_code(200);
        echo json_encode(array("Message" => $returnVal, "Status" => "200"));
    } else{
        http_response_code(500);
        echo json_encode(array("Message" => "Error", "Status" => "500"));
    }
    
} else {
    
    http_response_code(403);
    echo json_encode(array("Message" => "Insufficient or wrong parameters.", "Status" => "403"));

}

?>