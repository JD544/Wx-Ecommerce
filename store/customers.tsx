import { Customer } from '../ui';

export default function Customers(
    {
        filteredCustomers,
        searchTerm,
        setSearchTerm,
        openAddCustomerModal,
        formatDate,
        formatCurrency,
        editCustomer,
        deleteCustomer,
    }: {
        filteredCustomers: Customer[];
        searchTerm: string;
        setSearchTerm: (term: string) => void;
        openAddCustomerModal: () => void;
        formatDate: (date: string) => string;
        formatCurrency: (amount: number) => string;
        editCustomer: (customer: Customer) => void;
        deleteCustomer: (customerId: string) => void;
    }
) {
  return (
    <div className="wx-ecom-card">
            <div className="wx-ecom-header">
              <h2 className="wx-ecom-section-title">Customers</h2>
              <div className="wx-ecom-search">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="wx-ecom-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="wx-ecom-button wx-ecom-button-action" onClick={openAddCustomerModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <div className="wx-ecom-customers-list">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <div key={customer.id} className="wx-ecom-customer-item">
                    <div className="wx-ecom-customer-info">
                      <div className="wx-ecom-customer-primary">
                        <h3 className="wx-ecom-customer-name">{customer.firstName} {customer.lastName}</h3>
                        <span className={`wx-ecom-status-badge wx-ecom-status-${customer.status}`}>
                          {customer.status}
                        </span>
                      </div>
                      <div className="wx-ecom-customer-details">
                        <span>Email: {customer.email}</span>
                        <span>Orders: {customer.ordersCount}</span>
                        <span>Total Spent: {formatCurrency(customer.totalSpent)}</span>
                        <span>Joined: {formatDate(customer.createdAt)}</span>
                      </div>
                    </div>
                    <div className="wx-ecom-customer-actions">
                      <button className="wx-ecom-icon-button" onClick={() => editCustomer(customer)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </button>
                      <button className="wx-ecom-icon-button wx-ecom-delete-button" onClick={() => deleteCustomer(customer.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="wx-ecom-empty-state">
                  <p>No customers found.</p>
                </div>
              )}
            </div>
          </div>
  )
}
