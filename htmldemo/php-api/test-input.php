<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
  </head>
  <body>
    <?php
        $str=trim($_POST['tt_str']);

        //write to test.txt
        $handle=fopen('test-input.txt','a');
        if($handle && $str){
          $str = stripslashes($str);
           fwrite($handle,'####:'.$str."\r\n");
        }else{
            echo 'fail to open file';
        }
   
        fclose($handle);
    ?>
    <form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">    
    
     <textarea name="tt_str"></textarea>
    
    <input type="submit" value="提交">
    
    </form
  </body>
</html>