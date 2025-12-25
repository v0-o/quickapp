import { useConfigStore } from '../store/configStore.js';
import { useState, useRef } from 'react';

export default function ProductsEditor() {
  const { config, updateConfig } = useConfigStore();
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    desc: '',
    image: null, 
    imagePreview: null 
  });
  const fileInputRef = useRef(null);
  
  const products = config?.products || [];
  const categories = config?.categories || [];

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({
        ...newProduct,
        image: reader.result,
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
      category: newProduct.category || (categories[0]?.id || 'top'),
      name: newProduct.name,
      emoji: '📦',
      badge: null,
      media: [],
      posters: [newProduct.image],
      thumbnail: newProduct.image,
      desc: newProduct.desc || '',
      price: newProduct.price ? Number(newProduct.price) : null,
      oldPrice: null,
      isPack: false,
      catalogOnly: false,
      details: [],
    };

    updateConfig({
      products: [...products, product],
    });

    setNewProduct({ name: '', price: '', category: '', desc: '', image: null, imagePreview: null });
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
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">
          Produits & Catégories
        </label>
        
        {/* Categories */}
        <div className="mb-3">
          <div className="text-xs text-white/50 mb-2">Categories:</div>
          <CategoriesEditor />
        </div>

        {/* Existing products */}
        <div className="space-y-2 mb-3 max-h-[120px] overflow-y-auto custom-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              {product.thumbnail && (
                <img 
                  src={product.thumbnail} 
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <div className="text-sm text-white font-medium">{product.name}</div>
                {product.price && (
                  <div className="text-xs text-white/60">{product.price}€</div>
                )}
              </div>
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
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
            placeholder="Product name"
          />
          
          <div className="flex gap-2">
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-[#0a0a0a]">{cat.label}</option>
              ))}
            </select>
            
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
              placeholder="€"
            />
          </div>

          <textarea
            value={newProduct.desc}
            onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 resize-none"
            placeholder="Description (optional)"
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

// Import CategoriesEditor inline to avoid circular dependency
function CategoriesEditor() {
  const { config, updateConfig } = useConfigStore();
  const [newCategory, setNewCategory] = useState({ label: '', emoji: '📦' });

  const categories = config?.categories || [];

  const handleAddCategory = () => {
    if (!newCategory.label.trim()) return;
    
    const category = {
      id: newCategory.label.toLowerCase().replace(/\s+/g, '-'),
      label: newCategory.label,
      emoji: newCategory.emoji,
      gradient: 'from-blue-500 to-purple-500',
      isNew: false,
    };

    updateConfig({
      categories: [...categories, category],
    });

    setNewCategory({ label: '', emoji: '📦' });
  };

  const handleDeleteCategory = (categoryId) => {
    updateConfig({
      categories: categories.filter(cat => cat.id !== categoryId),
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newCategory.emoji}
          onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
          className="w-12 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-center text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
          placeholder="📦"
          maxLength={2}
        />
        <input
          type="text"
          value={newCategory.label}
          onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
          placeholder="Nom de catégorie"
        />
        <button
          onClick={handleAddCategory}
          className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/15"
        >
          Add
        </button>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs">
            <span>{cat.emoji}</span>
            <span className="text-white/80">{cat.label}</span>
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="text-red-400 hover:text-red-300 ml-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
