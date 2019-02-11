<?php

include_once '../utilities/emailsender.php';
class Employees{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $employeeId;
    public $username;
    public $password;
    public $roleId;
    public $companyId;
    public $firstname;
    public $lastname;
    public $contactnumber;
    public $address;
    
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        $query = "INSERT INTO `employees` (`UserName`, `FirstName`, `LastName`, `ContactNumber`, `Address`, `Email`, `RoleID`, `CompanyID`) VALUES (?, ?, ?, ?, ?, ?, ? ,? )";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssssii", $this->username, $this->firstname, $this->lastname, $this->contactnumber, $this->address, $this->email, $this->roleId, $this->companyId);
      
        if ($stmt->execute()) {
           
            $email_query = "SELECT `Email` FROM `employees` WHERE `EmployeeID`= LAST_INSERT_ID()";
            $email_stmt = $conn->prepare($email_query);
            $email_stmt->execute();
            $rs = $email_stmt->get_result();            
            $rows = mysqli_fetch_assoc($rs);
            
            $recepients = array($rows['Email']);
            $emailSender = new EmailSender($recepients, 'account_created');
            $emailSender->sendEmail();

            $email_stmt->close();
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

        $query = "SELECT e.EmployeeID, e.UserName, e.FirstName, e.LastName, e.ContactNumber,  e.Address, e.Email, r.Name AS `RoleName` FROM `employees` e JOIN `roles` r ON e.RoleID = r.RoleID  WHERE e.CompanyID = ? AND e.DateDeleted IS NULL ORDER BY e.UserName ASC";
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

        $query = "SELECT `EmployeeID`, `UserName`, `FirstName`, `LastName`, `ContactNumber`, `Address`, `RoleID`, `Email` FROM `employees` WHERE DateDeleted IS NULL AND `EmployeeID` = ?";
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

        $query = "UPDATE `employees` SET `UserName` = ?, `FirstName` =? , `LastName` = ?, `ContactNumber` = ?, `Address` = ?, `Email` = ?, `RoleId` = ? WHERE `EmployeeID` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssssii", $this->username, $this->firstname, $this->lastname, $this->contactnumber, $this->address, $this->email, $this->roleId, $this->employeeId);
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