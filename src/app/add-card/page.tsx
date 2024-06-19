'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Card } from '@prisma/client'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [frontWords, setFrontWords] = useState<string[]>(['', '', '', '', ''])
  const [backWords, setBackWords] = useState<string[]>(['', '', '', '', ''])
  const [existingWords, setExistingWords] = useState<Card[]>([])

  useEffect(() => {
    const fetchExistingWords = async () => {
      try {
        const response = await axios.get('/api/cards')
        if (Array.isArray(response.data)) {
          setExistingWords(response.data)
        } else {
          console.error('Response is not an array:', response.data)
          toast.error('Erro ao carregar palavras existentes')
        }
      } catch (error) {
        console.error(error)
        toast.error('Erro ao carregar palavras existentes')
      }
    }
    fetchExistingWords()
  }, [])

  console.log('existingWords:', existingWords)

  const handleSubmit = async () => {
    if (
      frontWords.some((word) => word.trim() === '') ||
      backWords.some((word) => word.trim() === '')
    ) {
      toast.error(
        'Preencha todos os campos com palavras válidas antes de adicionar o card',
      )
      return
    }

    const allWords = [...frontWords, ...backWords]
    const duplicateWord = allWords.some((word) =>
      existingWords.some(
        (card) => card.front.includes(word) || card.back.includes(word),
      ),
    )

    if (duplicateWord) {
      toast.error('Uma ou mais palavras já existem no tabuleiro')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/add-card', {
        front: frontWords,
        back: backWords,
      })

      toast.success('Card adicionado com sucesso')
      setBackWords(['', '', '', '', ''])
      setFrontWords(['', '', '', '', ''])
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-24 p-4 border rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Adicionar Card</h2>
      <div className="mb-4">
        <label htmlFor="front" className="block mb-2 text-sm">
          Frente
        </label>
        {frontWords.map((word, index) => (
          <input
            key={index}
            title="front"
            type="text"
            value={word}
            onChange={(e) => {
              const newWords = [...frontWords]
              newWords[index] = e.target.value
              setFrontWords(newWords)
            }}
            className="w-full p-2 mb-2 border rounded bg-[#333333]"
          />
        ))}
      </div>
      <div className="mb-4">
        <label htmlFor="back" className="block mb-2 text-sm">
          Verso
        </label>
        {backWords.map((word, index) => (
          <input
            key={index}
            title="back"
            type="text"
            value={word}
            onChange={(e) => {
              const newWords = [...backWords]
              newWords[index] = e.target.value
              setBackWords(newWords)
            }}
            className="w-full p-2 mb-2 border rounded bg-[#333333]"
          />
        ))}
      </div>
      <button
        title="submit"
        type="submit"
        onClick={handleSubmit}
        className={`w-full p-2 bg-green-400 font-extrabold uppercase text-black rounded hover:bg-green-600 transition ${
          loading && 'cursor-not-allowed'
        }`}
      >
        {loading ? 'Adicionando...' : 'Adicionar'}
      </button>
    </div>
  )
}
