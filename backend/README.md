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
    - GET
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/resume/
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

- [Load Dashboard/Thumbnails](#load-dashboard-thumbnails)
    - GET
    - https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/dashboard/
    - Header:
        - "Authorization": "Bearer ABCDEFGHIJ=="
    - Body:
        - "id": string
        - "others": boolean
        - "resume_id": int
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
    "prop": {"font-type": "arial", "font-size": 12}},
    {element 2},
    {element 3},
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
    "z-index":  1,
    "prop": {"font-type": "arial", "font-size": 12}
    }]
}
```

# Load Dashboard Thumbnails

The dashboard must load multiple thumbnails of different resumes from both the user and from templates.

To accomplish this, we include the "others" and "n" variable.

The API will only respond with 1 image at a time for each API call. This means that every resume "slot" that must show a thumbnail in the dashboard page must make a separate GET request.

"others" is a boolean: \
When "others" is true, get a thumbnail from templates i.e. another user's resume. \
When "others" is false, get the thumbnail that is specified by resume_id.

This means that if "others" = true, resume_id is not used to query and you can just place any integer like 1 as the value.

"n" is used as an index. As mentioned previously, the API can only retrieve one image at a time. So to prevent the API from sending the same resume twice, we use "n" as an index.

For example:
Imagine there is room to display 4 resumes on the dashboard.
```
[ 0 ]   [ 1 ]   [ 2 ]   [ 3 ]
```
To prevent overlap, \
slot 0 would send "n":0, \
slot 1 would send "n":1, \
slot 2 would send "n":2, \
slot 3 would send "n":3

And so on until every slot has requested a thumbnail. The API will query the database for shareable resumes, then use a TBD sort method (for now it's just whatever the default sort is when we query Share=1). For example, if we sort by resume_id. Slot 0 would get resume_id=1, Slot 1 would get resume_id=2, and so on.

Since we don't have many resumes yet, there is a possibility of less shareable thumbnails than slots in dashboard. In this case, the rest are filled by a dummy thumbnail value.

# Change Name

Self explanatory I think.

# Delete Account

Self explanatory I think.

# Change Profile Picture

More or less self-explanatory. Only concern is to make sure that the image being sent is processed on the frontend so that the API receives a Base64 encoded image that it can just store as a string.