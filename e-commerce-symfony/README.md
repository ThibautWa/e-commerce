# API Reference

## users

### POST /user/add

Adds user to database

#### Request

{  
    "name" : string,  
    "lastname" : string,  
    "email": string,
    "password": string,
    "confirmPassword": string,
    "adress": string,
    "city": string,
    "postalCode": int,
}

#### Response

##### Status 200

{"status": "User succesfully added"}

##### Status 400

{"error": "Mismatched passwords!"}

{"error": "Invalid email!"}

### GET /user/:id

Gets user with :id parameter

#### Response

##### Status 200

{  
    "id":int,  
    "name": string,  
    "lastname":string,  
    "email":string,  
    "city":string,  
    "postalCode":int,  
    "adress":string,  
    "statut": int  
}

##### Status 400

{"error": "User not found!"}

### GET /users

Gets users by bundles of 10  

#### Response

##### Status 200
{  
    "links":  
    {  
        "self":string,
        "next":string,
        "previous":string,
    }  
    "data" :
    {  
        "id":int,  
        "name": string,  
        "lastname":string,  
        "email":string,  
        "city":string,  
        "postalCode":int,  
        "adress":string,  
        "statut": int,  
    }  
}  

##### Status 400

{"error": "User not found!"}

### PUT /user/update/:id

Updates user with :id  

#### Request  

{  
    "name" : string,  
    "lastname" : string,  
    "email": string,
    "password": string,
    "confirmPassword": string,
    "adress": string,
    "city": string,
    "postalCode": int,
}

#### Response

##### Status 200

{  
    "status": "User successfully updated!"  
}  

##### Status 400

{"error": "User not found!"}  

### DELETE /user/delete/:id

Deletes user with :id  

#### Response

{  
    "name" : string,  
    "lastname" : string,  
    "email": string,
    "password": string,
    "confirmPassword": string,
    "adress": string,
    "city": string,
    "postalCode": int,
}

##### Status 204

{"status": "User successfully deleted!"}  

##### Status 400

{"error": "User not found!"}  
