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
  const [currentCards, setCurrentCards] = useState<CardProps[]>(cards)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const playTic = async () => {
    const audio = new Audio(tic)
    audio.play()
  }

  useEffect(() => {
    if (timeLeft > 0 && isPlaying) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      if (timeLeft <= 5 && timeLeft > 0) {
        playTic()
      }

      return () => clearTimeout(timer)
    }
  }, [timeLeft, isPlaying])

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const nextCard = () => {
    setIsFlipped(false)
    setTimeLeft(30)

    const nextIndex = currentCardIndex + 1
    if (nextIndex < currentCards.length) {
      setCurrentCardIndex(nextIndex)
    } else {
      const newOrder = [...currentCards.slice(1), currentCards[0]]
      setCurrentCards(newOrder)
      setCurrentCardIndex(0)
    }
  }

  const startGame = () => {
    setIsPlaying(true)
    setIsPaused(false)
    setTimeLeft(30) // Reset the timer when starting the game
  }

  const pauseGame = () => {
    setIsPlaying(false)
    setIsPaused(true)
  }

  const continueGame = () => {
    setIsPlaying(true)
    setIsPaused(false)
  }

  const currentCard = currentCards[currentCardIndex]

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {!isPlaying && !isPaused && (
        <div className="flex flex-col items-center justify-center w-96 h-52 rounded-lg shadow-lg bg-[#202024] p-4">
          <p className="text-2xl font-extrabold uppercase text-purple-400 text-center mb-2">
            Clique em iniciar para mostrar as cartas
          </p>
        </div>
      )}
      {(isPlaying || isPaused) && (
        <div className="text-3xl relative font-bold mb-4 transition-all duration-300 ease-in-out">
          <CountdownCircleTimer
            key={currentCard.id}
            isPlaying={isPlaying}
            duration={30}
            colors={['#09cf62', '#F7B801', '#A30000', '#000']}
            strokeWidth={5}
            colorsTime={[30, 20, 10]}
            trailColor="#333"
            size={75}
            initialRemainingTime={timeLeft}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>
      )}
      {isPlaying && (
        <AnimatePresence onExitComplete={() => setIsFlipped(false)}>
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { duration: 0.5, ease: 'easeInOut' },
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              rotate: 180,
              transition: { duration: 0.5, ease: 'easeInOut' },
            }}
            className="flex justify-center items-center relative w-96 h-52 rounded-lg shadow-lg"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className="absolute w-full h-full flex flex-col justify-center items-start rounded-lg bg-yellow-400 p-4"
              style={{ backfaceVisibility: 'hidden' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentCard.front.map((word, index) => (
                <div
                  key={index}
                  className="text-start uppercase text-black text-xl font-bold my-1"
                >
                  {word}
                </div>
              ))}
            </motion.div>
            <motion.div
              className="absolute w-full h-full flex flex-col justify-center items-start rounded-lg bg-blue-400 p-4"
              style={{ backfaceVisibility: 'hidden' }}
              animate={{ rotateY: isFlipped ? 0 : 180 }}
              transition={{ duration: 0.5 }}
            >
              {currentCard.back.map((word, index) => (
                <div
                  key={index}
                  className="text-xl uppercase text-black font-bold my-1"
                >
                  {word}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {isPlaying && (
        <div className="mt-4 flex space-x-4">
          <button
            type="button"
            onClick={toggleFlip}
            className={`${
              isFlipped
                ? 'bg-yellow-400 hover:bg-yellow-600'
                : 'bg-blue-400 hover:bg-blue-600'
            } text-black uppercase font-extrabold px-4 py-2 rounded transition-all duration-300 ease-in-out`}
          >
            {isFlipped ? 'Frente' : 'Verso'}
          </button>
          <button
            type="button"
            onClick={
              currentCardIndex === cards.length - 1 || timeLeft > 0
                ? undefined
                : nextCard
            }
            disabled={currentCardIndex === cards.length - 1 || timeLeft > 0}
            className={`${
              currentCardIndex === cards.length - 1 || timeLeft > 0
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-700'
            } text-black uppercase font-extrabold px-4 py-2 rounded transition-all duration-300 ease-in-out`}
          >
            Próximo
          </button>
        </div>
      )}
      {isPaused && (
        <div className="flex flex-col items-center justify-center w-96 h-52 rounded-lg shadow-lg bg-[#202024] p-4 mt-4">
          <p className="text-2xl font-extrabold uppercase text-center text-purple-400 mb-2">
            Jogo pausado. Clique em continuar para retomar.
          </p>
        </div>
      )}
      <div className="mt-4">
        <button
          type="button"
          onClick={isPlaying ? pauseGame : isPaused ? continueGame : startGame}
          className={`${
            isPlaying
              ? 'bg-red-400 hover:bg-red-600'
              : 'bg-green-400 hover:bg-green-600'
          } text-black font-extrabold uppercase px-4 py-2 rounded transition-all duration-300 ease-in-out`}
        >
          {isPlaying ? 'Pausar' : isPaused ? 'Continuar' : 'Iniciar'}
        </button>
      </div>
    </div>
  )
}
