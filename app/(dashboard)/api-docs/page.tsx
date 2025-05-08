import { Code, FileJson } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-muted-foreground">
          Integration guide for Licentia license management
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Getting Started</h2>
        <p>
          Licentia provides simple REST APIs for license validation and activation. 
          These endpoints can be integrated into your application to verify license 
          authenticity and track activations.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Code className="h-6 w-6" />
          API Endpoints
        </h2>

        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium">Validate License</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check if a license key is valid for a specific domain
            </p>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Endpoint</h4>
              <div className="mt-1 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">POST</span>
                <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">/api/licenses/validate</code>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Request Body</h4>
              <pre className="mt-1 bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
                {`{
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "domain": "example.com"
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Response (Success)</h4>
              <pre className="mt-1 bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
                {`{
  "success": true,
  "valid": true,
  "message": "License is valid for this domain"
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Response (Invalid)</h4>
              <pre className="mt-1 bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
                {`{
  "success": true,
  "valid": false,
  "message": "License is invalid or not authorized for this domain"
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="rounded-lg border mt-6">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium">Activate License</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Activate a license for a specific domain
            </p>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Endpoint</h4>
              <div className="mt-1 flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">POST</span>
                <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">/api/licenses/activate</code>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Request Body</h4>
              <pre className="mt-1 bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
                {`{
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "domain": "example.com"
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Response (Success)</h4>
              <pre className="mt-1 bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
                {`{
  "success": true,
  "activated": true,
  "message": "License successfully activated for this domain"
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Response (Failed)</h4>
              <pre className="mt-1 bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
                {`{
  "success": true,
  "activated": false,
  "message": "Failed to activate license for this domain"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileJson className="h-6 w-6" />
          Client Integration Examples
        </h2>

        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium">JavaScript Example</h3>
          </div>
          <div className="p-4">
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
              {`// Validate a license key
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

// Activate a license key
async function activateLicense(licenseKey, domain) {
  try {
    const response = await fetch('https://yourdomain.com/api/licenses/activate', {
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
    console.error('Error activating license:', error);
    return { success: false, message: 'Error activating license' };
  }
}`}
            </pre>
          </div>
        </div>

        <div className="rounded-lg border mt-4">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium">PHP Example</h3>
          </div>
          <div className="p-4">
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
              {`<?php
// Validate a license key
function validateLicense($licenseKey, $domain) {
  $url = 'https://yourdomain.com/api/licenses/validate';
  $data = [
    'license_key' => $licenseKey,
    'domain' => $domain
  ];

  $options = [
    'http' => [
      'header'  => "Content-type: application/json\\r\\n",
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

// Activate a license key
function activateLicense($licenseKey, $domain) {
  $url = 'https://yourdomain.com/api/licenses/activate';
  $data = [
    'license_key' => $licenseKey,
    'domain' => $domain
  ];

  $options = [
    'http' => [
      'header'  => "Content-type: application/json\\r\\n",
      'method'  => 'POST',
      'content' => json_encode($data)
    ]
  ];

  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  
  if ($result === FALSE) {
    return ['success' => false, 'message' => 'Error activating license'];
  }
  
  return json_decode($result, true);
}
?>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 