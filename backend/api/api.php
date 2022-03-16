<?php
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;

function login($id, $name, $email, $pic){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $stmt1 = $conn->prepare("SELECT COUNT(id) FROM Users WHERE id = ?");
    $stmt1->bind_param("s", $id);
    $stmt1->execute();
  
    $result = $stmt1->get_result();
    $row = $result->fetch_assoc();
  
    // User does not exist, create new user in table
    if ($row["COUNT(id)"] == 0) {
      $stmt2 = $conn->prepare("INSERT INTO Users(id, Name, Email, ProfilePic) VALUES (?, ?, ?, ?)");
      $stmt2->bind_param("ssss", $id, $name, $email, $pic);
      $stmt2->execute();
      $stmt2->close();
    }
  
    $stmt1->close();
    $conn->close();
}

function saveResume($id, $resume_id, $thumbnail, $elements, $share = 1){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    # Turn the array into a json list string for storing in database
    $elements = json_encode($elements);

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt1 = $conn->prepare("SELECT COUNT(ResumeID) FROM Resumes WHERE ResumeID = ?");
    $stmt1->bind_param("i", $resume_id);
    $stmt1->execute();
  
    $result = $stmt1->get_result();
    $row = $result->fetch_assoc();
  
    // Resume does not already exist, create new resume in table
    if ($row["COUNT(ResumeID)"] == 0) {
        $stmt2 = $conn->prepare("INSERT INTO Resumes(id, Thumbnail, Elements, Share) VALUES (?, ?, ?, ?)");
        $stmt2->bind_param("sbsi", $id, $thumbnail, $elements);
        $stmt2->execute();
        $stmt2->close();
    }
    // Resume exists, update it
    else {
        $stmt3 = $conn->prepare("UPDATE Resumes SET Thumbnail = ?, Elements = ?, Share = ? WHERE ResumeID = ?");
        $stmt3->bind_param("bsii", $thumbnail, $elements, $share, $resume_id);
        $stmt3->execute();
        $stmt3->close();
    }
}

function loadResume($id, $resume_id){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    $stmt1 = $conn->prepare("SELECT Elements, Share FROM Resumes WHERE ResumeID = ? AND id = ?");
    $stmt1->bind_param("is", $resume_id, $id);
    $stmt1->execute();
  
    $result = $stmt1->get_result();
    $data = array();

    // The resume exists in the database
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $data = array(
            "resume_id" => $resume_id,
            "elements" => json_decode($row["Elements"]), // Turn elements back into array before returning
            "share" => $row["Share"]
        );
    }
    else {
        echo "The resume does not exist";
    }

    $stmt1->close();
    return $data;
}

/**
 * $id - user's id to query
 * $others - boolean;
 * if true, get some random resume thumbnail.
 * if false, get $resume_id under user's account
 * $n is getting a random resume. We can get the nth resume in
 * some ordering to ensure that the same resume doesn't get pulled twice.
 * (e.g. when n=0, we could get the 0th most popular template, indexed by 0)
 */
function getThumbnail($id, $others, $resume_id, $n){
    
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    //This proved helpful to me
    //https://stackoverflow.com/questions/7793009/how-to-retrieve-images-from-mysql-database-and-display-in-an-html-tag

    if($others === false){
        //Query for resume associated with resume_id

        $stmt1 = $conn->prepare("SELECT Thumbnail FROM Resumes WHERE ResumeID = ? AND id = ?");
        $stmt1->bind_param("is", $resume_id, $id);
        $stmt1->execute();

        $result = $stmt1->get_result();
        $data = array();

        // The resume exists in the database
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $data = array(
                "id" => $id,
                "resume_id" => $resume_id,
                "thumbnail" => $row["Thumbnail"]
                // Image should already be encoded when retrieved from database - 
                // need to decode after getting. Change here if impl. changes.

                // $base64_image = base64_encode( $row["Thumbnail"] );
            );
        }
        $stmt1->close();

    } else {
        //Otherwise query for a random other image query

        $stmt1 = $conn->prepare("SELECT ResumeID, id, Thumbnail FROM Resumes WHERE Share = ?");
        $stmt1->bind_param("i", 1); // Share = 1 is default and will always return a result if it exists
        $stmt1->execute();

        $result = $stmt1->get_result();
        $data = array();

        // A resume was found
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $data = array(
                "id" => $id,
                "resume_id" => $resume_id,
                "thumbnail" => $row["Thumbnail"]
                // Image should already be encoded when retrieved from database - 
                // need to decode after getting. Decode here if needed.

                // $base64_image = base64_decode( $row["Thumbnail"] );
            );
        }
        $stmt1->close();
    }
    
    return $data;
}

