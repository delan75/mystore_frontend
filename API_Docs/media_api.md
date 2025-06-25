# Media API Documentation

## Overview

The Media API provides centralized media management for the MyStore platform, handling file uploads, image processing, and media organization across all applications.

## Base URL
`/api/media/`

## Authentication

Most endpoints require authentication. Upload and management operations require appropriate permissions.

## Endpoints

### File Upload

#### Upload File
```http
POST /api/media/upload/
```

**Request Body (multipart/form-data):**
```
file: <file_data>
category: "product_images"
alt_text: "Product image description"
tags: "electronics,smartphone,samsung"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "samsung-galaxy-s24.jpg",
    "original_filename": "IMG_20250120_143000.jpg",
    "file_size": 2457600,
    "file_type": "image/jpeg",
    "category": "product_images",
    "url": "https://example.com/media/products/samsung-galaxy-s24.jpg",
    "thumbnail_url": "https://example.com/media/products/thumbs/samsung-galaxy-s24.jpg",
    "alt_text": "Product image description",
    "tags": ["electronics", "smartphone", "samsung"],
    "dimensions": {
      "width": 1920,
      "height": 1080
    },
    "uploaded_by": {
      "id": 1,
      "username": "admin"
    },
    "created_at": "2025-01-20T14:30:00Z"
  },
  "message": "File uploaded successfully"
}
```

#### Bulk Upload
```http
POST /api/media/bulk-upload/
```

**Request Body (multipart/form-data):**
```
files: <file1>
files: <file2>
files: <file3>
category: "product_images"
```

### Media Management

#### List Media Files
```http
GET /api/media/
```

