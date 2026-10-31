import React, { useState, useEffect } from 'react';

function ProductDetail({ productId, user, onBack, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
          credentials: 'include',
        });
        const data = await res.json();
        setProduct(data);
        setEditData(data);
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          alert('Product deleted successfully.');
          onBack();
        } else {
          alert('Unauthorized action.');
        }
      } catch (err) {
        console.error('Error deleting product', err);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editData.name);
    formData.append('price', editData.price);
    formData.append('short_description', editData.short_description || '');
    formData.append('full_description', editData.full_description);
    
    // Only append image if a new file was selected
    if (editData.image instanceof File) {
      formData.append('image', editData.image);
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
        method: 'PUT', // or 'PATCH'
        credentials: 'include', // Sends session cookie
        body: formData, // <--- Send FormData instead of JSON string
      });

      if (res.ok) {
        const updated = await res.json();
        setProduct(updated);
        setIsEditing(false);
        alert('Product updated successfully!');
      } else {
        const errData = await res.json();
        alert(`Failed to update product: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      console.error('Error updating product', err);
    }
  };

  if (loading) return <div className="loading-spinner">Loading product details...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-detail-container">
      <button className="btn-back" onClick={onBack}>← Back to Products</button>

      <div className="detail-card">
        {product.image && <img src={product.image} alt={product.name} className="detail-img" />}
        
        <div className="detail-info">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="edit-form">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <input
                type="number"
                step="0.01"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              />
              <textarea
                value={editData.full_description}
                onChange={(e) => setEditData({ ...editData, full_description: e.target.value })}
              />
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          ) : (
            <>
              <h2>{product.name}</h2>
              <p className="detail-price">₹{product.price}</p>
              <p className="detail-desc-title">Full Description:</p>
              <p className="detail-desc">{product.full_description}</p>

              <div className="detail-actions">
                <button className="btn-cart-large" onClick={() => onAddToCart(product)}>
                  🛒 Add to Cart
                </button>

                {user.is_admin && (
                  <div className="admin-actions">
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Product</button>
                    <button className="btn-delete" onClick={handleDelete}>Delete Product</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;