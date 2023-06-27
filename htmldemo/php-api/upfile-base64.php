<?php
header('content-type:text/html;charset=utf-8');
//json头
header("Content-type: application/json");
//跨域
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
$myfile=$_POST['file'];
//print_r($myfile);
//exit;
$newimg=base64_decode($myfile);
$a = file_put_contents('./test.jpg', $newimg);//返回的是字节数
echo '{"name":"/test.jpg"}';
exit;
?>