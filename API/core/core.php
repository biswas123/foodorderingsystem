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
include_once '../objects/orders.php';
include_once '../objects/deliveries.php';
include_once '../objects/order_items.php';
include_once '../objects/login.php';
 
// instantiate database 
$connection = new Connection();
$db = $connection->getConnection();
  
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->call)) {

    switch ($data->call) {
        case 'create_orders':
            create_orders($data);
        break;

        case 'login' :
            login($data);
        break;

    }

} else {
    
    http_response_code(403);
    echo json_encode(array("Message" => "Insufficient or wrong parameters.", "Status" => "403"));

}


function login($data) {

    if(!empty($data->username) && !empty($data->password)){
    
        global $db; 

        $Login = new Login($db);
        $Login->username = $data->username;
        $Login->password = $data->password;
        $Login->companyId = $data->companyId;

        
        if ($returnVal = $Login->authenticate()) {
            http_response_code(200);
            echo json_encode(array("Message" => "Success", "Status" => "200"));
        } else {
            http_response_code(500);
            echo json_encode(array("Message" => "Error", "Status" => "500"));
        } 

     }else {
        http_response_code(403);
        echo json_encode(array("Message" => "Insufficient or wrong parameters.", "Status" => "403"));
    } 

}


function create_orders($data) {
    
    if (!empty($data->deliveryDate) 
        && !empty($data->deliveryTime)
        && !empty($data->deliveryAddressId)
        && !empty($data->orderDateTime) 
        && !empty($data->customerId)
        && !empty($data->companyId)
        && !empty($data->items)) {

        // initialize object
        global $db;
        $Orders = new Orders($db);
        $Deliveries = new Deliveries($db);
        $OrderItems = new OrderItems($db);

        $Deliveries->deliveryDate = $data->deliveryDate;
        $Deliveries->deliveryTime = $data->deliveryTime;
        $Deliveries->deliveryAddressId = $data->deliveryAddressId;
        
        $Orders->orderDateTime = $data->orderDateTime;
        $Orders->customerId = $data->customerId;
        $Orders->companyId = $data->companyId;
        
        $Orders->orderstatusId = $data->orderstatusId ?? 1;
        
        $items = json_decode(json_encode($data->items), true);


        if ($Deliveries->create()) {   
            $Orders->deliveryId = mysqli_insert_id($db);

            if ($Orders->create()) {
                $orderId =  mysqli_insert_id($db);
                foreach($items as $item) {
                    $OrderItems->orderId = $orderId;
  
  
                    $OrderItems->itemId = $item['itemId'];
                    $OrderItems->quantity = $item['quantity'];
                    $OrderItems->create();
                }
                http_response_code(200);
                echo json_encode(array("Message" => "Success", "Status" => "200"));
            } else {
                http_response_code(500);
                echo json_encode(array("Message" => "Error", "Status" => "500"));
            }
        } else {
            http_response_code(500);
            echo json_encode(array("Message" => "Error", "Status" => "500"));
        }

    } else {
        http_response_code(403);
        echo json_encode(array("Message" => "Insufficient or wrong parameters.", "Status" => "403"));
    }

}

?>