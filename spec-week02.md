# Books API Week 02 Spec

# Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route, including request bodies, route parameters, successful responses, and possible error responses.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal
Create an authors collection to store author information and provide all CRUD operations for managing authors. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Each author can be associated with multiple books. Books will reference authors through the `authorId` field, which must match the custom `id` value of an existing author document.

An author can have multiple books, but each book must reference one existing author.

When deleting an author, the API should check whether any books still reference that author. If books are associated with the author, the API should prevent deletion and return a `409 Conflict` status code.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "John Smith",
      "birthYear": 1985
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "John Smith Updated",
      "birthYear": 1986
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Before deleting an author, the API must check whether any books reference that author's id.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has associated books
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route, including request bodies, route parameters, successful responses, and possible error responses.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Evaluation of Version 1

After reviewing the Version 1 specifications, the following improvements should be considered before implementation.

### 1. Bugs or Short-Sighted Decisions
- The API should validate that required fields contain valid values, not just check whether they exist.
- The `birthYear` field should be a valid number.
- The `publicationDate` field should follow a consistent date format, such as `YYYY-MM-DD`.
- The API should prevent duplicate custom IDs in both collections.
- The API should prevent an author from being deleted while books still reference that author.

### 2. Security Considerations
- The API should validate request bodies before inserting or updating MongoDB documents.
- The API should reject unexpected fields to prevent clients from modifying fields that are not part of the data model.
- Database errors should not expose sensitive connection information or internal implementation details to clients.
- Route parameters and request data should be validated before database queries are performed.

### 3. Efficiency Concerns
- The API should use MongoDB queries that retrieve only the necessary records.
- The API should create unique indexes for custom IDs to prevent duplicate records.
- The API should use a database query to check for associated books before deleting an author instead of retrieving all books into application memory.

### 4. Unclear Response and Error Behaviors
- The API should consistently distinguish between invalid request data, missing records, and unexpected server errors.
- A `400 Bad Request` response should be returned when required fields are missing or invalid.
- A `404 Not Found` response should be returned when a requested book or author does not exist.
- A `409 Conflict` response should be returned when attempting to delete an author who still has associated books.
- A `500 Internal Server Error` response should be returned for unexpected database or server failures.

---

# Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an existing author and the API supports all CRUD operations for books. All book routes must validate incoming data, return appropriate HTTP status codes, and be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, unique custom id such as `b1`
- `authorId`: string, required, references the `id` field of an existing author document
- `title`: string, required, non-empty string
- `publicationDate`: string, required, valid date in `YYYY-MM-DD` format

Books will continue to use custom string IDs instead of MongoDB `_id` values for route parameters.

A unique index should be created for the custom `id` field to prevent duplicate book records.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document in the `authors` collection.

When creating or updating a book, the API must verify that the referenced author exists before saving the book.

If the author does not exist, the API should reject the request with a `400 Bad Request` status code.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects containing `id`, `authorId`, `title`, and `publicationDate`.

Errors:
- `500` if an unexpected server or database error occurs.

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object.

Errors:
- `404` if no book exists with that id.
- `500` if an unexpected server or database error occurs.

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Validation:
- All four fields are required.
- All fields must have the correct data type.
- String fields must not be empty or contain only whitespace.
- `publicationDate` must use the `YYYY-MM-DD` format and represent a valid date.
- The submitted `id` must be unique.
- The submitted `authorId` must reference an existing author.
- Unexpected fields must be rejected.

Success:
- Status code: `201`
- Response body: the newly created book object.

Errors:
- `400` if a required field is missing or invalid.
- `400` if the `id` already exists.
- `400` if the `authorId` does not match an existing author.
- `500` if an unexpected server or database error occurs.

#### PUT /books/:id
Purpose: Update an existing book using its custom id. This route will replace the editable book information with the submitted values.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Validation:
- All required editable fields must be included.
- All fields must have the correct data type.
- String fields must not be empty or contain only whitespace.
- `publicationDate` must be a valid date in `YYYY-MM-DD` format.
- The submitted `authorId` must reference an existing author.
- The book's custom `id` will not be changed through this route.
- Unexpected fields must be rejected.

Success:
- Status code: `200`
- Response body: the updated book object.

