# SEO Management API Documentation

## Overview

The SEO Management API provides comprehensive SEO tools including backlink management, internal linking optimization, orphan page detection, and Google API integration. All endpoints require superuser privileges.

## Base URL
`/api/seo/`

## Authentication

**All endpoints require superuser authentication:**
```http
Authorization: Bearer <jwt_token>
X-Superuser-Required: true
```

## Endpoints

### Backlink Management

#### List Backlinks
```http
GET /api/seo/backlinks/
```

**Query Parameters:**
- `status` - Filter by status: `active`, `lost`, `toxic`, `disavowed`, `pending`
- `link_type` - Filter by type: `contextual`, `sidebar`, `footer`, `navigation`
- `source_domain` - Filter by source domain
- `search` - Search in domain, URL, anchor text
- `ordering` - Sort by: `discovered_date`, `domain_authority`, `quality_score`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 1247,
    "results": [
      {
        "id": "uuid-123",
        "source_domain": "techblog.com",
        "source_url": "https://techblog.com/best-smartphones-2025",
        "target_url": "https://mystore.com/samsung-galaxy-s24",
        "anchor_text": "Samsung Galaxy S24 review",
        "link_type": "contextual",
        "status": "active",
        "domain_authority": 65,
        "page_authority": 45,
        "spam_score": 5,
        "quality_score": 78.5,
        "discovered_date": "2025-01-15T10:30:00Z",
        "last_checked": "2025-01-20T14:22:00Z",
        "is_monitored": true,
        "created_by_username": "admin"
      }
    ]
  }
}
```

#### Create Backlink Profile
```http
POST /api/seo/backlinks/
```

**Request Body:**
```json
{
  "source_domain": "example.com",
  "source_url": "https://example.com/article",
  "target_url": "https://mystore.com/product",
  "anchor_text": "best online store",
  "link_type": "contextual",
  "domain_authority": 55,
  "page_authority": 40,
  "spam_score": 8,
  "is_monitored": true
}
```

#### Get Backlink Details
```http
GET /api/seo/backlinks/{id}/
```

#### Update Backlink
```http
PUT /api/seo/backlinks/{id}/
```

#### Delete Backlink
```http
DELETE /api/seo/backlinks/{id}/
```

### Backlink Opportunities

#### List Opportunities
```http
GET /api/seo/backlinks/opportunities/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-456",
      "target_domain": "potential-partner.com",
      "target_url": "https://potential-partner.com/resources",
      "opportunity_type": "guest_post",
      "status": "pending",
      "priority": "high",
      "contact_name": "John Editor",
      "contact_email": "editor@potential-partner.com",
      "domain_authority": 72,
      "relevance_score": 8.5,
      "estimated_effort": "medium",
      "notes": "High-authority tech blog, good fit for guest posting",
      "discovered_date": "2025-01-18T09:15:00Z"
    }
  ]
}
```

#### Create Opportunity
```http
POST /api/seo/backlinks/opportunities/
```

### Backlink Outreach

#### List Outreach Campaigns
```http
GET /api/seo/backlinks/outreach/
```

#### Create Outreach Campaign
```http
POST /api/seo/backlinks/outreach/
```

**Request Body:**
```json
{
  "opportunity_id": "uuid-456",
  "campaign_name": "Tech Blog Guest Post Outreach",
  "campaign_type": "guest_post",
  "subject_line": "Guest Post Collaboration Opportunity",
  "email_template": "Hi {contact_name}, I'd like to propose...",
  "follow_up_days": 7,
  "max_follow_ups": 3
}
```

### Internal Linking

#### List Internal Links
```http
GET /api/seo/internal-links/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-789",
      "source_url": "https://mystore.com/blog/smartphone-guide",
      "target_url": "https://mystore.com/samsung-galaxy-s24",
      "anchor_text": "Samsung Galaxy S24",
      "link_type": "contextual",
      "status": "active",
      "click_count": 156,
      "last_clicked": "2025-01-20T11:30:00Z",
      "created_date": "2025-01-10T14:00:00Z"
    }
  ]
}
```

#### Create Internal Link
```http
POST /api/seo/internal-links/
```

### Orphan Pages

#### List Orphan Pages
```http
GET /api/seo/orphan-pages/
```

**Query Parameters:**
- `status` - Filter by status: `orphan`, `linked`, `redirect`, `delete`, `ignore`
- `priority` - Filter by priority: `low`, `medium`, `high`, `urgent`
- `page_type` - Filter by type: `product`, `category`, `blog_post`, `page`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-101",
      "url": "https://mystore.com/forgotten-product",
      "page_title": "Forgotten Product Page",
      "page_type": "product",
      "status": "orphan",
      "priority": "high",
      "word_count": 450,
      "search_impressions": 1250,
      "search_clicks": 23,
      "days_orphaned": 45,
      "discovered_date": "2024-12-05T10:00:00Z",
      "last_crawled": "2025-01-20T08:30:00Z"
    }
  ]
}
```