/**
 * This function is specifically only for login authentication with jwt token from google.
 */
function verify($body){

    $jwks = ['keys' => [
        [
            'e' => 'AQAB',
            'n' => 'urIBEeEj2HvBoNipv4PcFPGbw66boVQx60hl0sK7rTLKpLZqIkorKiC2d8nDg7Zrm_uYvYBNsoQWZohEsTh3kBSs92BNnbA_Z1Ok345e8BGDKifsi6YuMtjqffIqsZs-gCWE_AxZ_9m-CfCzs5UGgad7E0qFQxlOe18ds-mHhWd3l-CgQsAYNMoII7GCxLsp5GUaPFjld5E9h5dK7LrKH311swII_rypnK6ktduKpcuMLuxcfz8oQ3Gqzp1oZ1fm9eG98adjSLl796vz5Uh-mz__YBkyD67Jibf4pqtQ07skq_Ff7KKQO32I4Yy0Dp7I0aUTYA2ff8JT0Huz2876LQ',
            'kty' => 'RSA',
            'kid' => '3dd6ca2a81dc2fea8c3642431e7e296d2d75b446',
            'use' => 'sig',
            'alg' => 'RS256'
        ],
        [
            'n' => 'rXzt9xpKC1vqbtVm-XJi2ys1_4LaiRKBhBNyUTtTBZedgJtr3XU6SSol8HEDwzAuPb3cODABr0wpNmEGFg7dcSL6QOSSb3sntvsiYqxUXIFnFpAGMEA2SzconFLdAaLNKAX1T4F1EU50v20EIZFxWdR8sZ0ClrOrixPf_TR2hRoqiyvrpEyeVxxWatae2DPTmgeTmdanPAKjspR9iF4xEpRoo2MKUGGMDDZvFJSSlL1Bd26SbXEHYvn4muOLWuaro4Va2HUPnfDXJEPPAr2Mag1sbiEMgjs0FUlfJkk_oZr8GEOny4TOlhGmJmrPCkunGj3yAmwOmDULpjRihknkpw',
            'alg' => 'RS256',
            'e' => 'AQAB',
            'use' => 'sig',
            'kid' => 'd63dbe73aad88c854de0d8d6c014c36dc25c4292',
            'kty' => 'RSA'
        ]
    ]];

    $json_body = (array)json_decode($body);
    $token = $json_body["token"];
    // $parts = explode(".",$token);
    // $header = $parts[0];
    // $payload = $parts[1];
    // $signature = $parts[2];

    $decoded;
    
    try {
        $decoded = (array) @JWT::decode($token, JWK::parseKeySet($jwks));
        return $decoded;
    } catch (Exception $e) {
        header("HTTP/1.1 400 Bad Token");
        echo $e;
        echo "Could not verify token and id";
        return null;
    }
}

/**
 * For all requests except login, a bearer token verifies identity.
 * Returns true if the token is legitimate and token is not expired.
 * Returns false if the token is illegitimate and token is not expired.
 */
function authenticate($token, $id){

    $expiration = openssl_decrypt($token, 'aes-256-ctr', $id, 0, "0000000000000000");
    if(ctype_digit($expiration)){
         $exp_int = (int)$expiration;
         if($exp_int > time()){
             return true;
         }
    }
    return false;
}

