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
        $stmt2->bind_param("sssi", $id, $thumbnail, $elements, $share);
        $stmt2->execute();
        $stmt2->close();
    }
    // Resume exists, update it
    else {
        $stmt3 = $conn->prepare("UPDATE Resumes SET Thumbnail = ?, Elements = ?, Share = ? WHERE ResumeID = ?");
        $stmt3->bind_param("ssii", $thumbnail, $elements, $share, $resume_id);
        $stmt3->execute();
        $stmt3->close();
    }

    $stmt1->close();
    $conn->close();
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
    
    //only need ResumeID since we can load other people's shareable resumes too
    //Prior check for ownership or shareability is done.
    $stmt1 = $conn->prepare("SELECT Elements, Share FROM Resumes WHERE ResumeID = ?");
    $stmt1->bind_param("i", $resume_id);
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
        //Doesn't need header because this will still output "" along with normal header
        echo "The resume does not exist";
    }

    $stmt1->close();
    $conn->close();
    return $data;
}

function getOtherThumbnail($id, $n){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;
    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt1 = $conn->prepare("SELECT ResumeID, id, Thumbnail FROM Resumes WHERE Share = 1");
    $stmt1->execute();

    $result = $stmt1->get_result();
    $data = array();

    $counter = 0;
    //$n index by 0. If num_rows > index position, that means there is an nth row
    if ($result->num_rows > $n){
        while( $row = $result->fetch_assoc()){
            if($counter === $n){
                $data = array(
                    "id" => $row["id"],
                    "resume_id" => $row["ResumeID"],
                    "thumbnail" => $row["Thumbnail"],
                );
                break;
            }
            $counter++;
        }
    }
    else{
        //resume_id = 1 is specifically set by me for a dummy thumbnail
        $stmt2 = $conn->prepare("SELECT Thumbnail FROM Resumes Where ResumeID = 1");
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $row = $result2->fetch_assoc();
        $data = array(
            "id" => "113776533273259442553",
            "resume_id" => 1,
            "thumbnail" => $row["Thumbnail"],
        );
        $stmt2->close();
    }
    $stmt1->close();

    $conn->close();
    return $data;
}

function getResumeCount($id){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;
    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt1 = $conn->prepare("SELECT Thumbnail FROM Resumes WHERE id = ?");
    $stmt1->bind_param("s", $id);
    $stmt1->execute();

    $result = $stmt1->get_result();
    $count = $result->num_rows;

    $data = array("count" => $count);

    return $data;
}

/**
 * $id - user's id to query
 * $n is getting a random resume. We can get the nth resume in
 * some ordering to ensure that the same resume doesn't get pulled twice.
 * (e.g. when n=0, we could get the 0th most popular template, indexed by 0)
 */
function getMyThumbnail($id, $n){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;
    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt1 = $conn->prepare("SELECT ResumeID, id, Thumbnail FROM Resumes WHERE id = ?");
    $stmt1->bind_param("s", $id);
    $stmt1->execute();

    $result = $stmt1->get_result();
    $data = array();

    // The resume exists in the database
    if ($result->num_rows > $n){
        $counter = 0;
        while( $row = $result->fetch_assoc()){
            if($counter === $n){
                $data = array(
                    "id" => $row["id"],
                    "resume_id" => $row["ResumeID"],
                    "thumbnail" => $row["Thumbnail"],
                );
                break;
            }
            $counter++;
        }
    }
    else {
        echo "Queried for a resume that doesn't exist.";
    }
    $stmt1->close();

    
    $conn->close();
    return $data;
}

function changeName($id, $new_name) {
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

    // Make sure user exists
    if ($row["COUNT(id)"] > 0) {
        $stmt2 = $conn->prepare("UPDATE Users SET Name = ? WHERE id = ?");
        $stmt2->bind_param("ss", $new_name, $id);
        $stmt2->execute();
        $stmt2->close();
      }
    else {
        echo "Invalid user ID, user does not exist in the database";
    }

    $stmt1->close();
    $conn->close();
}

