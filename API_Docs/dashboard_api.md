# Dashboard API Documentation

## Overview

The Dashboard API provides analytics, reporting, and business intelligence data for the MyStore platform. It aggregates data from all modules to provide comprehensive insights.

## Base URL
`/api/dashboard/`

## Authentication

All endpoints require authentication. Most analytics require staff or admin privileges.

## Endpoints

### Main Dashboard

#### Get Dashboard Overview
```http
GET /api/dashboard/overview/
```

**Query Parameters:**
- `period` - Time period: `today`, `week`, `month`, `quarter`, `year`
- `compare_previous` - Include previous period comparison (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "date_range": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    },
    "key_metrics": {
      "total_revenue": {
        "value": "2847392.50",
        "currency": "ZAR",
        "change_percentage": 15.2,
        "trend": "up"
      },
      "total_orders": {
        "value": 1247,
        "change_percentage": 8.7,
        "trend": "up"
      },
      "average_order_value": {
        "value": "2284.15",
        "currency": "ZAR",
        "change_percentage": 5.9,
        "trend": "up"
      },
      "conversion_rate": {
        "value": 3.2,
        "unit": "percentage",
        "change_percentage": -0.3,
        "trend": "down"
      }
    },
    "quick_stats": {
      "active_customers": 15847,
      "products_sold": 3456,
      "inventory_value": "12847392.50",
      "pending_orders": 23,
      "low_stock_items": 45
    },
    "recent_activities": [
      {
        "timestamp": "2025-01-20T14:30:00Z",
        "type": "order",
        "description": "New order #ORD-2025-001234 received",
        "value": "1599.00",
        "user": "customer@example.com"
      }
    ]
  }
}
```

### Sales Analytics

#### Sales Dashboard
```http
GET /api/dashboard/sales/
```

**Query Parameters:**
- `period` - Time period filter
- `breakdown` - Breakdown by: `day`, `week`, `month`, `product`, `category`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_revenue": "2847392.50",
      "total_orders": 1247,
      "average_order_value": "2284.15",
      "gross_profit": "1423696.25",
      "profit_margin": 50.0
    },
    "trends": {
      "revenue_trend": [
        {
          "date": "2025-01-01",
          "revenue": "89234.50",
          "orders": 39
        }
      ],
      "top_products": [
        {
          "product_id": 1,
          "product_name": "Samsung Galaxy S24",
          "revenue": "479976.00",
          "units_sold": 32,
          "profit_margin": 45.2
        }
      ],
      "top_categories": [
        {
          "category_id": 1,
          "category_name": "Electronics",
          "revenue": "1847392.50",
          "percentage": 64.9
        }
      ]
    },
    "geographic_breakdown": [
      {
        "province": "Western Cape",
        "revenue": "1138956.00",
        "orders": 498,
        "percentage": 40.0
      }
    ]
  }
}
```

#### Sales Forecast
```http
GET /api/dashboard/sales/forecast/
```

**Query Parameters:**
- `horizon` - Forecast horizon: `week`, `month`, `quarter`
- `model` - Forecast model: `linear`, `seasonal`, `arima`

### Customer Analytics

#### Customer Dashboard
```http
GET /api/dashboard/customers/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_customers": 15847,
      "new_customers": 234,
      "active_customers": 8923,
      "customer_retention_rate": 78.5,
      "customer_lifetime_value": "4567.89"
    },
    "segmentation": {
      "by_value": [
        {
          "segment": "high_value",
          "count": 1584,
          "percentage": 10.0,
          "avg_order_value": "8945.67"
        }
      ],
      "by_frequency": [
        {
          "segment": "frequent",
          "count": 3169,
          "percentage": 20.0,
          "avg_orders_per_month": 4.2
        }
      ]
    },
    "acquisition_channels": [
      {
        "channel": "organic_search",
        "customers": 4754,
        "percentage": 30.0,
        "cost_per_acquisition": "125.50"
      }
    ]
  }
}
```

#### Customer Cohort Analysis
```http
GET /api/dashboard/customers/cohort-analysis/
```

### Inventory Analytics

#### Inventory Dashboard
```http
GET /api/dashboard/inventory/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_products": 5847,
      "total_value": "12847392.50",
      "low_stock_items": 45,
      "out_of_stock_items": 12,
      "inventory_turnover": 6.2
    },
    "stock_levels": {
      "healthy": 5234,
      "low_stock": 45,
      "out_of_stock": 12,
      "overstock": 156
    },
    "top_movers": [
      {
        "product_id": 1,
        "product_name": "Samsung Galaxy S24",
        "units_sold": 156,
        "velocity": "high"
      }
    ],
    "slow_movers": [
      {
        "product_id": 234,
        "product_name": "Old Model Phone",
        "days_since_last_sale": 45,
        "current_stock": 23
      }
    ],
    "abc_analysis": {
      "A_items": 584,
      "B_items": 1169,
      "C_items": 4094
    }
  }
}
```

#### Stock Movement Analysis
```http
GET /api/dashboard/inventory/movements/
```

### Financial Analytics

