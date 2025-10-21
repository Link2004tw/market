# API Documentation

This document describes the API endpoints for the Next.js marketplace website, which uses Supabase (PostgreSQL) for data storage and authentication. The marketplace allows buyers to search for products available in their governorate, with products linked to sellers who can ship to specific locations via a many-to-many relationship defined in the `Locations` table.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API endpoints require authentication via Supabase Auth. Clients must include a valid JSON Web Token (JWT) in the `Authorization` header as `Bearer <token>`. The token is obtained after user login via Supabase Auth (e.g., email/password or OAuth).

Example:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### GET /products

**Description**: Retrieves a list of products available in the authenticated user's governorate, filtered by an optional keyword search and additional parameters. Products are associated with sellers (via `Product.suid = sellers.uid`), and sellers are linked to locations (governorates) via the `Locations` table (`Locations.SUID = sellers.uid`). The API returns products from sellers who can ship to the user's governorate, as specified in the `buyers` table.

**Path**: `/api/products`

**Query Parameters**:

- `q` (string, optional): Keyword to search in `Product.name` and `Product.description` (case-insensitive). Default: empty string.
- `category` (integer, optional): Filters products by category ID (`Product.categoryID`). Must match a `cID` in the `categories` table. Default: none.
- `minPrice` (number, optional): Filters products with price greater than or equal to this value (`Product.price`). Default: none.
- `maxPrice` (number, optional): Filters products with price less than or equal to this value (`Product.price`). Default: none.
- `available` (boolean, optional): If `true`, returns only products with `available > 0`. Default: `false`.

**Headers**:

- `Authorization`: `Bearer <supabase-auth-token>` (required)

**Response**:

- **Status**: `200 OK` on success, with a JSON object containing:
  - `data`: Array of product objects, each including:
    - `pID` (integer): Product ID.
    - `name` (string): Product name.
    - `price` (number): Product price (EGP).
    - `image` (string): URL of the product image.
    - `available` (integer): Number of items in stock.
    - `description` (string): Product description.
    - `minDays` (integer): Minimum delivery days.
    - `maxDays` (integer): Maximum delivery days.
    - `suid` (string): Seller’s UUID (`sellers.uid`).
    - `categoryID` (integer): Category ID (`categories.cID`).
    - `categories` (object): Contains `name` (string) of the category.
    - `sellers` (object): Contains `Locations` (object) with `cost` (number) for shipping cost in the user’s governorate.
- **Error Responses**:
  - `401 Unauthorized`: Missing or invalid JWT.
    ```json
    { "error": "Unauthorized" }
    ```
  - `404 Not Found`: User not found in the `buyers` table.
    ```json
    { "error": "User not found in buyers table" }
    ```
  - `400 Bad Request`: Invalid `category`, `minPrice`, or `maxPrice` parameters.
    ```json
    { "error": "Invalid category ID" }
    ```
    or
    ```json
    { "error": "Invalid price range" }
    ```
  - `500 Internal Server Error`: Database query error.
    ```json
    { "error": "<database error message>" }
    ```

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/products?q=smartphone&category=1&minPrice=500&maxPrice=4000&available=true" \
  -H "Authorization: Bearer <supabase-auth-token>"
```

**Example Response**:

```json
{
  "data": [
    {
      "pID": 1,
      "name": "Smartphone X12",
      "price": 3500.0,
      "image": "https://ui-avatars.com/api/?name=Smartphone+X12&size=200&background=random&color=fff",
      "available": 25,
      "description": "Latest 5G smartphone with 128GB storage.",
      "minDays": 1,
      "maxDays": 3,
      "suid": "550e8400-e29b-41d4-a716-446655440001",
      "categoryID": 1,
      "categories": { "name": "Electronics" },
      "sellers": {
        "Locations": { "cost": 50.0 }
      }
    },
    {
      "pID": 2,
      "name": "Smartphone Y9",
      "price": 2800.0,
      "image": "https://ui-avatars.com/api/?name=Smartphone+Y9&size=200&background=random&color=fff",
      "available": 15,
      "description": "Budget-friendly smartphone with 64GB storage.",
      "minDays": 2,
      "maxDays": 4,
      "suid": "550e8400-e29b-41d4-a716-446655440003",
      "categoryID": 1,
      "categories": { "name": "Electronics" },
      "sellers": {
        "Locations": { "cost": 50.0 }
      }
    }
  ]
}
```

**Notes**:

- The API uses the authenticated user’s `uid` to fetch their governorate from the `buyers` table.
- Products are filtered based on sellers who can ship to the user’s governorate, as defined in the `Locations` table (`Locations.SUID = sellers.uid`).
- The `Locations` table models a many-to-many relationship between sellers and locations (governorates), with a composite primary key `(SUID, location)` and a `cost` for shipping.
- Row Level Security (RLS) ensures users can only access their own `buyers` data, while `Product`, `sellers`, `Locations`, and `categories` are public for reading.
- Use Supabase’s auth helpers (`@supabase/auth-helpers-nextjs`) to manage JWTs in the frontend.

**Frontend Integration Example**:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("your-supabase-url", "your-anon-key");
const {
  data: { session },
} = await supabase.auth.getSession();
const response = await fetch(
  "/api/products?q=smartphone&category=1&minPrice=500&maxPrice=4000&available=true",
  {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  }
);
const { data } = await response.json();
console.log(data);
```

**Setup Requirements**:

- Ensure environment variables are set in `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  ```
- Install Supabase client: `npm install @supabase/supabase-js`.
- Ensure RLS policies are configured:
  ```sql
  ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can view their own buyer data" ON buyers FOR SELECT USING (auth.uid() = uid);
  ALTER TABLE Product ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Products are public" ON Product FOR SELECT USING (true);
  ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Sellers are public" ON sellers FOR SELECT USING (true);
  ALTER TABLE Locations ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Locations are public" ON Locations FOR SELECT USING (true);
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);
  ```
- Populate the `Locations` table with data matching `sellers.uid` and governorates in `buyers.governorate`.

**Troubleshooting**:

- **401 Unauthorized**: Verify the JWT is valid and included in the `Authorization` header. Use Supabase auth helpers for session management.
- **404 Not Found**: Ensure the user’s `uid` exists in the `buyers` table with a valid `governorate` matching `Locations.location`.
- **400 Bad Request**: Check that `category`, `minPrice`, and `maxPrice` are valid numbers.
- **Empty Results**: Verify `Locations` has entries for governorates in `buyers` and that `Product.suid` matches `Locations.SUID`. Run:
  ```sql
  SELECT DISTINCT location FROM Locations;
  ```
- **Duplicates**: The `Locations` composite key `(SUID, location)` prevents duplicate seller-location pairs. Ensure query joins are correct to avoid duplicate products.
