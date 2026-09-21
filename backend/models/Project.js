import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  github: {
    type: String,
    trim: true,
    default: ''
  },
  demo: {
    type: String,
    trim: true,
    default: ''
  },
  stack: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