#### Create Orphan Page Record
```http
POST /api/seo/orphan-pages/
```

#### Detect Orphan Pages
```http
POST /api/seo/orphan-pages/detect/
```

**Request Body:**
```json
{
  "base_urls": [
    "https://mystore.com"
  ]
}
```

### Linking Rules

#### List Linking Rules
```http
GET /api/seo/linking-rules/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-202",
      "rule_name": "Product to Category Auto-Link",
      "rule_type": "keyword_based",
      "is_active": true,
      "keyword_triggers": ["smartphone", "phone", "mobile"],
      "anchor_text_template": "{keyword}",
      "target_url_pattern": "/categories/smartphones/",
      "priority": 5,
      "execution_count": 234,
      "success_count": 198,
      "success_rate": 84.6,
      "created_date": "2024-11-15T10:00:00Z"
    }
  ]
}
```

#### Create Linking Rule
```http
POST /api/seo/linking-rules/
```

#### Execute Linking Rules
```http
POST /api/seo/linking-rules/execute/
```

**Request Body:**
```json
{
  "rule_ids": ["uuid-202", "uuid-203"]
}
```

### Google Integration

#### List Google Credentials
```http
GET /api/seo/google/credentials/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-301",
      "service_name": "search_console",
      "service_name_display": "Google Search Console",
      "account_email": "admin@mystore.co.za",
      "is_active": true,
      "token_expires_at": "2025-02-20T10:00:00Z",
      "is_token_valid": true,
      "days_until_expiry": 31,
      "scopes": [
        "https://www.googleapis.com/auth/webmasters.readonly"
      ],
      "last_used": "2025-01-20T08:00:00Z",
      "created_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

#### Create Google Credentials (OAuth Flow)
```http
POST /api/seo/google/credentials/
```

#### Get Search Console Data
```http
GET /api/seo/google/search-console-data/
```

**Query Parameters:**
- `data_type` - Filter by type: `query`, `page`, `country`, `device`
- `date` - Filter by date range
- `credential` - Filter by credential ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-401",
      "credential_email": "admin@mystore.co.za",
      "date": "2025-01-19",
      "data_type": "query",
      "query": "samsung galaxy s24 price",
      "page": "https://mystore.com/samsung-galaxy-s24",
      "clicks": 45,
      "impressions": 1250,
      "ctr_percentage": 3.6,
      "average_position_rounded": 4.2,
      "fetched_date": "2025-01-20T08:00:00Z"
    }
  ]
}
```

#### Sync Google Data
```http
POST /api/seo/google/sync/search-console/
```

**Request Body:**
```json
{
  "start_date": "2025-01-01",
  "end_date": "2025-01-31",
  "dimensions": ["query", "page"],
  "row_limit": 1000
}
```

### Dashboard Data