function deleteAccount($id) {
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt1 = $conn->prepare("DELETE FROM Users WHERE id = ?");
    $stmt1->bind_param("s", $id);
    $stmt1->execute();
    $stmt1->close();

    $stmt2 = $conn->prepare("DELETE FROM Resumes WHERE id = ?");
    $stmt2->bind_param("s", $id);
    $stmt2->execute();
    $stmt2->close();

    $conn->close();
}

function getProfileName($id){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt1 = $conn->prepare("Select COUNT(id) FROM Users WHERE id = ?");
    $stmt1->bind_param("s", $id);
    $stmt1->execute();

    $result = $stmt1->get_result();
    $row = $result->fetch_assoc();

    $data = "";

    if ($row["COUNT(id"] > 0){
        $stmt2 = $conn->prepare("SELECT Name FROM Users WHERE id = ?");
        $stmt2->bind_param("s", $id);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $row = $result2->fetch_assoc();
        $data = $row["Name"];
        $stmt2->close();
    }

    $stmt1->close();
    $conn->close();
    return $data;
}

function getProfilePic($id){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $stmt1 = $conn->prepare("Select COUNT(id) FROM Users WHERE id = ?");
    $stmt1->bind_param("s", $id);
    $stmt1->execute();

    $result = $stmt1->get_result();
    $row = $result->fetch_assoc();

    $data = "";

    if ($row["COUNT(id"] > 0){
        $stmt2 = $conn->prepare("SELECT ProfilePic FROM Users WHERE id = ?");
        $stmt2->bind_param("s", $id);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $row = $result2->fetch_assoc();
        $data = $row["ProfilePic"];
        $stmt2->close();
    }

    $stmt1->close();
    $conn->close();
    return $data;
}

function changeProfilePic($id, $image){
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

    // Make sure user exists
    if ($row["COUNT(id)"] > 0) {
        $stmt2 = $conn->prepare("UPDATE Users SET ProfilePic = ? WHERE id = ?");
        $stmt2->bind_param("ss", $image, $id);
        $stmt2->execute();
        $stmt2->close();
      }
    else {
        echo "Invalid user ID, user does not exist in the database";
    }
    $stmt1->close();
    $conn->close();
}

/**
 * This function is specifically only for login authentication with jwt token from google.
 */
function verify($body){

    $jwk_query_results = file_get_contents("https://www.googleapis.com/oauth2/v3/certs");
    $jwks = json_decode($jwk_query_results,true);

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

function isOwnerOrShareable($id, $resume_id){
    $servername = "oceanus.cse.buffalo.edu";
    $username = "msmu";
    $password = "50266948";
    $database = "cse442_2022_spring_team_r_db";
    $port = 3306;

    $conn = new mysqli($servername, $username, $password, $database, $port);
    if (mysqli_connect_error()) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    //Due to ResumeID =? AND id = ?, there is implicit check for ownership of resume
    $stmt1 = $conn->prepare("SELECT Share FROM Resumes WHERE ResumeID = ? AND id = ?");
    $stmt1->bind_param("is", $resume_id, $id);
    $stmt1->execute();
  
    $result = $stmt1->get_result();
    $data = array();

    $retval = false;

    // The resume exists in the database
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $share = $row["Share"];
        if($share === 1){
            $retval = true;
        }
    }

    $stmt1->close();
    $conn->close();
    return $retval;
}







/**
 * Using this blank space and code to separate help functions are API implementation.
 * The reason for this approach rather than using multiple files is to prevent the creation
 * of an access point from the helper file.
 */






