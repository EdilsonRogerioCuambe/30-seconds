import { db } from '@/db/prisma'
import Deck from './components/deck'

export default async function Home() {
  const deck = await db.card.findMany()
  return (
    <main className="max-w-md mx-auto min-h-screen">
      <Deck cards={deck} />
    </main>
  )
}
