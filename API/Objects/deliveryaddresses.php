<?php

class DeliveryAddresses{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $deliveryAddressId;
    public $name;
    public $description;
    public $latitude;
    public $longitude;
    public $customerId;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        
        $conn = $this->conn;
        $query = "INSERT INTO `deliveryaddress` (`Name`, `Description`, `Latitude`, `Longitude`, `CustomerId`) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssi", $this->name, $this->description, $this->latitude, $this->longitude, $this->customerId);
      
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

        $query = "SELECT * FROM `deliveryaddress` WHERE `CustomerID` = ? AND DateDeleted IS NULL ORDER BY `Name` ASC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->customerId);
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

        $query = "SELECT * FROM `deliveryaddress` WHERE DateDeleted IS NULL AND `CustomerId` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->customerId);
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

        $query = "UPDATE `deliveryaddress` SET `Name` = ?, `Description` = ?, `latitude` = ?, `longitude` = ? WHERE `DeliveryAddressId` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssi", $this->name, $this->description, $this->latitude, $this->longitude, $this->deliveryAddressId);
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

        $query = "UPDATE `deliveryaddress` SET `DateDeleted` = now() WHERE `DeliveryAddressID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->deliveryAddressId);
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