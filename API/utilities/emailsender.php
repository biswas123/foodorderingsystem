<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require '../../vendor/autoload.php';

class EmailSender {

    private $recepients = array();
    private $email_type = "";

    public function __construct($to, $email_type){
        $this->recepients = $to;
        $this->email_type = $email_type;
    }

    public function sendEmail() {
        
        $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
        try {
            //Server settings
            $mail->SMTPDebug = 0;                                 // Enable verbose debug output
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = 'biswas.khayargoli@gmail.com';                 // SMTP username
            $mail->Password = 'enigma1!';                           // SMTP password
            $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 587;                                    // TCP port to connect to

            //Recipients
            $mail->setFrom('biswas.khayargoli@example.com', 'Mailer');

            foreach ($this->recepients as $address) {
                $mail->AddAddress($address); 
            }
            //Content
            $mail->isHTML(true);                                  // Set email format to HTML

            switch ($this->email_type) {
                case "account_created":
                    $mail->Subject = 'Account created!';
                    $mail->Body    = 'Welcome, please complete your registration by clicking on the link below:';
                break;
                default:
            }
           
            $mail->send();
        } catch (Exception $e) {
            echo json_encode(array("Message" => "Message could not be sent. Mailer Error:". $mail->ErrorInfo, "Status" => "500"));
        }
    }
    
}
?>