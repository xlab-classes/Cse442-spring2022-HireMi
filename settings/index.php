<?php
if (isset($_COOKIE["name"]) and 
    isset($_COOKIE["id"]) and 
    isset($_COOKIE["pic"]) and
    isset($_COOKIE["email"]))
{
  echo $_COOKIE["name"];
  echo $_COOKIE["id"];
  echo $_COOKIE["pic"];
  echo $_COOKIE["email"];

}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="Hire-Mi Frontend Application"
      content="Web site created using create-react-app"
    />
    <title>HireMi</title>
  </head>
  <body>
    <header>
      <?php include '../frontend/public/nav.php'; ?>
    </header>
    <div id="root"></div>
    
  </body>
</html>