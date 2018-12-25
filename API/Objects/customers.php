<?php

class Customers{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $customerId;
    public $name;
    public $email;
    public $address;
    public $phonenumber;
    public $image;
    public $companyId;
    
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        $query = "INSERT INTO `customers` (`Name`,`Email`, `Address`, `PhoneNumber`,`Image`, `CompanyID`) VALUES (?, ?, ?, ?, ? , ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssssi", $this->name, $this->email, $this->address, $this->phonenumber, $this->image, $this->companyId);
      
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

        $query = "SELECT * FROM `customers`  WHERE `CompanyID` = ? AND DateDeleted IS NULL ORDER BY `Name` ASC";
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

        $query = "SELECT * FROM `customers` WHERE DateDeleted IS NULL AND `CustomerID` = ?";
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

        $query = "UPDATE `customers` SET `Name` = ?, `Email` = ?, `Address` = ?, `PhoneNumber` = ?, `Image`= ? WHERE `CustomerID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssssi", $this->name, $this->email, $this->address, $this->phonenumber, $this->image, $this->customerId);
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

        $query = "UPDATE `customers` SET `DateDeleted` = now() WHERE `CustomerID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->customerId);
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