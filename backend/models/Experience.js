import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: [String],
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
