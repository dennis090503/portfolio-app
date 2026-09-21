import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    trim: true,
    default: ''
  },
  url: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;
