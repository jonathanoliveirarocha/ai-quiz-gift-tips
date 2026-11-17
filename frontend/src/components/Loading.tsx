import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const MESSAGES = (name: string) => [
  name ? `Lendo tudo sobre ${name}...` : 'Abrindo o presente...',
  'Cruzando gostos, rotina e estilo...',
  'Pensando em algo que ninguém pensou...',
  'Conferindo o orçamento...',
  'Separando as melhores opções...',
  'Embrulhando a ideia perfeita...',
]

export default function Loading({ name }: { name: string }) {
  const messages = MESSAGES(name)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  // As mensagens giram a cada 2,5 s e voltam ao começo, sem travar na última.
  const i = Math.floor(seconds / 2.5) % messages.length

  const slow = seconds >= 18

  return (
    <section className="loading" aria-busy="true">
      <div className="gift-anim" aria-hidden="true">
        <div className="gift-lid" />
        <div className="gift-box" />
        <span className="gift-spark s1">✦</span>
        <span className="gift-spark s2">✧</span>
        <span className="gift-spark s3">✦</span>
      </div>
      <div className="loading-text" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p key={slow ? 'slow' : i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {slow ? 'A IA está com muita procura agora. Mais alguns segundos...' : messages[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="shimmer-bar">
        <span />
      </div>
      <p className="loading-hint">
        {slow
          ? 'Se ela não responder logo, mostramos ideias do nosso acervo, escolhidas pelas suas respostas.'
          : 'Costuma levar de 10 a 25 segundos.'}
      </p>
    </section>
  )
}
