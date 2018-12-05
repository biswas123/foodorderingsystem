<?php

class Categories{
 
    // database connection and table name
    private $conn;
    private $table_name = "categories";
 
    // object properties
    public $id;
    public $name;
    public $description;
    public $companyId;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        // query to insert record
        $query = "INSERT INTO `categories` (`Name`, `Description`, `CompanyId`) VALUES ('$this->name', '$this->description', '$this->companyId');";
                             
        if (mysqli_query($conn,$query) or die(mysqli_error($conn))) {
            mysqli_close($conn);
            return true;
        } else {
            mysqli_close($conn);
            return false;
        }
                 
    }
    
}

?>