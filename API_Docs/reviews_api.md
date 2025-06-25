# Reviews API Documentation

## Overview

The Reviews API manages product reviews, ratings, and customer feedback for the MyStore platform.

## Base URL
`/api/reviews/`

## Authentication

Read operations are public. Write operations require authentication.

## Endpoints

### Product Reviews

#### List Product Reviews
```http
GET /api/reviews/products/{product_id}/reviews/
```

**Query Parameters:**
- `rating` - Filter by rating (1-5)
- `verified_purchase` - Filter verified purchases (true/false)
- `has_images` - Filter reviews with images (true/false)
- `ordering` - Sort by: `created_at`, `-created_at`, `rating`, `-rating`, `helpful_count`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 127,
    "average_rating": 4.3,
    "rating_distribution": {
      "5": 65,
      "4": 32,
      "3": 18,
      "2": 8,
      "1": 4
    },
    "results": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "username": "john_doe",
          "first_name": "John",
          "avatar": "https://example.com/avatars/john.jpg"
        },
        "rating": 5,
        "title": "Excellent smartphone!",
        "content": "This phone exceeded my expectations. Great camera quality and battery life.",
        "verified_purchase": true,
        "purchase_date": "2024-12-15",
        "helpful_count": 23,
        "not_helpful_count": 2,
        "images": [
          {
            "id": 1,
            "image": "https://example.com/review-images/review1-1.jpg",
            "caption": "Camera quality test"
          }
        ],
        "created_at": "2024-12-20T10:30:00Z",
        "updated_at": "2024-12-20T10:30:00Z"
      }
    ]
  }
}
```

#### Create Product Review
```http
POST /api/reviews/products/{product_id}/reviews/
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "content": "I'm very satisfied with this purchase. Highly recommended!",
  "order_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 128,
    "rating": 5,
    "title": "Great product!",
    "content": "I'm very satisfied with this purchase. Highly recommended!",
    "verified_purchase": true,
    "created_at": "2025-01-20T14:30:00Z"
  },
  "message": "Review submitted successfully"
}
```

#### Get Review Details
```http
GET /api/reviews/{id}/
```

#### Update Review
```http
PUT /api/reviews/{id}/
```

**Note:** Users can only update their own reviews within 30 days of creation.

#### Delete Review
```http
DELETE /api/reviews/{id}/
```

### Review Images

#### Upload Review Images
```http
POST /api/reviews/{review_id}/images/
```

**Request Body (multipart/form-data):**
```
image: <image_file>
caption: "Product in use"
```

#### Delete Review Image
```http
DELETE /api/reviews/{review_id}/images/{image_id}/
```

### Review Interactions

#### Mark Review as Helpful
```http
POST /api/reviews/{id}/helpful/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "helpful_count": 24,
    "user_found_helpful": true
  },
  "message": "Review marked as helpful"
}
```

#### Mark Review as Not Helpful
```http
POST /api/reviews/{id}/not-helpful/
```

#### Report Review
```http
POST /api/reviews/{id}/report/
```

**Request Body:**
```json
{
  "reason": "inappropriate_content",
  "description": "Contains offensive language"
}
```

### Review Responses (Store Owners)

#### Respond to Review
```http
POST /api/reviews/{id}/respond/
```

**Request Body:**
```json
{
  "response": "Thank you for your feedback! We're glad you're satisfied with your purchase."
}
```

**Note:** Requires staff privileges.

#### Update Response
```http
PUT /api/reviews/{id}/response/
```

#### Delete Response
```http
DELETE /api/reviews/{id}/response/
```

### Review Statistics

#### Get Product Rating Summary
```http
GET /api/reviews/products/{product_id}/summary/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "total_reviews": 127,
    "average_rating": 4.3,
    "rating_distribution": {
      "5": 65,
      "4": 32,
      "3": 18,
      "2": 8,
      "1": 4
    },
    "verified_purchase_percentage": 78.5,
    "recent_reviews_trend": "positive",
    "recommendation_percentage": 89.2
  }
}
```

#### Get User Review History
```http
GET /api/reviews/users/{user_id}/reviews/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Samsung Galaxy S24",
        "image": "https://example.com/products/samsung-s24.jpg"
      },
      "rating": 5,
      "title": "Excellent smartphone!",
      "verified_purchase": true,
      "helpful_count": 23,
      "created_at": "2024-12-20T10:30:00Z"
    }
  ]
}
```

### Review Moderation (Admin)

#### List Pending Reviews
```http
GET /api/reviews/moderation/pending/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 129,
      "product": {
        "id": 2,
        "name": "iPhone 15 Pro"
      },
      "user": {
        "username": "reviewer123"
      },
      "rating": 1,
      "title": "Terrible product",
      "content": "This product is awful...",
      "status": "pending",
      "flagged_reasons": ["inappropriate_content"],
      "created_at": "2025-01-20T15:00:00Z"
    }
  ]
}
```

#### Approve Review
```http
POST /api/reviews/{id}/approve/
```

#### Reject Review
```http
POST /api/reviews/{id}/reject/
```

**Request Body:**
```json
{
  "reason": "inappropriate_content",
  "admin_notes": "Contains offensive language"
}
```

#### List Reported Reviews
```http
GET /api/reviews/moderation/reported/
```

### Review Analytics (Admin)

#### Review Analytics Dashboard
```http
GET /api/reviews/analytics/dashboard/
```

**Query Parameters:**
- `period` - Time period: `week`, `month`, `quarter`, `year`
- `product_id` - Filter by specific product

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "total_reviews": 456,
    "average_rating": 4.2,
    "review_velocity": 15.2,
    "sentiment_analysis": {
      "positive": 78.5,
      "neutral": 15.2,
      "negative": 6.3
    },
    "top_reviewed_products": [
      {
        "product_id": 1,
        "product_name": "Samsung Galaxy S24",
        "review_count": 127,
        "average_rating": 4.3
      }
    ],
    "review_trends": [
      {
        "date": "2025-01-01",
        "count": 12,
        "average_rating": 4.1
      }
    ]
  }
}
```

