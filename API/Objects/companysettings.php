<?php

class CompanySettings{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $settingId;
    public $name;
    public $value;
    public $companyId;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        
        $conn = $this->conn;
        $query = "INSERT INTO `companysettings` (`Name`, `Value`, `CompanyId`) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssi", $this->name, $this->value, $this->companyId);
      
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

        $query = "SELECT * FROM `companysettings` WHERE `CompanyID` = ? AND DateDeleted IS NULL ORDER BY `Name` ASC";
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

        $query = "SELECT * FROM `companysettings` WHERE DateDeleted IS NULL AND `SettingID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->settingId);
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

        $query = "UPDATE `companysettings` SET `name` = ?, `value` = ? WHERE`SettingID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssi", $this->name, $this->value, $this->settingId);
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

        $query = "UPDATE `companysettings` SET `DateDeleted` = now() WHERE`SettingID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->settingId);
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