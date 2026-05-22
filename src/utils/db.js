import mongoose from 'mongoose';

async function connect() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/url_shortener';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
}

export default connect;
