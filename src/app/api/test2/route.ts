import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const apps = await prisma.app.findMany();
    return NextResponse.json({ status: 'ok', apps });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', error: e.message }, { status: 500 });
  }
}
