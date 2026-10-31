
function Navbar({ user, cartCount, onNavigate, onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => onNavigate('home')}>
        Electronic-Hub|Ecommerce Store
      </div>
      <div className="nav-links">
        <button className="nav-btn" onClick={() => onNavigate('home')}>Home</button>
        <button className="nav-btn cart-btn" onClick={() => onNavigate('cart')}>
          🛒 Cart <span className="badge">{cartCount}</span>
        </button>
        <span className="nav-user">👤 {user.username}</span>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;