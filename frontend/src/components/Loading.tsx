import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export default function Loading({ name }: { name: string }) {
  const messages = [
    name ? `Lendo tudo sobre ${name}...` : 'Abrindo o presente...',
    'Cruzando gostos, rotina e estilo...',
    'Pensando em algo que ninguém pensou...',
    'Conferindo o orçamento...',
    'Separando opções nas lojas confiáveis...',
    'Embrulhando a ideia perfeita...',
  ]
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setI((n) => Math.min(n + 1, messages.length - 1)), 2200)
    return () => window.clearInterval(id)
  }, [messages.length])

  return (
    <section className="loading">
      <div className="gift-anim" aria-hidden="true">
        <div className="gift-lid" />
        <div className="gift-box" />
        <span className="gift-spark s1">✦</span>
        <span className="gift-spark s2">✧</span>
        <span className="gift-spark s3">✦</span>
      </div>
      <div className="loading-text" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {messages[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="shimmer-bar">
        <span />
      </div>
    </section>
  )
}
