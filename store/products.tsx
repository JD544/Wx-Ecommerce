import { Product } from "../ui"

export default function Products(
    {
        filteredProducts,
        searchTerm,
        setSearchTerm,
        openAddProductModal,
        editProduct,
        deleteProduct,
        formatCurrency,        
    } : {
        filteredProducts: Product[],
        searchTerm: string,
        setSearchTerm: (searchTerm: string) => void,
        openAddProductModal: () => void,
        editProduct: (product: Product) => void,
        deleteProduct: (productId: string) => void,
        formatCurrency: (amount: number) => string,        
    }
) {
  return (
    <div className="wx-ecom-card">
            <div className="wx-ecom-header">
              <h2 className="wx-ecom-section-title">Products</h2>
              <div className="wx-ecom-search">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="wx-ecom-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="wx-ecom-button wx-ecom-button-action" onClick={openAddProductModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <div className="wx-ecom-products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="wx-ecom-product-card">
                    <div className="wx-ecom-product-image">
                      <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} />
                      <span className={`wx-ecom-status-badge wx-ecom-status-${product.status}`}>
                        {product.status}
                      </span>
                    </div>
                    <div className="wx-ecom-product-info">
                      <h3 className="wx-ecom-product-name">{product.name}</h3>
                      <p className="wx-ecom-product-sku">SKU: {product.sku}</p>
                      <div className="wx-ecom-product-pricing">
                        <span className="wx-ecom-product-price">{formatCurrency(product.price)}</span>
                        {product.compareAtPrice && (
                          <span className="wx-ecom-product-compare-price">{formatCurrency(product.compareAtPrice)}</span>
                        )}
                      </div>
                      <div className="wx-ecom-product-meta">
                        <span>Category: {product.category}</span>
                        <span>Stock: {product.quantity}</span>
                      </div>
                    </div>
                    <div className="wx-ecom-product-actions">
                      <button className="wx-ecom-icon-button" onClick={() => editProduct(product)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </button>
                      <button className="wx-ecom-icon-button wx-ecom-delete-button" onClick={() => deleteProduct(product.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="wx-ecom-empty-state">
                  <p>No products found. Create your first product!</p>
                </div>
              )}
            </div>
          </div>
  )
}
