import mongoose from 'mongoose';
import { STORE_IDS } from './services/stores.js';

const { Schema } = mongoose;

const quizResultSchema = new Schema(
  {
    answers: { type: Schema.Types.Mixed, required: true },
    result: { type: Schema.Types.Mixed, required: true },
    catalog: { type: [Schema.Types.Mixed], default: [] },
    mode: { type: String, enum: ['gemini', 'demo'], required: true },
    model: String,
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Produtos parceiros com link de afiliado, cadastrados via /api/admin ou npm run import:catalog.
const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 600, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
    price: { type: Number, min: 0 },
    store: { type: String, enum: STORE_IDS, required: true },
    url: { type: String, required: true, trim: true, unique: true },
    tags: { type: [String], index: true, default: [] },
    active: { type: Boolean, default: true },
    priority: { type: Number, min: 1, max: 10, default: 1 },
  },
  { timestamps: true },
);

const clickSchema = new Schema(
  {
    result: { type: Schema.Types.ObjectId, ref: 'QuizResult' },
    title: String,
    store: String,
    url: String,
    kind: { type: String, enum: ['ideal', 'suggestion', 'catalog'] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export const Product = mongoose.model('Product', productSchema);
export const Click = mongoose.model('Click', clickSchema);
