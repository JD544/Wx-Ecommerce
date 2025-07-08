# WX E-commerce Plugin

A comprehensive e-commerce solution for the WX Eclipse website builder platform. This plugin provides a complete online store management system with product catalog, order management, customer management, and analytics.

## Features

### 🛍️ Product Management
- **Product Catalog**: Create and manage products with detailed information
- **Product Variants**: Support for different sizes, colors, and options
- **Inventory Tracking**: Real-time stock management
- **Categories & Collections**: Organize products efficiently
- **SEO Optimization**: Built-in SEO fields for better search visibility
- **Image Management**: Drag & drop image uploads with preview

### 📦 Order Management
- **Order Processing**: Complete order lifecycle management
- **Order Status Tracking**: Real-time status updates (pending, confirmed, shipped, delivered)
- **Payment Status**: Track payment states (pending, paid, refunded)
- **Fulfillment Management**: Handle shipping and delivery
- **Order Details**: Comprehensive order information and customer data

### 👥 Customer Management
- **Customer Profiles**: Detailed customer information
- **Address Management**: Multiple shipping and billing addresses
- **Order History**: Track customer purchase history
- **Marketing Preferences**: Manage email marketing consent
- **Customer Analytics**: Spending patterns and behavior insights

### 📊 Analytics & Reporting
- **Sales Dashboard**: Real-time sales metrics
- **Revenue Tracking**: Monthly and total revenue reports
- **Top Products**: Best-selling product analytics
- **Customer Insights**: Customer acquisition and retention metrics
- **Conversion Tracking**: Monitor store performance

### 🎯 Marketing Tools
- **Discount Codes**: Create percentage, fixed amount, and free shipping discounts
- **Promotional Campaigns**: Time-limited offers
- **Customer Segmentation**: Target specific customer groups
- **Usage Limits**: Control discount code usage

### 📄 Content Management
- **Custom Pages**: Create About, Contact, and custom pages
- **Page Templates**: Pre-built templates for different page types
- **SEO Meta Tags**: Optimize pages for search engines
- **Content Editor**: Rich text editing capabilities

### ⚙️ Store Settings
- **General Settings**: Store name, description, currency, timezone
- **Payment Integration**: Stripe, PayPal, Cash on Delivery, Bank Transfer
- **Shipping Configuration**: Zones, rates, and free shipping thresholds
- **Tax Management**: Configurable tax rates
- **Inventory Settings**: Stock tracking and low stock alerts

## Installation

1. The plugin is included with WX Eclipse by default
2. Navigate to the Plugins section in your WX Eclipse dashboard
3. Activate the E-commerce plugin
4. Configure your store settings

## Quick Start

### 1. Initial Setup
```typescript
// The plugin automatically initializes with default data
// Access the e-commerce dashboard from the plugins menu
```

### 2. Configure Store Settings
1. Go to **Settings** → **General**
2. Set your store name, description, and currency
3. Configure payment methods in **Settings** → **Payments**
4. Set up shipping zones in **Settings** → **Shipping**

### 3. Add Your First Product
1. Navigate to **Products**
2. Click **Add Product**
3. Fill in product details:
   - Name and description
   - Price and cost
   - SKU and inventory
   - Category and tags
   - Product images

### 4. Create Store Pages
1. Go to **Pages**
2. The plugin automatically generates:
   - Shop page (`/shop`)
   - Product detail pages (`/products/{slug}`)
   - Shopping cart (`/cart`)
   - Checkout (`/checkout`)

## API Reference

### Product Interface
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  sku: string;
  quantity: number;
  category: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  images: string[];
  variants: ProductVariant[];
  // ... additional fields
}
```

### Order Interface
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  // ... additional fields
}
```

### Customer Interface
```typescript
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  totalSpent: number;
  ordersCount: number;
  addresses: Address[];
  // ... additional fields
}
```

## Components

### Builder Components
The plugin provides several pre-built components for the WX builder:

- **Product List** (`wx-product-list`): Display products in a grid layout
- **Product Detail** (`wx-product-detail`): Show individual product information
- **Shopping Cart** (`wx-shopping-cart`): Cart functionality with coupon support
- **Checkout** (`wx-checkout`): Complete checkout process

### Usage in Builder
```typescript
import { productList, productDetail, shoppingCart, checkout } from './wx-ecommerce/ui';

// Add to page
addPage({
  id: 'shop',
  name: 'Shop',
  url: 'shop',
  components: [productList]
});
```

## Customization

### Styling
The plugin uses CSS classes with the `wx-ecom-` prefix. Override these styles in your theme:

```css
.wx-ecom-card {
  /* Custom card styling */
}

.wx-ecom-button {
  /* Custom button styling */
}

.wx-ecom-product-grid {
  /* Custom product grid styling */
}
```

### Settings Configuration
```typescript
const storeSettings: StoreSettings = {
  storeName: 'My Store',
  currency: 'USD',
  enableInventoryTracking: true,
  enableTaxes: true,
  taxRate: 10,
  // ... other settings
};
```

## Integrations

### Payment Gateways
- **Stripe**: Credit card processing
- **PayPal**: PayPal payments
- **Cash on Delivery**: Pay on delivery option
- **Bank Transfer**: Direct bank transfers

### Third-party Services
- **WhatsApp Business**: Order notifications
- **Mailchimp**: Email marketing
- **Google Analytics**: Website analytics
- **Inventory Management**: External inventory systems

## Data Storage

The plugin uses the WX Eclipse storage system:
- Data is stored locally using `useStorage` hook
- Automatic persistence across sessions
- Export/import capabilities

## Security

- Input validation on all forms
- XSS protection
- CSRF protection
- Secure payment processing
- Data encryption for sensitive information

## Performance

- Lazy loading of product images
- Pagination for large product catalogs
- Optimized database queries
- Caching for frequently accessed data

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:
- Documentation: [WX Eclipse Docs](https://docs.wx-eclipse.com)
- Issues: [GitHub Issues](https://github.com/JD544/wx-eclipse/issues)
- Community: [Discord Server](https://discord.gg/wx-eclipse)

## License

This plugin is part of the WX Eclipse project and follows the same license terms.

## Changelog

### v1.0.0
- Initial release
- Complete e-commerce functionality
- Product, order, and customer management
- Analytics dashboard
- Payment integrations
- Marketing tools

---

**Made with ❤️ by the WX Eclipse team**
