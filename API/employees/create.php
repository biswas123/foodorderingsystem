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
include_once '../objects/employees.php';
 
// instantiate database 
$connection = new Connection();
$db = $connection->getConnection();
 
// initialize object
$Employees = new Employees($db);
 
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) &&  !empty($data->roleId) && !empty($data->companyId) && !empty($data->email)) {

    $Employees->username = $data->username;
    //$Employees->password = password_hash($data->password, PASSWORD_DEFAULT);
    $Employees->roleId = $data->roleId;
    $Employees->companyId = $data->companyId;
    $Employees->firstname = $data->firstname;
    $Employees->lastname = $data->lastname;
    $Employees->contactnumber = $data->contactnumber;
    $Employees->address = $data->address;
    $Employees->email = $data->email;
    
    
    if ($Employees->create()) {
        http_response_code(200);
        echo json_encode(array("Message" => "Success", "Status" => "200"));
    } else {
        http_response_code(500);
        echo json_encode(array("Message" => "Error", "Status" => "500"));
    }

} else {
    
    http_response_code(403);
    echo json_encode(array("Message" => "Insufficient or wrong parameters.", "Status" => "403"));

}

?>