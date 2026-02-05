import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId || this.isProfileComplete;
        },
        minlength: 6,
        select: false
    },
    profilePicture: {
        type: String,
        default: ''
    },
    isProfileComplete: {
        type: Boolean,
        default: true // false for first-time Google users
    },
    customCategories: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        color: {
            type: String,
            default: '#6366f1'
        },
        type: {
            type: String,
            enum: ['Income', 'Expense'],
            default: 'Expense'
        },
        icon: {
            type: String,
            default: '📁'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    currency: {
        type: String,
        default: 'USD'
    },
    budget: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
