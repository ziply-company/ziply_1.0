# User Registration and Business Creation

## Overview

When a new user registers on the platform, the following actions are performed automatically:

1. **User Creation**
   The system creates a new user account using the provided email, name, and password.

2. **Business Creation**
   After the user is created, a new business is automatically generated for the user. The business name is based on the user's name (e.g., "John Doe's Business"), and a unique slug is generated.

3. **Business Membership**
   The newly registered user is added as a member of the created business with the role of **Owner**.

## API Endpoint

- **POST** `/register/`
  Registers a new user and creates a business for them.

### Request Body Example

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "yourpassword"
}
```

### Successful Response

- **Status:** `201 Created`
- **Body:**
  ```json
  {
    "message": "User and Business created."
  }
  ```

### Error Handling

- If the business cannot be created (e.g., due to a slug conflict), the user registration is rolled back and an error message is returned.

### Notes

- Each user can only register once with a unique email.
- Each business created during registration will have a unique slug based on the user's name and ID.
- The user is always assigned the **Owner** role in their created business.
