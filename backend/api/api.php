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
    
    header("HTTP/1.1 200 OK");
    header("Content-Type: application/json; charset=utf-8");
    echo "We haven't built support for this type of request.";


} else{
    header("HTTP/1.1 400 Bad Request");
    echo "Could not properly parse request";
}

?>