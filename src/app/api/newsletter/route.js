import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.subscribers.getAll();
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve subscribers" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const result = db.subscribers.add(email);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
