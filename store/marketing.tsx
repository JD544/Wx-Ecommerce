import React from 'react'
import { Discount } from '../ui';

export default function Marketing(
    {
        discounts,
        formatCurrency,
        openAddDiscountModal,
        
    }: {
        openAddDiscountModal: () => void;        
        discounts: Discount[];
        formatCurrency: (amount: number) => string;        
    }
) {
  return (
    <div className="wx-ecom-card">
            <h2 className="wx-ecom-section-title">Marketing & Discounts</h2>            
            <div className="wx-ecom-marketing-tabs">
              <button className="wx-ecom-tab active">Discount Codes</button>
              <button className="wx-ecom-tab">Email Marketing</button>
              <button className="wx-ecom-tab">SEO</button>
            </div>

            <div className="wx-ecom-discounts-section">
              <div className="wx-ecom-header">
                <h3 className="wx-ecom-section-subtitle">Discount Codes</h3>
                <button className="wx-ecom-button wx-ecom-button-action" onClick={openAddDiscountModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>

              <div className="wx-ecom-discounts-list">
                {discounts.length > 0 ? (
                  discounts.map(discount => (
                    <div key={discount.id} className="wx-ecom-discount-item">
                      <div className="wx-ecom-discount-info">
                        <h4 className="wx-ecom-discount-code">{discount.code}</h4>
                        <div className="wx-ecom-discount-details">
                          <span>Type: {discount.type}</span>
                          <span>Value: {discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}</span>
                          <span>Used: {discount.usageCount}/{discount.usageLimit || '∞'}</span>
                        </div>
                      </div>
                      <div className="wx-ecom-discount-status">
                        <span className={`wx-ecom-status-badge wx-ecom-status-${discount.isActive ? 'active' : 'inactive'}`}>
                          {discount.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="wx-ecom-empty-state">
                    <p>No discount codes created yet.</p>
                  </div>
                )}
              </div>
            </div>
        </div>
  )
}
