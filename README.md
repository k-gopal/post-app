# post-app

This is project is a basic backend for a post application.

The Postman collection contains all the URL and examples.

Following things are covered in it:
  - sign up using email (verified via otp sent on the same email)
  - on verification jwt token is assigned for next 30 mins
  - sign in using email (authenticated using otp service on email and on verification success token is generated)
  - every API other than auth flow requires token to proceed with call(provided when verified via otp)
  - API to update basic details of user(firstName, lastName)
  - API to create a post(title mandatory, desc)
  - API to create comment on any created post by anyone
  - API to like any post created by anyone
  - API to delete a post created by just you
  - API to list all the active posts (accepting pagination and sorting)
