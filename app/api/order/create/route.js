import { inngest } from '@/config/inngest';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { items, address } = await req.json();

    if (items.lenght === 0 || !address) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }
    const amount = items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return await (acc + product.offerPrice * item.quantity);
    }, 0);

    await inngest.send({
      event: 'order/created',
      data: {
        userId,
        items,
        amount,
        address,
        date: Date.now(),
      },
    });
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();
    return NextResponse.json(
      { success: true, message: 'Orden creada exitosamente!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
