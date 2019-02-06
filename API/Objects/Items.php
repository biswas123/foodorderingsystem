<?php

class Items{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $itemId;
    public $name;
    public $descrpition;
    public $price;
    public $available;
    public $image;    
    public $categoryId;
    public $companyId;
    
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        $query = "INSERT INTO `items` (`Name`,`Description`, `Price`,`available`, `image`, `CategoryId`, `CompanyId`) VALUES (?, ?, ?,?,?,?,?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssiisii", $this->name, $this->descrpition, $this->price, $this->available, $this->image, $this->categoryId, $this->companyId);
      
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

        $query = "SELECT i.*, c.Name AS `CategoryName` FROM `items` i JOIN `Categories` c on i.CategoryID = c.CategoryID  WHERE i.CompanyID = ? AND i.DateDeleted IS NULL ORDER BY i.Name ASC";
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

        $query = "SELECT * FROM `items` WHERE DateDeleted IS NULL AND `ItemID` = ?";
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

        $query = "UPDATE `items` SET `name` = ?, `description` = ?, `price` = ?, `available` = ?, `image` = ?, `categoryId` = ? WHERE `itemID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssiisii", $this->name, $this->description, $this->price, $this->available, $this->image, $this->categoryId, $this->itemId);
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

        $query = "UPDATE `items` SET `DateDeleted` = now() WHERE `ItemID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->itemId);
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