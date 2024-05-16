'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  id: string
  front: string[]
  back: string[]
}

interface DeckProps {
  cards: CardProps[]
}

export default function Deck({ cards }: DeckProps) {
  const [shuffledCards, setShuffledCards] = useState<CardProps[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  // Shuffle cards function
  const shuffleCards = (cards: CardProps[]) => {
    const array = cards.slice() // Create a copy of the array
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
    }
    return array
  }

  // Effect to shuffle cards on load
  useEffect(() => {
    setShuffledCards(shuffleCards(cards))
  }, [cards])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const nextCard = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % shuffledCards.length)
    setTimeLeft(30)
  }

  const currentCard = cards[currentCardIndex] || { front: [], back: [] }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="text-2xl font-bold text-[#333333] mb-4">
        {timeLeft} segundos restantes
      </div>
      <motion.div
        className="flex justify-center items-center relative w-96 h-52 rounded-lg shadow-lg"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="absolute w-full h-full flex flex-col justify-center items-start rounded-lg bg-yellow-600 p-4"
          style={{ backfaceVisibility: 'hidden' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentCard.front.map((word, index) => (
            <div
              key={index}
              className="text-start text-2xl font-bold text-[#f5f5f5] my-1"
            >
              {word}
            </div>
          ))}
        </motion.div>
        <motion.div
          className="absolute w-full h-full flex flex-col justify-center items-start rounded-lg bg-blue-600 p-4"
          style={{ backfaceVisibility: 'hidden', rotateY: '180deg' }}
          animate={{ rotateY: isFlipped ? 360 : 180 }}
          transition={{ duration: 0.5 }}
        >
          {currentCard.back.map((word, index) => (
            <div key={index} className="text-2xl font-bold text-white my-1">
              {word}
            </div>
          ))}
        </motion.div>
      </motion.div>
      <div className="mt-4 flex space-x-4">
        <button
          type="button"
          onClick={toggleFlip}
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {isFlipped ? 'Frente' : 'Verso'}
        </button>
        <button
          type="button"
          onClick={nextCard}
          className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
