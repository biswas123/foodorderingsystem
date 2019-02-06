<?php

class OrderItems{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $itemId;
    public $orderId;
    public $quantity;
    
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $conn = $this->conn;
        $query = "INSERT INTO `orders_items` (`OrderID`,`ItemID`, `Quantity`) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iii", $this->orderId, $this->itemId, $this->quantity);
      
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

        $query = "SELECT * FROM `order_items`  WHERE `OrderID` = ? AND DateDeleted IS NULL";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $this->orderId);
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
}

?>