<?php

class Orders{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $orderId;
    public $orderDateTime;
    public $customerId;
    public $companyId;
    public $deliveryId;
    public $orderstatusId;    
    
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        $query = "INSERT INTO `orders` (`OrderDateTime`, `CustomerID`,`CompanyID`, `DeliveryID`, `OrderStatusID`) VALUES (?, ?, ? ,? , ? )";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("siiii", $this->orderDateTime, $this->customerId, $this->companyId, $this->deliveryId, $this->orderstatusId);
      
        if ($stmt->execute()) {
            $stmt->close();
            return true;
        } else {
            echo $stmt->error;
            //TODO : LOG into table
            $stmt->close();
            return false;
        }
                 
    }

    public function read(){
        
        $conn = $this->conn;
        $returnArr = array();

        $query = "SELECT * FROM `orders`  WHERE `CompanyID` = ? AND DateDeleted IS NULL ORDER BY `Name` ASC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->companyId);
        $stmt->execute();
        $result = $stmt->get_result();

        $num = $result->num_rows;
        if ($num > 0 ) {
            $returnArr = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return json_encode($returnArr);
        } else {
            $stmt -> close();
            return json_encode($returnArr);
        }
    }

    public function read_one(){
        
        $conn = $this->conn;
        $returnArr = array();

        $query = "SELECT * FROM `orders` WHERE DateDeleted IS NULL AND `OrderID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->itemId);
        $stmt->execute();
        $result = $stmt->get_result();

        $num = $result->num_rows;
        if ($num > 0 ) {
            $returnArr = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return json_encode($returnArr);
        } else {
            $stmt -> close();
            return json_encode($returnArr);
        }
    }

    public function update() {
        $conn = $this->conn;
        $returnArr = array();

        $query = "UPDATE `orders` SET `OrderDateTime` = ?, `CustomerId` = ?, `CompanyId` = ?, `DeliveryId` = ?, `OrderStatusID` = ? WHERE `OrderID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("siiiii", $this->orderDateTime, $this->customerId, $this->companyId, $this->deliveryId, $this->orderstatusId, $this->orderId);
        $stmt->execute();
        $num  = $stmt->affected_rows;

        if ($num > 0 ) {
            $stmt->close();
            return true;
        } else {
            $stmt -> close();
            return false;
        }
    }

    public function delete(){
        $conn = $this->conn;
        $returnArr = array();

        $query = "UPDATE `orders` SET `DateDeleted` = now() WHERE `OrderID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->orderId);
        $stmt->execute();
        $num  = $stmt->affected_rows;

        if ($num > 0 ) {
            $stmt->close();
            return true;
        } else {
            $stmt -> close();
            return false;
        }
    }
    
}

?>