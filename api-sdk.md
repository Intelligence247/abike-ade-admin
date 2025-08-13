
 Sandbox
 API Docs
 Logout
INTRODUCTION
Welcome to AbikeAde API Documentation
Welcome to the AbikeAde API documentation! Our API provides a comprehensive and flexible way to interact with the AbikeAde platform.

Key Features
Easy Integration: Clear and concise endpoints that simplify the integration process.
Comprehensive Documentation: Detailed descriptions of endpoints, parameters, responses, and error messages.
Scalability: Robust and scalable API designed to handle high traffic and large datasets.
Security: Secure endpoints with authentication to ensure your data is protected.
API Setup - SDK Installation
To get started with using the API, first, you'll need to install the abikeade-sdk module.
This module (written in pure javascript) provides pre-written classes and methods that will make the integration easy and organized.
To install using npm,

  
    npm i abikeade-sdk
  
If you prefer inline javascript, you can include the module using the following script url:

  
    <script src="https://api.abikeadecourt.com/static/sdk/abikeade-sdk.js"></script>
  
API Setup - Import/Initialization
If you're using the npm package, you can import the Admin (for admin API), Staff (for staff API), and Student (for student API) classes using the following:

  
    import { Admin, Client } from 'abikeadecourt-sdk';

    // initialize selected class/classes
    const admin = new Admin();
    const client = new Client();

    // now the constants can now be used to call different methods of the API
    // e.g to get student profile
    client.account.getProfile()

    // to get client list
    const data = await admin.user.userList()
  
NOTE: most API methods require tokens to be already set (after login) before calling them

If you're using the inline JS module, you can initialize the Admin and Client classes using the following:

  
          
    // initialize selected class/classes
    const admin = new abikeadeSDK.Admin();
    const client = new abikeadeSDK.Client();
          
    // now the constants can now be used to call different methods of the API
    // e.g to get student profile
    client.account.getProfile()

    // to get client list
    const data = await admin.user.userList()

  
Parameters and Responses
Each endpoint description includes the required and optional parameters, along with detailed information about the expected responses.
This ensures you have all the information you need to integrate our API into your frontend seamlessly.

An example of parameters usually involve fetching a list of items or fetching information about a specific item

NOTE: parameters are passed in form of javascript objects using the params keyword

  
    // Fetching users with optional parameters

    const data = await admin.user.userList({
      params: {
        page : 1,
        per_page : 20,
        sort_by : "first_name"
      }
    })

    // Fetching a single student

    const data = await admin.user.userList({
      params: {
        student_id : 1
      }
    })

          
  
Success & Error Handling
The API methods allow for success and error handling.
By default, the API metnods return the data object (if success, which can be stored in a variable as demonstrated in previous example) and throws an error (in case of error).
to handle success/error response manually, you can include the onSuccess and/or onError keyword as part of optional parameters (just like the params keyword).
These keywords takes a callback function with the data object (for success) or error message (for error) as arguments

NOTE: If you are passing the success/error handling, you do not need to store the method in a variable or use async/await

  
    // Fetching user list with success/error handling
          
    admin.user.userList({
      params: { page: 1 },
      onSuccess: (data) => console.log(data),
      onError: (err) => console.error(err),
    })     
  
API Sections
The API sections are divided as follows with their corresponding endpoints and functions:

Admin Sections
Admin Account
Site API
Happy coding! 😀