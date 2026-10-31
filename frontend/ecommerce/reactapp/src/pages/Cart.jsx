
function Cart({ cartItems, onRemove, onContinueShopping }) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="btn-primary" onClick={onContinueShopping}>Start Shopping</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                {item.image && <img src={item.image} alt={item.name} className="cart-thumb" />}
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price} * {item.quantity}</p>
                </div>
                <button className="btn-remove" onClick={() => onRemove(item.id)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-total">
              <span>Total Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn-primary checkout-btn" onClick={() => alert('Checkout feature coming soon!')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;