Errors:
- `400` if a required field is missing or invalid.
- `400` if the `authorId` does not match an existing author.
- `404` if no book exists with that id.
- `500` if an unexpected server or database error occurs.

#### DELETE /books/:id
Purpose: Delete an existing book using its custom id.

Success:
- Status code: `204`
- Response body: none.

Errors:
- `404` if no book exists with that id.
- `500` if an unexpected server or database error occurs.

### Swagger Documentation
Swagger must document every book route, including:
- Route parameters and their required data types.
- Request body schemas for creating and updating books.
- Required and optional fields.
- Successful response status codes and response examples.
- Possible error status codes and their descriptions.

Every book route must be testable through the Swagger interface at `/api-docs`.

### Deployment Expectations
After implementation, all book routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must document and allow testing of every book route.

---

## Feature 2: Author CRUD Operations

### Goal
Create an authors collection to store author information and provide all CRUD operations for managing authors. The API must validate author data, prevent duplicate author IDs, and protect relationships between authors and books. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, unique custom id such as `a1`
- `name`: string, required, non-empty string
- `birthYear`: number, required, valid four-digit year

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

A unique index should be created for the custom `id` field to prevent duplicate author records.

### Relationship to Books
Each author can be associated with multiple books. Books will reference authors through the `authorId` field, which must match the custom `id` value of an existing author document.

An author can have multiple books, but each book must reference one existing author.

When creating or updating a book, the API must verify that the referenced author exists.

When deleting an author, the API must first check whether any books still reference that author's id.

If books are associated with the author, the API must prevent deletion and return a `409 Conflict` status code. The client must delete or update the associated books before attempting to delete the author.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects containing `id`, `name`, and `birthYear`.

Errors:
- `500` if an unexpected server or database error occurs.

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object.

Errors:
- `404` if no author exists with that id.
- `500` if an unexpected server or database error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "John Smith",
      "birthYear": 1985
    }

Validation:
- All three fields are required.
- `id` and `name` must be non-empty strings.
- `birthYear` must be a valid four-digit number.
- The submitted `id` must be unique.
- Unexpected fields must be rejected.

Success:
- Status code: `201`
- Response body: the newly created author object.

Errors:
- `400` if a required field is missing or invalid.
- `400` if the `id` already exists.
- `500` if an unexpected server or database error occurs.

#### PUT /authors/:id
Purpose: Update an existing author using the custom id. This route will replace the editable author information with the submitted values.

Request body:

    {
      "name": "John Smith Updated",
      "birthYear": 1986
    }

Validation:
- Both editable fields are required.
- `name` must be a non-empty string.
- `birthYear` must be a valid four-digit number.
- The author's custom `id` will not be changed through this route.
- Unexpected fields must be rejected.

Success:
- Status code: `200`
- Response body: the updated author object.

Errors:
- `400` if a required field is missing or invalid.
- `404` if no author exists with that id.
- `500` if an unexpected server or database error occurs.

#### DELETE /authors/:id
Purpose: Delete an existing author using the custom id.

Before deleting an author, the API must check whether any books reference that author's id.

If books still reference the author, the API must prevent deletion.

Success:
- Status code: `204`
- Response body: none.

Errors:
- `404` if no author exists with that id.
- `409` if the author still has associated books.
- `500` if an unexpected server or database error occurs.

### Swagger Documentation
Swagger must document every author route, including:
- Route parameters and their required data types.
- Request body schemas for creating and updating authors.
- Required fields and validation rules.
- Successful response status codes and response examples.
- Possible error status codes and their descriptions.

Every author route must be testable through the Swagger interface at `/api-docs`.

### Deployment Expectations
After implementation, all author routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must document and allow testing of every author route.

---

# Final Implementation Checklist

The following requirements must be completed during implementation:

- Update the existing book data model to include `authorId`.
- Create the `authors` collection.
- Implement GET, POST, PUT, and DELETE routes for books.
- Implement GET, POST, PUT, and DELETE routes for authors.
- Validate all required fields and data types.
- Prevent duplicate custom IDs.
- Verify author references when creating or updating books.
- Prevent deletion of authors who still have associated books.
- Return the appropriate HTTP status codes for successful and unsuccessful requests.
- Document every book and author route in Swagger.
- Test all routes locally through `/api-docs`.
- Deploy the updated API to Render.
- Test all book and author routes using the deployed `/api-docs` page.