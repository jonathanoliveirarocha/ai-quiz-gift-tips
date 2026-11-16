import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import StepBody from './StepBody.tsx'
import { STEPS, isStepValid, who } from '../quiz.ts'
import type { Answers } from '../types.ts'

type Props = { initial: Answers; onSubmit: (answers: Answers) => void; onExit: () => void }

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
}

export default function Quiz({ initial, onSubmit, onExit }: Props) {
  const [answers, setAnswers] = useState(initial)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const advanceTimer = useRef<number | undefined>(undefined)

  const step = STEPS[index]
  const valid = isStepValid(step, answers)
  const isLast = index === STEPS.length - 1
  const progress = ((index + 1) / STEPS.length) * 100
  const isEmptyOptional = step.optional === true && step.kind === 'text' && !answers[step.field].trim()

  const update = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }))

  function next() {
    window.clearTimeout(advanceTimer.current)
    if (!valid) return
    if (isLast) return onSubmit(answers)
    setDirection(1)
    setIndex((i) => i + 1)
  }

  function back() {
    window.clearTimeout(advanceTimer.current)
    if (index === 0) return onExit()
    setDirection(-1)
    setIndex((i) => i - 1)
  }

  // Em perguntas de escolha única, avança sozinho logo depois do clique.
  function autoAdvance() {
    window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => {
      setDirection(1)
      setIndex((i) => Math.min(i + 1, STEPS.length - 1))
    }, 320)
  }

  useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inTextarea = (e.target as HTMLElement).tagName === 'TEXTAREA'
      if (e.key === 'Enter' && (!inTextarea || e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="quiz">
      <div className="quiz-top">
        <button className="icon-btn" onClick={back} aria-label="Voltar">
          <ArrowLeft size={20} />
        </button>
        <div className="progress" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
          <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
        <span className="progress-count">
          {index + 1}/{STEPS.length}
        </span>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          className="quiz-card glass"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <span className="eyebrow">
            Pergunta {index + 1} de {STEPS.length}
            {step.optional && ' · opcional'}
          </span>
          <h2 className="quiz-title">{step.title(who(answers))}</h2>
          {step.subtitle && <p className="quiz-subtitle">{step.subtitle(who(answers))}</p>}
          <StepBody step={step} answers={answers} update={update} onPicked={autoAdvance} />
        </motion.div>
      </AnimatePresence>

      <div className="quiz-actions">
        <span className="kbd-hint">
          Aperte <kbd>Enter</kbd> para continuar
        </span>
        <button className={`btn ${isLast ? 'btn-primary' : 'btn-light'}`} onClick={next} disabled={!valid}>
          {isLast ? (
            <>
              <Sparkles size={18} /> {isEmptyOptional ? 'Pular e descobrir o presente' : 'Descobrir o presente'}
            </>
          ) : (
            <>
              {isEmptyOptional ? 'Pular' : 'Continuar'} <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </section>
  )
}
