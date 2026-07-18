import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    toolName: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
      minlength: [2, 'Tool name must be at least 2 characters'],
      maxlength: [120, 'Tool name cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [80, 'Category cannot exceed 80 characters']
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      maxlength: [80, 'Brand cannot exceed 80 characters']
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['New', 'Good', 'Fair', 'Needs Repair']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      max: [10000, 'Quantity is too high']
    },
    availability: {
      type: String,
      required: true,
      enum: ['Available', 'Borrowed', 'Unavailable'],
      default: 'Available',
      index: true
    },
    borrowerName: {
      type: String,
      trim: true,
      maxlength: [120, 'Borrower name cannot exceed 120 characters'],
      default: ''
    },
    borrowDate: {
      type: Date,
      default: null
    },
    returnDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: ''
    }
  },
  { timestamps: true }
);

toolSchema.index({ owner: 1, toolName: 1 });
toolSchema.index({ owner: 1, category: 1 });
toolSchema.index({ owner: 1, createdAt: -1 });

export const Tool = mongoose.model('Tool', toolSchema);
