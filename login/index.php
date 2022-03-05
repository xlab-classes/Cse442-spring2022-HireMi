<?php
if (isset($_COOKIE["name"]) and 
    isset($_COOKIE["id"]) and 
    isset($_COOKIE["pic"]) and
    isset($_COOKIE["email"]))
{
  echo $_COOKIE["name"];

  // query to database to check for user and either
  // create a user or retrieve their information.

  $servername = "oceanus.cse.buffalo.edu";
  $username = "********";
  $password = "********";
  $database = "cse442_2022_spring_team_r_db";
  $port = 3306;

  // Create db connection
  $conn = new mysqli($servername, $username, $password);

  // Check db connection
  if (mysqli_connect_error()) {
    die("Connection failed: " . mysqli_connect_error());
  }

  // prepare and bind statement checking existence of user
  $stmt1 = $conn->prepare("SELECT COUNT(id) FROM Users WHERE id = ?");
  $stmt1->bind_param("s", $_COOKIE["id"]);
  $stmt1->execute();

  $result = $stmt1->get_result();
  $row = $result->fetch_assoc();

  // User does not exist, create new user in table
  if ($row["COUNT(id)"] == 0) {
    $stmt2 = $conn->prepare("INSERT INTO Users(id, Name, Email, ProfilePic) VALUES (?, ?, ?, ?)");
    $stmt2->bind_param("ssss", $_COOKIE["id"], $_COOKIE["name"], $_COOKIE["email"], $_COOKIE["pic"]);
    $stmt2->execute();
    $stmt2->close();
  }

  $stmt1->close();
  $conn->close();

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

    <div id="g_id_onload"
     data-client_id="515535950425-qkoa6f2on1o99chdj02nqqqu5e4kln8c.apps.googleusercontent.com"
     data-context="signup"
     data-ux_mode="popup"
     data-callback="handleCredentialResponse"
     data-auto_prompt="false">
    </div>

    <script>

        function handleCredentialResponse(response) {
           // decodeJwtResponse() is a custom function defined by you
           // to decode the credential response.

           const payloadBase64 = response.credential.split('.')[1];
           const payload = atob(payloadBase64);

           const responsePayload = JSON.parse(payload)
           const expirationDate = new Date(new Date().getTime()+(14*24*60*60*1000));

           document.cookie = `name=${responsePayload.name}; path=/; expires=${expirationDate}`;
           document.cookie = `id=${responsePayload.sub}; path=/; expires=${expirationDate}`;
           document.cookie = `pic=${responsePayload.picture}; path=/; expires=${expirationDate}`;
           document.cookie = `email=${responsePayload.email}; path=/; expires=${expirationDate}`;

           window.location.reload()
        }
      </script>

    <!-- <div id="g_id_onload"
     data-client_id="515535950425-qkoa6f2on1o99chdj02nqqqu5e4kln8c.apps.googleusercontent.com"
     data-context="signup"
     data-ux_mode="popup"
     data-login_uri="https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/login/index.html"
     data-auto_prompt="false">
    </div> -->

    <div class="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left">
    </div>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    
  </body>
</html>