#### Export Reviews
```http
GET /api/reviews/export/
```

**Query Parameters:**
- `format` - Export format: `csv`, `xlsx`, `json`
- `product_id` - Filter by product
- `date_from` - Start date
- `date_to` - End date
- `rating` - Filter by rating

### Review Incentives

#### Get Review Incentives
```http
GET /api/reviews/incentives/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "active_campaigns": [
      {
        "id": 1,
        "name": "January Review Rewards",
        "description": "Get 50 loyalty points for each verified review",
        "reward_type": "loyalty_points",
        "reward_value": 50,
        "minimum_rating": 1,
        "requires_verification": true,
        "start_date": "2025-01-01",
        "end_date": "2025-01-31"
      }
    ]
  }
}
```

#### Claim Review Reward
```http
POST /api/reviews/{review_id}/claim-reward/
```

### Bulk Operations (Admin)

#### Bulk Approve Reviews
```http
POST /api/reviews/bulk/approve/
```

**Request Body:**
```json
{
  "review_ids": [129, 130, 131]
}
```

#### Bulk Delete Reviews
```http
POST /api/reviews/bulk/delete/
```

#### Import Reviews
```http
POST /api/reviews/import/
```

**Request Body (multipart/form-data):**
```
csv_file: <reviews.csv>
```

### Review Widgets

#### Get Review Widget Data
```http
GET /api/reviews/widgets/product/{product_id}/
```

**Query Parameters:**
- `widget_type` - Type: `summary`, `recent`, `featured`
- `limit` - Number of reviews to return

**Response:**
```json
{
  "success": true,
  "data": {
    "widget_type": "summary",
    "product_id": 1,
    "average_rating": 4.3,
    "total_reviews": 127,
    "featured_reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Excellent smartphone!",
        "content_excerpt": "This phone exceeded my expectations...",
        "user_name": "John D.",
        "verified_purchase": true,
        "created_at": "2024-12-20T10:30:00Z"
      }
    ]
  }
}
```

## Review Status Values

| Status | Description |
|--------|-------------|
| `pending` | Awaiting moderation |
| `approved` | Approved and visible |
| `rejected` | Rejected by moderator |
| `flagged` | Flagged for review |
| `hidden` | Hidden by admin |

## Review Report Reasons

| Reason | Description |
|--------|-------------|
| `inappropriate_content` | Offensive or inappropriate language |
| `spam` | Spam or promotional content |
| `fake_review` | Suspected fake review |
| `off_topic` | Not related to the product |
| `personal_information` | Contains personal information |

## Error Codes

| Code | Description |
|------|-------------|
| `REVIEW_NOT_FOUND` | Review does not exist |
| `PRODUCT_NOT_FOUND` | Product does not exist |
| `ALREADY_REVIEWED` | User already reviewed this product |
| `PURCHASE_REQUIRED` | Must purchase product to review |
| `REVIEW_PERIOD_EXPIRED` | Review period has expired |
| `INAPPROPRIATE_CONTENT` | Review contains inappropriate content |

## Rate Limits

- **Review creation**: 5 reviews per day per user
- **Review interactions**: 100 per hour per user
- **Image uploads**: 10 per hour per user

## Examples

### Complete Review Flow
```bash
# 1. Get product reviews
curl -X GET http://localhost:8000/api/reviews/products/1/reviews/

# 2. Create review (authenticated user)
curl -X POST http://localhost:8000/api/reviews/products/1/reviews/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Great product!",
    "content": "Very satisfied with this purchase.",
    "order_id": 123
  }'

# 3. Upload review image
curl -X POST http://localhost:8000/api/reviews/128/images/ \
  -H "Authorization: Bearer <token>" \
  -F "image=@product_photo.jpg" \
  -F "caption=Product in use"

# 4. Mark review as helpful
curl -X POST http://localhost:8000/api/reviews/128/helpful/ \
  -H "Authorization: Bearer <token>"
```
