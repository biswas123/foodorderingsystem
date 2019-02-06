<?php

class Login
{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $username;
    public $password;
    public $companyId;
    private $passwordHash;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function authenticate(){
        
        $conn = $this->conn;
        $returnArr = array();

        $query = "SELECT `PasswordHash` FROM `employees` WHERE `UserName` = ?  AND DateDeleted IS NULL AND `companyID` = ? LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $this->username, $this->companyId);
        $stmt->execute();
        $result = $stmt->get_result();

        $num = $result->num_rows;
        if ($num > 0 ) {
            $row = $result->fetch_assoc();
            $this->passwordHash = $row["PasswordHash"];
            if(isset($this->passwordHash) && password_verify($this->password, $this->passwordHash)){
                $stmt->close(); 
                return true;
            }else{
                $stmt->close();
                return false;
            }

        } else {
            $stmt -> close();
            return false;
        }
    }
}

?>