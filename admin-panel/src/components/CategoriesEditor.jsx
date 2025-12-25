import { useConfigStore } from '../store/configStore.js';
import { useState } from 'react';

export default function CategoriesEditor() {
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
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-white/60 mb-2 uppercase tracking-wide">
          Categories
        </label>
        
        {/* Existing categories */}
        <div className="space-y-2 mb-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <span className="text-xl">{cat.emoji}</span>
              <span className="flex-1 text-sm text-white">{cat.label}</span>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add new category */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory.emoji}
            onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
            className="w-12 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center text-sm focus:outline-none focus:border-white/30"
            placeholder="📦"
            maxLength={2}
          />
          <input
            type="text"
            value={newCategory.label}
            onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="Category name"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/15"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