#### Financial Dashboard
```http
GET /api/dashboard/financial/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "gross_revenue": "2847392.50",
      "net_revenue": "2562053.25",
      "gross_profit": "1423696.25",
      "operating_expenses": "456789.12",
      "net_profit": "966907.13",
      "profit_margin": 33.9
    },
    "cash_flow": {
      "operating_cash_flow": "1234567.89",
      "investing_cash_flow": "-234567.89",
      "financing_cash_flow": "0.00"
    },
    "accounts_receivable": "234567.89",
    "accounts_payable": "345678.90",
    "expense_breakdown": [
      {
        "category": "cost_of_goods_sold",
        "amount": "1423696.25",
        "percentage": 50.0
      }
    ]
  }
}
```

### Performance Metrics

#### KPI Dashboard
```http
GET /api/dashboard/kpis/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sales_kpis": {
      "revenue_growth": {
        "value": 15.2,
        "target": 20.0,
        "status": "below_target"
      },
      "conversion_rate": {
        "value": 3.2,
        "target": 3.5,
        "status": "below_target"
      }
    },
    "operational_kpis": {
      "order_fulfillment_time": {
        "value": 24.5,
        "unit": "hours",
        "target": 24.0,
        "status": "slightly_above_target"
      },
      "inventory_turnover": {
        "value": 6.2,
        "target": 8.0,
        "status": "below_target"
      }
    },
    "customer_kpis": {
      "customer_satisfaction": {
        "value": 4.3,
        "unit": "rating",
        "target": 4.5,
        "status": "below_target"
      },
      "retention_rate": {
        "value": 78.5,
        "unit": "percentage",
        "target": 80.0,
        "status": "below_target"
      }
    }
  }
}
```

### Real-time Analytics

#### Real-time Dashboard
```http
GET /api/dashboard/realtime/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_visitors": 234,
    "active_sessions": 189,
    "orders_today": 67,
    "revenue_today": "89234.50",
    "live_orders": [
      {
        "order_id": 1234,
        "customer": "John D.",
        "amount": "1599.00",
        "status": "processing",
        "timestamp": "2025-01-20T14:30:00Z"
      }
    ],
    "trending_products": [
      {
        "product_id": 1,
        "product_name": "Samsung Galaxy S24",
        "views_today": 456,
        "sales_today": 12
      }
    ]
  }
}
```

### Custom Reports

#### Generate Report
```http
POST /api/dashboard/reports/generate/
```

**Request Body:**
```json
{
  "report_type": "sales_summary",
  "date_range": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  },
  "filters": {
    "category": [1, 2],
    "warehouse": [1]
  },
  "format": "pdf",
  "email_to": ["manager@mystore.co.za"]
}
```

#### List Saved Reports
```http
GET /api/dashboard/reports/
```

#### Download Report
```http
GET /api/dashboard/reports/{id}/download/
```

### Data Export

#### Export Dashboard Data
```http
GET /api/dashboard/export/
```

**Query Parameters:**
- `data_type` - Type: `sales`, `customers`, `inventory`, `financial`
- `format` - Format: `csv`, `xlsx`, `json`
- `date_range` - Date range filter

### Alerts and Notifications

#### Dashboard Alerts
```http
GET /api/dashboard/alerts/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "low_stock",
      "severity": "warning",
      "title": "Low Stock Alert",
      "message": "45 products are below reorder level",
      "action_required": true,
      "action_url": "/inventory/low-stock/",
      "created_at": "2025-01-20T14:00:00Z"
    }
  ]
}
```

#### Create Alert Rule
```http
POST /api/dashboard/alert-rules/
```

**Request Body:**
```json
{
  "name": "High Value Order Alert",
  "condition": "order_value > 10000",
  "notification_method": "email",
  "recipients": ["manager@mystore.co.za"],
  "is_active": true
}
```

## Dashboard Widgets

### Available Widgets

| Widget | Description |
|--------|-------------|
| `revenue_chart` | Revenue trend chart |
| `order_summary` | Order statistics |
| `top_products` | Best selling products |
| `customer_map` | Geographic customer distribution |
| `inventory_status` | Stock level overview |
| `recent_orders` | Latest orders list |
| `kpi_cards` | Key performance indicators |

### Widget Configuration
```http
PUT /api/dashboard/widgets/config/
```

**Request Body:**
```json
{
  "layout": [
    {
      "widget": "revenue_chart",
      "position": {"x": 0, "y": 0, "w": 6, "h": 4},
      "config": {"period": "month"}
    }
  ]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `INVALID_DATE_RANGE` | Date range is invalid |
| `REPORT_GENERATION_FAILED` | Report generation failed |
| `DATA_NOT_AVAILABLE` | Requested data not available |

## Examples

### Dashboard Overview Flow
```bash
# 1. Get main dashboard
curl -X GET "http://localhost:8000/api/dashboard/overview/?period=month" \
  -H "Authorization: Bearer <token>"

# 2. Get sales analytics
curl -X GET "http://localhost:8000/api/dashboard/sales/?breakdown=category" \
  -H "Authorization: Bearer <token>"

# 3. Generate custom report
curl -X POST http://localhost:8000/api/dashboard/reports/generate/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "sales_summary",
    "date_range": {"start": "2025-01-01", "end": "2025-01-31"},
    "format": "pdf"
  }'
```
