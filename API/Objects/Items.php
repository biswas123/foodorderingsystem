<?php

class Items{
 
    // database connection and table name
    private $conn;
    private $table_name = "items";
 
    // object properties
    public $id;
    public $name;
    public $categoryId;
    public $companyId;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        // query to insert record
        $query = "INSERT INTO `items` (`Name`, `CategoryId`, `CompanyId`) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sii", $this->name, $this->categoryId, $this->companyId);
      
        //fetching result would go here, but will be covered later
        if ($stmt->execute() or die(mysqli_error($conn))) {
            $stmt->close();
            return true;
        } else {
            $stmt->close();
            return false;
        }
                 
    }
    
}

?>