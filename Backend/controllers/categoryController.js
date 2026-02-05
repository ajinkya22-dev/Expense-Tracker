import User from '../models/User.js';

// @desc    Get all custom categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            categories: user.customCategories || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add custom category
// @route   POST /api/categories
// @access  Private
export const addCategory = async (req, res) => {
    try {
        const { name, color, type, icon } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a category name'
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if category already exists
        const categoryExists = user.customCategories.some(
            cat => cat.name.toLowerCase() === name.toLowerCase()
        );

        if (categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        // Add new category
        const newCategory = {
            name,
            color: color || '#6366f1',
            type: type || 'Expense',
            icon: icon || '📁'
        };

        user.customCategories.push(newCategory);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Category added successfully',
            category: user.customCategories[user.customCategories.length - 1]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update custom category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color, type, icon } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const category = user.customCategories.id(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Update category fields
        if (name) category.name = name;
        if (color) category.color = color;
        if (type) category.type = type;
        if (icon) category.icon = icon;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const category = user.customCategories.id(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        category.deleteOne();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
