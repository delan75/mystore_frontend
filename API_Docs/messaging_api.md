# Messaging API Documentation

## Overview

The Messaging API provides internal messaging functionality for staff communication, notifications, and announcements within the MyStore platform.

## Base URL
`/api/messaging/`

## Authentication

All endpoints require authentication. Access levels vary by endpoint.

## Endpoints

### Messages

#### List Messages
```http
GET /api/messaging/messages/
```

**Query Parameters:**
- `folder` - Filter by folder: `inbox`, `sent`, `drafts`, `archived`
- `unread` - Filter unread messages (true/false)
- `priority` - Filter by priority: `low`, `normal`, `high`, `urgent`
- `search` - Search in subject and content
- `from_user` - Filter by sender
- `date_from` - Start date filter
- `date_to` - End date filter

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 45,
    "unread_count": 12,
    "results": [
      {
        "id": 1,
        "subject": "Weekly Inventory Report",
        "from_user": {
          "id": 2,
          "username": "manager",
          "first_name": "John",
          "last_name": "Manager",
          "avatar": "https://example.com/avatars/manager.jpg"
        },
        "to_users": [
          {
            "id": 1,
            "username": "admin",
            "first_name": "Admin"
          }
        ],
        "priority": "normal",
        "is_read": false,
        "has_attachments": true,
        "message_type": "direct",
        "created_at": "2025-01-20T10:30:00Z",
        "read_at": null
      }
    ]
  }
}
```

#### Get Message Details
```http
GET /api/messaging/messages/{id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "subject": "Weekly Inventory Report",
    "content": "Please find attached the weekly inventory report...",
    "from_user": {
      "id": 2,
      "username": "manager",
      "first_name": "John",
      "last_name": "Manager",
      "email": "manager@mystore.co.za",
      "avatar": "https://example.com/avatars/manager.jpg"
    },
    "to_users": [
      {
        "id": 1,
        "username": "admin",
        "first_name": "Admin",
        "last_name": "User"
      }
    ],
    "cc_users": [],
    "bcc_users": [],
    "priority": "normal",
    "message_type": "direct",
    "is_read": false,
    "is_starred": false,
    "is_archived": false,
    "attachments": [
      {
        "id": 1,
        "filename": "inventory_report_week3.pdf",
        "file_size": 245760,
        "file_type": "application/pdf",
        "download_url": "https://example.com/attachments/1/download/"
      }
    ],
    "thread_id": "thread-uuid-123",
    "parent_message_id": null,
    "created_at": "2025-01-20T10:30:00Z",
    "read_at": null,
    "delivery_status": "delivered"
  }
}
```

#### Send Message
```http
POST /api/messaging/messages/
```

**Request Body:**
```json
{
  "to_users": [1, 3, 5],
  "cc_users": [2],
  "subject": "Important Update",
  "content": "Please review the attached document and provide feedback by Friday.",
  "priority": "high",
  "message_type": "direct"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 46,
    "subject": "Important Update",
    "to_users_count": 3,
    "delivery_status": "sent",
    "created_at": "2025-01-20T14:30:00Z"
  },
  "message": "Message sent successfully"
}
```

#### Reply to Message
```http
POST /api/messaging/messages/{id}/reply/
```

**Request Body:**
```json
{
  "content": "Thank you for the report. I'll review it and get back to you.",
  "reply_to_all": false
}
```

#### Forward Message
```http
POST /api/messaging/messages/{id}/forward/
```

**Request Body:**
```json
{
  "to_users": [4, 6],
  "content": "FYI - please see the original message below."
}
```

### Message Actions

#### Mark as Read
```http
PUT /api/messaging/messages/{id}/read/
```

#### Mark as Unread
```http
PUT /api/messaging/messages/{id}/unread/
```

#### Star Message
```http
PUT /api/messaging/messages/{id}/star/
```

#### Archive Message
```http
PUT /api/messaging/messages/{id}/archive/
```

#### Delete Message
```http
DELETE /api/messaging/messages/{id}/
```

### Message Attachments

#### Upload Attachment
```http
POST /api/messaging/messages/{id}/attachments/
```

**Request Body (multipart/form-data):**
```
file: <attachment_file>
description: "Weekly report"
```

#### Download Attachment
```http
GET /api/messaging/attachments/{id}/download/
```

#### Delete Attachment
```http
DELETE /api/messaging/attachments/{id}/
```

### Drafts

#### Save Draft
```http
POST /api/messaging/drafts/
```

**Request Body:**
```json
{
  "to_users": [1],
  "subject": "Draft Message",
  "content": "This is a draft message...",
  "priority": "normal"
}
```

#### List Drafts
```http
GET /api/messaging/drafts/
```

#### Update Draft
```http
PUT /api/messaging/drafts/{id}/
```

#### Send Draft
```http
POST /api/messaging/drafts/{id}/send/
```

### Announcements

#### List Announcements
```http
GET /api/messaging/announcements/
```

**Query Parameters:**
- `active` - Filter active announcements (true/false)
- `department` - Filter by department
- `priority` - Filter by priority

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "System Maintenance Scheduled",
      "content": "The system will be down for maintenance on Saturday...",
      "priority": "high",
      "announcement_type": "system",
      "target_audience": "all_staff",
      "departments": ["all"],
      "is_active": true,
      "start_date": "2025-01-25T00:00:00Z",
      "end_date": "2025-01-26T23:59:59Z",
      "created_by": {
        "id": 1,
        "username": "admin",
        "first_name": "Admin"
      },
      "read_count": 23,
      "total_recipients": 45,
      "created_at": "2025-01-20T09:00:00Z"
    }
  ]
}
```

