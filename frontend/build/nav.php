<!DOCTYPE html>
<html>
    <head>
        <script src="https://kit.fontawesome.com/3fa4fe1c6a.js" crossorigin="anonymous"></script>
        <style>
            .profile {
                max-width: 100%;
                max-height: 100%;
            }
            .nav-bar {
                background-color: #0000ff;
                display: flex;
                justify-content: space-between;
                height: 50px;
                border-style: solid;
                /* border-bottom: 1px solid; */
            }
            .dropbtn {
                background-color: #ffffff;
                height: 100%;
            }
            .dropdown {
                position: relative;
                display: inline-block;
            }
            .dropdown-content {
                display: none;
                position: absolute;
                right: 0;
                background-color: #ffff00;
                z-index: 1;
            }
            .dropdown-content a{
                color: black;
                padding: 8px 12px;
                text-decoration: none;
                white-space: nowrap;
                overflow: hidden;
                display: block;
            }
            .dropdown:hover .dropbtn {background-color: #ff0000}
            .dropdown:hover .dropdown-content {display: block;}
            .dropdown-content a:hover {background-color: #00ff00}
        </style>
    </head>
    <body>


    <div class="nav-bar">
        <div class="profile">
            <img src="<?php echo (isset($_COOKIE["pic"])) ? $_COOKIE["pic"] : './lemonade.jpg'; ?>" style="max-height: 100%">
            <p style="float:right; padding-left: 10px"><?php echo (isset($_COOKIE["name"])) ? $_COOKIE["name"] : 'Anonymous'; ?></p>
        </div>
        <div class="dropdown">
            <button class="dropbtn"><i class="fa-solid fa-list-ul fa-2x"></i></button>
            <div class="dropdown-content">
                <a href="/index.php">Resume Builder</a>
                <a href="/dashboard/">Dashboard</a>
                <a href="/login/">Login</a>
                <a href="/others/">Other Templates</a>
                <a href="/settings">Settings</a>
            </div>
        </div>
    </div>

</body>
</html>