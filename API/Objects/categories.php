<?php

class Categories{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $categoryId;
    public $name;
    public $description;
    public $companyId;
    public $image;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        
        $conn = $this->conn;
        $query = "INSERT INTO `categories` (`Name`, `Description`, `CompanyId`, `Image`, `Available`) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssisi", $this->name, $this->description, $this->companyId, $this->image, $this->available);
      
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

        $query = "SELECT * FROM `categories` WHERE `CompanyID` = ? AND DateDeleted IS NULL ORDER BY `Name` ASC";
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

        $query = "SELECT * FROM `categories` WHERE DateDeleted IS NULL AND `categoryID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->categoryId);
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

        $query = "UPDATE `categories` SET `Name` = ?, `Description` = ?, `Image` = ?, `Available` = ? WHERE`categoryID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssisi", $this->name, $this->description,  $this->image,  $this->available, $this->categoryId);
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

        $query = "UPDATE `categories` SET `DateDeleted` = now() WHERE`categoryID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->categoryId);
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