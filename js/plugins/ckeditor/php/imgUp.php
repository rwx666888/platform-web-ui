<?php
$myfile=$_FILES['upload'];
//返回信息
$re=array('uploaded'=>1,'url'=>'https://www.baidu.com/img/bd_logo1.png','state'=>1,'path'=>'https://www.baidu.com/img/bd_logo1.png');
echo json_encode($re);
?>