**Query Parameters:**
- `category` - Filter by category
- `file_type` - Filter by MIME type
- `tags` - Filter by tags (comma-separated)
- `uploaded_by` - Filter by uploader
- `date_from` - Start date filter
- `date_to` - End date filter
- `search` - Search in filename, alt_text, tags
- `ordering` - Sort by: `created_at`, `-created_at`, `file_size`, `filename`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 1247,
    "results": [
      {
        "id": 1,
        "filename": "samsung-galaxy-s24.jpg",
        "file_size": 2457600,
        "file_type": "image/jpeg",
        "category": "product_images",
        "url": "https://example.com/media/products/samsung-galaxy-s24.jpg",
        "thumbnail_url": "https://example.com/media/products/thumbs/samsung-galaxy-s24.jpg",
        "alt_text": "Samsung Galaxy S24 product image",
        "tags": ["electronics", "smartphone", "samsung"],
        "dimensions": {
          "width": 1920,
          "height": 1080
        },
        "usage_count": 5,
        "uploaded_by": {
          "id": 1,
          "username": "admin"
        },
        "created_at": "2025-01-20T14:30:00Z"
      }
    ]
  }
}
```

#### Get Media Details
```http
GET /api/media/{id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "samsung-galaxy-s24.jpg",
    "original_filename": "IMG_20250120_143000.jpg",
    "file_size": 2457600,
    "file_type": "image/jpeg",
    "category": "product_images",
    "url": "https://example.com/media/products/samsung-galaxy-s24.jpg",
    "thumbnail_url": "https://example.com/media/products/thumbs/samsung-galaxy-s24.jpg",
    "alt_text": "Samsung Galaxy S24 product image",
    "description": "High-quality product image showing the Samsung Galaxy S24",
    "tags": ["electronics", "smartphone", "samsung"],
    "dimensions": {
      "width": 1920,
      "height": 1080
    },
    "file_hash": "sha256:abc123...",
    "usage_count": 5,
    "used_in": [
      {
        "app": "store",
        "model": "Product",
        "object_id": 1,
        "field": "images"
      }
    ],
    "uploaded_by": {
      "id": 1,
      "username": "admin",
      "first_name": "Admin"
    },
    "created_at": "2025-01-20T14:30:00Z",
    "updated_at": "2025-01-20T14:30:00Z"
  }
}
```

#### Update Media
```http
PUT /api/media/{id}/
```

**Request Body:**
```json
{
  "alt_text": "Updated product image description",
  "description": "Updated description",
  "tags": ["electronics", "smartphone", "samsung", "flagship"],
  "category": "featured_products"
}
```

#### Delete Media
```http
DELETE /api/media/{id}/
```

### Image Processing

#### Generate Thumbnails
```http
POST /api/media/{id}/thumbnails/
```

**Request Body:**
```json
{
  "sizes": [
    {"width": 150, "height": 150, "name": "small"},
    {"width": 300, "height": 300, "name": "medium"},
    {"width": 600, "height": 600, "name": "large"}
  ]
}
```

#### Resize Image
```http
POST /api/media/{id}/resize/
```

**Request Body:**
```json
{
  "width": 800,
  "height": 600,
  "maintain_aspect_ratio": true,
  "quality": 85
}
```

#### Crop Image
```http
POST /api/media/{id}/crop/
```

**Request Body:**
```json
{
  "x": 100,
  "y": 50,
  "width": 800,
  "height": 600
}
```

#### Apply Filters
```http
POST /api/media/{id}/filters/
```

**Request Body:**
```json
{
  "filters": [
    {"type": "brightness", "value": 10},
    {"type": "contrast", "value": 5},
    {"type": "saturation", "value": -10}
  ]
}
```

### Media Categories

#### List Categories
```http
GET /api/media/categories/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "product_images",
      "display_name": "Product Images",
      "description": "Images for product catalog",
      "allowed_types": ["image/jpeg", "image/png", "image/webp"],
      "max_file_size": 10485760,
      "file_count": 1247,
      "total_size": 2847392000
    }
  ]
}
```

#### Create Category
```http
POST /api/media/categories/
```

**Request Body:**
```json
{
  "name": "blog_images",
  "display_name": "Blog Images",
  "description": "Images for blog posts",
  "allowed_types": ["image/jpeg", "image/png"],
  "max_file_size": 5242880
}
```

### Media Collections

#### List Collections
```http
GET /api/media/collections/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Samsung Products",
      "description": "All Samsung product images",
      "media_count": 45,
      "created_by": {
        "id": 1,
        "username": "admin"
      },
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### Create Collection
```http
POST /api/media/collections/
```

**Request Body:**
```json
{
  "name": "iPhone Products",
  "description": "All iPhone product images",
  "media_ids": [1, 2, 3, 4, 5]
}
```

#### Add Media to Collection
```http
POST /api/media/collections/{id}/add-media/
```

**Request Body:**
```json
{
  "media_ids": [6, 7, 8]
}
```

### Media Search

#### Advanced Search
```http
GET /api/media/search/
```

**Query Parameters:**
- `q` - Search query
- `category` - Category filter
- `file_type` - File type filter
- `size_min` - Minimum file size
- `size_max` - Maximum file size
- `dimensions` - Image dimensions filter
- `color` - Dominant color filter
- `has_faces` - Images with faces detected
- `orientation` - Image orientation: `landscape`, `portrait`, `square`

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "samsung phone",
    "total_results": 23,
    "facets": {
      "categories": [
        {"name": "product_images", "count": 18},
        {"name": "marketing_images", "count": 5}
      ],
      "file_types": [
        {"type": "image/jpeg", "count": 20},
        {"type": "image/png", "count": 3}
      ]
    },
    "results": [
      // Media objects
    ]
  }
}
```

### Media Analytics

#### Usage Statistics
```http
GET /api/media/analytics/usage/
```

**Query Parameters:**
- `period` - Time period: `week`, `month`, `quarter`
- `category` - Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "total_files": 1247,
    "total_size": "12.5 GB",
    "uploads_count": 156,
    "downloads_count": 2345,
    "storage_by_category": [
      {
        "category": "product_images",
        "file_count": 856,
        "size": "8.2 GB",
        "percentage": 65.6
      }
    ],
    "most_used_files": [
      {
        "id": 1,
        "filename": "samsung-galaxy-s24.jpg",
        "usage_count": 45
      }
    ]
  }
}
```

