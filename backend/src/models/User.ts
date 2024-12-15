import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  name: string;
  savedFoods: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
    // Removed required: true since we're generating it automatically
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  savedFoods: [{
    type: Schema.Types.ObjectId,
    ref: 'Food'
  }]
}, {
  timestamps: true
});

// Generate username from email
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate username from email (before @)
    let baseUsername = this.email.split('@')[0];
    
    // Check if username exists and append numbers if needed
    let counter = 0;
    let tempUsername = baseUsername;
    
    while (true) {
      const existingUser = await mongoose.model('User').findOne({ username: tempUsername });
      if (!existingUser) {
        break;
      }
      counter++;
      tempUsername = `${baseUsername}${counter}`;
    }
    
    this.username = tempUsername;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
