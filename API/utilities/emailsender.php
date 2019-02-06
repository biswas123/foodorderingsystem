<?php
  
    function send_email($to, $email_type) {
        
        if($email_type == 'new-user'){
            $subject = "New user activation";
         
            $message = "<b>Please follow the link below to finalize registration:</b>";
            
            $retval = mail ($to,"Success","Send mail from localhost using PHP");
            
            if( $retval == true ) {
               echo "Message sent successfully...";
            }else {
               echo "Message could not be sent...";
            }
        }

    }
  
      
?>
      