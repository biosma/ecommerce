import connect from '@/config/db';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { cartData } = req.json();
    await connect();
    const user = await User.findById(userId);
    user.cartItems = cartData;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Cart updated successfully!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
