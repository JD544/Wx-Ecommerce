import React, { useEffect, useRef, useState } from 'react';
import { Modal } from './modal';
import useStorage from '../../../func/hooks/useStorage';
import { Plugin } from '../plugins';
import { useBuilder } from '../../../func/hooks/useBuilder';
import { faShoppingCart, faBox, faUsers, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { BuilderComponent, Media } from '../../../func/builder';
import { Dropdown } from '../../tools/dropdown';
import { useAuth } from '../../../func/hooks/useAuth';
import Marketing from './store/marketing';
import Analytics from './store/Analytics';
import Customers from './store/customers';
import Orders from './store/orders';
import Products from './store/products';

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity: number;
  weight: number;
  weightUnit: 'kg' | 'lb' | 'oz' | 'g';
  category: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  vendor: string;
  productType: string;
  images: string[];
  variants: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

// Product variant interface
export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  quantity: number;
  weight: number;
  options: { [key: string]: string };
  image?: string;
}

// Order interface
export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'voided';
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Order item interface
export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

// Customer interface
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
  totalSpent: number;
  ordersCount: number;
  status: 'active' | 'disabled';
  addresses: Address[];
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Address interface
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
  isDefault: boolean;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  isVisible: boolean;
}

// Collection interface
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  conditions: CollectionCondition[];
  isVisible: boolean;
  sortOrder: 'manual' | 'best-selling' | 'alpha-asc' | 'alpha-desc' | 'price-asc' | 'price-desc' | 'created-asc' | 'created-desc';
}

// Collection condition interface
export interface CollectionCondition {
  field: 'title' | 'type' | 'vendor' | 'price' | 'tag' | 'weight';
  relation: 'equals' | 'not_equals' | 'starts_with' | 'ends_with' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: string;
}

// Discount interface
export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minimumAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startsAt: string;
  endsAt?: string;
  isActive: boolean;
  appliesToProducts: string[];
  appliesToCollections: string[];
  customerEligibility: 'all' | 'specific' | 'group';
  eligibleCustomers: string[];
}

// Settings interfaces
export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  weightUnit: 'kg' | 'lb' | 'oz' | 'g';
  timezone: string;
  orderIdFormat: string;
  enableInventoryTracking: boolean;
  enableTaxes: boolean;
  taxRate: number;
  enableShipping: boolean;
  freeShippingThreshold?: number;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableCompareProducts: boolean;
  enableGuestCheckout: boolean;
  requirePhoneNumber: boolean;
}

export interface PaymentSettings {
  enableStripe: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  enablePayPal: boolean;
  paypalClientId: string;
  paypalClientSecret: string;
  enableCOD: boolean;
  enableBankTransfer: boolean;
  bankDetails: string;
}

export interface ShippingSettings {
  zones: ShippingZone[];
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  minWeight?: number;
  maxWeight?: number;
  minAmount?: number;
  freeShipping: boolean;
}

// Analytics interface
export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: { id: string; name: string; revenue: number; orders: number }[];
  recentOrders: Order[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  template: 'default' | 'landing' | 'about' | 'contact' | 'custom';
  createdAt: string;
  updatedAt: string;
}


// Default data
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    shortDescription: 'Premium wireless headphones with noise cancellation.',
    price: 199.99,
    compareAtPrice: 249.99,
    cost: 120.00,
    sku: 'WBH-001',
    barcode: '123456789012',
    trackQuantity: true,
    quantity: 45,
    weight: 0.3,
    weightUnit: 'kg',
    category: 'Electronics',
    tags: ['headphones', 'wireless', 'bluetooth', 'audio'],
    status: 'active',
    vendor: 'AudioTech',
    productType: 'Headphones',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    variants: [],
    seoTitle: 'Best Wireless Bluetooth Headphones - AudioTech',
    seoDescription: 'Shop premium wireless headphones with superior sound quality and long battery life.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    slug: 'wireless-bluetooth-headphones'
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable organic cotton t-shirt made from sustainably sourced materials.',
    shortDescription: 'Comfortable organic cotton t-shirt.',
    price: 29.99,
    compareAtPrice: 39.99,
    cost: 15.00,
    sku: 'OCT-001',
    barcode: '123456789013',
    trackQuantity: true,
    quantity: 120,
    weight: 0.15,
    weightUnit: 'kg',
    category: 'Clothing',
    tags: ['t-shirt', 'organic', 'cotton', 'sustainable'],
    status: 'active',
    vendor: 'EcoWear',
    productType: 'T-Shirt',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    variants: [
      {
        id: '2-1',
        productId: '2',
        title: 'Small / Black',
        price: 29.99,
        cost: 15.00,
        sku: 'OCT-001-S-BLK',
        quantity: 30,
        weight: 0.15,
        options: { size: 'Small', color: 'Black' }
      },
      {
        id: '2-2',
        productId: '2',
        title: 'Medium / White',
        price: 29.99,
        cost: 15.00,
        sku: 'OCT-001-M-WHT',
        quantity: 40,
        weight: 0.15,
        options: { size: 'Medium', color: 'White' }
      }
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    slug: 'organic-cotton-t-shirt'
  }
];

const defaultCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    acceptsMarketing: true,
    totalSpent: 459.98,
    ordersCount: 3,
    status: 'active',
    addresses: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        province: 'NY',
        country: 'United States',
        zip: '10001',
        phone: '+1234567890',
        isDefault: true
      }
    ],
    tags: ['vip', 'repeat-customer'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  }
];

const defaultOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1001',
    customer: defaultCustomers[0],
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        quantity: 1,
        price: 199.99,
        total: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
      }
    ],
    subtotal: 199.99,
    tax: 20.00,
    shipping: 9.99,
    discount: 0,
    total: 229.98,
    status: 'confirmed',
    paymentStatus: 'paid',
    fulfillmentStatus: 'unfulfilled',
    shippingAddress: defaultCustomers[0].addresses[0],
    billingAddress: defaultCustomers[0].addresses[0],
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  }
];

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    isVisible: true
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    isVisible: true
  }
];

