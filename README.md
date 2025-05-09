<div align="center">

# LICENIUM

  <p><strong>Enterprise-Grade License Management Platform</strong></p>

  <div>
      <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15" />
      <img src="https://img.shields.io/badge/Bun-Latest-F9F1E1?style=flat-square&logo=bun" alt="Bun" />
      <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
      <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
  </div>
</div>

## Overview

**Licenium** is a sophisticated license management solution engineered for modern software businesses. With its intuitive dashboard and robust API, Licenium streamlines the entire licensing lifecycle from generation to validation, enabling businesses to focus on growth rather than license administration.

## Key Features

<table>
  <tr>
    <td width="33%">
      <h3>🏢 Organization Management</h3>
      <p>Create, manage, and organize multiple client organizations with customizable hierarchies.</p>
    </td>
    <td width="33%">
      <h3>🛠️ Product Configuration</h3>
      <p>Define products with flexible licensing parameters, feature flags, and usage limits.</p>
    </td>
    <td width="33%">
      <h3>🔑 License Generation</h3>
      <p>Generate and distribute secure, tamper-proof license keys with customizable formats.</p>
    </td>
  </tr>
  <tr>
    <td width="33%">
      <h3>📊 Activation Tracking</h3>
      <p>Monitor license usage, activations, and domain validations in real-time.</p>
    </td>
    <td width="33%">
      <h3>👥 Role-Based Access</h3>
      <p>Implement granular permissions with customizable roles for administrators.</p>
    </td>
    <td width="33%">
      <h3>🔒 Domain Validation</h3>
      <p>Secure domain-based license validation with automatic verification.</p>
    </td>
  </tr>
</table>

## Getting Started

### System Requirements

- **Runtime**: Node.js 18+ or Bun (recommended)

### Quick Installation

<details>
<summary><b>Step 1:</b> Clone the repository</summary>

```bash
git clone https://github.com/Yimikami/licenium.git
cd licenium
```

</details>

<details>
<summary><b>Step 2:</b> Install dependencies</summary>

```bash
bun install
```

</details>

<details>
<summary><b>Step 3:</b> Configure environment</summary>

```bash
cp .env.example .env.local
```

Edit `.env.local` with your connection details and other required settings.

</details>

<details>
<summary><b>Step 4:</b> Set up database</summary>

```bash
bunx prisma migrate dev
bunx prisma generate
bun run db:seed
```

</details>

<details>
<summary><b>Step 5:</b> Launch development server</summary>

```bash
bun run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser

</details>

## API Documentation (WIP)

### Core Endpoints

| Method | Endpoint                 | Description                       | Authentication |
| ------ | ------------------------ | --------------------------------- | -------------- |
| POST   | `/api/licenses/validate` | Validate a license key for domain | Public         |

### License Validation

```http
POST /api/licenses/validate
Content-Type: application/json

{
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "domain": "example.com"
}
```

#### Responses

<table>
  <tr>
    <th>Status</th>
    <th>Response</th>
  </tr>
  <tr>
    <td>Valid License</td>
    <td>
      <pre><code>{
  "success": true,
  "valid": true,
  "message": "License is valid for this domain"
}</code></pre>
    </td>
  </tr>
  <tr>
    <td>Invalid License</td>
    <td>
      <pre><code>{
  "success": true,
  "valid": false,
  "message": "License is invalid or not authorized for this domain"
}</code></pre>
    </td>
  </tr>
</table>

### Client Integration

<details>
<summary><b>JavaScript</b></summary>

```javascript
async function validateLicense(licenseKey, domain) {
  try {
    const response = await fetch(
      "https://yourdomain.com/api/licenses/validate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license_key: licenseKey,
          domain: domain,
        }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error validating license:", error);
    return { success: false, message: "Error validating license" };
  }
}
```

</details>

<details>
<summary><b>PHP</b></summary>

```php
<?php
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

</details>

For comprehensive documentation, visit our [API Reference](#)(TBD).

## Technology Stack

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Next.js 15</strong></td>
      <td align="center"><strong>Tailwind CSS 4</strong></td>
      <td align="center"><strong>shadcn/ui</strong></td>
    </tr>
    <tr>
      <td align="center"><strong>PostgreSQL</strong></td>
      <td align="center"><strong>Prisma ORM</strong></td>
      <td align="center"><strong>NextAuth.js</strong></td>
    </tr>
  </table>
</div>

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
