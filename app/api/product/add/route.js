import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { connect } from 'mongoose';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: You are not a seller' },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const files = formData.getAll('images');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice');
    const category = formData.get('category');
    // const quantity = formData.get('quantity');

    if (
      !name ||
      !description ||
      !files ||
      files.length === 0 ||
      !price ||
      !offerPrice ||
      !category
      //TODO: ADD !quantity
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      );
    }

    const result = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );
          stream.end(buffer);
        });
      }),
    );

    const image = result.map((result) => result.secure_url);
    await connect();
    const newProduct = await Product.create({
      userId,
      name,
      description,
      image,
      price: Number(price),
      offerPrice: Number(offerPrice),
      category,
      date: Date.now(),
    });

    return NextResponse.json(
      { success: true, message: 'Producto agregado exitosamente!', newProduct },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
