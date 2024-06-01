import { db } from '@/db/prisma'
import Deck from './components/deck'

export const dynamic = 'force-dynamic'

interface CardProps {
  id: string
  front: string[]
  back: string[]
}

function shuffle(array: CardProps[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default async function Home() {
  const deck = await db.card.findMany({
    orderBy: { createdAt: 'asc' },
  })
  const shuffledDeck = shuffle(deck)
  return (
    <main className="max-w-md mx-auto min-h-screen bg-[#202024] text-[#f5f5f5]">
      <Deck cards={shuffledDeck} />
    </main>
  )
}