// Define our e-commerce components
export const productList: BuilderComponent = {
  id: 'wx-product-list',
  type: 'plugin',
  pluginName: 'E-commerce',
  content: 'Product List',
  icon: faBox,
  plugin: 'product-grid',
  pluginSettings: [
    { name: 'Category', value: '', description: 'Filter by category', type: 'string' },
    { name: 'ProductsPerPage', value: '12', description: 'Number of products to show', type: 'number' },
    { name: 'ShowPrice', value: true, description: 'Show product price', type: 'boolean' },
    { name: 'ShowAddToCart', value: true, description: 'Show add to cart button', type: 'boolean' }
  ]
};

export const productDetail: BuilderComponent = {
  id: 'wx-product-detail',
  type: 'plugin',
  pluginName: 'E-commerce',
  content: 'Product Detail',
  icon: faBox,
  plugin: 'product-detail',
  pluginSettings: [
    { name: 'ShowRelatedProducts', value: true, description: 'Show related products', type: 'boolean' },
    { name: 'ShowReviews', value: true, description: 'Show product reviews', type: 'boolean' },
    { name: 'EnableZoom', value: true, description: 'Enable image zoom', type: 'boolean' }
  ]
};

export const shoppingCart: BuilderComponent = {
  id: 'wx-shopping-cart',
  type: 'plugin',
  pluginName: 'E-commerce',
  content: 'Shopping Cart',
  icon: faShoppingCart,
  plugin: 'shopping-cart',
  pluginSettings: [
    { name: 'EnableCoupons', value: true, description: 'Enable coupon codes', type: 'boolean' },
    { name: 'ShowShipping', value: true, description: 'Show shipping calculator', type: 'boolean' }
  ]
};

export const checkout: BuilderComponent = {
  id: 'wx-checkout',
  type: 'plugin',
  pluginName: 'E-commerce',
  content: 'Checkout',
  icon: faCreditCard,
  plugin: 'checkout',
  pluginSettings: [
    { name: 'EnableGuestCheckout', value: true, description: 'Allow guest checkout', type: 'boolean' },
    { name: 'RequirePhone', value: false, description: 'Require phone number', type: 'boolean' }
  ]
};

const EcommerceDashboard = ({ pluginSettings }: { pluginSettings: Plugin }) => {
  const { addPage, addMedia } = useBuilder();
  const { putItemInStore, getState } = useStorage();
  const { user } = useAuth();

  // State variables
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: '',
    content: null
  });

  // Get stored data or initialize with defaults
  const [products, setProducts] = useState<Product[]>(
    getState(pluginSettings.name)?.products as Product[] || defaultProducts
  );

  const [orders, setOrders] = useState<Order[]>(
    getState(pluginSettings.name)?.orders as Order[] || defaultOrders
  );

  const [customers, setCustomers] = useState<Customer[]>(
    getState(pluginSettings.name)?.customers as Customer[] || defaultCustomers
  );

  const [categories, setCategories] = useState<Category[]>(
    getState(pluginSettings.name)?.categories as Category[] || defaultCategories
  );

  const [collections, setCollections] = useState<Collection[]>(
    getState(pluginSettings.name)?.collections as Collection[] || []
  );

  const [discounts, setDiscounts] = useState<Discount[]>(
    getState(pluginSettings.name)?.discounts as Discount[] || []
  );

