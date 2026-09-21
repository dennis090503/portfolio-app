import mongoose from 'mongoose';

const techStackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

const TechStack = mongoose.model('TechStack', techStackSchema);
export default TechStack;
