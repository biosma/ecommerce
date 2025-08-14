import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/ecommerce-next`, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
