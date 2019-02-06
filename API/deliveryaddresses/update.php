<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 

// include database and object files
include_once '../config/connection.php';
include_once '../objects/deliveryaddresses.php';
 
// instantiate database 
$connection = new Connection();
$db = $connection->getConnection();
 
// initialize object
$DeliveryAddresses = new DeliveryAddresses($db);
 
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->deliveryAddressId) && !empty($data->name)  && !empty($data->customerId) && !empty($data->latitude) && !empty($data->longitude)){
    
    $DeliveryAddresses->deliveryAddressId = $data->deliveryAddressId;
    $DeliveryAddresses->name = $data->name;
    $DeliveryAddresses->description = $data->description  ?? NULL;
    $DeliveryAddresses->latitude = $data->latitude;
    $DeliveryAddresses->longitude = $data->longitude;
    $DeliveryAddresses->customerId = $data->customerId;

    if($returnVal = $DeliveryAddresses->update()){
        http_response_code(200);
        echo json_encode(array("Message" => "Success", "Status" => "200"));
    } else{
        http_response_code(500);
        echo json_encode(array("Message" => "Error", "Status" => "500"));
    }
    
} else {
    
    http_response_code(403);
    echo json_encode(array("Message" => "Insufficient or wrong parameters.", "Status" => "403"));

}

?>