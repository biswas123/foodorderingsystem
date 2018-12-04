<?php

class Items{
 
    // database connection and table name
    private $conn;
    private $table_name = "items";
 
    // object properties
    public $id;
    public $name;
    public $description;
    public $price;
    public $category_id;
    public $category_name;
    public $created;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        // query to insert record
        $query = "INSERT INTO `items` (`Name`) VALUES ('$this->name');";
                             
        if (mysqli_query($conn,$query)) {
            mysqli_close($conn);

            return true;
        } else {
            mysqli_close($conn);

            return false;
        }
                 
    }
    
}

?>