#### Get SEO Dashboard Overview
```http
GET /api/seo/dashboard/overview-data/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "backlinks": {
      "total_backlinks": 1247,
      "active_backlinks": 1156,
      "lost_backlinks": 23,
      "health_score": 92.7
    },
    "internal_links": {
      "total_orphan_pages": 45,
      "high_priority_orphans": 8,
      "resolved_orphans": 234,
      "resolution_rate": 83.9
    },
    "google_integration": {
      "total_credentials": 3,
      "active_credentials": 3,
      "search_console": {
        "total_clicks": 15847,
        "total_impressions": 456789,
        "avg_ctr": 3.47,
        "avg_position": 8.2
      },
      "analytics": {
        "total_sessions": 45678,
        "total_users": 32456,
        "total_page_views": 89123,
        "avg_bounce_rate": 42.3
      }
    }
  }
}
```

#### Get Performance Trends
```http
GET /api/seo/dashboard/performance-trends/
```

#### Get Quick Actions
```http
GET /api/seo/dashboard/quick-actions/
```

### Automated Actions

#### Discover Backlinks
```http
POST /api/seo/backlinks/discover/
```

**Request Body:**
```json
{
  "target_urls": [
    "https://mystore.com",
    "https://mystore.com/products/"
  ]
}
```

#### Check Backlink Status
```http
POST /api/seo/backlinks/check-status/
```

**Request Body:**
```json
{
  "backlink_ids": ["uuid-123", "uuid-124"]
}
```

#### Validate Google Credentials
```http
POST /api/seo/google/validate-credentials/
```

**Request Body:**
```json
{
  "credential_ids": ["uuid-301", "uuid-302"]
}
```

## Dashboard Interface

#### Access SEO Dashboard
```http
GET /api/seo/dashboard/
```

Returns HTML dashboard interface with:
- Real-time SEO metrics
- Interactive charts and graphs
- Quick action buttons
- Performance monitoring
- Alert notifications

## Automated Scheduling

The SEO system includes automated Celery tasks:

### Daily Tasks
- Google Search Console data sync
- Google Analytics data sync
- Google credentials validation
- Linking rules execution

### Weekly Tasks
- Backlink discovery
- Backlink status monitoring
- Orphan page detection
- SEO performance reports

### Monthly Tasks
- Data cleanup and archival
- Comprehensive SEO audits

## Email Notifications

Automated email alerts for:
- Lost backlinks detected
- New backlinks discovered
- Orphan pages found
- Google credentials expiring
- Weekly SEO performance reports

## Error Codes

| Code | Description |
|------|-------------|
| `SUPERUSER_REQUIRED` | Endpoint requires superuser access |
| `BACKLINK_NOT_FOUND` | Backlink profile does not exist |
| `GOOGLE_API_ERROR` | Google API integration error |
| `INVALID_URL` | URL format is invalid |
| `ORPHAN_PAGE_NOT_FOUND` | Orphan page record not found |
| `LINKING_RULE_ERROR` | Error executing linking rule |
| `CREDENTIAL_EXPIRED` | Google API credentials expired |

## Rate Limits

- **General endpoints**: 1000 requests/hour per user
- **Automated actions**: 10 requests/hour per user
- **Google API sync**: 5 requests/hour per credential

## Examples

### Complete SEO Workflow
```bash
# 1. Check dashboard overview
curl -X GET http://localhost:8000/api/seo/dashboard/overview-data/ \
  -H "Authorization: Bearer <superuser_token>"

# 2. Discover new backlinks
curl -X POST http://localhost:8000/api/seo/backlinks/discover/ \
  -H "Authorization: Bearer <superuser_token>" \
  -H "Content-Type: application/json" \
  -d '{"target_urls": ["https://mystore.com"]}'

# 3. Detect orphan pages
curl -X POST http://localhost:8000/api/seo/orphan-pages/detect/ \
  -H "Authorization: Bearer <superuser_token>" \
  -H "Content-Type: application/json" \
  -d '{"base_urls": ["https://mystore.com"]}'

# 4. Sync Google Search Console data
curl -X POST http://localhost:8000/api/seo/google/sync/search-console/ \
  -H "Authorization: Bearer <superuser_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2025-01-01",
    "end_date": "2025-01-31",
    "dimensions": ["query", "page"]
  }'
```
