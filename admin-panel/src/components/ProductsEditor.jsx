import { useConfigStore } from '../store/configStore.js';
import { useState, useRef } from 'react';

export default function ProductsEditor() {
  const { config, updateConfig } = useConfigStore();
  const [newProduct, setNewProduct] = useState({ name: '', image: null, imagePreview: null });
  const fileInputRef = useRef(null);
  
  const products = config?.products || [];

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({
        ...newProduct,
        image: reader.result, // Base64 for now (will use Cloudinary later)
        imagePreview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.image) {
      alert('Please add a name and image');
      return;
    }
    
    const product = {
      id: `product_${Date.now()}`,
      category: config?.categories?.[0]?.id || 'top',
      name: newProduct.name,
      emoji: '📦',
      badge: null,
      media: [],
      posters: [newProduct.image],
      thumbnail: newProduct.image,
      desc: '',
      price: null,
      oldPrice: null,
      isPack: false,
      weight: null,
      catalogOnly: false,
      details: [],
    };

    updateConfig({
      products: [...products, product],
    });

    setNewProduct({ name: '', image: null, imagePreview: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteProduct = (productId) => {
    updateConfig({
      products: products.filter(prod => prod.id !== productId),
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-white/60 mb-2 uppercase tracking-wide">
          Products
        </label>
        
        {/* Existing products */}
        <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto custom-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              {product.thumbnail && (
                <img 
                  src={product.thumbnail} 
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <span className="flex-1 text-sm text-white">{product.name}</span>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add new product */}
        <div className="space-y-2">
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="Product name"
          />
          
          {/* Image upload */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="product-image-input"
            />
            <label
              htmlFor="product-image-input"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center cursor-pointer hover:bg-white/10"
            >
              {newProduct.imagePreview ? '📷 Change Image' : '📷 Add Image'}
            </label>
            {newProduct.imagePreview && (
              <img 
                src={newProduct.imagePreview} 
                alt="Preview"
                className="w-12 h-12 object-cover rounded"
              />
            )}
          </div>
          
          <button
            onClick={handleAddProduct}
            className="w-full px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/15"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
