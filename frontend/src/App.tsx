import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Gift } from 'lucide-react'
import Background from './components/Background.tsx'
import Landing from './components/Landing.tsx'
import Quiz from './components/Quiz.tsx'
import Loading from './components/Loading.tsx'
import Result from './components/Result.tsx'
import ErrorState from './components/ErrorState.tsx'
import Footer from './components/Footer.tsx'
import { generateGift, getResult } from './api.ts'
import { emptyAnswers } from './quiz.ts'
import type { Answers, QuizResponse } from './types.ts'

type View =
  | { name: 'landing' }
  | { name: 'quiz' }
  | { name: 'loading'; who: string }
  | { name: 'result'; data: QuizResponse }
  | { name: 'error'; message: string; retry?: () => void }

const resultIdFromPath = () => window.location.pathname.match(/^\/r\/([a-f\d]{24})\/?$/i)?.[1] ?? null

export default function App() {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [view, setView] = useState<View>(() => (resultIdFromPath() ? { name: 'loading', who: '' } : { name: 'landing' }))

  useEffect(() => {
    const id = resultIdFromPath()
    if (id) {
      getResult(id)
        .then((data) => {
          setAnswers(data.answers)
          setView({ name: 'result', data })
        })
        .catch((err: Error) => setView({ name: 'error', message: err.message }))
    }
    const onPopState = () => {
      if (!resultIdFromPath()) setView({ name: 'landing' })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  async function submit(current: Answers, exclude: string[] = []) {
    setAnswers(current)
    setView({ name: 'loading', who: current.name })
    try {
      const data = await generateGift(current, exclude)
      if (data.id) window.history.pushState(null, '', `/r/${data.id}`)
      setView({ name: 'result', data })
    } catch (err) {
      setView({ name: 'error', message: (err as Error).message, retry: () => submit(current, exclude) })
    }
  }

  function goTo(name: 'landing' | 'quiz', reset = false) {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/')
    if (reset) setAnswers(emptyAnswers())
    setView(name === 'quiz' ? { name: 'quiz' } : { name: 'landing' })
  }

  const key = view.name === 'result' ? `result-${view.data.id ?? view.data.createdAt}` : view.name

  return (
    <>
      <Background />
      <div className="app">
        <header className="topbar">
          <button className="brand" onClick={() => goTo('landing')} aria-label="Ir para o início">
            <span className="brand-icon">
              <Gift size={18} strokeWidth={2.4} />
            </span>
            Presente <em>Certo</em>
          </button>
        </header>

        <main className="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {view.name === 'landing' && <Landing onStart={() => goTo('quiz', true)} />}
              {view.name === 'quiz' && <Quiz initial={answers} onSubmit={(a) => submit(a)} onExit={() => goTo('landing')} />}
              {view.name === 'loading' && <Loading name={view.who} />}
              {view.name === 'result' && (
                <Result
                  data={view.data}
                  onRestart={() => goTo('quiz', true)}
                  onEdit={() => goTo('quiz')}
                  onMoreIdeas={(exclude) => submit(view.data.answers ?? answers, exclude)}
                />
              )}
              {view.name === 'error' && <ErrorState message={view.message} onRetry={view.retry} onHome={() => goTo('landing')} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  )
}
