<?php
Class Connection{
	/* Database connection start */
	private  $servername = "localhost";
	private  $username = "root";
	private  $password = "";
	private  $dbname = "foodordersystem";
	private  $conn;


	function getConnection() {
		$conn = mysqli_connect($this->servername, $this->username, $this->password, $this->dbname);
		if (!$conn) {
			die("Connection failed: " . $conn->connect_error);
		} else {
			$this->conn = $conn;
		}
		return $this->conn;
	}
}

?>