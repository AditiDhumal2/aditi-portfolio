import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Define schema (simplified for testing)
const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Aditi' },
  title: { type: String, default: 'Information Technology Student' }
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default async function handler(req, res) {
  try {
    await mongoose.connect(MONGODB_URI);
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({ name: 'Aditi' });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}