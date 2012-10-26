<?php
 // open file
   $fd = fopen("post.txt", "a");
   $str = "[" . date("Y/m/d h:i:s", time()) . "] " . serialize($_POST);
   // write string
   fwrite($fd, $str . "\n");
   // close file
   fclose($fd);
?>