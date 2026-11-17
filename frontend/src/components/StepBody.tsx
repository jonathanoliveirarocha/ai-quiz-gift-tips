import { useRef } from 'react'
import { Check } from 'lucide-react'
import { BUDGETS, SCALES, type Step } from '../quiz.ts'
import type { Answers, Pronoun } from '../types.ts'

type Props = {
  step: Step
  answers: Answers
  update: (patch: Partial<Answers>) => void
  onPicked: () => void
}

const PRONOUNS: { value: Pronoun; label: string }[] = [
  { value: 'ela', label: 'Ela' },
  { value: 'ele', label: 'Ele' },
  { value: 'neutro', label: 'Prefiro não dizer' },
]

export default function StepBody({ step, answers, update, onPicked }: Props) {
  const textRef = useRef<HTMLTextAreaElement>(null)

  switch (step.kind) {
    case 'name':
      return (
        <div className="name-step">
          <input
            className="input input-xl"
            autoFocus
            aria-label="Nome ou apelido de quem vai ganhar o presente (opcional)"
            autoComplete="off"
            maxLength={40}
            placeholder="Ex.: Ana, Vô Zé, Mozão..."
            value={answers.name}
            onChange={(e) => update({ name: e.target.value })}
          />
          <div className="field-label" id="pronome">
            Como você se refere a essa pessoa?
          </div>
          <div className="segmented" role="group" aria-labelledby="pronome">
            {PRONOUNS.map((p) => (
              <button
                key={p.value}
                aria-pressed={answers.pronoun === p.value}
                className={answers.pronoun === p.value ? 'active' : ''}
                onClick={() => update({ pronoun: p.value })}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )

    case 'single':
      return (
        <div className={`options ${step.compact ? 'options-compact' : ''}`}>
          {step.options.map((o) => {
            const selected = answers[step.field] === o.value
            return (
              <button
                key={o.value}
                aria-pressed={selected}
                className={`option ${selected ? 'selected' : ''}`}
                onClick={() => {
                  update({ [step.field]: o.value })
                  onPicked()
                }}
              >
                <span className="option-emoji" aria-hidden="true">
                  {o.emoji}
                </span>
                <span className="option-label">{o.value}</span>
                {selected && (
                  <span className="option-check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )

    case 'budget':
      return (
        <div className="options options-budget">
          {BUDGETS.map(({ emoji, ...budget }) => {
            const selected = answers.budget?.label === budget.label
            return (
              <button
                key={budget.label}
                aria-pressed={selected}
                className={`option ${selected ? 'selected' : ''}`}
                onClick={() => {
                  update({ budget })
                  onPicked()
                }}
              >
                <span className="option-emoji" aria-hidden="true">
                  {emoji}
                </span>
                <span className="option-label">{budget.label}</span>
                {selected && (
                  <span className="option-check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )

    case 'multi': {
      const selected = answers[step.field]
      const full = selected.length >= step.max
      const toggle = (value: string) =>
        update({ [step.field]: selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value] })
      return (
        <div>
          <div className="chips">
            {step.options.map((o) => {
              const active = selected.includes(o.value)
              return (
                <button
                  key={o.value}
                  aria-pressed={active}
                  className={`chip ${active ? 'active' : ''}`}
                  disabled={!active && full}
                  onClick={() => toggle(o.value)}
                >
                  <span aria-hidden="true">{o.emoji}</span> {o.value}
                </button>
              )
            })}
          </div>
          <div className="multi-footer">
            <span className={`counter ${full ? 'full' : ''}`} aria-live="polite">
              {selected.length}/{step.max} escolhidos
            </span>
            {step.other && (
              <input
                className="input"
                aria-label="Outro interesse (opcional)"
                maxLength={120}
                placeholder="Outro interesse? Escreva aqui (ex.: crochê, F1, K-pop)"
                value={answers.otherInterest}
                onChange={(e) => update({ otherInterest: e.target.value })}
              />
            )}
          </div>
        </div>
      )
    }

    case 'scales':
      return (
        <div className="scales">
          {SCALES.map((s) => {
            const value = answers.style[s.key]
            return (
              <div key={s.key} className="scale">
                <span className={`scale-side ${value <= 2 ? 'strong' : ''}`}>
                  <span>{s.leftEmoji}</span> {s.left}
                </span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={value}
                  style={{ ['--fill' as string]: `${((value - 1) / 4) * 100}%` }}
                  aria-label={`${s.left} ou ${s.right}`}
                  onChange={(e) => update({ style: { ...answers.style, [s.key]: Number(e.target.value) } })}
                />
                <span className={`scale-side right ${value >= 4 ? 'strong' : ''}`}>
                  {s.right} <span>{s.rightEmoji}</span>
                </span>
              </div>
            )
          })}
        </div>
      )

    case 'text': {
      const value = answers[step.field]
      const max = step.field === 'special' ? 600 : 300
      return (
        <div className="text-step">
          <textarea
            ref={textRef}
            className="input textarea"
            aria-label={step.field === 'avoid' ? 'O que a pessoa já tem ou não curte (opcional)' : 'Algo especial sobre a pessoa (opcional)'}
            autoFocus
            rows={4}
            maxLength={max}
            placeholder={step.placeholder}
            value={value}
            onChange={(e) => update({ [step.field]: e.target.value })}
          />
          <div className="text-meta">
            <div className="starters">
              {step.starters.map((s) => (
                <button
                  key={s}
                  className="starter"
                  onClick={() => {
                    const sep = value && !/[\s.;,]$/.test(value) ? '. ' : ''
                    update({ [step.field]: `${value}${sep}${s}`.slice(0, max) })
                    textRef.current?.focus()
                  }}
                >
                  + {s.trim()}...
                </button>
              ))}
            </div>
            <span className="char-count">
              {value.length}/{max}
            </span>
          </div>
        </div>
      )
    }
  }
}
