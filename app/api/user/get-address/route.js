import connect from '@/config/db';
import Address from '@/models/Address';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    await connect();
    const addresses = await Address.find({ userId });

    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
