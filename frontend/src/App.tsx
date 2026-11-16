import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Gift } from 'lucide-react'
import Background from './components/Background.tsx'
import Landing from './components/Landing.tsx'
import GuidePage from './components/GuidePage.tsx'
import NotFound from './components/NotFound.tsx'
import Quiz from './components/Quiz.tsx'
import Loading from './components/Loading.tsx'
import Result from './components/Result.tsx'
import ErrorState from './components/ErrorState.tsx'
import Footer from './components/Footer.tsx'
import { generateGift, getResult } from './api.ts'
import { BUDGETS, emptyAnswers } from './quiz.ts'
import { guideBySlug, loadGuide } from './content/guides/registry.ts'
import { normalizePath as normalize, resultIdFromPath } from './routes.ts'
import { HOME, SITE_NAME } from './content/home.ts'
import type { Guide, GuidePreset } from './content/types.ts'
import type { Answers, QuizResponse } from './types.ts'

/** Página "de chegada" de uma URL: home, guia ou 404. */
type Page = { name: 'landing' } | { name: 'guide'; guide: Guide } | { name: 'notfound' }

type View =
  | Page
  | { name: 'quiz' }
  | { name: 'loading'; who: string }
  | { name: 'result'; data: QuizResponse }
  | { name: 'error'; message: string; retry?: () => void }

function pageFromPath(path: string): Page {
  const clean = normalize(path)
  if (clean === '/') return { name: 'landing' }
  const guide = guideBySlug(clean.slice(1))
  return guide ? { name: 'guide', guide } : { name: 'notfound' }
}

function viewFromPath(path: string): View {
  return resultIdFromPath(path) ? { name: 'loading', who: '' } : pageFromPath(path)
}

function applyPreset(base: Answers, preset?: GuidePreset): Answers {
  if (!preset) return base
  const budget = BUDGETS.find((b) => b.label === preset.budget)
  return {
    ...base,
    relationship: preset.relationship ?? base.relationship,
    occasion: preset.occasion ?? base.occasion,
    age: preset.age ?? base.age,
    pronoun: preset.pronoun ?? base.pronoun,
    budget: budget ? { label: budget.label, min: budget.min, max: budget.max } : base.budget,
  }
}

function titleFor(view: View) {
  switch (view.name) {
    case 'landing':
      return HOME.title
    case 'guide':
      return view.guide.title
    case 'notfound':
      return `Página não encontrada | ${SITE_NAME}`
    case 'quiz':
    case 'loading':
      return `Quiz do presente ideal | ${SITE_NAME}`
    case 'result':
      return `${view.data.result.idealGift.title}: o presente ideal | ${SITE_NAME}`
    case 'error':
      return SITE_NAME
  }
}

/** `path` vem de window.location no navegador e da rota sendo gerada no build. */
export default function App({ path }: { path: string }) {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [view, setView] = useState<View>(() => viewFromPath(path))

  function fetchResult(id: string) {
    getResult(id)
      .then((data) => {
        setAnswers(data.answers)
        setView({ name: 'result', data })
      })
      .catch((err: Error) => setView({ name: 'error', message: err.message }))
  }

  useEffect(() => {
    // Em /r/:id a tela de carregamento já é o estado inicial; aqui só busca o resultado.
    const id = resultIdFromPath(window.location.pathname)
    if (id) fetchResult(id)
    const onPopState = () => {
      const current = window.location.pathname
      const resultId = resultIdFromPath(current)
      if (resultId) {
        setView({ name: 'loading', who: '' })
        fetchResult(resultId)
        return
      }
      // O texto do guia pode ainda não ter sido baixado nesta aba.
      void loadGuide(normalize(current).slice(1)).then(() => setView(pageFromPath(current)))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.title = titleFor(view)
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

  function goHome() {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/')
    setView({ name: 'landing' })
  }

  /** Abre o quiz na página atual (home ou guia), com respostas pré-preenchidas se vier de um guia. */
  function startQuiz(preset?: GuidePreset) {
    setAnswers(applyPreset(emptyAnswers(), preset))
    setView({ name: 'quiz' })
  }

  /** Volta ao quiz com as respostas atuais (a partir do resultado). */
  function editAnswers() {
    if (resultIdFromPath(window.location.pathname)) window.history.pushState(null, '', '/')
    setView({ name: 'quiz' })
  }

  function onBrandClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    goHome()
  }

  const key =
    view.name === 'result' ? `result-${view.data.id ?? view.data.createdAt}` : view.name === 'guide' ? `guide-${view.guide.slug}` : view.name

  return (
    <>
      <Background />
      <div className="app">
        <header className="topbar">
          <a className="brand" href="/" onClick={onBrandClick} aria-label="Presente Certo: ir para o início">
            <span className="brand-icon">
              <Gift size={18} strokeWidth={2.4} />
            </span>
            Presente <em>Certo</em>
          </a>
        </header>

        <main className="main">
          {/* initial={false}: o HTML pré-renderizado já aparece visível, sem esperar o JavaScript. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {view.name === 'landing' && <Landing onStart={() => startQuiz()} />}
              {view.name === 'guide' && <GuidePage guide={view.guide} onStart={startQuiz} />}
              {view.name === 'notfound' && <NotFound onStart={() => startQuiz()} />}
              {view.name === 'quiz' && (
                <Quiz initial={answers} onSubmit={(a) => submit(a)} onExit={() => setView(pageFromPath(window.location.pathname))} />
              )}
              {view.name === 'loading' && <Loading name={view.who} />}
              {view.name === 'result' && (
                <Result
                  data={view.data}
                  onRestart={() => {
                    if (resultIdFromPath(window.location.pathname)) window.history.pushState(null, '', '/')
                    startQuiz()
                  }}
                  onEdit={editAnswers}
                  onMoreIdeas={(exclude) => submit(view.data.answers ?? answers, exclude)}
                />
              )}
              {view.name === 'error' && <ErrorState message={view.message} onRetry={view.retry} onHome={goHome} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  )
}
