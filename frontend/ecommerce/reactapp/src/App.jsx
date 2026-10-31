import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import './App.css';

function App() {
  // Persist user login session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shop_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentView, setCurrentView] = useState('home'); // 'home', 'detail', 'cart'
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Persist cart items so refresh doesn't reset count to 0
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [toastMessage, setToastMessage] = useState('');

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('shop_user', JSON.stringify(userData));
    showToast('Login successful!');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shop_user');
    localStorage.removeItem('shop_cart');
    setCart([]);
    setCurrentView('home');
    showToast('Logged out successfully.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showToast('Item removed from cart.');
  };

  // If user is not logged in, render the Login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Navbar
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />

      <Toast message={toastMessage} />

      <main className="main-content">
        {currentView === 'home' && (
          <Home
            user={user}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setCurrentView('detail');
            }}
            onAddToCart={addToCart}
          />
        )}

        {currentView === 'detail' && (
          <ProductDetail
            productId={selectedProductId}
            user={user}
            onBack={() => setCurrentView('home')}
            onAddToCart={addToCart}
          />
        )}

        {currentView === 'cart' && (
          <Cart
            cartItems={cart}
            onRemove={removeFromCart}
            onContinueShopping={() => setCurrentView('home')}
          />
        )}
      </main>
    </div>
  );
}

export default App;