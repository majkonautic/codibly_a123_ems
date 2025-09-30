'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import swaggerSpec from '../../lib/swagger';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  FileText,
  ExternalLink,
  Copy,
  CheckCircle,
  Code,
  Globe,
  Zap
} from 'lucide-react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  const [copied, setCopied] = useState(false);
  const [selectedExample, setSelectedExample] = useState('curl');

  const baseUrl = 'http://localhost:3000/api';

  const examples = {
    curl: `# Get all assets
curl "${baseUrl}/assets" \\
  -H "Content-Type: application/json"

# Get specific asset
curl "${baseUrl}/assets/asset-id" \\
  -H "Content-Type: application/json"

# Get portfolio overview
curl "${baseUrl}/portfolio" \\
  -H "Content-Type: application/json"`,
    javascript: `// Get all assets
const response = await fetch('${baseUrl}/assets');
const assets = await response.json();

// Create new asset
const newAsset = await fetch('${baseUrl}/assets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Solar Farm Alpha',
    type: 'solar',
    capacity: 150.5,
    location: 'California',
    lat: 36.7783,
    lng: -121.9573
  })
});`,
    python: `import requests

# Get all assets
response = requests.get('${baseUrl}/assets')
assets = response.json()

# Create new asset
new_asset = requests.post('${baseUrl}/assets', json={
    'name': 'Wind Farm Beta',
    'type': 'wind',
    'capacity': 200.0,
    'location': 'Texas',
    'lat': 32.7767,
    'lng': -96.7970
})`
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom Swagger UI configuration
  const swaggerConfig = {
    spec: swaggerSpec,
    layout: 'BaseLayout',
    deepLinking: true,
    displayOperationId: false,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    defaultModelRendering: 'example',
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  };

  // Apply light theme styles
  useEffect(() => {
    const addCustomStyles = () => {
      const style = document.createElement('style');
      style.id = 'swagger-light-theme';
      style.textContent = `
        /* Main Swagger UI Container */
        .swagger-ui {
          font-family: system-ui, -apple-system, sans-serif !important;
          background: #FFFFFF !important;
          color: #1A1D23 !important;
        }

        /* Top bar */
        .swagger-ui .topbar {
          background: #FFFFFF !important;
          border-bottom: 1px solid #E5E7EB !important;
        }

        /* Info section */
        .swagger-ui .info {
          background: #F8F9FA !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 8px !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
        }

        .swagger-ui .info .title {
          color: #1A1D23 !important;
        }

        .swagger-ui .info .description {
          color: #6B7280 !important;
        }

        /* Operations */
        .swagger-ui .opblock {
          background: #FFFFFF !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 8px !important;
          margin-bottom: 10px !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }

        .swagger-ui .opblock.opblock-get .opblock-summary {
          background: #3B82F6 !important;
          border-color: #2563EB !important;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary {
          background: #10B981 !important;
          border-color: #059669 !important;
        }

        .swagger-ui .opblock.opblock-patch .opblock-summary {
          background: #F59E0B !important;
          border-color: #D97706 !important;
        }

        .swagger-ui .opblock.opblock-delete .opblock-summary {
          background: #EF4444 !important;
          border-color: #DC2626 !important;
        }

        .swagger-ui .opblock .opblock-summary-description {
          color: #FFFFFF !important;
        }

        /* Operation details */
        .swagger-ui .opblock .opblock-body {
          background: #F8F9FA !important;
          border-top: 1px solid #E5E7EB !important;
        }

        /* Parameters */
        .swagger-ui .parameters-container {
          background: #FFFFFF !important;
          border: 1px solid #E5E7EB !important;
        }

        .swagger-ui .parameter__name {
          color: #1A1D23 !important;
        }

        .swagger-ui .parameter__type {
          color: #FF8C00 !important;
        }

        /* Responses */
        .swagger-ui .responses-wrapper {
          background: #FFFFFF !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 6px !important;
        }

        .swagger-ui .response-col_status {
          color: #10B981 !important;
        }

        /* Models */
        .swagger-ui .model-container {
          background: #FFFFFF !important;
          border: 1px solid #E5E7EB !important;
        }

        .swagger-ui .model .property-row {
          border-bottom: 1px solid #E5E7EB !important;
        }

        .swagger-ui .model .property-row .property-name {
          color: #1A1D23 !important;
        }

        /* Try it out */
        .swagger-ui .btn.try-out__btn {
          background: #3b82f6 !important;
          color: white !important;
          border: none !important;
        }

        .swagger-ui .btn.execute {
          background: #16a34a !important;
          color: white !important;
          border: none !important;
        }

        /* Tables */
        .swagger-ui table {
          background: #FFFFFF !important;
        }

        .swagger-ui table thead tr td,
        .swagger-ui table thead tr th {
          background: #F8F9FA !important;
          color: #1A1D23 !important;
          border-bottom: 1px solid #E5E7EB !important;
        }

        .swagger-ui table tbody tr td {
          color: #6B7280 !important;
          border-bottom: 1px solid #E5E7EB !important;
        }

        /* JSON highlight */
        .swagger-ui .highlight-code {
          background: #F8F9FA !important;
        }

        .swagger-ui .highlight-code .hljs {
          background: #F8F9FA !important;
          color: #1A1D23 !important;
        }

        /* Input fields */
        .swagger-ui input,
        .swagger-ui textarea {
          background: #FFFFFF !important;
          border: 1px solid #E5E7EB !important;
          color: #1A1D23 !important;
        }

        /* Scrollbars */
        .swagger-ui ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .swagger-ui ::-webkit-scrollbar-track {
          background: #F8F9FA;
        }

        .swagger-ui ::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 4px;
        }

        .swagger-ui ::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `;

      // Remove existing styles
      const existingStyle = document.getElementById('swagger-light-theme');
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(style);
    };

    // Add styles with a small delay to ensure Swagger UI is loaded
    const timer = setTimeout(addCustomStyles, 100);

    return () => {
      clearTimeout(timer);
      const style = document.getElementById('swagger-light-theme');
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                  <FileText className="h-8 w-8 mr-3 text-[#FF8C00]" />
                  EMS-SCADA API Documentation
                </h1>
                <p className="text-[#6B7280]">
                  Enterprise-grade energy management system API documentation
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success" className="bg-green-600">
                  <Zap className="h-3 w-3 mr-1" />
                  v1.0.0
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-400">
                  <Globe className="h-3 w-3 mr-1" />
                  OpenAPI 3.0
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-[#6B7280]">Endpoints</p>
                      <p className="text-xl font-bold text-[#1A1D23]">6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-[#6B7280]">Schemas</p>
                      <p className="text-xl font-bold text-[#1A1D23]">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-[#6B7280]">Tags</p>
                      <p className="text-xl font-bold text-[#1A1D23]">4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-[#6B7280]">Base URL</p>
                      <p className="text-sm font-mono text-[#1A1D23]">localhost:3000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Start */}
          <Card className="bg-white border-[#E5E7EB] mb-6">
            <CardHeader>
              <CardTitle className="text-[#1A1D23] flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Quick Start Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                {Object.keys(examples).map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedExample === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExample(lang)}
                    className={selectedExample === lang
                      ? "bg-[#FF8C00] hover:bg-[#E67A00] text-white"
                      : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                    }
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="relative">
                <pre className="bg-[#F8F9FA] text-[#1A1D23] p-4 rounded-lg overflow-x-auto text-sm border border-[#E5E7EB]">
                  <code>{examples[selectedExample as keyof typeof examples]}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 border-[#E5E7EB] text-[#6B7280] hover:bg-white hover:text-[#1A1D23]"
                  onClick={() => copyToClipboard(examples[selectedExample as keyof typeof examples])}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Swagger UI */}
          <Card className="bg-white border-[#E5E7EB]">
            <CardContent className="p-0">
              <div className="swagger-container">
                <SwaggerUI {...swaggerConfig} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}