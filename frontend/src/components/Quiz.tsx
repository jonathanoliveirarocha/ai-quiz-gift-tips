import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import StepBody from './StepBody.tsx'
import { STEPS, isMinorAge, isStepAnswered, isStepValid, who } from '../quiz.ts'
import { track } from '../lib/tracking.ts'
import { preloadTurnstile } from '../lib/turnstile.ts'
import type { Answers } from '../types.ts'

type Props = {
  initial: Answers
  /** Pergunta inicial. */
  startIndex?: number
  /** Perguntas já respondidas por um guia: são puladas ao avançar (dá para voltar e mudar). */
  skip?: number[]
  onSubmit: (answers: Answers) => void
  onExit: () => void
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
}

export default function Quiz({ initial, startIndex = 0, skip = [], onSubmit, onExit }: Props) {
  const [answers, setAnswers] = useState(initial)
  const [index, setIndex] = useState(Math.min(startIndex, STEPS.length - 1))
  const [direction, setDirection] = useState(1)
  const advanceTimer = useRef<number | undefined>(undefined)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const step = STEPS[index]
  const valid = isStepValid(step, answers)
  const isLast = index === STEPS.length - 1
  const progress = ((index + 1) / STEPS.length) * 100
  const isEmptyOptional = step.optional === true && !isStepAnswered(step, answers)

  const update = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }))

  // Próxima pergunta que ainda falta (pula as que o guia já respondeu).
  const nextIndex = (from: number) => {
    let i = from + 1
    while (i < STEPS.length - 1 && skip.includes(i)) i++
    return Math.min(i, STEPS.length - 1)
  }

  useEffect(() => {
    track('quiz_start')
    preloadTurnstile()
  }, [])

  useEffect(() => {
    track('step', { step: index + 1 })
    titleRef.current?.focus({ preventScroll: true })
  }, [index])

  function next() {
    window.clearTimeout(advanceTimer.current)
    if (!valid) return
    if (isLast) return onSubmit(answers)
    setDirection(1)
    setIndex(nextIndex)
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
      setIndex(nextIndex)
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

  const minor = isMinorAge(answers.age)

  return (
    <section className="quiz" aria-label="Quiz do presente ideal">
      <div className="quiz-top">
        <button className="icon-btn" onClick={back} aria-label={index === 0 ? 'Sair do quiz' : 'Pergunta anterior'}>
          <ArrowLeft size={20} />
        </button>
        <div
          className="progress"
          role="progressbar"
          aria-label="Progresso do quiz"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
        <span className="progress-count" aria-hidden="true">
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
          <h2 className="quiz-title" ref={titleRef} tabIndex={-1}>
            {step.title(who(answers))}
          </h2>
          {step.subtitle && <p className="quiz-subtitle">{step.subtitle(who(answers))}</p>}
          {step.kind === 'text' && minor && (
            <p className="quiz-note">
              <ShieldCheck size={16} aria-hidden="true" /> Como o presente é para uma criança ou adolescente, não escreva nome completo, escola ou
              outros dados que a identifiquem.
            </p>
          )}
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
      {isLast && (
        <p className="quiz-consent">
          Ao continuar, você confirma ter 18 anos ou mais, concorda com os{' '}
          <a href="/termos-de-uso" target="_blank" rel="noopener">
            Termos de Uso
          </a>{' '}
          e declara ter lido a{' '}
          <a href="/politica-de-privacidade" target="_blank" rel="noopener">
            Política de Privacidade
          </a>
          .
        </p>
      )}
    </section>
  )
}