#### Create Announcement
```http
POST /api/messaging/announcements/
```

**Request Body:**
```json
{
  "title": "New Policy Update",
  "content": "Please review the updated company policies...",
  "priority": "normal",
  "announcement_type": "policy",
  "target_audience": "department",
  "departments": ["sales", "support"],
  "start_date": "2025-01-21T00:00:00Z",
  "end_date": "2025-01-31T23:59:59Z"
}
```

#### Mark Announcement as Read
```http
POST /api/messaging/announcements/{id}/read/
```

### Notifications

#### List Notifications
```http
GET /api/messaging/notifications/
```

**Query Parameters:**
- `unread` - Filter unread notifications (true/false)
- `type` - Filter by type: `message`, `announcement`, `system`, `order`, `inventory`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "New Message Received",
      "content": "You have a new message from John Manager",
      "notification_type": "message",
      "is_read": false,
      "action_url": "/messaging/messages/46/",
      "related_object_id": 46,
      "created_at": "2025-01-20T14:30:00Z"
    }
  ]
}
```

#### Mark Notification as Read
```http
PUT /api/messaging/notifications/{id}/read/
```

#### Mark All Notifications as Read
```http
PUT /api/messaging/notifications/mark-all-read/
```

### Message Templates

#### List Templates
```http
GET /api/messaging/templates/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Weekly Report Template",
      "subject": "Weekly Report - {week_ending}",
      "content": "Please find attached the weekly report for {department}...",
      "category": "reports",
      "is_active": true,
      "usage_count": 45,
      "created_by": {
        "id": 1,
        "username": "admin"
      }
    }
  ]
}
```

#### Create Template
```http
POST /api/messaging/templates/
```

#### Use Template
```http
POST /api/messaging/templates/{id}/use/
```

**Request Body:**
```json
{
  "variables": {
    "week_ending": "2025-01-24",
    "department": "Sales"
  },
  "to_users": [1, 2, 3]
}
```

### Message Threads

#### Get Thread Messages
```http
GET /api/messaging/threads/{thread_id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "thread_id": "thread-uuid-123",
    "subject": "Weekly Inventory Report",
    "participants": [
      {
        "id": 1,
        "username": "admin",
        "first_name": "Admin"
      },
      {
        "id": 2,
        "username": "manager",
        "first_name": "John"
      }
    ],
    "message_count": 3,
    "last_message_at": "2025-01-20T15:45:00Z",
    "messages": [
      {
        "id": 1,
        "content": "Please find attached the weekly inventory report...",
        "from_user": {
          "id": 2,
          "username": "manager"
        },
        "created_at": "2025-01-20T10:30:00Z"
      }
    ]
  }
}
```

### Bulk Operations

#### Bulk Mark as Read
```http
POST /api/messaging/messages/bulk/mark-read/
```

**Request Body:**
```json
{
  "message_ids": [1, 2, 3, 4, 5]
}
```

#### Bulk Delete
```http
POST /api/messaging/messages/bulk/delete/
```

#### Bulk Archive
```http
POST /api/messaging/messages/bulk/archive/
```

### Message Search

#### Advanced Search
```http
GET /api/messaging/search/
```

**Query Parameters:**
- `q` - Search query
- `from_user` - Sender filter
- `date_range` - Date range filter
- `has_attachments` - Messages with attachments
- `priority` - Priority filter

### Analytics (Admin)

#### Messaging Statistics
```http
GET /api/messaging/analytics/stats/
```

**Query Parameters:**
- `period` - Time period: `week`, `month`, `quarter`

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "total_messages": 1247,
    "total_announcements": 23,
    "average_response_time_hours": 4.2,
    "most_active_users": [
      {
        "user_id": 2,
        "username": "manager",
        "message_count": 156
      }
    ],
    "message_trends": [
      {
        "date": "2025-01-01",
        "count": 45
      }
    ]
  }
}
```

## Message Types

| Type | Description |
|------|-------------|
| `direct` | Direct message between users |
| `announcement` | System-wide announcement |
| `notification` | System notification |
| `auto` | Automated system message |

## Priority Levels

| Priority | Description |
|----------|-------------|
| `low` | Low priority, no urgency |
| `normal` | Standard priority |
| `high` | High priority, needs attention |
| `urgent` | Urgent, immediate attention required |

## Error Codes

| Code | Description |
|------|-------------|
| `MESSAGE_NOT_FOUND` | Message does not exist |
| `RECIPIENT_NOT_FOUND` | Recipient user does not exist |
| `ATTACHMENT_TOO_LARGE` | Attachment exceeds size limit |
| `INVALID_RECIPIENT` | Cannot send to specified recipient |
| `THREAD_NOT_FOUND` | Message thread does not exist |

## Rate Limits

- **Message sending**: 50 messages per hour per user
- **Bulk operations**: 10 operations per minute per user
- **File uploads**: 20 uploads per hour per user

## Examples

### Send Message with Attachment
```bash
# 1. Send message
curl -X POST http://localhost:8000/api/messaging/messages/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "to_users": [2],
    "subject": "Report",
    "content": "Please review the attached report.",
    "priority": "high"
  }'

# 2. Upload attachment
curl -X POST http://localhost:8000/api/messaging/messages/46/attachments/ \
  -H "Authorization: Bearer <token>" \
  -F "file=@report.pdf" \
  -F "description=Weekly report"
```
