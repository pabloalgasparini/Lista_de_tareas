import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('connectado a la base de datos');
  } catch (error) {
    console.log(`No se pudo conectar la base de datos: ${error}`);
  }
};
