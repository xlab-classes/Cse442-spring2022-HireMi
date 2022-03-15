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

    $conn = new mysqli($servername, $username, $password, $database);
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

function saveResume($id, $resume_name, $thumbnail, $elements){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    //TODO: ASIF HELP IDK WHAT I'M DOING
    //I'm not really certain if the resumes are saved in the same table as user accounts or what
    //Also, I haven't implemented a "share: bool" value, but you can store a dummy true if you want.
}

function loadResume($id, $resume_name){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }
    //TODO: ASIF HELP
}

/**
 * $id - user's id to query
 * $others - boolean;
 * if true, get some random resume thumbnail.
 * if false, get $resume_name under user's account
 * $n is getting a random resume. We can get the nth resume in
 * some ordering to ensure that the same resume doesn't get pulled twice.
 * (e.g. when n=0, we could get the 0th most popular template, indexed by 0)
 */
function getThumbnail($id, $others, $resume_name, $n){
    
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    //TODO: ASIF HELP

    //This proved helpful to me
    //https://stackoverflow.com/questions/7793009/how-to-retrieve-images-from-mysql-database-and-display-in-an-html-tag

    if($others === false){
        //Query for resume associate with resume_name
        //$owner_id = $id;
        //$owner_resume_name = $resume_name;
        //$image_data = 
    }
    //Otherwise query for a random other image query 
    //For now maybe do nth oldest thumbnail?
    //$owner_id = 
    //$owner_resume_name =
    //$image_data = 

    $base64_image = base64_encode( $image_data );
    $data = array(
        "id" => $owner_id,
        "name" => $owner_resume_name,
        "image" => $base64_image,
    );

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
            $resume_name = $data["name"];
            $elements = $data["elements"];
            
            //Save to database
            saveResume($id, $resume_name, $thumbnail, $elements);
            
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

        $resume_name = $json_body["name"];
        // $data = loadResume($id, $resume_name);

        //TODO: ASIF load resume needs to be implemented.
        //Should be inverse of saveResume. Dummy data example below.
        
        $data = array(
            "name" => "dummyData",
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
        $resume_name = $json_body["name"];
        $n = $json_body["n"];

        //TODO: ASIF getThumbnail() needs to be implemented.
        $data = getThumbnail($id, $others, $resume_name, $n);

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