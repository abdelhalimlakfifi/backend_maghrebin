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
