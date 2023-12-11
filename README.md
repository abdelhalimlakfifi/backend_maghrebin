# backend_maghrebin

=> In app.js:
Start the Express server and listen on the specified port.

=> In routes/authRoutes.js:
Define an Express router.
Create a POST route /login that maps to the loginUser function in the authController.

=> In controllers/authController.js:
Define the loginUser function for user login.
Extract username and password from the request.
Check if the username and password are valid.
If valid, create a JWT token and return it along with the user's role.

=> In config/passport.js:
Configure Passport with a JWT authentication strategy.
Use the JWT token and a secret key to authenticate users.

=> In middleware/authenticate.js:
Define a middleware authenticateToken to authenticate users with a JWT token.
Check if the user is authenticated and set req.user.

=> In middleware/authorization.js:
Define two authorization middlewares: authorizeAdmin and authorizeUser.
Check the user's role and allow access if it matches the required role (admin or user).
Return Error if the user's role does not match.

# Project Structure:
``` 
├── config\
│   ├── db.js\
│   └── passport.js\
├── controllers\
│   ├── backoffice\
│   │   ├── admin.controller.js\
│   │   ├── authController.js\
│   │   ├── categorie.controller.js\
|   |   └── ...\
│   ├── frontoffice
│   │   ├── customer.controller.js
│   │   ├── order.controller.js
|   |   └── ...
├── middleware
│   ├── backoffice
│   │   └── permissions.middleware.js
│   ├── frontoffice
│   │   ├── authMiddleware.js
│   │   ├── customer.Middleware.js
|   |   └── ...
├── models
│   ├── cartModel.js
│   ├── categorie.model.js
│   ├── color.model.js
|   └── ...
├── routes
│   ├── backoffice
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categorie.route.js
|   |   └── ...
│   ├── frontoffice
│   │   ├── customer.route.js
│   │   ├── order.route.js
│   │   └── wishList.route.js
├── seeder
│   ├── permission.seeder.js
│   ├── product.seeder.js
│   └── user.seeder.js
├── utils
│   ├── email
│   │   └── templates
│   │       └── requestActivateAccount.handlebars
│   ├── sendEmail.js
│   ├── 500.js
│   └── uploadFile.js
├── .gitignore
├── README.md
├── app.js
├── package-lock.json
└── package.json
```

## Overview

This project follows a modular structure to ensure clarity and maintainability. Here's a brief explanation of the main directories:

- **config:** Configuration files, including database setup and Passport.js configuration.
- **controllers:** Business logic, organized by backoffice and frontoffice.
- **middleware:** Middleware functions for both backoffice and frontoffice.
- **models:** Database models for MongoDB.
- **routes:** API routes, organized by backoffice and frontoffice.
- **seeder:** Seeder scripts for populating the database with initial data.
- **utils:** Utility functions, including email templates and file upload handling.
- **.gitignore:** Specifies files and directories to be ignored by version control.
- **README.md:** Documentation for the backend architecture.
- **app.js:** Main entry point for the application.
- **package-lock.json:** Automatically generated file to lock dependencies versions.
- **package.json:** Configuration file for Node.js project, including dependencies and scripts.

Feel free to adjust the structure and content based on your specific project requirements.

