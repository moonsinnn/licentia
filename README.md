<div align="center">

# 🔐 LICENTIA

**Modern License Management Solution**


</div>

## 🌟 Overview

Licentia is a powerful license management platform designed for modern software businesses. Generate, track, and manage software licenses with an intuitive dashboard and robust API.

### ✨ Key Features

- 🏢 **Organization Management** - Create and manage multiple organizations
- 🛠️ **Product Configuration** - Set up products with customizable licensing options
- 🔑 **License Generation** - Create and distribute license keys securely
- 📊 **Activation Tracking** - Monitor license usage and activations
- 👥 **Role-Based Access** - Granular permissions for admins and super admins

## 🚀 Getting Started

### Requirements

- Node.js 18+ or Bun (recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yimikami/licentia.git
cd licentia
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your MySQL connection in `.env.local`

5. Run database migrations:
```bash
bunx prisma migrate dev
```

6. Start the development server:
```bash
bun dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Documentation

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/licenses/validate` | Validate a license key |

### License Validation API

**Endpoint**: `POST /api/licenses/validate`

Validates if a license key is valid for a specific domain.

**Request Body**:
```json
{
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "domain": "example.com"
}
```

**Success Response**:
```json
{
  "success": true,
  "valid": true,
  "message": "License is valid for this domain"
}
```

**Invalid License Response**:
```json
{
  "success": true,
  "valid": false,
  "message": "License is invalid or not authorized for this domain"
}
```

### Client Integration Examples

#### JavaScript
```javascript
// Validate a license key
async function validateLicense(licenseKey, domain) {
  try {
    const response = await fetch('https://yourdomain.com/api/licenses/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        license_key: licenseKey,
        domain: domain,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating license:', error);
    return { success: false, message: 'Error validating license' };
  }
}
```

#### PHP
```php
<?php
// Validate a license key
function validateLicense($licenseKey, $domain) {
  $url = 'https://yourdomain.com/api/licenses/validate';
  $data = [
    'license_key' => $licenseKey,
    'domain' => $domain
  ];

  $options = [
    'http' => [
      'header'  => "Content-type: application/json\r\n",
      'method'  => 'POST',
      'content' => json_encode($data)
    ]
  ];

  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  
  if ($result === FALSE) {
    return ['success' => false, 'message' => 'Error validating license'];
  }
  
  return json_decode($result, true);
}
?>
```

Visit our [API documentation](/api-docs)(TODO) for more detailed usage examples.

## 🔧 Tech Stack

- **Frontend**: Next.js with App Router
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
