import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.orders.getAll();
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}
