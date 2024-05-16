'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import tic from '@/assets/sounds/tic.mp3'

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

  const shuffleCards = (cards: CardProps[]) => {
    return cards.sort(() => Math.random() - 0.3)
  }

  useEffect(() => {
    setShuffledCards(shuffleCards(cards))
  }, [cards])

  const playTic = async () => {
    const audio = new Audio(tic)
    audio.play()
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      if (timeLeft <= 5 && timeLeft > 0) {
        playTic()
      }

      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const nextCard = () => {
    setIsFlipped(false)
    setTimeLeft(30)
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % shuffledCards.length)
  }

  const currentCard = cards[currentCardIndex] || { front: [], back: [] }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="text-3xl relative font-bold mb-4 transition-all duration-300 ease-in-out">
        <CountdownCircleTimer
          key={currentCard.id}
          isPlaying={timeLeft > 0}
          duration={30}
          colors={['#09cf62', '#F7B801', '#A30000', '#000']}
          strokeWidth={5}
          colorsTime={[30, 20, 10]}
          trailColor="#333"
          size={75}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>
      <AnimatePresence onExitComplete={() => setIsFlipped(false)}>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
          exit={{
            opacity: 0,
            y: -100,
            scale: 0.5,
            rotate: 180,
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
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
                className="text-start text-xl font-bold text-[#f5f5f5] my-1"
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
              <div key={index} className="text-xl font-bold text-white my-1">
                {word}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
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
          onClick={
            currentCardIndex === shuffledCards.length - 1 ? undefined : nextCard
          }
          disabled={currentCardIndex === shuffledCards.length - 1}
          className={`${
            currentCardIndex === shuffledCards.length - 1
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-400 hover:bg-green-600'
          } text-white px-4 py-2 rounded transition`}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
