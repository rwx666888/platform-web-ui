<?php
header('content-type:text/html;charset=utf-8');
//json头
header("Content-type: application/json");
//跨域
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
//CORS
/*header("Access-Control-Request-Methods:GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Headers:x-requested-with,content-type');*/
echo '{
                "state": 1,
                "path": "https://www.baidu.com/img/bd_logo1.png",
                "fileName": "bd_logo1.png",
                "uploaded": 1,
                "url": "https://www.baidu.com/img/bd_logo1.png"
            }';
?>