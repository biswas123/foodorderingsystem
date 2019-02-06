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
include_once '../objects/companysettings.php';
 
// instantiate database 
$connection = new Connection();
$db = $connection->getConnection();
 
// initialize object
$CompanySettings = new CompanySettings($db);
 
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->settingId)){

    $CompanySettings->settingId = $data->settingId; 
    if($returnVal = $CompanySettings->read_one()){
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