# Lineless Backend - Invoice & Services Management

Backend service for generating invoices, estimations, and managing institutional services for Lineless.

## Features

- **Invoice Generation**: Generate professional PDF invoices with tax calculations
- **Estimation Service**: Calculate investment needed for services with tax breakdowns
- **Tax Calculation**: Configurable tax percentages and discounts
- **PDF Download**: Generate downloadable invoices
- **Cost Breakdown**: Detailed expense tracking including:
  - Subtotal
  - Discounts
  - Tax/GST
  - Final Total

## Installation

### Prerequisites
- Node.js 16+ (with npm)

### Setup

1. Navigate to Backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration (optional for development)

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### 1. Generate Invoice Estimation
**POST** `/api/invoices/estimate`

Calculate investment needed with tax breakdown.

**Request Body:**
```json
{
  "organizationName": "Company Name",
  "organizationType": "business|government",
  "items": [
    {
      "description": "Service Description",
      "quantity": 1,
      "unitPrice": 1000
    }
  ],
  "taxPercentage": 18,
  "discountPercentage": 5,
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "EST-XXXXXXXX",
    "organizationName": "Company Name",
    "organizationType": "business",
    "items": [...],
    "estimation": {
      "subtotal": 1000,
      "discountPercentage": 5,
      "discountAmount": 50,
      "taxPercentage": 18,
      "taxAmount": 171,
      "totalInvestmentNeeded": 1121,
      "generatedAt": "2024-01-17T..."
    }
  }
}
```

### 2. Generate Downloadable PDF Invoice
**POST** `/api/invoices/generate`

Generate and download a professional PDF invoice.

**Request Body:**
```json
{
  "organizationName": "Company Name",
  "organizationType": "business|government",
  "items": [
    {
      "description": "Service Description",
      "quantity": 1,
      "unitPrice": 1000
    }
  ],
  "taxPercentage": 18,
  "discountPercentage": 5,
  "dueDate": "2024-02-17",
  "notes": "Payment terms details"
}
```

**Response:** PDF file download

### 3. Calculate Invoice Totals
**POST** `/api/invoices/calculate`

Quick calculation of invoice totals.

**Request Body:**
```json
{
  "items": [
    {
      "description": "Service",
      "quantity": 2,
      "unitPrice": 500
    }
  ],
  "taxPercentage": 18,
  "discountPercentage": 0
}
```

**Response:**
```json
{
  "success": true,
  "calculations": {
    "items": [...],
    "summary": {
      "subtotal": 1000,
      "discountPercentage": 0,
      "discountAmount": 0,
      "taxPercentage": 18,
      "taxAmount": 180,
      "total": 1180
    }
  }
}
```

## Integration with Frontend

Frontend can call these endpoints using:

```typescript
// Example service call
const generateEstimate = async (data) => {
  const response = await fetch('http://localhost:5000/api/invoices/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

## Project Structure

```
Backend/
├── server.js                 # Main server entry point
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
└── src/
    ├── models/
    │   └── Invoice.js       # Invoice data model
    ├── services/
    │   └── InvoiceService.js # Invoice generation & calculations
    └── routes/
        └── invoiceRoutes.js # API endpoints
```

## Configuration

All configuration is in `.env` file:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

## Next Steps

1. Install dependencies: `npm install`
2. Start backend: `npm run dev`
3. Frontend can call endpoints at `http://localhost:5000/api/invoices/*`
4. Customize tax rates, item types, and business logic as needed

## Support

For issues or feature requests, contact the development team.
