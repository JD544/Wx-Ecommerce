import { Analytics as AnalyticType } from '../ui'

export default function Analytics(
    {
        analytics,
        formatCurrency,
    }: {
        analytics: AnalyticType;      
        formatCurrency: (amount: number) => string;
    }
) {
  return (
    <div className="wx-ecom-card">
            <h2 className="wx-ecom-section-title">Analytics & Reports</h2>
            
            <div className="wx-ecom-analytics-grid">
              <div className="wx-ecom-analytics-card">
                <h3 className="wx-ecom-analytics-title">Sales Performance</h3>
                <div className="wx-ecom-metric">
                  <span className="wx-ecom-metric-label">Average Order Value</span>
                  <span className="wx-ecom-metric-value">{formatCurrency(analytics.averageOrderValue)}</span>
                </div>
                <div className="wx-ecom-metric">
                  <span className="wx-ecom-metric-label">Conversion Rate</span>
                  <span className="wx-ecom-metric-value">{analytics.conversionRate}%</span>
                </div>
              </div>

              <div className="wx-ecom-analytics-card">
                <h3 className="wx-ecom-analytics-title">Monthly Revenue</h3>
                <div className="wx-ecom-chart-placeholder">
                  {analytics.monthlyRevenue.map(month => (
                    <div key={month.month} className="wx-ecom-chart-bar">
                      <div className="wx-ecom-bar" style={{ height: `${(month.revenue / 10000) * 100}%` }}></div>
                      <span className="wx-ecom-chart-label">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="wx-ecom-reports-section">
              <h3 className="wx-ecom-section-subtitle">Export Reports</h3>
              <div className="wx-ecom-reports-grid">
                <button className="wx-ecom-report-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Sales Report</span>
                </button>
                <button className="wx-ecom-report-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Customer Report</span>
                </button>
                <button className="wx-ecom-report-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Inventory Report</span>
                </button>
              </div>
            </div>
          </div>
  )
}
