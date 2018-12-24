<?php

class Employees{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $employeeId;
    public $username;
    public $password;
    public $roleId;
    public $companyId;
    
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        $query = "INSERT INTO `employees` (`UserName`,`Password`, `RoleID`, `CompanyID`) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssii", $this->username, $this->password, $this->roleId, $this->companyId);
      
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

        $query = "SELECT * FROM `employees`  WHERE `CompanyID` = ? AND DateDeleted IS NULL ORDER BY `UserName` ASC";
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

        $query = "SELECT * FROM `employees` WHERE DateDeleted IS NULL AND `EmployeeID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->employeeId);
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

        $query = "UPDATE `employees` SET `UserName` = ?, `Password` = ?, `RoleId` = ? WHERE `EmployeeID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssii", $this->username, $this->password, $this->roleId, $this->employeeId);
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

        $query = "UPDATE `employees` SET `DateDeleted` = now() WHERE`EmployeeID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->employeeId);
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