$verb = 'default';
if (isset($_SERVER['REQUEST_METHOD']) && isset($_SERVER['REQUEST_METHOD']) && isset($_SERVER['PATH_INFO'])){
    $verb = $_SERVER['REQUEST_METHOD'];
    $uri = $_SERVER['REQUEST_URI'];
    $info = $_SERVER['PATH_INFO'];

    $body = '';
    if (($stream = fopen('php://input', "r")) !== FALSE)
        $body = stream_get_contents($stream);
    
    //localhost/backend/api/api.php/login/
    if($verb === 'POST' && $info === '/login'){
        $verified = verify($body);
        if($verified === null){
            return;
        }
    
        $id = $verified["sub"];
        $name = $verified["name"];
        $email = $verified["email"];
        $pic = $verified["picture"];

        $message = time() + 10000000;
        $ciphertext = openssl_encrypt($message, 'aes-256-ctr', $id, 0,"0000000000000000");
        login($id, $name, $email, $pic);

        $data = array(
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "pic" => $pic,
            "verified_token" => $ciphertext
        );
    
        header("HTTP/1.1 200 OK");
        header("Content-Type: application/json; charset=utf-8");
        $json = json_encode($data);
        echo $json;
        return;
    }

    if($verb === 'POST' && $info === '/resume'){
        try {
            $headers = (array)apache_request_headers();
            $authorization = $headers["Authorization"];
            $token = explode(" ",$authorization)[1];
    
            $json_body = (array)json_decode($body);
            $id = $json_body["id"];
    
            if(!authenticate($token, $id)){
                echo "Invalid or expired bearer token. Please log in again.";
                return;
            }
            
            $thumbnail = $json_body["thumbnail"];
            $data = $json_body["data"];
    
            //This is necessary to save multiple resumes
            $resume_id = $data["resume_id"];
            $elements = $data["elements"];
            
            //Save to database
            saveResume($id, $resume_id, $thumbnail, $elements);
            
            echo "Successfully saved Resume";
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }

    if($verb === 'GET' && $info === '/resume'){
        $headers = (array)apache_request_headers();
        $authorization = $headers["Authorization"];
        $token = explode(" ",$authorization)[1];

        $json_body = (array)json_decode($body);
        $id = $json_body["id"];

        if(!authenticate($token, $id)){
            echo "Invalid or expired bearer token. Please log in again.";
            return;
        }

        $resume_id = $json_body["resume_id"];
        $data = loadResume($id, $resume_id);

        //Should be inverse of saveResume. Dummy data example below.
        
        /* $data = array(
            "resume_id" => "25",
            "elements" => array(
                "type" => "text",
                "offset-x" => 100,
                "offset-y" => 100,
                "width" => 100,
                "height" => 100,
                "z-index" => 1,
                "prop" => array(
                    "font-type" => "arial",
                    "font-size" => 12,
                )
            )
        );
        */
        
        header("HTTP/1.1 200 OK");
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode($data);
        return;
    }

    /**
     * This one is a bit different. Capable of returning two things:
     * 1. current user's resume thumbnails
     * 2. other people's resumes
     */
    if($verb === 'GET' && $info === '/dashboard'){
        $headers = (array)apache_request_headers();
        $authorization = $headers["Authorization"];
        $token = explode(" ",$authorization)[1];

        $json_body = (array)json_decode($body);
        $id = $json_body["id"];

        if(!authenticate($token, $id)){
            echo "Invalid or expired bearer token. Please log in again.";
            return;
        }

        $others = $json_body["others"];
        $resume_id = $json_body["resume_id"];
        $n = $json_body["n"];

        $data = getThumbnail($id, $others, $resume_id, $n);

        header("HTTP/1.1 200 OK");
        header("Content-Type: application/json; charset=utf-8");

        echo json_encode($data);
        return;
    }
    
    header("HTTP/1.1 200 OK");
    header("Content-Type: application/json; charset=utf-8");
    echo "We haven't built support for this type of request.";


} else{
    header("HTTP/1.1 400 Bad Request");
    echo "Could not properly parse request";
}

?>