#### Storage Report
```http
GET /api/media/analytics/storage/
```

### Media Optimization

#### Optimize Images
```http
POST /api/media/optimize/
```

**Request Body:**
```json
{
  "media_ids": [1, 2, 3],
  "optimization_level": "medium",
  "format": "webp",
  "quality": 80
}
```

#### Bulk Operations
```http
POST /api/media/bulk/
```

**Request Body:**
```json
{
  "action": "update_tags",
  "media_ids": [1, 2, 3, 4, 5],
  "data": {
    "tags": ["electronics", "featured"]
  }
}
```

### CDN Integration

#### Purge CDN Cache
```http
POST /api/media/{id}/purge-cache/
```

#### Get CDN URLs
```http
GET /api/media/{id}/cdn-urls/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "original": "https://cdn.mystore.com/media/products/samsung-galaxy-s24.jpg",
    "thumbnails": {
      "small": "https://cdn.mystore.com/media/products/thumbs/small/samsung-galaxy-s24.jpg",
      "medium": "https://cdn.mystore.com/media/products/thumbs/medium/samsung-galaxy-s24.jpg",
      "large": "https://cdn.mystore.com/media/products/thumbs/large/samsung-galaxy-s24.jpg"
    }
  }
}
```

### Media Backup

#### Create Backup
```http
POST /api/media/backup/
```

**Request Body:**
```json
{
  "backup_type": "incremental",
  "categories": ["product_images", "marketing_images"],
  "destination": "s3://backup-bucket/media/"
}
```

#### List Backups
```http
GET /api/media/backups/
```

#### Restore from Backup
```http
POST /api/media/restore/
```

## Media Categories

| Category | Description | Max Size |
|----------|-------------|----------|
| `product_images` | Product catalog images | 10 MB |
| `marketing_images` | Marketing and promotional images | 15 MB |
| `user_avatars` | User profile pictures | 2 MB |
| `blog_images` | Blog post images | 5 MB |
| `documents` | PDF and document files | 25 MB |
| `videos` | Video content | 100 MB |

## Supported File Types

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- SVG (.svg)

### Documents
- PDF (.pdf)
- DOC/DOCX (.doc, .docx)
- XLS/XLSX (.xls, .xlsx)
- TXT (.txt)

### Videos
- MP4 (.mp4)
- WebM (.webm)
- MOV (.mov)

## Error Codes

| Code | Description |
|------|-------------|
| `FILE_TOO_LARGE` | File exceeds maximum size limit |
| `INVALID_FILE_TYPE` | File type not supported |
| `MEDIA_NOT_FOUND` | Media file does not exist |
| `INSUFFICIENT_STORAGE` | Not enough storage space |
| `PROCESSING_FAILED` | Image processing failed |
| `DUPLICATE_FILE` | File already exists |

## Rate Limits

- **File uploads**: 50 uploads per hour per user
- **Bulk operations**: 10 operations per minute per user
- **Image processing**: 20 operations per minute per user

## Examples

### Complete Media Upload Flow
```bash
# 1. Upload image
curl -X POST http://localhost:8000/api/media/upload/ \
  -H "Authorization: Bearer <token>" \
  -F "file=@product-image.jpg" \
  -F "category=product_images" \
  -F "alt_text=Product image" \
  -F "tags=electronics,smartphone"

# 2. Generate thumbnails
curl -X POST http://localhost:8000/api/media/1/thumbnails/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sizes": [
      {"width": 150, "height": 150, "name": "small"},
      {"width": 300, "height": 300, "name": "medium"}
    ]
  }'

# 3. Add to collection
curl -X POST http://localhost:8000/api/media/collections/1/add-media/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"media_ids": [1]}'
```
