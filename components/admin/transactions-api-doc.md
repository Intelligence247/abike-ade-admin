(GET  Get Transaction List/Single Item
Method	GET
Function	admin.transaction.transactionList()
Parameters
Parameter Name	Value Type	Description
sort_by	String	Optional; sorting method (default is "-date"; options are "date, -date, expiration_date, -expiration_date"
NOTE: Options with the "-" sign signifies descending order
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
search	String	Optional; search string is matched against transaction reference
status	String	Optional; if filtering by status. available options are (pending, success, refunded, failed, reversed)
reference	String	Optional; if fetching a single transaction, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.transaction.transactionList({
      params: { status: "success" }
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.transaction.transactionList({
      params: { reference: "THECOURT_12345678943566596" }
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "data fetched successfully",
      "data": [
          {
              "id": 2,
              "reference": "THECOURT_12345678943566596",
              "description": "House rent",
              "duration": 12,
              "amount": 230000,
              "status": "Successful",
              "date": "2024-07-25",
              "expiration_date": "2025-07-25",
              "receipt": null,
              "student": {
                  "id": 1,
                  "first_name": "Enny",
                  "last_name": "WhizzyDoc",
                  "email": "hassanridwan2536@gmail.com",
                  "phone_number": "",
                  "image": null
              },
              "room": {
                  "id": 2,
                  "title": "Room 2",
                  "thumbnail": "/media/room/thumbnails/bch.png",
                  "available": false,
                  "price": "230000.00",
                  "features": ""
              }
          },
          {
              "id": 1,
              "reference": "THECOURT_12345678909876543",
              "description": "Payment for Rent",
              "duration": 12,
              "amount": 150000,
              "status": "Successful",
              "date": null,
              "expiration_date": null,
              "receipt": "/media/receipts/04754/DOC-20240206-WA0007..xlsx",
              "student": {
                  "id": 1,
                  "first_name": "Enny",
                  "last_name": "WhizzyDoc",
                  "email": "hassanridwan2536@gmail.com",
                  "phone_number": "",
                  "image": null
              },
              "room": {
                  "id": 1,
                  "title": "Room 1",
                  "thumbnail": "/media/room/thumbnails/cofee.png",
                  "available": true,
                  "price": "150000.00",
                  "features": ""
              }
          }
      ],
      "page_number": 1,
      "list_per_page": 20,
      "total_pages": 1,
      "total_items": 2,
      "search_query": ""
    }
      
    
    // for a single transaction
    {
      "status": "success",
      "message": "data fetched successfully",
      "data": {
          "id": 2,
          "reference": "THECOURT_12345678943566596",
          "description": "House rent",
          "duration": 12,
          "amount": 230000,
          "status": "Successful",
          "date": "2024-07-25",
          "expiration_date": "2025-07-25",
          "receipt": null,
          "student": {
              "id": 1,
              "first_name": "Enny",
              "last_name": "WhizzyDoc",
              "email": "hassanridwan2536@gmail.com",
              "phone_number": "",
              "image": null
          },
          "room": {
              "id": 2,
              "title": "Room 2",
              "thumbnail": "/media/room/thumbnails/bch.png",
              "available": false,
              "price": "230000.00",
              "features": ""
          }
      }
    }

Response

error



    // invalid reference
    {
      "status": "error",
      "message": "Invalid transaction reference"
    }
      // server error
    {
      "status": "error",
      "message": "Error occured: {error details}"
    }
)

(GET  Get Refund List/Single Item
Method	GET
Function	admin.transaction.refundList()
Parameters
Parameter Name	Value Type	Description
sort_by	String	Optional; sorting method (default is "-date"; options are "date, -date, amount, -amount"
NOTE: Options with the "-" sign signifies descending order
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
search	String	Optional; search string is matched against reference and description
status	String	Optional; if filtering by status. available options are (pending, success, failed, reversed)
reference	String	Optional; if fetching a single refund transaction, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.transaction.refundList({
      params: { status: "success" }
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.transaction.transactionList({
      params: { reference: "trf-12345678943566596" }
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "data": [],
      "message": "refund list retrieved",
      "page_number": 1,
      "list_per_page": 30,
      "total_pages": 0,
      "total_items": 0,
      "search_query": ""
    }
Response

error



    // invalid reference
    {
      "status": "error",
      "message": "Invalid reference"
    }
      // server error
    {
      "status": "error",
      "message": "Error occured: {error details}"
    }
)



 (


POST  Initiate Refund
Method	POST
Function	admin.transaction.initiateRefund()
Parameters
Parameter Name	Value Type	Description
amount	Integer	Required; Amount must not be less than ₦100
account_number	String	Required; Recipient account number
account_name	String	Required; Recipient account name (use the verify account details API to get account name)
bank_code	String	Required; bank code of recipient bank used in verification (not bank_id)
reference	String	Required; reference of transaction to be refunded
Request

Direct Function


    // ensure the account you're making transfer to belongs to the student by checking the student info

    let formData = {
      account_number: "7011978058",
      bank_code: "999992",
      account_name: "RIDWAN ENIOLA HASSAN",
      amount: 100000,
      reference: "THECOURT_346056285692386537895"
    }

    admin.transaction.initiateRefund({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })



Response

success


    {
      "status": "success",
      "message": "Refund initiated successfully",
      "data": {
          "reference": "trf-2025080406574068524",
          "transaction": {
              "reference": "THECOURT_12345678943566596",
              "amount": 230000,
              "status": "Successful",
              "date": "2024-07-25"
          },
          "description": "Rent refund for Room 2 assigned to Enny WhizzyDoc",
          "amount": 100000,
          "date": "2025-08-04",
          "receipt": null,
          "status": "unpaid",
          "details": {
              "destination_account_number": "7011978058",
              "destination_account_name": "RIDWAN ENIOLA HASSAN",
              "destination_bank_name": "OPay Digital Services Limited (OPay)",
              "recipient_code": "RCP_kj5zwoyx6iby5hy",
              "amount": 100000
          }
      }
    }

 Logout
AbikeAde Admin API
Site
Admin Account
Gallery
Rooms
Users
Paystack
Transactions
Messages/Broadcast/Notifications
GET  Get Transaction List/Single Item

GET  Get Refund List/Single Item

POST  Initiate Refund
Method	POST
Function	admin.transaction.initiateRefund()
Parameters
Parameter Name	Value Type	Description
amount	Integer	Required; Amount must not be less than ₦100
account_number	String	Required; Recipient account number
account_name	String	Required; Recipient account name (use the verify account details API to get account name)
bank_code	String	Required; bank code of recipient bank used in verification (not bank_id)
reference	String	Required; reference of transaction to be refunded
Request

Direct Function


    // ensure the account you're making transfer to belongs to the student by checking the student info

    let formData = {
      account_number: "7011978058",
      bank_code: "999992",
      account_name: "RIDWAN ENIOLA HASSAN",
      amount: 100000,
      reference: "THECOURT_346056285692386537895"
    }

    admin.transaction.initiateRefund({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })



Response

error



    // invalid reference
    {
      "status": "error",
      "message": "Invalid transaction reference"
    }
      // invalid bank code
    {
      "status": "error",
      "message": "Invalid bank code provided"
    }
      // unsuccessful transaction
    {
      "status": "error",
      "message": "Refund cannot be made on unsuccessful transactions"
    }
      // amount error
    {
      "status": "error",
      "message": "Refund amount cannot be greater than rent amount"
    }
      // expired rent
    {
      "status": "error",
      "message": "Refund cannot be made on expired rent"
    }
      // low amount
    {
      "status": "error",
      "message": "Amount cannot be less than 100."
    }
      // server error
    {
      "status": "error",
      "message": "Error occured: {error details}"
    }

POST  Make Refund Transfer
Method	POST
Function	admin.transaction.makeTransfer()
Parameters
Parameter Name	Value Type	Description
reference	String	Required; reference of refund transaction initiated (usually has the format "trf-xxxxxxxxxxxxxxxxx")
password	String	Required; Admin login password (for authorization)
Request

Direct Function


    let formData = {
      reference: "trf-2025080406574068524",
      password: "password123"
    }

    admin.transaction.makeTransfer({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })



Response

success


    {
      'status': "success",
      "message": "Your refund request is being processed. Kindly  check your refund history to see the status"
    }

Response

error



    // invalid reference
    {
      "status": "error",
      "message": "Invalid transfer reference"
    }
      // invalid password
    {
      "status": "error",
      "message": "Invalid password"
    }
      // incorrect password
    {
      "status": "error",
      "message": "Incorrect password"
    }
      // paystack account inactivation
    {
      "status": "error",
      "message": "You cannot initiate third party payouts at this time"
    }
      // server error
    {
      "status": "error",
      "message": "Error occured: {error details}"
    }
)
)
