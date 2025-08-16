import connect from '@/config/db';
import authSeller from '@/lib/authSeller';
import Address from '@/models/Address';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: You are not a seller' },
        { status: 401 },
      );
    }

    await connect();
    Address.length;
    const orders = await Order.find({}).populate('address items.product');

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 404 });
  }
}
