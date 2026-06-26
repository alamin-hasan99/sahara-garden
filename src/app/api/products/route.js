import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.products.getAll();
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve products" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const product = db.products.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
