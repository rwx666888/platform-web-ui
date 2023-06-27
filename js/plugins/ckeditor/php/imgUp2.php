<?php
$myfile=$_FILES['upload'];
$enum=$_GET['CKEditorFuncNum'];
//返回信息
echo '<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction("'.$enum.'","../js/plugins/ckeditor/php/11.jpg");</script>';
?>