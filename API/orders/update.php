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
include_once '../objects/orders.php';
 
// instantiate database 
$connection = new Connection();
$db = $connection->getConnection();
 
// initialize object
$Orders = new Orders($db);
 
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->orderstatusId) && !empty($data->orderId)  && !empty($data->orderDateTime) && !empty($data->companyId) && !empty($data->customerId) && !empty($data->deliveryId) && !empty($data->orderStatusId)){
    $Orders->orderId = $data->orderId;
    $Orders->orderDateTime = $data->orderDateTime;
    $Orders->customerId = $data->customerId;
    $Orders->companyId = $data->companyId;
    $Orders->deliveryId = $data->deliveryId;
    $Orders->orderstatusId = $data->orderstatusId;
    

    if($returnVal = $Orders->update()){
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