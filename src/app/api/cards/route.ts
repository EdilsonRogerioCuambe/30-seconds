/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/db/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const cards = await db.card.findMany()
    return NextResponse.json(cards)
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }
    return new Response('An error occurred', { status: 500 })
  }
}
