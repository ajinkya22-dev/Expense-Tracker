import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategoryAsync, deleteCategoryAsync } from '../Store/CategorySlice';

const CategoryManager = ({ onSelectCategory, selectedCategory }) => {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector(state => state.categories);
    const [isOpen, setIsOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        color: '#6366f1',
        type: 'Expense',
        icon: '📁'
    });

    // Predefined icons
    const icons = ['📁', '🏠', '🚗', '🍔', '🎬', '👕', '💊', '📚', '✈️', '💳', '🎮', '🏋️', '🛒', '⚡', '💰', '🎨'];

    // Predefined colors
    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', 
        '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
        '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6'
    ];

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchCategories());
        }
    }, [isOpen, dispatch]);

    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        await dispatch(addCategoryAsync(newCategory));
        setNewCategory({
            name: '',
            color: '#6366f1',
            type: 'Expense',
            icon: '📁'
        });
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await dispatch(deleteCategoryAsync(id));
        }
    };

    const handleSelectCategory = (category) => {
        onSelectCategory(category);
        setIsOpen(false);
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
                {selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : 'Manage Categories'}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Categories</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Add New Category */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Add New Category</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Category name"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    />
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Icon</label>
                                        <div className="grid grid-cols-8 gap-2">
                                            {icons.map((icon) => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setNewCategory({ ...newCategory, icon })}
                                                    className={`p-2 text-2xl rounded-lg border-2 hover:border-indigo-500 transition-colors ${
                                                        newCategory.icon === icon ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-600'
                                                    }`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Color</label>
                                        <div className="grid grid-cols-10 gap-2">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setNewCategory({ ...newCategory, color })}
                                                    className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                                                        newCategory.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setNewCategory({ ...newCategory, type: 'Expense' })}
                                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                                                newCategory.type === 'Expense'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            Expense
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewCategory({ ...newCategory, type: 'Income' })}
                                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                                                newCategory.type === 'Income'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            Income
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        disabled={loading || !newCategory.name.trim()}
                                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? 'Adding...' : 'Add Category'}
                                    </button>
                                </div>
                            </div>

                            {/* Existing Categories */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Your Categories</h3>
                                {loading && categories.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Loading...</p>
                                ) : categories.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No custom categories yet. Add one above!</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {categories.map((category) => (
                                            <div
                                                key={category._id}
                                                className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer bg-white dark:bg-gray-800"
                                                onClick={() => handleSelectCategory(category)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                                        style={{ backgroundColor: category.color }}
                                                    >
                                                        {category.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-white">{category.name}</p>
                                                        <p className={`text-sm ${category.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            {category.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteCategory(category._id);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xl px-2"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
