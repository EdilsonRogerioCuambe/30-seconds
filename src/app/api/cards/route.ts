/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/db/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get('word')

  if (!word) {
    return new NextResponse('Palavra de busca não fornecida', { status: 400 })
  }

  try {
    const cards = await db.card.findMany()

    const filteredCards = cards.filter(
      (card) =>
        card.front.some((item) =>
          item.toLowerCase().includes(word.toLowerCase()),
        ) ||
        card.back.some((item) =>
          item.toLowerCase().includes(word.toLowerCase()),
        ),
    )

    return NextResponse.json(filteredCards)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { cardId, oldWord, newWord } = await request.json()

    if (!cardId || !oldWord || !newWord) {
      return new NextResponse('Invalid request', { status: 400 })
    }

    const card = await db.card.findUnique({
      where: {
        id: cardId,
      },
    })

    if (!card) {
      return new NextResponse('Card not found', { status: 404 })
    }

    const updatedFront = card.front.map((word) =>
      word.includes(oldWord) ? word.replace(oldWord, newWord) : word,
    )

    const updatedBack = card.back.map((word) =>
      word.includes(oldWord) ? word.replace(oldWord, newWord) : word,
    )

    const updatedCard = await db.card.update({
      where: {
        id: cardId,
      },
      data: {
        front: updatedFront,
        back: updatedBack,
      },
    })

    return NextResponse.json(updatedCard)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
