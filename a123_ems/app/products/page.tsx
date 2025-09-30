'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  getAllProducts,
  getProductsByCategory,
  getCategoryName,
  formatCapacity,
  type BatteryProduct
} from '../../lib/productCatalog';
import {
  Battery,
  Zap,
  Thermometer,
  Shield,
  Wind,
  CheckCircle,
  Award,
  Grid3x3,
  Building2,
  ArrowRight,
  Filter,
  X,
  Package,
  Weight
} from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'utility' | 'ci'>('all');
  const [selectedProduct, setSelectedProduct] = useState<BatteryProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allProducts = getAllProducts();
  const displayProducts = selectedCategory === 'all'
    ? allProducts
    : getProductsByCategory(selectedCategory);

  const utilityCo = getProductsByCategory('utility').length;
  const ciCount = getProductsByCategory('ci').length;

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                  <Battery className="h-8 w-8 mr-3 text-[#FF8C00]" />
                  A123 Battery Storage Product Catalog
                </h1>
                <p className="text-[#6B7280] mt-2">
                  Explore our comprehensive range of lithium iron phosphate (LFP) battery storage solutions
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total Products</p>
                      <p className="text-2xl font-bold text-[#1A1D23]">{allProducts.length}</p>
                      <p className="text-xs text-[#9CA3AF]">Battery models</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Battery className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-xs uppercase tracking-wide">Utility Scale</p>
                      <p className="text-2xl font-bold text-blue-600">{utilityCo}</p>
                      <p className="text-xs text-[#9CA3AF]">Large-scale systems</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Grid3x3 className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-xs uppercase tracking-wide">C&I Solutions</p>
                      <p className="text-2xl font-bold text-green-600">{ciCount}</p>
                      <p className="text-xs text-[#9CA3AF]">Commercial & Industrial</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-[#E5E7EB] inline-flex">
              <Filter className="h-4 w-4 text-[#6B7280] ml-2" />
              <Button
                variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={`${selectedCategory === 'all' ? 'bg-[#FF8C00] text-white' : 'text-[#6B7280] hover:bg-[#F8F9FA]'}`}
              >
                All Products ({allProducts.length})
              </Button>
              <Button
                variant={selectedCategory === 'utility' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory('utility')}
                className={`${selectedCategory === 'utility' ? 'bg-[#FF8C00] text-white' : 'text-[#6B7280] hover:bg-[#F8F9FA]'}`}
              >
                Utility Scale ({utilityCo})
              </Button>
              <Button
                variant={selectedCategory === 'ci' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory('ci')}
                className={`${selectedCategory === 'ci' ? 'bg-[#FF8C00] text-white' : 'text-[#6B7280] hover:bg-[#F8F9FA]'}`}
              >
                Commercial & Industrial ({ciCount})
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <Card
                key={product.model}
                className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-[#1A1D23] text-lg mb-2">{product.model}</CardTitle>
                      <p className="text-sm text-[#6B7280]">{product.name}</p>
                    </div>
                    <Badge className={`${product.category === 'utility' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                      {getCategoryName(product.category)}
                    </Badge>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-[#F8F9FA] rounded-lg overflow-hidden border border-[#E5E7EB]">
                    <Image
                      src={product.image}
                      alt={`${product.model} Battery Container`}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center mb-1">
                        <Battery className="h-3 w-3 mr-1 text-[#FF8C00]" />
                        <span className="text-xs text-[#6B7280]">Capacity</span>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1D23]">{formatCapacity(product.capacity)}</p>
                    </div>
                    <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center mb-1">
                        <Zap className="h-3 w-3 mr-1 text-[#FF8C00]" />
                        <span className="text-xs text-[#6B7280]">Voltage</span>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1D23]">{product.voltage.nominal} V</p>
                    </div>
                    <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center mb-1">
                        <Wind className="h-3 w-3 mr-1 text-[#FF8C00]" />
                        <span className="text-xs text-[#6B7280]">Cooling</span>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1D23]">{product.coolingType}</p>
                    </div>
                    <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center mb-1">
                        <Thermometer className="h-3 w-3 mr-1 text-[#FF8C00]" />
                        <span className="text-xs text-[#6B7280]">Temp Range</span>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1D23]">
                        {product.temperatureRange.min}°C to {product.temperatureRange.max}°C
                      </p>
                    </div>
                  </div>

                  {/* Chemistry */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-900">{product.chemistry}</span>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[#1A1D23] mb-2 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-[#FF8C00]" />
                      Key Features
                    </h4>
                    <div className="space-y-1">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="text-[#FF8C00] text-xs mr-2">•</span>
                          <span className="text-xs text-[#6B7280]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[#1A1D23] mb-2">Applications</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.applications.map((app, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-[#E5E7EB] text-[#6B7280] text-xs"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <Award className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-xs font-semibold text-green-900">Certified</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.certifications.slice(0, 4).map((cert, idx) => (
                        <span key={idx} className="text-xs text-green-700 bg-white px-2 py-1 rounded">
                          {cert}
                        </span>
                      ))}
                      {product.certifications.length > 4 && (
                        <span className="text-xs text-green-700 bg-white px-2 py-1 rounded">
                          +{product.certifications.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-[#FF8C00] hover:bg-[#D97706] text-white"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <Card className="bg-blue-50 border-blue-200 mt-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Battery className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Need Help Choosing the Right Solution?
                  </h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Our A123 battery storage systems are designed for reliability, safety, and performance.
                    Contact our technical team to discuss your specific requirements and find the perfect
                    solution for your energy storage needs.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-blue-900">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Long-life LFP technology</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Advanced thermal management</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Multi-level fire protection</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Global certifications</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#FF8C00] bg-opacity-10 rounded-lg">
                    <Battery className="h-6 w-6 text-[#FF8C00]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1D23]">{selectedProduct.model}</h2>
                    <p className="text-sm text-[#6B7280]">{selectedProduct.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-[#6B7280]" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Product Image */}
              <div className="relative w-full h-80 bg-[#F8F9FA] rounded-lg overflow-hidden border border-[#E5E7EB] mb-6">
                <Image
                  src={selectedProduct.image}
                  alt={`${selectedProduct.model} Battery Container`}
                  fill
                  className="object-contain p-8"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Category Badge */}
                  <div>
                    <Badge className={`${selectedProduct.category === 'utility' ? 'bg-blue-500' : 'bg-green-500'} text-white text-sm`}>
                      {getCategoryName(selectedProduct.category)}
                    </Badge>
                  </div>

                  {/* Key Specifications */}
                  <Card className="border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-lg">Key Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center">
                            <Battery className="h-4 w-4 mr-2 text-[#FF8C00]" />
                            <span className="text-sm text-[#6B7280]">Capacity</span>
                          </div>
                          <span className="text-base font-bold text-[#1A1D23]">{formatCapacity(selectedProduct.capacity)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-[#FF8C00]" />
                            <span className="text-sm text-[#6B7280]">Nominal Voltage</span>
                          </div>
                          <span className="text-base font-bold text-[#1A1D23]">{selectedProduct.voltage.nominal} V</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm text-[#6B7280]">Voltage Range</span>
                          </div>
                          <span className="text-sm font-semibold text-[#1A1D23]">
                            {selectedProduct.voltage.min} - {selectedProduct.voltage.max} V
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center">
                            <Wind className="h-4 w-4 mr-2 text-[#FF8C00]" />
                            <span className="text-sm text-[#6B7280]">Cooling Type</span>
                          </div>
                          <span className="text-base font-bold text-[#1A1D23]">{selectedProduct.coolingType}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 mr-2 text-[#FF8C00]" />
                            <span className="text-sm text-[#6B7280]">Operating Temp</span>
                          </div>
                          <span className="text-sm font-semibold text-[#1A1D23]">
                            {selectedProduct.temperatureRange.min}°C to {selectedProduct.temperatureRange.max}°C
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center">
                            <Weight className="h-4 w-4 mr-2 text-[#FF8C00]" />
                            <span className="text-sm text-[#6B7280]">Weight</span>
                          </div>
                          <span className="text-base font-bold text-[#1A1D23]">
                            {selectedProduct.weight} {selectedProduct.weightUnit}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Configuration */}
                  <Card className="border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Package className="h-4 w-4 mr-2 text-[#FF8C00]" />
                        Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#6B7280]">{selectedProduct.configuration}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Chemistry */}
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-purple-600" />
                        <div>
                          <p className="text-xs text-purple-700 font-semibold">Battery Chemistry</p>
                          <p className="text-lg font-bold text-purple-900">{selectedProduct.chemistry}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Features */}
                  <Card className="border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-[#FF8C00]" />
                        Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-[#FF8C00] mr-2 mt-0.5">•</span>
                            <span className="text-sm text-[#6B7280]">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Applications */}
                  <Card className="border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-lg">Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.applications.map((app, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-[#E5E7EB] text-[#6B7280]"
                          >
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certifications */}
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center text-green-900">
                        <Award className="h-4 w-4 mr-2 text-green-600" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.certifications.map((cert, idx) => (
                          <Badge
                            key={idx}
                            className="bg-white text-green-700 border border-green-300"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer Note */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Contact Sales:</strong> For detailed specifications, pricing, and customization options,
                    please contact our technical sales team. We can configure this system to meet your specific
                    energy storage requirements.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-6 py-4">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-[#FF8C00] hover:bg-[#D97706] text-white"
                  onClick={() => {
                    alert('Contact sales feature would be implemented here');
                  }}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}