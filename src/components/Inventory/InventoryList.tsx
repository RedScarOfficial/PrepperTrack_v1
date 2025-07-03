import React, { useState } from 'react';
import { Package, Calendar, MapPin, Plus, Search, Filter } from 'lucide-react';
import { usePrepper } from '../../context/PrepperContext';
import { InventoryItem, ItemCategory } from '../../types';
import ItemRow from './ItemRow';
import AddItemModal from './AddItemModal';

export default function InventoryList() {
  const { state } = usePrepper();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'expiration' | 'quantity' | 'category'>('name');

  const categories: (ItemCategory | 'all')[] = [
    'all',
    'Food - Grains',
    'Food - Proteins', 
    'Food - Vegetables',
    'Food - Fruits',
    'Food - Dairy',
    'Food - Canned',
    'Water',
    'Medical',
    'Tools',
    'Shelter',
    'Energy',
    'Communication',
    'Clothing',
    'Hygiene',
    'Security',
  ];

  const filteredItems = state.inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'expiration':
          if (!a.expirationDate) return 1;
          if (!b.expirationDate) return -1;
          return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        case 'quantity':
          return b.quantity - a.quantity;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Inventory Management</h1>
            <p className="text-slate-600">Track and manage your survival supplies</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'all')}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="expiration">Sort by Expiration</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="category">Sort by Category</option>
            </select>
            
            <div className="flex items-center text-sm text-slate-600">
              <Package className="h-4 w-4 mr-2" />
              {filteredItems.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-slate-700">Item</th>
                <th className="text-left px-6 py-4 font-medium text-slate-700">Category</th>
                <th className="text-left px-6 py-4 font-medium text-slate-700">Quantity</th>
                <th className="text-left px-6 py-4 font-medium text-slate-700">Expiration</th>
                <th className="text-left px-6 py-4 font-medium text-slate-700">Location</th>
                <th className="text-left px-6 py-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">No items found</p>
            <p className="text-sm text-slate-500">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first inventory item to get started'
              }
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSave={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}