<?php

class Deliveries{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $deliveryId;
    public $deliveryDate;
    public $deliveryTime;
    public $deliveryAddressId;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        
        $conn = $this->conn;
        $query = "INSERT INTO `deliveries` (`deliveryDate`, `deliveryTime`, `deliveryAddressId`) VALUES (?, ?, ?) ";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssi", $this->deliveryDate, $this->deliveryTime, $this->deliveryAddressId);
      
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

        $query = "SELECT * FROM `deliveries` WHERE  DateDeleted IS NULL";
        $stmt = $conn->prepare($query);
       // $stmt->bind_param("i", $this->customerId);
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

        $query = "SELECT * FROM `deliveries` WHERE DateDeleted IS NULL AND `DeliveryId` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->deliveryId);
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

        $query = "UPDATE `deliveries` SET `deliveryDate` = ?, `deliveryTime` = ?, `deliveryAddressId` = ? WHERE `DeliveryId` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssii", $this->deliveryDate, $this->deliveryTime, $this->deliveryAddressId, $this->deliveryId);
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

        $query = "UPDATE `deliveries` SET `DateDeleted` = now() WHERE `DeliveryId` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->deliveryId);
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