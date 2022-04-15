A guide to the current available api calls:

- [Login](#login)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/login/
    - Body: 
        - "token": string
    - Returns:
        - "id": string
        - "name": string
        - "email": string
        - "pic": URL string (maybe should switch to Base64?)
        - "verified_token": string

<br>

- [Load Resume](#load-resume)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_resume/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
        - "resume_id": int
    - Returns:
        - "resume_id": int
        - "share": boolean (int 0 or 1)
        - "elements": JSON

<br>

- [Save Resume](#save-resume)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/resume/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
        - "thumbnail": Base64 String
        - "data": JSON
    - Returns:
        - "Succesfully saved resume."

<br>

- [Get Dashboard Count](#get-dashboard-count)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_dashboard_count/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
    - Returns:
        - "count": int

<br>

- [Get Dashboard Thumbnail](#get-dashboard-thumbnail)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_dashboard/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
        - "n": int
    - Returns:
        - "id": string
        - "resume_id": int
        - "thumbnail": Base64 string

<br>

- [Get Template Thumbnail](#get-template-thumbnail)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_template/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
        - "n": int
    - Returns:
        - "id": string
        - "resume_id": int
        - "thumbnail": Base64 string

<br>

- [Change Name](#change-name)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/change_name/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
        - "new_name": string
    - Returns:
        - "Successfully changed name"

<br>

- [Delete Account](#delete-account)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/del_acc/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
    - Returns:
        - "Successfully deleted the account and all user data"

<br>

- [Get Profile Info](#get-profile-info)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/profile_pic/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
    - Returns:
        - "profile_picture": Base64 string
        - "profile_name": string

<br>

- [Change Profile Picture](#change-profile-picture)
    - POST
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/profile_pic/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
        - "image": Base64 string
    - Returns:
        - "Successfully updated profile picture"

---

# Login

Sign in with Google button will produce a jwt token after sign in. Pass this jwt token to the login api to verify it. User account is created and some preliminary data is saved in the database, and user id, name, email, Google profile picture, and a bearer token is returned. Bearer token and user id will be required for all future api calls for verification.

# Load Resume

When a resume is selected, we want to open up an editable resume. This query gets the required data. We need the user id as well as the resume id. The API checks to see if the user owns the resume or if the owner of the resume set the resume to be shareable. If either is true, then the resume returns the resume_id, it's shareability property (1 or 0), and an array of elements in JSON. The element JSON will vary depending on the element, but will generally resemble:
```
"elements": [
    {"type": "text",
    "offset-x": 100,
    "offset-y": 100,
    "width":    100,
    "height":   100,
    "z-index":  1,
    "content": "HelloWorld",
    "prop": {"font-type": "arial", "font-size": 12}},
    {element 2},
    {element 3},
    {"type": "image",
    "offset-x": 100,
    "offset-y": 100,
    "width":    100,
    "height":   100,
    "z-index":  1,
    "content": Base64 string,
    "prop": {}} (Currently don't use or need this, but in case we need it later)
    ...
    ]
```

# Save Resume

Upon saving, the frontend must store the user id and take a screenshot of what the current resume looks like for the thumbnail. This image must be converted to Base64 string to be placed in the JSON body.

Then, the resume and its elements must be saved in the following format:

```
"data : {
    "resume_id": 1234,
    "share": 1,
    "elements": [{
    "type": "text",
    "offset-x": 100,
    "offset-y": 100,
    "width":    100,
    "height":   100,
    "content": "HelloWorld",
    "z-index":  1,
    "prop": {"font-type": "arial", "font-size": 12}}
    {element 2},
    {element 3},
    {"type": "image",
    "offset-x": 100,
    "offset-y": 100,
    "width":    100,
    "height":   100,
    "z-index":  1,
    "content": Base64 string,
    "prop": {}} (Currently don't use or need this, but in case we need it later)
    ...
    ]
}
```

# Get Dashboard Count

First, we have to know how many resumes a user has. This allows the front end to generate as many thumbnail slots as resumes. This will then be used to query for each image.

# Get Dashboard Thumbnail

We retrieve the user's $n^{th}$ resume thumbnail (indexed by 0). The reason we do one at a time is to not make an overly large JSON string for the encodings of each thumbnail.

# Get Template Thumbnail

We retrieve the $n^{th}$ shareable resume thumbnail (indexed by 0). For now, this uses the default ordering of MySQL, but we can reorder by date, popularity, etc. in the future.

# Change Name

Self explanatory I think.

# Delete Account

Self explanatory I think.

# Get Profile Info

Returns a json with profile information. The format is a JSON for the profile picture and profile name. This is combined since they are only ever needed together. Could also use this if you need one of the variables in the future.

# Change Profile Picture

More or less self-explanatory. Only concern is to make sure that the image being sent is processed on the frontend so that the API receives a Base64 encoded image that it can just store as a string.