const [pages, setPages] = useState<Page[]>(
  getState(pluginSettings.name)?.pages as Page[] || [
    {
      id: '1',
      name: 'About Us',
      slug: 'about-us',
      content: '<h1>About Our Store</h1><p>We are a leading e-commerce store...</p>',
      metaTitle: 'About Us - Learn More About Our Story',
      metaDescription: 'Discover our story, mission, and values.',
      isPublished: true,
      template: 'about',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Contact Us',
      slug: 'contact',
      content: '<h1>Contact Us</h1><p>Get in touch with our team...</p>',
      metaTitle: 'Contact Us - Get in Touch',
      metaDescription: 'Contact our customer service team for any questions.',
      isPublished: true,
      template: 'contact',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    }
  ]
);

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(
    getState(pluginSettings.name)?.storeSettings || {
      storeName: 'My Store',
      storeDescription: 'Your online store description',
      storeEmail: 'store@example.com',
      storePhone: '+1234567890',
      currency: 'USD',
      weightUnit: 'kg',
      timezone: 'UTC',
      orderIdFormat: '#1000',
      enableInventoryTracking: true,
      enableTaxes: true,
      taxRate: 10,
      enableShipping: true,
      freeShippingThreshold: 100,
      enableReviews: true,
      enableWishlist: true,
      enableCompareProducts: true,
      enableGuestCheckout: true,
      requirePhoneNumber: false
    }
  );

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(
    getState(pluginSettings.name)?.paymentSettings || {
      enableStripe: false,
      stripePublishableKey: '',
      stripeSecretKey: '',
      enablePayPal: false,
      paypalClientId: '',
      paypalClientSecret: '',
      enableCOD: true,
      enableBankTransfer: true,
      bankDetails: ''
    }
  );

  // Calculate analytics
  const analytics: Analytics = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
    conversionRate: 2.5, // Mock data
    topProducts: products.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name,
      revenue: product.price * 10, // Mock data
      orders: 10 // Mock data
    })),
    recentOrders: orders.slice(0, 5),
    monthlyRevenue: [
      { month: 'Jan', revenue: 5000 },
      { month: 'Feb', revenue: 7500 },
      { month: 'Mar', revenue: 6200 }
    ]
  };

  // Save data to storage when it changes
  useEffect(() => {
    const config = {
      ...getState(pluginSettings.name),
      products,
      orders,
      customers,
      categories,
      collections,
      discounts,
      storeSettings,
      paymentSettings,
      pages
    };

    putItemInStore(pluginSettings.name, config);
  }, [products, orders, customers, categories, collections, discounts, storeSettings, paymentSettings, pages]);

  // Helper functions
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: storeSettings.currency
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate pages
  const generatePages = () => {
    // Generate product pages
    products.forEach(product => {
      addPage({
        id: product.id,
        name: product.name,
        description: product.shortDescription,
        url: `products/${product.slug}`,
        components: [productDetail]
      });
    });

    // Generate category pages
    categories.forEach(category => {
      addPage({
        id: category.id,
        name: category.name,
        description: category.description,
        url: `categories/${category.slug}`,
        components: [productList]
      });
    });

    // Generate main pages
    addPage({
      id: 'shop',
      name: 'Shop',
      description: 'Browse all products',
      url: 'shop',
      components: [productList]
    });

    addPage({
      id: 'cart',
      name: 'Shopping Cart',
      description: 'Your shopping cart',
      url: 'cart',
      components: [shoppingCart]
    });

    addPage({
      id: 'checkout',
      name: 'Checkout',
      description: 'Complete your purchase',
      url: 'checkout',
      components: [checkout]
    });
  };

  // Modal management
  const closeModal = () => {
    setModal({ isOpen: false, title: '', content: null });
  };

  const openAddProductModal = () => {
    setModal({
      isOpen: true,
      title: 'Add New Product',
      content: <AddProductForm onClose={closeModal} categories={categories} />
    });
  };

  // Filter functions
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.template.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="wx-ecom-card">
            <h2 className="wx-ecom-section-title">Store Overview</h2>
            <div className="wx-ecom-stats-grid">
              <div className="wx-ecom-stat-card">
                <div className="wx-ecom-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <span className="wx-ecom-stat-value">{formatCurrency(analytics.totalRevenue)}</span>
                <span className="wx-ecom-stat-label">Total Revenue</span>
              </div>
              <div className="wx-ecom-stat-card">
                <div className="wx-ecom-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 4H8l-1-2H2v2h2l3.6 7.59L6.25 14.04C6.09 14.32 6 14.65 6 15c0 1.1.9 2 2 2h12v-2H8.42l1.04-2H19l2-7z"></path>
                  </svg>
                </div>
                <span className="wx-ecom-stat-value">{analytics.totalOrders}</span>
                <span className="wx-ecom-stat-label">Total Orders</span>
              </div>
              <div className="wx-ecom-stat-card">
                <div className="wx-ecom-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="wx-ecom-stat-value">{analytics.totalCustomers}</span>
                <span className="wx-ecom-stat-label">Total Customers</span>
              </div>
              <div className="wx-ecom-stat-card">
                <div className="wx-ecom-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <span className="wx-ecom-stat-value">{analytics.totalProducts}</span>
                <span className="wx-ecom-stat-label">Total Products</span>
              </div>
            </div>

            <div className="wx-ecom-dashboard-grid">
              <div className="wx-ecom-dashboard-section">
                <h3 className="wx-ecom-section-subtitle">Recent Orders</h3>
                <div className="wx-ecom-recent-orders">
                  {analytics.recentOrders.map(order => (
                    <div key={order.id} className="wx-ecom-recent-order">
                      <div className="wx-ecom-order-info">
                        <span className="wx-ecom-order-number">{order.orderNumber}</span>
                        <span className="wx-ecom-order-customer">{order.customer.firstName} {order.customer.lastName}</span>
                      </div>
                      <div className="wx-ecom-order-meta">
                        <span className={`wx-ecom-status-badge wx-ecom-status-${order.status}`}>
                          {order.status}
                        </span>
                        <span className="wx-ecom-order-total">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wx-ecom-dashboard-section">
                <h3 className="wx-ecom-section-subtitle">Top Products</h3>
                <div className="wx-ecom-top-products">
                  {analytics.topProducts.map(product => (
                    <div key={product.id} className="wx-ecom-top-product">
                      <div className="wx-ecom-product-info">
                        <span className="wx-ecom-product-name">{product.name}</span>
                        <span className="wx-ecom-product-orders">{product.orders} orders</span>
                      </div>
                      <span className="wx-ecom-product-revenue">{formatCurrency(product.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <Products
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            formatCurrency={formatCurrency}
            openAddProductModal={openAddProductModal}
            deleteProduct={deleteProduct}
            editProduct={editProduct}
            />
        );

      case 'orders':
        return (
          <Orders
            filteredOrders={filteredOrders}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            updateOrderStatus={updateOrderStatus}
            viewOrder={viewOrder}            
            />
        );

      case 'customers':
        return (
          <Customers 
            filteredCustomers={filteredCustomers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            openAddCustomerModal={openAddCustomerModal}
            editCustomer={editCustomer}
            deleteCustomer={deleteCustomer}
          />
        );

      case 'analytics':
        return (
          <Analytics analytics={analytics} formatCurrency={formatCurrency} />
        );

      case 'marketing':
        return (
          <Marketing discounts={discounts} openAddDiscountModal={openAddDiscountModal} formatCurrency={formatCurrency} />
        );

        
        case 'pages':
            return (
                <div className="wx-ecom-card">
                <div className="wx-ecom-header">
                    <h2 className="wx-ecom-section-title">Pages</h2>
                    <div className="wx-ecom-search">
                    <input
                        type="text"
                        placeholder="Search pages..."
                        className="wx-ecom-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                    <button className="wx-ecom-button wx-ecom-button-action" onClick={openAddPageModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    </button>
                </div>

                <div className="wx-ecom-pages-list">
                    {filteredPages.length > 0 ? (
                    filteredPages.map(page => (
                        <div key={page.id} className="wx-ecom-page-item">
                        <div className="wx-ecom-page-info">
                            <div className="wx-ecom-page-primary">
                            <h3 className="wx-ecom-page-name">{page.name}</h3>
                            <span className={`wx-ecom-status-badge wx-ecom-status-${page.isPublished ? 'active' : 'draft'}`}>
                                {page.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="wx-ecom-page-template">{page.template}</span>
                            </div>
                            <div className="wx-ecom-page-details">
                            <span>Slug: /{page.slug}</span>
                            <span>Template: {page.template}</span>
                            <span>Updated: {formatDate(page.updatedAt)}</span>
                            </div>
                        </div>
                        <div className="wx-ecom-page-actions">
                            <button className="wx-ecom-icon-button" onClick={() => editPage(page)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                            </button>
                            <button className="wx-ecom-icon-button" onClick={() => window.open(`/${page.slug}`, '_blank')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15,3 21,3 21,9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            </button>
                            <button className="wx-ecom-icon-button wx-ecom-delete-button" onClick={() => deletePage(page.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                            </button>
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="wx-ecom-empty-state">
                        <p>No pages found. Create your first page!</p>
                    </div>
                    )}
                </div>
                </div>
            );
            

      case 'settings':
        return (
          <div className="wx-ecom-card">
            <h2 className="wx-ecom-section-title">Store Settings</h2>
            
            <div className="wx-ecom-settings-tabs">
              <button className={`wx-ecom-tab ${activeSettingsTab === 'general' && 'active'}`} onClick={() => setActiveSettingsTab('general')}>General</button>
              <button className={`wx-ecom-tab ${activeSettingsTab === 'payments' && 'active'}`} onClick={() => setActiveSettingsTab('payments')}>Payments</button>
              <button className={`wx-ecom-tab ${activeSettingsTab === 'shipping' && 'active'}`} onClick={() => setActiveSettingsTab('shipping')}>Shipping</button>
              <button className={`wx-ecom-tab ${activeSettingsTab === 'integrations' && 'active'}`} onClick={() => setActiveSettingsTab('integrations')}>Integrations</button>
            </div>

            {renderSettingsContent()}
          </div>
        );

      default:
        return null;
    }
  };

  // Settings state
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case 'general':
        return (
          <form onSubmit={saveStoreSettings} className="wx-ecom-settings-form">
            <div className="wx-ecom-field">
              <label className="wx-ecom-label">Store Name</label>
              <input 
                type="text" 
                className="wx-ecom-input" 
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
              />
            </div>
            
            <div className="wx-ecom-field">
              <label className="wx-ecom-label">Store Description</label>
              <textarea 
                className="wx-ecom-input" 
                rows={3}
                value={storeSettings.storeDescription}
                onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
              />
            </div>
            
            <div className="wx-ecom-field">
              <label className="wx-ecom-label">Store Email</label>
              <input 
                type="email" 
                className="wx-ecom-input" 
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
              />
            </div>
            
            <div className="wx-ecom-field">
              <label className="wx-ecom-label">Currency</label>
              <Dropdown
                options={[
                  { label: 'USD - US Dollar', value: 'USD' },
                  { label: 'EUR - Euro', value: 'EUR' },
                  { label: 'GBP - British Pound', value: 'GBP' },
                  { label: 'CAD - Canadian Dollar', value: 'CAD' }
                ]}
                value={storeSettings.currency}
                onChange={(value) => setStoreSettings({...storeSettings, currency: value})}
                placeholder="Select Currency"
              />
            </div>

            <div className="wx-ecom-setting-item">
              <div>
                <h3 className="wx-ecom-setting-title">Enable Inventory Tracking</h3>
                <p className="wx-ecom-setting-description">Track product quantities and show stock status</p>
              </div>
              <div 
                className={`wx-ecom-toggle ${storeSettings.enableInventoryTracking ? 'active' : 'inactive'}`}
                onClick={() => setStoreSettings({...storeSettings, enableInventoryTracking: !storeSettings.enableInventoryTracking})}
              >
                <div className={`wx-ecom-toggle-handle ${storeSettings.enableInventoryTracking ? 'active' : 'inactive'}`} />
              </div>
            </div>

            <div className="wx-ecom-setting-item">
              <div>
                <h3 className="wx-ecom-setting-title">Enable Guest Checkout</h3>
                <p className="wx-ecom-setting-description">Allow customers to checkout without creating an account</p>
              </div>
              <div 
                className={`wx-ecom-toggle ${storeSettings.enableGuestCheckout ? 'active' : 'inactive'}`}
                onClick={() => setStoreSettings({...storeSettings, enableGuestCheckout: !storeSettings.enableGuestCheckout})}
              >
                <div className={`wx-ecom-toggle-handle ${storeSettings.enableGuestCheckout ? 'active' : 'inactive'}`} />
              </div>
            </div>

            <div className="wx-ecom-modal-actions">
              <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={generatePages}>
                Generate Store Pages
              </button>
              <button type="submit" className="wx-ecom-button">
                Save Settings
              </button>
            </div>
          </form>
        );

      case 'payments':
        return (
          <form onSubmit={savePaymentSettings} className="wx-ecom-settings-form">
            <div className="wx-ecom-payment-method">
              <div className="wx-ecom-setting-item">
                <div>
                  <h3 className="wx-ecom-setting-title">Stripe Payments</h3>
                  <p className="wx-ecom-setting-description">Accept credit card payments via Stripe</p>
                </div>
                <div 
                  className={`wx-ecom-toggle ${paymentSettings.enableStripe ? 'active' : 'inactive'}`}
                  onClick={() => setPaymentSettings({...paymentSettings, enableStripe: !paymentSettings.enableStripe})}
                >
                  <div className={`wx-ecom-toggle-handle ${paymentSettings.enableStripe ? 'active' : 'inactive'}`} />
                </div>
              </div>
              
              {paymentSettings.enableStripe && (
                <>
                  <div className="wx-ecom-field">
                    <label className="wx-ecom-label">Stripe Publishable Key</label>
                    <input 
                      type="text" 
                      className="wx-ecom-input" 
                      value={paymentSettings.stripePublishableKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, stripePublishableKey: e.target.value})}
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="wx-ecom-field">
                    <label className="wx-ecom-label">Stripe Secret Key</label>
                    <input 
                      type="password" 
                      className="wx-ecom-input" 
                      value={paymentSettings.stripeSecretKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                      placeholder="sk_test_..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="wx-ecom-payment-method">
              <div className="wx-ecom-setting-item">
                <div>
                  <h3 className="wx-ecom-setting-title">PayPal Payments</h3>
                  <p className="wx-ecom-setting-description">Accept PayPal payments</p>
                </div>
                <div 
                  className={`wx-ecom-toggle ${paymentSettings.enablePayPal ? 'active' : 'inactive'}`}
                  onClick={() => setPaymentSettings({...paymentSettings, enablePayPal: !paymentSettings.enablePayPal})}
                >
                  <div className={`wx-ecom-toggle-handle ${paymentSettings.enablePayPal ? 'active' : 'inactive'}`} />
                </div>
              </div>
              
              {paymentSettings.enablePayPal && (
                <>
                  <div className="wx-ecom-field">
                    <label className="wx-ecom-label">PayPal Client ID</label>
                    <input 
                      type="text" 
                      className="wx-ecom-input" 
                      value={paymentSettings.paypalClientId}
                      onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                    />
                  </div>
                  <div className="wx-ecom-field">
                    <label className="wx-ecom-label">PayPal Client Secret</label>
                    <input 
                      type="password" 
                      className="wx-ecom-input" 
                      value={paymentSettings.paypalClientSecret}
                      onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientSecret: e.target.value})}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="wx-ecom-setting-item">
              <div>
                <h3 className="wx-ecom-setting-title">Cash on Delivery</h3>
                <p className="wx-ecom-setting-description">Allow customers to pay when they receive the order</p>
              </div>
              <div 
                className={`wx-ecom-toggle ${paymentSettings.enableCOD ? 'active' : 'inactive'}`}
                onClick={() => setPaymentSettings({...paymentSettings, enableCOD: !paymentSettings.enableCOD})}
              >
                <div className={`wx-ecom-toggle-handle ${paymentSettings.enableCOD ? 'active' : 'inactive'}`} />
              </div>
            </div>

            <div className="wx-ecom-modal-actions">
              <button type="submit" className="wx-ecom-button">
                Save Payment Settings
              </button>
            </div>
          </form>
        );

      case 'integrations':
        return (
          <div className="wx-ecom-integrations">
            <div className="wx-ecom-integration-grid">
              <div className="wx-ecom-integration-card">
                <div className="wx-ecom-integration-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3 className="wx-ecom-integration-title">WhatsApp Business</h3>
                <p className="wx-ecom-integration-description">Send order updates via WhatsApp</p>
                <button className="wx-ecom-integration-button">Connect</button>
              </div>

              <div className="wx-ecom-integration-card">
                <div className="wx-ecom-integration-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h3 className="wx-ecom-integration-title">Mailchimp</h3>
                <p className="wx-ecom-integration-description">Email marketing automation</p>
                <button className="wx-ecom-integration-button">Connect</button>
              </div>

              <div className="wx-ecom-integration-card">
                <div className="wx-ecom-integration-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </div>
                <h3 className="wx-ecom-integration-title">Google Analytics</h3>
                <p className="wx-ecom-integration-description">Track website analytics</p>
                <button className="wx-ecom-integration-button">Connect</button>
              </div>

              <div className="wx-ecom-integration-card">
                <div className="wx-ecom-integration-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h3 className="wx-ecom-integration-title">Inventory Management</h3>
                <p className="wx-ecom-integration-description">Sync with inventory systems</p>
                <button className="wx-ecom-integration-button">Connect</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Handler functions
  const editProduct = (product: Product) => {
    setModal({
      isOpen: true,
      title: 'Edit Product',
      content: <EditProductForm product={product} onClose={closeModal} categories={categories} />
    });
  };

  const deleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const viewOrder = (order: Order) => {
    setModal({
      isOpen: true,
      title: `Order ${order.orderNumber}`,
      content: <OrderDetailsModal order={order} onClose={closeModal} />
    });
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: status as Order['status'], updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const editCustomer = (customer: Customer) => {
    setModal({
      isOpen: true,
      title: 'Edit Customer',
      content: <EditCustomerForm customer={customer} onClose={closeModal} />
    });
  };

  const deleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const openAddCustomerModal = () => {
    setModal({
      isOpen: true,
      title: 'Add New Customer',
      content: <AddCustomerForm onClose={closeModal} />
    });
  };

  const openAddDiscountModal = () => {
    setModal({
      isOpen: true,
      title: 'Create Discount Code',
      content: <AddDiscountForm onClose={closeModal} />
    });
  };

  const editPage = (page: Page) => {
  setModal({
    isOpen: true,
    title: 'Edit Page',
    content: <EditPageForm page={page} onClose={closeModal} />
  });
};

const deletePage = (pageId: string) => {
  if (window.confirm('Are you sure you want to delete this page?')) {
    setPages(pages.filter(p => p.id !== pageId));
  }
};

const openAddPageModal = () => {
  setModal({
    isOpen: true,
    title: 'Add New Page',
    content: <AddPageForm onClose={closeModal} />
  });
};

  const saveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Settings are already updated via state setters
    alert('Store settings saved successfully!');
  };

  const savePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Settings are already updated via state setters
    alert('Payment settings saved successfully!');
  };


  // Form Components
    const AddPageForm = ({ onClose }: { onClose: () => void }) => {
    const [template, setTemplate] = useState<'default' | 'landing' | 'about' | 'contact' | 'custom'>('default');
    const [isPublished, setIsPublished] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string || createSlug(name);
        
        const page: Page = {
        id: `page_${Date.now()}`,
        name,
        slug,
        content: formData.get('content') as string,
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        isPublished,
        template,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
        };

        setPages(prev => [...prev, page]);

        addPage({
        id: page.id,
        name: page.name,
        url: page.slug,
        components: [],
        description: page.metaDescription || ''
        });

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="wx-ecom-modal-form">
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Page Name *</label>
            <input type="text" className="wx-ecom-input" name="name" required />
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Slug</label>
            <input type="text" className="wx-ecom-input" name="slug" placeholder="auto-generated from name" />
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Content</label>
            <textarea className="wx-ecom-input" name="content" rows={6} placeholder="Page content..."></textarea>
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Meta Title</label>
            <input type="text" className="wx-ecom-input" name="metaTitle" />
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Meta Description</label>
            <textarea className="wx-ecom-input" name="metaDescription" rows={2}></textarea>
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Template</label>
            <Dropdown
            options={[
                { label: 'Default', value: 'default' },
                { label: 'Landing Page', value: 'landing' },
                { label: 'About', value: 'about' },
                { label: 'Contact', value: 'contact' },
                { label: 'Custom', value: 'custom' }
            ]}
            value={template}
            onChange={(value) => setTemplate(value as typeof template)}
            placeholder="Select Template"
            />
        </div>
        
        <div className="wx-ecom-setting-item">
            <div>
            <h3 className="wx-ecom-setting-title">Published</h3>
            <p className="wx-ecom-setting-description">Make this page visible on your website</p>
            </div>
            <div 
            className={`wx-ecom-toggle ${isPublished ? 'active' : 'inactive'}`}
            onClick={() => setIsPublished(!isPublished)}
            >
            <div className={`wx-ecom-toggle-handle ${isPublished ? 'active' : 'inactive'}`} />
            </div>
        </div>
        
        <div className="wx-ecom-modal-actions">
            <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Cancel
            </button>
            <button type="submit" className="wx-ecom-button">
            Add Page
            </button>
        </div>
        </form>
    );
    };

    const EditPageForm = ({ page, onClose }: { page: Page, onClose: () => void }) => {
    const [template, setTemplate] = useState<'default' | 'landing' | 'about' | 'contact' | 'custom'>(page.template);
    const [isPublished, setIsPublished] = useState(page.isPublished);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.target as HTMLFormElement);
        const updatedPage = {
        ...page,
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        content: formData.get('content') as string,
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        isPublished,
        template,
        updatedAt: new Date().toISOString()
        };

        setPages(pages.map(p => p.id === page.id ? updatedPage : p));
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="wx-ecom-modal-form">
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Page Name *</label>
            <input type="text" className="wx-ecom-input" name="name" defaultValue={page.name} required />
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Slug</label>
            <input type="text" className="wx-ecom-input" name="slug" defaultValue={page.slug} />
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Content</label>
            <textarea className="wx-ecom-input" name="content" rows={6} defaultValue={page.content}></textarea>
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Meta Title</label>
            <input type="text" className="wx-ecom-input" name="metaTitle" defaultValue={page.metaTitle} />
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Meta Description</label>
            <textarea className="wx-ecom-input" name="metaDescription" rows={2} defaultValue={page.metaDescription}></textarea>
        </div>
        
        <div className="wx-ecom-field">
            <label className="wx-ecom-label">Template</label>
            <Dropdown
            options={[
                { label: 'Default', value: 'default' },
                { label: 'Landing Page', value: 'landing' },
                { label: 'About', value: 'about' },
                { label: 'Contact', value: 'contact' },
                { label: 'Custom', value: 'custom' }
            ]}
            value={template}
            onChange={(value) => setTemplate(value as typeof template)}
            placeholder="Select Template"
            />
        </div>
        
        <div className="wx-ecom-setting-item">
            <div>
            <h3 className="wx-ecom-setting-title">Published</h3>
            <p className="wx-ecom-setting-description">Make this page visible on your website</p>
            </div>
            <div 
            className={`wx-ecom-toggle ${isPublished ? 'active' : 'inactive'}`}
            onClick={() => setIsPublished(!isPublished)}
            >
            <div className={`wx-ecom-toggle-handle ${isPublished ? 'active' : 'inactive'}`} />
            </div>
        </div>
        
        <div className="wx-ecom-modal-actions">
            <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Cancel
            </button>
            <button type="submit" className="wx-ecom-button">
            Update Page
            </button>
        </div>
        </form>
    );
    };

  const AddProductForm = ({ onClose, categories }: { 
    onClose: () => void,
    categories: Category[]
  }) => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [category, setCategory] = useState<string>(categories[0]?.name || '');
    const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        handleFile(file);
      }
    };

    const handleFile = (file: File) => {
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) return;
      
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const shortDescription = formData.get('shortDescription') as string;
      const price = parseFloat(formData.get('price') as string);
      const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : undefined;
      const cost = parseFloat(formData.get('cost') as string);
      const sku = formData.get('sku') as string;
      const quantity = parseInt(formData.get('quantity') as string);
      const weight = parseFloat(formData.get('weight') as string);

      if (!name || !description || !price || !sku) {
        alert('Please fill in all required fields');
        return;
      }

      if (imagePreview) {
        const media: Media = {
          id: `product_${name}_${Date.now()}`,
          title: name,
          date: new Date().toISOString(),
          url: imagePreview,
          type: 'image',
          alt: 'Product Image',
        };
        addMedia(media);
      }

      const product: Product = {
        id: `product_${name}_${Date.now()}`,
        name,
        description,
        shortDescription,
        price,
        compareAtPrice,
        cost,
        sku,
        barcode: formData.get('barcode') as string || undefined,
        trackQuantity: true,
        quantity,
        weight,
        weightUnit: 'kg',
        category,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
        status,
        vendor: formData.get('vendor') as string || 'Default Vendor',
        productType: formData.get('productType') as string || 'General',
        images: imagePreview ? [imagePreview] : [],
        variants: [],
        seoTitle: formData.get('seoTitle') as string || undefined,
        seoDescription: formData.get('seoDescription') as string || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: createSlug(name)
      };

      setProducts(prev => [...prev, product]);

      addPage({
        id: product.id,
        name: product.name,
        url: `products/${product.slug}`,
        components: [productDetail],
        description: product.shortDescription,
      });

      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="wx-ecom-modal-form">
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Product Image</label>
          
          {imagePreview ? (
            <div className="wx-ecom-image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" onClick={removeImage}>Remove Image</button>
            </div>
          ) : (
            <div
              className={`wx-ecom-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" y1="5" x2="22" y2="5"></line>
                <line x1="19" y1="2" x2="19" y2="8"></line>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <p>Drag & drop an image here, or click to select</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Product Name *</label>
          <input type="text" className="wx-ecom-input" name="name" required />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Short Description</label>
          <textarea className="wx-ecom-input" name="shortDescription" rows={2}></textarea>
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Full Description *</label>
          <textarea className="wx-ecom-input" name="description" rows={4} required></textarea>
        </div>
        
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Price *</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="price" required />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Compare at Price</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="compareAtPrice" />
          </div>
        </div>
        
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Cost per Item</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="cost" />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">SKU *</label>
            <input type="text" className="wx-ecom-input" name="sku" required />
          </div>
        </div>
        
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Quantity</label>
            <input type="number" className="wx-ecom-input" name="quantity" defaultValue="0" />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Weight (kg)</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="weight" defaultValue="0" />
          </div>
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Category</label>
          <Dropdown
            options={categories.map(cat => ({ label: cat.name, value: cat.name }))}
            value={category}
            onChange={setCategory}
            placeholder="Select Category"
          />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Tags (comma separated)</label>
          <input type="text" className="wx-ecom-input" name="tags" placeholder="electronics, gadgets, wireless" />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Status</label>
          <Dropdown
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' }
            ]}
            value={status}
            onChange={(value) => setStatus(value as 'active' | 'draft' | 'archived')}
            placeholder="Select Status"
          />
        </div>
        
        <div className="wx-ecom-modal-actions">
          <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="wx-ecom-button">
            Add Product
          </button>
        </div>
      </form>
    );
  };

  const EditProductForm = ({ product, onClose, categories }: { 
    product: Product,
    onClose: () => void,
    categories: Category[]
  }) => {
    const [imagePreview, setImagePreview] = useState<string>(product.images[0] || '');
    const [category, setCategory] = useState<string>(product.category);
    const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(product.status);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedProduct = {
        ...product,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        shortDescription: formData.get('shortDescription') as string,
        price: parseFloat(formData.get('price') as string),
        compareAtPrice: formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : undefined,
        cost: parseFloat(formData.get('cost') as string),
        sku: formData.get('sku') as string,
        quantity: parseInt(formData.get('quantity') as string),
        weight: parseFloat(formData.get('weight') as string),
        category,
        status,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
        images: imagePreview ? [imagePreview] : product.images,
        updatedAt: new Date().toISOString(),
        slug: createSlug(formData.get('name') as string)
      };

      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="wx-ecom-modal-form">
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Product Name *</label>
          <input type="text" className="wx-ecom-input" name="name" defaultValue={product.name} required />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Short Description</label>
          <textarea className="wx-ecom-input" name="shortDescription" rows={2} defaultValue={product.shortDescription}></textarea>
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Full Description *</label>
          <textarea className="wx-ecom-input" name="description" rows={4} defaultValue={product.description} required></textarea>
        </div>
        
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Price *</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="price" defaultValue={product.price} required />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Compare at Price</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="compareAtPrice" defaultValue={product.compareAtPrice} />
          </div>
        </div>
        
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Cost per Item</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="cost" defaultValue={product.cost} />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">SKU *</label>
            <input type="text" className="wx-ecom-input" name="sku" defaultValue={product.sku} required />
          </div>
        </div>
        
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Quantity</label>
            <input type="number" className="wx-ecom-input" name="quantity" defaultValue={product.quantity} />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Weight (kg)</label>
            <input type="number" step="0.01" className="wx-ecom-input" name="weight" defaultValue={product.weight} />
          </div>
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Category</label>
          <Dropdown
            options={categories.map(cat => ({ label: cat.name, value: cat.name }))}
            value={category}
            onChange={setCategory}
            placeholder="Select Category"
          />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Tags (comma separated)</label>
          <input type="text" className="wx-ecom-input" name="tags" defaultValue={product.tags.join(', ')} />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Status</label>
          <Dropdown
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' }
            ]}
            value={status}
            onChange={(value) => setStatus(value as 'active' | 'draft' | 'archived')}
            placeholder="Select Status"
          />
        </div>
        
        <div className="wx-ecom-modal-actions">
          <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="wx-ecom-button">
            Update Product
          </button>
        </div>
      </form>
    );
  };

  const AddCustomerForm = ({ onClose }: { onClose: () => void }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const formData = new FormData(e.target as HTMLFormElement);
      const customer: Customer = {
        id: `customer_${Date.now()}`,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || undefined,
        acceptsMarketing: formData.get('acceptsMarketing') === 'on',
        totalSpent: 0,
        ordersCount: 0,
        status: 'active',
        addresses: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCustomers(prev => [...prev, customer]);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="wx-ecom-modal-form">
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">First Name *</label>
            <input type="text" className="wx-ecom-input" name="firstName" required />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Last Name *</label>
            <input type="text" className="wx-ecom-input" name="lastName" required />
          </div>
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Email *</label>
          <input type="email" className="wx-ecom-input" name="email" required />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Phone</label>
          <input type="tel" className="wx-ecom-input" name="phone" />
        </div>
        
        <div className="wx-ecom-setting-item">
          <div>
            <h3 className="wx-ecom-setting-title">Marketing Emails</h3>
            <p className="wx-ecom-setting-description">Customer agrees to receive marketing emails</p>
          </div>
          <input type="checkbox" name="acceptsMarketing" />
        </div>
        
        <div className="wx-ecom-modal-actions">
          <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="wx-ecom-button">
            Add Customer
          </button>
        </div>
      </form>
    );
  };

  const EditCustomerForm = ({ customer, onClose }: { 
    customer: Customer,
    onClose: () => void 
  }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedCustomer = {
        ...customer,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || undefined,
        acceptsMarketing: formData.get('acceptsMarketing') === 'on',
        updatedAt: new Date().toISOString()
      };

      setCustomers(customers.map(c => c.id === customer.id ? updatedCustomer : c));
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="wx-ecom-modal-form">
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">First Name *</label>
            <input type="text" className="wx-ecom-input" name="firstName" defaultValue={customer.firstName} required />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Last Name *</label>
            <input type="text" className="wx-ecom-input" name="lastName" defaultValue={customer.lastName} required />
          </div>
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Email *</label>
          <input type="email" className="wx-ecom-input" name="email" defaultValue={customer.email} required />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Phone</label>
          <input type="tel" className="wx-ecom-input" name="phone" defaultValue={customer.phone} />
        </div>
        
        <div className="wx-ecom-setting-item">
          <div>
            <h3 className="wx-ecom-setting-title">Marketing Emails</h3>
            <p className="wx-ecom-setting-description">Customer agrees to receive marketing emails</p>
          </div>
          <input type="checkbox" name="acceptsMarketing" defaultChecked={customer.acceptsMarketing} />
        </div>
        
        <div className="wx-ecom-modal-actions">
          <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="wx-ecom-button">
            Update Customer
          </button>
        </div>
      </form>
    );
  };

  const AddDiscountForm = ({ onClose }: { onClose: () => void }) => {
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount' | 'free_shipping'>('percentage');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const formData = new FormData(e.target as HTMLFormElement);
      const discount: Discount = {
        id: `discount_${Date.now()}`,
        code: formData.get('code') as string,
        type: discountType,
        value: parseFloat(formData.get('value') as string),
        minimumAmount: formData.get('minimumAmount') ? parseFloat(formData.get('minimumAmount') as string) : undefined,
        usageLimit: formData.get('usageLimit') ? parseInt(formData.get('usageLimit') as string) : undefined,
        usageCount: 0,
        startsAt: formData.get('startsAt') as string,
        endsAt: formData.get('endsAt') as string || undefined,
        isActive: true,
        appliesToProducts: [],
        appliesToCollections: [],
        customerEligibility: 'all',
        eligibleCustomers: []
      };

      setDiscounts(prev => [...prev, discount]);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="wx-ecom-modal-form">
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Discount Code *</label>
          <input type="text" className="wx-ecom-input" name="code" required placeholder="SAVE20" />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Type</label>
          <Dropdown
            options={[
              { label: 'Percentage', value: 'percentage' },
              { label: 'Fixed Amount', value: 'fixed_amount' },
              { label: 'Free Shipping', value: 'free_shipping' }
            ]}
            value={discountType}
            onChange={(value) => setDiscountType(value as 'percentage' | 'fixed_amount' | 'free_shipping')}
            placeholder="Select Type"
          />
        </div>
        
        {discountType !== 'free_shipping' && (
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">
              Value {discountType === 'percentage' ? '(%)' : `(${storeSettings.currency})`} *
            </label>
            <input type="number" step="0.01" className="wx-ecom-input" name="value" required />
          </div>
        )}
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Minimum Order Amount</label>
          <input type="number" step="0.01" className="wx-ecom-input" name="minimumAmount" />
        </div>
        
        <div className="wx-ecom-field">
          <label className="wx-ecom-label">Usage Limit</label>
          <input type="number" className="wx-ecom-input" name="usageLimit" placeholder="Leave empty for unlimited" />
        </div>
        
        <div className="wx-ecom-field-row">
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Starts At</label>
            <input type="datetime-local" className="wx-ecom-input" name="startsAt" required />
          </div>
          <div className="wx-ecom-field">
            <label className="wx-ecom-label">Ends At</label>
            <input type="datetime-local" className="wx-ecom-input" name="endsAt" />
          </div>
        </div>
        
        <div className="wx-ecom-modal-actions">
          <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="wx-ecom-button">
            Create Discount
          </button>
        </div>
      </form>
    );
  };

  const OrderDetailsModal = ({ order, onClose }: { 
    order: Order,
    onClose: () => void 
  }) => {
    return (
      <div className="wx-ecom-order-details">
        <div className="wx-ecom-order-header">
          <div className="wx-ecom-order-info">
            <h3>{order.orderNumber}</h3>
            <span className={`wx-ecom-status-badge wx-ecom-status-${order.status}`}>
              {order.status}
            </span>
          </div>
          <div className="wx-ecom-order-date">
            {formatDate(order.createdAt)}
          </div>
        </div>

        <div className="wx-ecom-order-customer">
          <h4>Customer</h4>
          <p>{order.customer.firstName} {order.customer.lastName}</p>
          <p>{order.customer.email}</p>
        </div>

        <div className="wx-ecom-order-items">
          <h4>Items</h4>
          {order.items.map(item => (
            <div key={item.id} className="wx-ecom-order-item">
              <div className="wx-ecom-item-info">
                <span className="wx-ecom-item-name">{item.name}</span>
                <span className="wx-ecom-item-sku">SKU: {item.sku}</span>
              </div>
              <div className="wx-ecom-item-quantity">
                Qty: {item.quantity}
              </div>
              <div className="wx-ecom-item-price">
                {formatCurrency(item.total)}
              </div>
            </div>
          ))}
        </div>

        <div className="wx-ecom-order-summary">
          <div className="wx-ecom-summary-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="wx-ecom-summary-row">
            <span>Tax:</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="wx-ecom-summary-row">
            <span>Shipping:</span>
            <span>{formatCurrency(order.shipping)}</span>
          </div>
          <div className="wx-ecom-summary-row wx-ecom-summary-total">
            <span>Total:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="wx-ecom-modal-actions">
          <button type="button" className="wx-ecom-button wx-ecom-button-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="wx-ecom-container">
      <div className="wx-ecom-topbar">
        <h1 className="wx-ecom-title">E-commerce Manager</h1>
        <div className="wx-ecom-topbar-actions">
          <button className="wx-ecom-button wx-ecom-button-secondary">Documentation</button>
          <button className="wx-ecom-button wx-ecom-button-action" onClick={() => window.open('/shop', '_blank')}>
            View Store
          </button>
        </div>
      </div>

      <div className="wx-ecom-content">
        <div className="wx-ecom-sidebar">
          <nav className="wx-ecom-menu">
            <div
              className={`wx-ecom-menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </div>
            <div
              className={`wx-ecom-menu-item ${activeSection === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSection('products')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Products
            </div>
            <div
            className={`wx-ecom-menu-item ${activeSection === 'pages' ? 'active' : ''}`}
            onClick={() => setActiveSection('pages')}
            >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            Pages
            </div>
            <div
              className={`wx-ecom-menu-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 4H8l-1-2H2v2h2l3.6 7.59L6.25 14.04C6.09 14.32 6 14.65 6 15c0 1.1.9 2 2 2h12v-2H8.42l1.04-2H19l2-7z"></path>
              </svg>
              Orders
            </div>
            <div
              className={`wx-ecom-menu-item ${activeSection === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveSection('customers')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Customers
            </div>
            <div
              className={`wx-ecom-menu-item ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
              </svg>
              Analytics
            </div>
            <div
              className={`wx-ecom-menu-item ${activeSection === 'marketing' ? 'active' : ''}`}
              onClick={() => setActiveSection('marketing')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m11-7a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
              </svg>
              Marketing
            </div>
            <div
              className={`wx-ecom-menu-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </div>
          </nav>
        </div>

        <main className="wx-ecom-main">
          {renderContent()}
        </main>
      </div>
      
      <Modal 
        isOpen={modal.isOpen} 
        onClose={closeModal} 
        title={modal.title}
      >
        {modal.content}
      </Modal>
    </div>
  );
};

export default EcommerceDashboard;