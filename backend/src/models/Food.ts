import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  imageUrl?: string;
  thirdPartyLinks: {
    uberEats?: string;
    deliveroo?: string;
  };
  userId: mongoose.Types.ObjectId; // Reference to the user who saved it
  createdAt: Date;
}

const FoodSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  macros: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true }
  },
  imageUrl: { type: String },
  thirdPartyLinks: {
    uberEats: { type: String },
    deliveroo: { type: String }
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFood>('Food', FoodSchema);
