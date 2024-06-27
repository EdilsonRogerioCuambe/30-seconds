/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/db/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const allCards = await db.card.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(allCards)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