$verb = 'default';
if (isset($_SERVER['REQUEST_METHOD']) && isset($_SERVER['REQUEST_METHOD']) && isset($_SERVER['PATH_INFO'])){
    $verb = $_SERVER['REQUEST_METHOD'];
    $uri = $_SERVER['REQUEST_URI'];
    $info = $_SERVER['PATH_INFO'];

    $body = '';
    if (($stream = fopen('php://input', "r")) !== FALSE)
        $body = stream_get_contents($stream);


    //Unique request in that it is the only one that needs separate auth
    //Since only login needs this and it's fully implmeneted, no need for documentation
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

    /**
     * Used to save a resume from resume builder.
     * The resume_id will have to match what is in the database. This means that
     * when a new resume is being created, resume_id cannot be an int > 0,
     * e.g. "resume_id": 0 will ensure there is no conflict.
     * 
     * If an old resume is being updated, then the resume_id must be the same as the
     * value given when the resume was first loaded from GET at endpoint /resume
     * 
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/resume/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553",
     * "thumbnail": "ASIHWv325g9IHSDF1345h", //Base64 Encoded Image
     * "data : {
     *          "resume_id": 1234,
     *          "share": 1,
     *          "elements": [{
     *              "type": "text",
     *              "offset-x": 100,
     *              "offset-y": 100,
     *              "width":    100,
     *              "height":   100,
     *              "z-index":  1,
     *              "prop": {"font-type": "arial", "font-size": 12}
     *          }]
     *      }
     * }
     */
    if($verb === 'POST' && $info === '/resume'){
        try {
            $headers = (array)apache_request_headers();
            $authorization = $headers["Authorization"];
            $token = explode(" ",$authorization)[1];
    
            $json_body = (array)json_decode($body, true);
            $id = $json_body["id"];
    
            if(!authenticate($token, $id)){
                header("HTTP/1.1 401 Unauthorized");
                echo "Invalid or expired bearer token. Please log in again.";
                return;
            }
            
            $thumbnail = $json_body["thumbnail"];
            $data = $json_body["data"];
    
            //This is necessary to save multiple resumes
            $resume_id = $data["resume_id"];
            $elements = $data["elements"];
            $share = $data["share"];
            
            //Save to database
            saveResume($id, $resume_id, $thumbnail, $elements, $share);
            
            header("HTTP/1.1 200 OK");
            echo "Successfully saved resume.";
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }


     /**
     * Used to load a resume for resume builder.
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_resume/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553",
     * "resume_id": 3
     * }
     */
    if($verb === 'POST' && $info === '/get_resume'){

        try {
            $headers = (array)apache_request_headers();
            $authorization = $headers["Authorization"];
            $token = explode(" ",$authorization)[1];
    
            $json_body = (array)json_decode($body);
            $id = $json_body["id"];
    
            if(!authenticate($token, $id)){
                header("HTTP/1.1 401 Unauthorized");
                echo "Invalid or expired bearer token. Please log in again.";
                return;
            }
    
            $resume_id = $json_body["resume_id"];
    
            //Should have permissions to load resume
            if(isOwnerOrShareable($id, $resume_id)){
                $data = loadResume($id, $resume_id);
            } else{
                header("HTTP/1.1 403 Forbidden");
                echo "It appears you don't have permission to load this resume.";
                return;
            }
    
            header("HTTP/1.1 200 OK");
            header("Content-Type: application/json; charset=utf-8");
            echo json_encode($data);
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }

    /**
     * Used to discover how many resumes a user has.
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_dashboard_count/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553",
     * }
     */
    if($verb === 'POST' && $info === '/get_dashboard_count'){
        try{
            $headers = (array)apache_request_headers();
            $authorization = $headers["Authorization"];
            $token = explode(" ",$authorization)[1];
    
            $json_body = (array)json_decode($body);
            $id = $json_body["id"];
    
            if(!authenticate($token, $id)){
                header("HTTP/1.1 401 Unauthorized");
                echo "Invalid or expired bearer token. Please log in again.";
                return;
            }
            $data = getResumeCount($id);
    
            header("HTTP/1.1 200 OK");
            header("Content-Type: application/json; charset=utf-8");
            echo json_encode($data);
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }

    /**
     * Used to load a single thumbnail for dashboard.
     * 
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_dashboard/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553",
     * "n": 0
     * }
     */
    if($verb === 'POST' && $info === '/get_dashboard'){
        try{
            $headers = (array)apache_request_headers();
            $authorization = $headers["Authorization"];
            $token = explode(" ",$authorization)[1];
    
            $json_body = (array)json_decode($body);
            $id = $json_body["id"];
    
            if(!authenticate($token, $id)){
                header("HTTP/1.1 401 Unauthorized");
                echo "Invalid or expired bearer token. Please log in again.";
                return;
            }

            $n = $json_body["n"];
    
            $data = getMyThumbnail($id, $n);
    
            header("HTTP/1.1 200 OK");
            header("Content-Type: application/json; charset=utf-8");
            echo json_encode($data);
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }


    /**
     * Used to load a single thumbnail for templates.
     * 
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_template/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553",
     * "n": 0
     * }
     */
    if($verb === 'POST' && $info === '/get_template'){
        try{
            $headers = (array)apache_request_headers();
            $authorization = $headers["Authorization"];
            $token = explode(" ",$authorization)[1];
    
            $json_body = (array)json_decode($body);
            $id = $json_body["id"];
    
            if(!authenticate($token, $id)){
                header("HTTP/1.1 401 Unauthorized");
                echo "Invalid or expired bearer token. Please log in again.";
                return;
            }
            $n = $json_body["n"];
    
            $data = getOtherThumbnail($id, $n);
    
            header("HTTP/1.1 200 OK");
            header("Content-Type: application/json; charset=utf-8");
            echo json_encode($data);
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }


    /**
     * Used to change the name associated with an account.
     * 
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/change_name/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553",
     * "new_name": "John Doe"
     * }
     */
    if($verb === 'POST' && $info === '/change_name'){
        try {
            $headers = (array)apache_request_headers();
            $authorization = $headers["Authorization"];
            $token = explode(" ",$authorization)[1];
    
            $json_body = (array)json_decode($body);
            $id = $json_body["id"];
    
            if(!authenticate($token, $id)){
                header("HTTP/1.1 401 Unauthorized");
                echo "Invalid or expired bearer token. Please log in again.";
                return;
            }

            $id = $json_body["id"]; //redundant but ok
            $new_name = $json_body["new_name"];
            
            // Change name in database
            changeName($id, $new_name);
            
            header("HTTP/1.1 200 OK");
            echo "Successfully changed name";
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }

    /**
     * Used to delete all information for a certain account.
     * 
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/del_acc/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553"
     * }
     */
    if($verb === 'POST' && $info === '/del_acc'){
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

            $id = $json_body["id"];
            
            // Delete account and associated data from database
            deleteAccount($id);
            
            header("HTTP/1.1 200 OK");
            echo "Successfully deleted the account and all user data";
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }

    /**
     * Used to get user profile picture and profile name.
     * 
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_profile_info/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9Mz0Q=="
     * }
     * body: {
     * "id": "113776533273259442553"
     * }
     */
    if($verb === 'POST' & $info === '/get_profile_info'){
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
            $data = array(
                "profile_picture" => getProfilePic($id),
                "profile_name" => getProfileName($id)
            );
            
            header("HTTP/1.1 200 OK");
            echo "Successfully updated profile picture";
            echo json_encode($data);
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }


    /**
     * Used to change user profile picture.
     * 
     * Expected query example:
     * 
     * verb: POST
     * url: https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/profile_pic/
     * headers: {
     * "Authorization": "Bearer 4FR039z4c9MzOQ=="
     * }
     * body: {
     * "id": "113776533273259442553"
     * "image": "VIU0Q349H4Q3GH0U984HGIUH=="
     * }
     */
    if($verb === 'POST' && $info === '/profile_pic'){
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

            $image = $json_body["image"];
            changeProfilePic($id, $image);
            
            header("HTTP/1.1 200 OK");
            echo "Successfully updated profile picture";
            return;
        } catch (Exception $e) {
            header("HTTP/1.1 400 Malformed Request");
            echo $e;
            echo "Something in the request was not formatted as expected.";
            return;
        }
    }

    
    header("HTTP/1.1 200 OK");
    header("Content-Type: application/json; charset=utf-8");
    echo "We haven't built support for this type of request.";


} else{
    header("HTTP/1.1 400 Bad Request");
    echo "Could not properly parse request";
}

?>