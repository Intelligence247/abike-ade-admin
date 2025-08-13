GET  Get Site Info
Method	GET
Function	admin.site.siteInfo()
Parameters
Parameter Name	Value Type	Description
Request

Direct Function


    // make request
    admin.site.siteInfo({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "data fetched successfully",
      "data": {
          "id": 1,
          "title": "The  Court",
          "email": "abikeadecourt@gmail.com",
          "phone_number": "",
          "address": "",
          "logo": "/media/logo/logo_HHNq3mX.png",
          "agreement": null,
          "facebook": "",
          "whatsapp": "",
          "instagram": ""
      }
    }


POST  Update Site Info
Method	POST
Function	admin.site.updateSite()
Parameters
Parameter Name	Value Type	Description
email	String	Optional; Updated site email
phone_number	String	Optional, Phone number
address	String	Optional; Hostel Address
facebook	String	Optional; Facebook page URL
whatsapp	String	Optional; Whatsapp URL
instagram	String	Optional; Instagram page URL
Request

Direct Function


    let formData = {
      "email": "updated@gmail.com",
      "address": "7, Allen Avenue"
    }

    // make request
    admin.site.updateSite({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "site updated successfully"
    }



POST  Admin Login Authentication
Method	POST
Function	admin.account.login()
Parameters
Parameter Name	Value Type	Description
username	String	Required
password	String	Required
Request

Direct Function


    var formData = {
        "username": "Admin",
        "password": "password123"
    }

    // make request
    admin.account.login({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Login successful"
    }


POST  Forgot Password
Method	POST
Function	admin.account.forgotPassword()
Parameters
Parameter Name	Value Type	Description
email	String	Required; Registered email
Request

Direct Function


    var formData = {
        "email": "admin@gmail.com"
    }

    // make request
    admin.account.forgotPassword({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Password reset instructions has been sent to your email"
    }


GET  Get Admin Profile
Method	GET
Function	admin.account.getProfile()
Parameters
Parameter Name	Value Type	Description
Request

Direct Function


    // make request
    admin.account.getProfile({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "data fetched successfully",
      "data": {
          "first_name": "The Court",
          "last_name": "Hostels",
          "email": "admin@gmail.com"
      }
    }


POST  Admin Logout
Method	POST
Function	admin.account.logout()
Parameters
Parameter Name	Value Type	Description
Request

Direct Function



    // make request
    admin.account.logout({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Logout successful"
    }


GET  Check Login Status
Method	GET
Function	admin.account.loginStatus()
Parameters
Parameter Name	Value Type	Description
Request

Direct Function


    // make request
    admin.account.loginStatus({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    // if logged in
    {
      "status": "success",
      "authenticated": true
    }
      // if logged out
    {
      "status": "success",
      "authenticated": false
    }


POST  Change Password
Method	POST
Function	admin.account.changePassword()
Parameters
Parameter Name	Value Type	Description
old_password	String	Required
new_password	String	Required; must be at least 8 alphanumeric characters long
Request

Direct Function


    var formData = {
        old_password: "password123",
        new_password: "newpassword223"
    }
    
    // make request
    admin.account.changePassword({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "password changed successfully."
    }


POST  Update Profile
Method	POST
Function	admin.account.updateProfile()
Parameters
Parameter Name	Value Type	Description
email	String	Optional; new email to update
first_name	String	Optional; new first name to update
last_name	String	Optional; new last name to update
Request

Direct Function


    var formData = {
        email: "mynewemail@gmail.com",
    }
    
    // make request
    admin.account.updateProfile({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "profile updated successfully."
    }

GET  Get Image List/Single Item
Method	GET
Function	admin.gallery.imageList()
Parameters
Parameter Name	Value Type	Description
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
search	String	Optional; search string is matched against image description
image_id	Integer	Optional; if fetching a single gallery image, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.gallery.imageList({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.gallery.imageList({
      params: { image_id: 1 }
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
              "id": 1,
              "image": "/media/gallery/c.png",
              "description": "sitting room",
              "featured": true
          }
      ],
      "page_number": 1,
      "list_per_page": 20,
      "total_pages": 1,
      "total_items": 1,
      "search_query": ""
    }
    
    // for a single message
    {
      "status": "success",
      "message": "data fetched successfully",
      "data": {
          "id": 1,
          "image": "/media/gallery/c.png",
          "description": "sitting room",
          "featured": true
      }
    }


POST  Add Image
Method	POST
Function	admin.gallery.addImage()
Parameters
Parameter Name	Value Type	Description
image	data:image	Required; Image file to upload (not more than 2MB)
description	String	Optional; Textarea Field (not HTML)
featured	Boolean/String	Optional; if image should be featured on homepage or not (options are true/false); default = false
Request

Direct Function


    let image = document.querySelector('.image')[0].files[0];

    var formData = new FormData();

    formData.append('image', image);
    formData.append('description', "Common room area with Plasma TV and Tennis table");
    formData.append('featured', true)

    admin.gallery.addImage({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "image added successfully"
    }


POST  Update Existing Image
Method	POST
Function	admin.gallery.updateImage()
Parameters
Parameter Name	Value Type	Description
image_id	Integer	Required; ID of gallery image to update
description	String	Optional; Textarea Field (not HTML)
featured	Boolean/String	Optional; if image should be featured on homepage or not (options are true/false);
Request

Direct Function


    let formData = {
      image_id: 1,
      description: "Balcony Area"
    }

    admin.gallery.updateImage({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "image updated successfully"
    }


POST  Delete Existing Image
Method	POST
Function	admin.gallery.deleteImage()
Parameters
Parameter Name	Value Type	Description
image_id	Integer	Required; ID of gallery image to delete
Request

Direct Function


    let formData = {
      image_id: 1
    }

    admin.gallery.deleteImage({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "image deleted successfully"
    }


GET  Get Room List/Single Item
Method	GET
Function	admin.room.roomList()
Parameters
Parameter Name	Value Type	Description
sort_by	String	Optional; sorting method (default is "title"; options are "title, -title, price, -price, expiration_date, -expiration_date"
NOTE: Options with the "-" sign signifies descending order
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
search	String	Optional; search string is matched against room title
available	Boolean/String	Optional; filtering by available rooms or not. default is None (which returns both available and unavailable). options are (true or false, preferably as booleans but as string also works)
room_id	Integer	Optional; if fetching a single room, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.room.roomList({
      params: { sort_by: "price", available: true }
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.room.roomList({
      params: { room_id: 2 }
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
              "id": 1,
              "title": "Room 1",
              "thumbnail": "/media/room/thumbnails/cofee.png",
              "available": true,
              "expiration_date": null,
              "price": "150000.00",
              "images": [
                  {
                      "id": 1,
                      "image": "/media/gallery/c.png",
                      "description": "sitting room",
                      "featured": true
                  }
              ],
              "features": "",
              "student": null
          }
      ],
      "page_number": 1,
      "list_per_page": 20,
      "total_pages": 1,
      "total_items": 1,
      "search_query": ""
    }
      
    
    // for a single room
    {
      "status": "success",
      "message": "data fetched successfully",
      "data": {
          "id": 2,
          "title": "Room 2",
          "thumbnail": "/media/room/thumbnails/bch.png",
          "available": false,
          "expiration_date": "2025-07-25",
          "price": "230000.00",
          "images": [],
          "features": "
  a

  ",
          "student": {
              "id": 1,
              "first_name": "Enny",
              "last_name": "WhizzyDoc",
              "email": "hassanridwan2536@gmail.com",
              "phone_number": "",
              "image": null
          }
      }
    }


POST  Add Room
Method	POST
Function	admin.room.addRoom()
Parameters
Parameter Name	Value Type	Description
title	String	Required
features	String	Optional; HTML content
price	Integer	Optional; default is 0
Request

Direct Function


    var formData = {
        title: "Room 10",
        features: "",
        price: 200000
    }
    
    // make request
    admin.room.addRoom({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Room 10 added successfully."
    }


POST  Update Existing Room
Method	POST
Function	admin.room.updateRoom()
Parameters
Parameter Name	Value Type	Description
room_id	Integer	Required; ID of room to update
title	String	Optional;
features	String	Optional; HTML content
price	Integer	Optional;
Request

Direct Function


    var formData = {
        price: 250000
    }
    
    // make request
    admin.room.updateRoom({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Room 10 updated successfully."
    }


POST  Add/Update Room Image
Method	POST
Function	admin.room.updateRoomImage()
Parameters
Parameter Name	Value Type	Description
room_id	Integer	Required; ID of room to update
image	data:image	
Request

Direct Function


    let image = document.querySelector('.image')[0].files[0];

    var formData = new FormData();
    formData.append('room_id', 2);
    formData.append('image', image)
    
    // make request
    admin.room.updateRoomImage({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Room 10 image updated successfully."
    }


POST  Assign Room to User
Method	POST
Function	admin.room.assignRoom()
Parameters
Parameter Name	Value Type	Description
room_id	Integer	Required; ID of room to assign
user_id	Integer	Required; ID of user to assign room to
months	Integer	Optional; number of months for the assignment; default is 12 (1 year) starting from day of assignment
Request

Direct Function


    var formData = {
        room_id: 2,
        user_id: 3
    }
    
    // make request
    admin.room.assignRoom({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Room 10 assigned to John Doe successfully."
    }


POST  Delete Room
Method	POST
Function	admin.room.deleteRoom()
Parameters
Parameter Name	Value Type	Description
room_id	Integer	Required; ID of room to delete
Request

Direct Function


    var formData = {
        room_id: 2
    }
    
    // make request
    admin.room.deleteRoom({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Room 10 deleted successfully."
    }


POST  Update Room Gallery
Method	POST
Function	admin.room.updateRoomGallery()
Parameters
Parameter Name	Value Type	Description
room_id	Integer	Required; ID of room to delete
images	Object:Array (integers)	Required; An array of IDs of the gallery images to add to room; You can use the get gallery API to fetch available gallery images
Request

Direct Function


    var formData = {
        room_id: 2,
        images: [2, 5, 3]
    }
    
    // make request
    admin.room.updateRoomGallery({
      formData: formData,
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Room 10 gallery updated successfully."
    }

GET  Get User List/Single Item
Method	GET
Function	admin.user.userList()
Parameters
Parameter Name	Value Type	Description
sort_by	String	Optional; sorting method (default is "first_name"; options are "first_name, last_name, email, created, -created"
NOTE: Options with the "-" sign signifies descending order
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
search	String	Optional; search string is matched against user first_name, last_name, email, phone_number, institution & department
user_id	Integer	Optional; if fetching a single user, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.user.userList({
      params: { sort_by: "first_name" }
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.user.userList({
      params: { user_id: 1 }
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
              "id": 1,
              "user": {
                  "username": "Virus",
                  "is_active": true,
                  "last_login": null
              },
              "first_name": "Enny",
              "last_name": "WhizzyDoc",
              "email": "hassanridwan2536@gmail.com",
              "phone_number": "",
              "image": null,
              "institution": "",
              "department": "",
              "level": "",
              "agreement": "/media/files/students/agreements/The__Court_agreement_Enny_WhizzyDoc_W7mVET4.pdf",
              "verified": false,
              "identity": null
          },
          {
              "id": 3,
              "user": {
                  "username": "johndoe",
                  "is_active": true,
                  "last_login": "2025-07-29T09:09:29Z"
              },
              "first_name": "John",
              "last_name": "Doe",
              "email": "johndoe@example.com",
              "phone_number": "07011223344",
              "image": null,
              "institution": "",
              "department": "",
              "level": "",
              "agreement": null,
              "verified": false,
              "identity": null
          }
      ],
      "page_number": 1,
      "list_per_page": 20,
      "total_pages": 1,
      "total_items": 2,
      "search_query": ""
    }
      
    
    // for a single user
    {
      "status": "success",
      "message": "data fetched successfully",
      "data": {
          "id": 1,
          "user": {
              "username": "Virus",
              "is_active": true,
              "last_login": null
          },
          "first_name": "Enny",
          "last_name": "WhizzyDoc",
          "email": "hassanridwan2536@gmail.com",
          "phone_number": "",
          "image": null,
          "institution": "",
          "department": "",
          "level": "",
          "agreement": "/media/files/students/agreements/The__Court_agreement_Enny_WhizzyDoc_W7mVET4.pdf",
          "verified": false,
          "identity": null
      }
    }


POST  Activate/Deactivate User Account
Method	POST
Function	admin.user.userStatus()
Parameters
Parameter Name	Value Type	Description
user_id	Integer	Required; ID of user to activate/deactivate
action	String	Required; action to perform. options are: activate, deactivate
Request

Direct Function


    let formData = {
      user_id: 1,
      action: "deactivate
    }

    admin.user.userStatus({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Enny WhizzyDoc deactivated successfully"
    }


POST  Verify User Account
Method	POST
Function	admin.user.verify()
Parameters
Parameter Name	Value Type	Description
user_id	Integer	Required; ID of user to verify
Request

Direct Function


    let formData = {
      user_id: 1
    }

    admin.user.verify({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Enny WhizzyDoc verified successfully"
    }


POST  Verify Uploaded Agreement
Method	POST
Function	admin.user.verifyAgreement()
Parameters
Parameter Name	Value Type	Description
user_id	Integer	Required; ID of user to verify their uploaded document
Request

Direct Function


    let formData = {
      user_id: 1
    }

    admin.user.verify({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Enny WhizzyDoc agreement document verified successfully"
    }


GET  Get User Transactions
Method	GET
Function	admin.user.userTransactions()
Parameters
Parameter Name	Value Type	Description
user_id	Integer	Required; ID of user to fetch
Request

Direct Function


    admin.user.userTransactions({
      params: { user_id: 1 }
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
      ]
    }


GET  Get Paystack Balance
Method	GET
Function	admin.wallet.balance()
Parameters
Parameter Name	Value Type	Description
Request

Direct Function


    // for a list
    admin.wallet.balance({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "paystack data fetched",
      "data": {
          "currency": "NGN",
          "balance": 309189900  // value is in kobo, so ensure you divide by 100 to give actual value in Naira
      }
    }


GET  Get Bank List (For Refund Transfers)
Method	GET
Function	admin.wallet.bankList()
Parameters
Parameter Name	Value Type	Description
Request

Direct Function


    // for a list
    admin.wallet.bankList({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "bank list fetched",
      "data": [
          {
              "bankId": 302,
              "bankName": "9mobile 9Payment Service Bank",
              "bankCode": "120001",
              "logo": null
          },
          {
              "bankId": 780,
              "bankName": "AG Mortgage Bank",
              "bankCode": "90077",
              "logo": null
          },
          {
              "bankId": 698,
              "bankName": "AKU Microfinance Bank",
              "bankCode": "51336",
              "logo": null
          },
          {
              "bankId": 27,
              "bankName": "ALAT by WEMA",
              "bankCode": "035A",
              "logo": null
          },
          {
              "bankId": 689,
              "bankName": "AMPERSAND MICROFINANCE BANK",
              "bankCode": "51341",
              "logo": null
          },
          ... // continuation    
      ]
    }


GET  Verify Account Details (For Refund Transfers)
Method	GET
Function	admin.wallet.verifyAccount()
Parameters
Parameter Name	Value Type	Description
account_number	String	Required; Account umber of recipient
bank_code	String	Required; Bank code of recipient bank (see bank list API above)
Request

Direct Function


    // for a list
    admin.wallet.verifyAccount({
      params: { account_number: "7011978058", bank_code: "999992" }, // represents OPAY
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
        "status": "success",
        "message": "account verified",
        "data": {
            "account_number": "7011978058",
            "account_name": "RIDWAN ENIOLA HASSAN",
            "bank_id": 171
        }
    }

GET  Get Transaction List/Single Item
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


GET  Get Refund List/Single Item
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



GET  Get Message List/Single Item
Method	GET
Function	admin.message.messageList()
Parameters
Parameter Name	Value Type	Description
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
search	String	Optional; search string is matched against name, email and subject
message_id	Integer	Optional; if fetching a single message, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.message.messageList({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.message.messageList({
      params: { message_id: 1 }
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
              "id": 1,
              "name": "John Doe",
              "subject": "Complaint About Hostel",
              "email": "johndoe@gmail.com",
              "message": "For a moment, there was no supply of light to the hostel.
we hope you do something as fast as possible",
              "reply": "",
              "replied": false,
              "date": "2024-05-23T23:08:42Z"
          }
      ],
      "page_number": 1,
      "list_per_page": 20,
      "total_pages": 1,
      "total_items": 1,
      "search_query": ""
    }
    
    // for a single message
    {
      "status": "success",
      "message": "data fetched successfully",
      "data": {
          "id": 1,
          "name": "John Doe",
          "subject": "Complaint About Hostel",
          "email": "johndoe@gmail.com",
          "message": "For a moment, there was no supply of light to the hostel.
we hope you do something as fast as possible",
          "reply": "",
          "replied": false,
          "date": "2024-05-23T23:08:42Z"
      }
    }


POST  Reply Message
Method	POST
Function	admin.message.reply()
Parameters
Parameter Name	Value Type	Description
message_id	Integer	Required; ID of message to reply to
reply	String	Required; Textarea Field (not HTML)
Request

Direct Function


    let formData = {
      message_id: 1,
      reply: "The issue will be addressed as soon as possible"
    }


    admin.message.reply({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "message replied successfully"
    }


GET  Get Broadcast List/Single Item
Method	GET
Function	admin.broadcast.broadcastList()
Parameters
Parameter Name	Value Type	Description
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
search	String	Optional; search string is matched against subject and message
broadcast_id	Integer	Optional; if fetching a single broadcast, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.broadcast.broadcastList({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.broadcast.broadcastList({
      params: { broadcast_id: 2 }
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
              "subject": "New Solar Installation",
              "message": "
  We hereby announce the installation of new solar panels in all Abikede hostels.

  

  This is due to complaints of lack of electricity by various students

  ",
              "date": "2024-10-29T20:24:03Z"
          },
          {
              "id": 1,
              "subject": "Compliment of the Season",
              "message": "
  We at AbikeAde Court Hostels wish you a happy new year and compliments of the season

  ",
              "date": "2024-10-29T20:16:51Z"
          }
      ],
      "page_number": 1,
      "list_per_page": 20,
      "total_pages": 1,
      "total_items": 2,
      "search_query": ""
    }
    
    // for a single message
    {
      "status": "success",
      "message": "broadcast message retrieved",
      "data": {
          "id": 2,
          "subject": "New Solar Installation",
          "message": "
  We hereby announce the installation of new solar panels in all Abikede hostels.

  

  This is due to complaints of lack of electricity by various students

  ",
          "date": "2024-10-29T20:24:03Z"
      }
    }


POST  Send Broadcast
Method	POST
Function	admin.broadcast.send()
Parameters
Parameter Name	Value Type	Description
subject	String	Required; subject of the broadcast
message	String/HTML	Required; content of broadcast
broadcast_id	Integer	Optional; if re-sending an existing broadcast, use the ID instead and ignore other parameters
Request

Direct Function


    let formData = {
      broadcast_id: 2   // resending existing broadcast
    }

    admin.broadcast.send({
      formData: formData
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })
    



Response

success


    {
      "status": "success",
      "message": "Broadcast sent successfully!"
    }


GET  Get Notifications List/Single Item
Method	GET
Function	admin.notification.list()
Parameters
Parameter Name	Value Type	Description
per_page	Integer	Optional; no of items to return for each pages (default is 20)
page	Integer	Optional; page to return; default is 1 (first page)
notification_id	Integer	Optional; if fetching a single notification, this parameter is required and does not need other parameters
Request

Direct Function


    // for a list
    admin.notification.list({
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    })

    // for a single item
    admin.notification.list({
      params: { notification_id: 8 }
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
              "id": 11,
              "title": "Rent Payment Alert",
              "detail": "Enny WhizzyDoc made a payment of N230000 for Room 2",
              "date": "2024-07-26T15:34:15.073766Z",
              "seen": false
          },
          {
              "id": 10,
              "title": "Rent Payment Alert",
              "detail": "Enny WhizzyDoc made a payment of N230000 for Room 2",
              "date": "2024-07-26T15:30:18.275850Z",
              "seen": false
          },
          {
              "id": 9,
              "title": "Rent Payment Alert",
              "detail": "Enny WhizzyDoc made a payment of N230000 for Room 2",
              "date": "2024-07-26T15:21:25.654486Z",
              "seen": false
          },
          {
              "id": 8,
              "title": "Rent Payment Alert",
              "detail": "Enny WhizzyDoc made a payment of N230000 for Room 2",
              "date": "2024-07-25T19:37:11.515738Z",
              "seen": false
          },
          {
              "id": 7,
              "title": "Rent Payment Alert",
              "detail": "Enny WhizzyDoc made a payment of N230000 for Room 2",
              "date": "2024-07-25T19:24:25.304808Z",
              "seen": false
          },
          ...
      ],
      "page_number": 1,
      "list_per_page": 20,
      "total_pages": 1,
      "total_items": 11
    }
    
    // for a single message
    {
      "status": "success",
      "message": "notification retrieved",
      "data": {
          "id": 8,
          "title": "Rent Payment Alert",
          "detail": "Enny WhizzyDoc made a payment of N230000 for Room 2",
          "date": "2024-07-25T19:37:11.515738Z",
          "seen": false
      }
    }

