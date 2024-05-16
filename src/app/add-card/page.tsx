'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Page() {
  const [frontWords, setFrontWords] = useState<string[]>(['', '', '', ''])
  const [backWords, setBackWords] = useState<string[]>(['', '', '', ''])

  const handleSubmit = async () => {
    try {
      await axios.post('/api/add-card', {
        front: frontWords,
        back: backWords,
      })

      toast.success('Card adicionado com sucesso')
      setBackWords(['', '', '', ''])
      setFrontWords(['', '', '', ''])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao adicionar card')
    }
  }

  return (
    <div className="max-w-md mx-auto my-8 p-4 border rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Adicionar Card</h2>
      <div className="mb-4">
        <label htmlFor="front" className="block mb-2 text-sm text-[#333333]">
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
            className="w-full p-2 mb-2 border rounded"
          />
        ))}
      </div>
      <div className="mb-4">
        <label htmlFor="back" className="block mb-2 text-sm text-[#333333]">
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
            className="w-full p-2 mb-2 border rounded"
          />
        ))}
      </div>
      <button
        title="submit"
        type="submit"
        onClick={handleSubmit}
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Adicionar
      </button>
    </div>
  )
}
