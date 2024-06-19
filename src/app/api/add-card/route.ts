import { db } from '@/db/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { front, back } = await request.json()

    if (!front || !back || !Array.isArray(front) || !Array.isArray(back)) {
      return new NextResponse('Invalid request', { status: 400 })
    }

    const existingCards = await db.card.findMany({
      select: {
        front: true,
        back: true,
      },
    })

    const existingWords = new Set<string>()
    existingCards.forEach((card) => {
      card.front.forEach((word) => existingWords.add(word))
      card.back.forEach((word) => existingWords.add(word))
    })

    const allWords = [...front, ...back]
    const duplicateWord = allWords.some((word) => existingWords.has(word))

    if (duplicateWord) {
      return new NextResponse(
        `${allWords
          .filter((word) => existingWords.has(word))
          .join(', ')} already exists in the deck`,
        { status: 400 },
      )
    }

    const card = await db.card.create({
      data: {
        front,
        back,
      },
    })

    return NextResponse.json(card)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
