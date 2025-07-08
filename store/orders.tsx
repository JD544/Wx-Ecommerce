import { Dropdown } from "../../../tools/dropdown"
import { Order } from "../ui";

export default function Orders(
    {
      searchTerm,
      setSearchTerm,
      filteredOrders,
      formatCurrency,
      formatDate,
      viewOrder,
      updateOrderStatus,
    }: {
      searchTerm: string;
      setSearchTerm: (searchTerm: string) => void;
      filteredOrders: Order[];
      formatCurrency: (amount: number) => string;
      formatDate: (date: string) => string;
      viewOrder: (order: Order) => void;
      updateOrderStatus: (orderId: string, status: string) => void;
    }
) {
  return (
    <div className="wx-ecom-card">
                <div className="wx-ecom-header">
                  <h2 className="wx-ecom-section-title">Orders</h2>
                  <div className="wx-ecom-search">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="wx-ecom-search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
    
                <div className="wx-ecom-orders-list">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <div key={order.id} className="wx-ecom-order-item">
                        <div className="wx-ecom-order-info">
                          <div className="wx-ecom-order-primary">
                            <h3 className="wx-ecom-order-number">{order.orderNumber}</h3>
                            <div className="wx-ecom-order-badges">
                              <span className={`wx-ecom-status-badge wx-ecom-status-${order.status}`}>
                                {order.status}
                              </span>
                              <span className={`wx-ecom-status-badge wx-ecom-payment-${order.paymentStatus}`}>
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>
                          <div className="wx-ecom-order-details">
                            <span>Customer: {order.customer.firstName} {order.customer.lastName}</span>
                            <span>Items: {order.items.length}</span>
                            <span>Date: {formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                        <div className="wx-ecom-order-total">
                          <span className="wx-ecom-order-amount">{formatCurrency(order.total)}</span>
                        </div>
                        <div className="wx-ecom-order-actions">
                          <button className="wx-ecom-icon-button" onClick={() => viewOrder(order)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <Dropdown
                            options={[
                              { label: 'Mark as Confirmed', value: 'confirmed' },
                              { label: 'Mark as Shipped', value: 'shipped' },
                              { label: 'Mark as Delivered', value: 'delivered' },
                              { label: 'Cancel Order', value: 'cancelled' }
                            ]}
                            value={order.status}
                            onChange={(value) => updateOrderStatus(order.id, value)}
                            placeholder="Update Status"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="wx-ecom-empty-state">
                      <p>No orders found.</p>
                    </div>
                  )}
                </div>
              </div>
  )
}
