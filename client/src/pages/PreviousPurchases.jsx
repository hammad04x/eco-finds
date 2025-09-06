import { useState, useEffect } from "react"
import "../assets/styles/index.css"

const PreviousPurchases = () => {
  const [purchases, setPurchases] = useState([])

  useEffect(() => {
    const purchaseHistory = JSON.parse(localStorage.getItem("purchases") || "[]")
    setPurchases(purchaseHistory)
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        <h1>Purchase History</h1>
        <p className="text-muted">Your previous orders on EcoFinds</p>

        {purchases.length === 0 ? (
          <div className="text-center mt-2">
            <h3>No purchases yet</h3>
            <p className="text-muted">Start shopping to see your purchase history here!</p>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            {purchases.map((purchase, index) => (
              <div key={index} className="card">
                <div className="flex-between">
                  <div>
                    <h3>{purchase.title}</h3>
                    <div className="flex gap-2" style={{ alignItems: "center", marginBottom: "0.5rem" }}>
                      <span className="product-price">${purchase.price}</span>
                      <span className="product-category">{purchase.category}</span>
                    </div>
                    <div className="text-muted">Order ID: {purchase.orderId}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted">Purchased on</div>
                    <div style={{ fontWeight: "600" }}>{formatDate(purchase.purchaseDate)}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="card mt-2">
              <div className="text-center">
                <h4>Total Spent: ${purchases.reduce((total, item) => total + item.price, 0).toFixed(2)}</h4>
                <p className="text-muted">Thank you for choosing sustainable shopping with EcoFinds!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviousPurchases
