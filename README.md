# Express.js RESTful API Assignment

This is a RESTful API built with Express.js for managing products. It includes CRUD operations, authentication, logging, validation, error handling, and advanced features like filtering, pagination, and search.

## Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Copy `.env.example` to `.env` (optional, defaults to port 3000).
4.  **Start the server**:
    ```bash
    npm start
    # or
    node server.js
    ```

## API Endpoints

**Base URL**: `http://localhost:3000/api/products`

**Authentication**:
Add header `x-api-key: secret-api-key` to all requests.

### Products

-   **GET /**: List all products.
    -   Query Params:
        -   `category`: Filter by category (e.g., `?category=Electronics`)
        -   `search`: Search by name (e.g., `?search=lap`)
        -   `page`: Page number (default 1)
        -   `limit`: Items per page (default 10)
-   **GET /:id**: Get product by ID.
-   **GET /stats**: Get product statistics (count by category).
-   **POST /**: Create a new product.
    -   Body: `{ "name": "...", "price": 10, "category": "..." }`
-   **PUT /:id**: Update a product.
-   **DELETE /:id**: Delete a product.

## Features

-   **Middleware**: Logger, Auth, Validation.
-   **Error Handling**: Global error handler, custom AppError.
-   **Advanced**: Pagination, Filtering, Search, Stats.
