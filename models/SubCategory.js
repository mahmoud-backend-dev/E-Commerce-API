const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'SubCategory required'],
        unique: [true, 'SubCategory must be unique'],
        millength: [2, 'Too short category name'],
        maxlength: [32, 'Too long category name']
    },
    // A and B => a-and-b
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'SubCategory must be belongs to parent category']
    }
}, { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);