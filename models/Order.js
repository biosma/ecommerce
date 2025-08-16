import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  items: {
    type: [
      {
        product: {
          type: String,
          required: true,
          ref: 'product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Orden Generada', 'Orden Entregada', 'Orden Cancelada'],
    default: 'Orden Generada',
  },
  date: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.models.order || mongoose.model('Order', orderSchema);

export default Order;
