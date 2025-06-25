# MyStore API Documentation

## Overview

This directory contains comprehensive API documentation for all applications in the MyStore e-commerce platform. Each app has its own dedicated documentation file with detailed endpoint specifications, request/response examples, and usage guidelines.

## Applications Documented

### Core Applications
- **[Core App](./core_api.md)** - Shared utilities and base functionality
- **[Store App](./store_api.md)** - Product catalog, categories, and store management
- **[Accounts App](./accounts_api.md)** - User authentication, profiles, and account management
- **[Orders App](./orders_api.md)** - Order processing, management, and tracking
- **[Cart App](./cart_api.md)** - Shopping cart functionality
- **[Inventory App](./inventory_api.md)** - Stock management and inventory tracking

### Business Management
- **[Suppliers App](./suppliers_api.md)** - Supplier management and relationships
- **[Warehouses App](./warehouses_api.md)** - Warehouse operations and management
- **[Reviews App](./reviews_api.md)** - Product reviews and ratings

### Communication & Analytics
- **[Messaging App](./messaging_api.md)** - Internal messaging system
- **[Dashboard App](./dashboard_api.md)** - Analytics and reporting dashboards
- **[Media App](./media_api.md)** - Centralized media management

### SEO & Marketing
- **[SEO Management App](./seo_management_api.md)** - SEO tools, backlinks, and optimization

## API Standards

### Base URL
- **Development**: `http://localhost:8000/api/`
- **Production**: `https://yourdomain.com/api/`

### Authentication
All API endpoints require authentication unless otherwise specified:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": null,
  "pagination": {
    "count": 100,
    "next": "url",
    "previous": null
  }
}
```

### Error Handling
Error responses include detailed information:

```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "errors": {
    "field_name": ["Field-specific error message"]
  },
  "error_code": "VALIDATION_ERROR"
}
```

### HTTP Status Codes
- `200` - OK (Success)
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Pagination
List endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)
- `cursor` - Cursor-based pagination token

### Filtering and Search
Most list endpoints support:
- **Filtering**: `?status=active&category=electronics`
- **Search**: `?search=keyword`
- **Ordering**: `?ordering=-created_at`
- **Date ranges**: `?created_after=2025-01-01&created_before=2025-01-31`

### Rate Limiting
API endpoints are rate-limited:
- **Authenticated users**: 1000 requests/hour
- **Anonymous users**: 100 requests/hour
- **Burst limit**: 50 requests/minute

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Quick Start

### 1. Authentication
```bash
# Login to get JWT token
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user@example.com", "password": "password"}'
```

### 2. Make API Calls
```bash
# Use token in subsequent requests
curl -X GET http://localhost:8000/api/store/products/ \
  -H "Authorization: Bearer <your_jwt_token>"
```

### 3. Create Resources
```bash
# Create a new product
curl -X POST http://localhost:8000/api/store/products/ \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Product", "price": "99.99", "category": 1}'
```

## SDK and Libraries

### Python SDK
```python
from mystore_sdk import MyStoreClient

client = MyStoreClient(
    base_url="http://localhost:8000/api/",
    token="your_jwt_token"
)

# Get products
products = client.store.products.list()

# Create order
order = client.orders.create({
    "items": [{"product_id": 1, "quantity": 2}]
})
```

### JavaScript SDK
```javascript
import { MyStoreAPI } from '@mystore/api-sdk';

const api = new MyStoreAPI({
  baseURL: 'http://localhost:8000/api/',
  token: 'your_jwt_token'
});

// Get products
const products = await api.store.products.list();

// Create order
const order = await api.orders.create({
  items: [{ product_id: 1, quantity: 2 }]
});
```

## Testing

### Postman Collection
Import the Postman collection for easy API testing:
- [MyStore API Collection](./postman/MyStore_API.postman_collection.json)
- [Environment Variables](./postman/MyStore_Environment.postman_environment.json)

### API Testing Tools
- **Postman**: GUI-based API testing
- **curl**: Command-line testing
- **HTTPie**: User-friendly command-line tool
- **Insomnia**: Alternative GUI client

## Webhooks

Some apps support webhooks for real-time notifications:
- Order status changes
- Inventory updates
- Payment confirmations
- SEO alerts

See individual app documentation for webhook details.

## Support

For API support and questions:
- **Documentation**: Check individual app docs
- **Issues**: Report bugs via GitHub issues
- **Email**: api-support@mystore.co.za
- **Discord**: Join our developer community

## Changelog

### Version 2.0.0 (2025-01-20)
- Added SEO Management API
- Enhanced authentication system
- Improved error handling
- Added rate limiting

### Version 1.5.0 (2024-12-15)
- Added Suppliers and Warehouses APIs
- Enhanced product management
- Added bulk operations

### Version 1.0.0 (2024-10-01)
- Initial API release
- Core e-commerce functionality
- JWT authentication
