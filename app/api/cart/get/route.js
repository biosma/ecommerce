import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    await connect();
    const user = await User.findById(userId);
    const { cartItems } = user;
    return NextResponse.json({ success: true, cartItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 404 });
  }
}
