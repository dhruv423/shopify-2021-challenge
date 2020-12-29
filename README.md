# Shopify Summer 2021 Coding Challenge
This is the coding challenge submission for my application to Shopify's Summer 2021 Internship.

## Setting up

Before using the code, you need to have the following requirements:

- Node.js
- [Cloudinary Account](https://cloudinary.com/users/register/free)
- [MongoDB Atlas Database](https://www.mongodb.com/try)

To run this app, follow these steps:

- Clone this repository `git clone https://github.com/dhruv423/shopify-2021-challenge.git`
- Install all the dependencies by running `npm install`
- Create a `.env` file in the root directory
- Add the following:
```
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster0.cpaq5.mongodb.net/<data>?retryWrites=true&w=majority
JWT_KEY=SOME_RANDOM_STRING_CAN_BE_ANYTHING
CLOUDINARY_API_KEY=XXXXXXXXX
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXX
TEST_EMAIL=XXXXX
TEST_PASSWORD=XXXXX
```
- The keys can be obtained from the respective sites once you have an account
- Once you have that set up, you can run `npm start`
- The app will be served at `localhost:3000` or whatever port you specify in the `.env` file
- You can hit the endpoints through Postman
- When MongoDB is configured correctly, the console will say `Connected to MongoDB!`


## Features
- Image storage for users
- Users can upload one or multiple images at once
- Secure storage with the use of JWT token to access image uploads


### Models
User Model is defined as follows:
```
name: String 
password: String // Hashed password
email: String
date: Date // Creation date
```

Image Model is defined as follows:
```
name: String // Name of the image
date: Date // Date when the image was uploaded
user: ObjectId of associated User
link: String // Link to the image on Cloudinary storage
public: Boolean // Public or Private, default to Private

```

### API Endpoints
1. Users can create an account by using `POST /user/register` by providing email, name, password and confirm password in the JSON body. If successful, the endpoint will return the `User` object else error will be returned.

2. Users can login with the `POST /user/login` endpoint by providing email and password in the JSON body. If successful, the endpoint will return the JWT token which you will need to access the upload endpoint. JWT token will expire after 2 hours.

3. Users can upload their images using the `POST /image/upload` endpoint. Make sure there is nothing in the header. Select body type to be form-data for the `images` key value make sure File is selected. The other keys are `isPublic` and `JWTToken`. The response will contain an object with arrays of results and error messages.

Postman Settings for API Call ![Postman Settings for API Call](readme_images/Postman-Call.png)

Success Response ![Success Response](readme_images/Success-Response.png)

Error Response ![Error Response](readme_images/Error-Response.png)

## Testing
To run end to end tests, make sure you provide a test account information that you have made in the `.env` file. To run the tests, use the following `npm test`. If you want to run the tests again make sure to clear the database on new users and new images, except test user.

![Test Results](readme_images/Testing-Result.png)


## Future Improvements

- Adding more features outlined in the [project description](https://docs.google.com/document/d/1ZKRywXQLZWOqVOHC4JkF3LqdpO3Llpfk_CkZPR8bjak/edit)

- Add scripts to take care of adding and deleting resources from the database

## Resources
- [Node.js Cloudinary](https://cloudinary.com/documentation/node_integration)
- [File uploading using Node.js](https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/)