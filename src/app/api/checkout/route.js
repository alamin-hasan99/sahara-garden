import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, subtotal, discount, shipping, tax, total } = body;
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const order = db.orders.create({ items, subtotal, discount, shipping, tax, total });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}
