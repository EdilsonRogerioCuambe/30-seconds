/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/db/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cards = await db.card.findMany()

    return NextResponse.json(cards)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await db.card.deleteMany()
    return new Response('All cards deleted')
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }
    return new Response('An error occurred', { status: 500 })
  }
}
