import { useState, useEffect } from 'react';

function Home({ user, onSelectProduct, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    short_description: '',
    full_description: '',
    image: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/products/', {
        credentials: 'include',
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('short_description', newProduct.short_description);
    formData.append('full_description', newProduct.full_description);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/products/', {
        method: 'POST',
        credentials: 'include', 
        body: formData,
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({ name: '', price: '', short_description: '', full_description: '', image: null });
        fetchProducts();
        alert('Product added successfully!');
      } else {
        const errorData = await res.json();
        alert(`Failed to add product: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error('Error adding product', err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {user.username} {user.is_admin && '(Admin)'}</h1>
        
        {user.is_admin && (
          <button className="btn-admin" onClick={() => setShowAddModal(true)}>
            + Add New Product
          </button>
        )}
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for electronics (e.g., phone, charger, laptop)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-spinner">Loading products...</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p className="no-products">No matching products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.image && <img src={product.image} alt={product.name} className="product-thumb" />}
                <div className="product-info" onClick={() => onSelectProduct(product.id)}>
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                  <p className="desc">{product.short_description}</p>
                </div>
                <div className="card-actions">
                  <button className="btn-details" onClick={() => onSelectProduct(product.id)}>
                    View Details
                  </button>
                  <button className="btn-cart" onClick={() => onAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Add New Product</h2>
            <form onSubmit={handleCreateProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newProduct.short_description}
                onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                required
              />
              <textarea
                placeholder="Full Description"
                value={newProduct.full_description}
                onChange={(e) => setNewProduct({ ...newProduct, full_description: e.target.value })}
                required
              />
              <input
                type="file"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
              />
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Save Product</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;