import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Background from './components/Background.tsx'
import Logo from './components/Logo.tsx'
import Landing from './components/Landing.tsx'
import GuidePage from './components/GuidePage.tsx'
import LegalPageView from './components/LegalPageView.tsx'
import AdminPanel from './components/AdminPanel.tsx'
import NotFound from './components/NotFound.tsx'
import Quiz from './components/Quiz.tsx'
import Loading from './components/Loading.tsx'
import Result from './components/Result.tsx'
import ErrorState from './components/ErrorState.tsx'
import Footer from './components/Footer.tsx'
import { generateGift, getResult } from './api.ts'
import { BUDGETS, emptyAnswers, prefilledSteps } from './quiz.ts'
import { guideBySlug, loadGuide } from './content/guides/registry.ts'
import { legalBySlug, loadLegal } from './content/legal/registry.ts'
import { APP_PAGES, appPageFromPath, normalizePath as normalize, resultIdFromPath, type AppPage } from './routes.ts'
import { HOME, SITE_NAME } from './content/home.ts'
import { nameFromHash } from './lib/personalize.ts'
import { track } from './lib/tracking.ts'
import type { Guide, GuidePreset } from './content/types.ts'
import type { LegalPage } from './content/legal/types.ts'
import type { Answers, QuizResponse } from './types.ts'

/** Página "de chegada" de uma URL. */
type Page =
  | { name: 'landing' }
  | { name: 'guide'; guide: Guide }
  | { name: 'legal'; page: LegalPage }
  | { name: 'app'; page: AppPage }
  | { name: 'notfound' }

type ResultView = { name: 'result'; data: QuizResponse; displayName: string; isOwner: boolean; notice?: string | null }

type View =
  | Page
  | { name: 'quiz'; startIndex: number; skip: number[] }
  | { name: 'loading'; who: string }
  | ResultView
  | { name: 'error'; message: string; retry?: () => void }

function pageFromPath(path: string): Page {
  const clean = normalize(path)
  if (clean === '/') return { name: 'landing' }
  const slug = clean.slice(1)
  const guide = guideBySlug(slug)
  if (guide) return { name: 'guide', guide }
  const legal = legalBySlug(slug)
  if (legal) return { name: 'legal', page: legal }
  const app = appPageFromPath(clean)
  if (app) return { name: 'app', page: app }
  return { name: 'notfound' }
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
    case 'legal':
      return view.page.title
    case 'app':
      return `${APP_PAGES[view.page]} | ${SITE_NAME}`
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

const shareFriendlyError = (err: unknown) => (err as Error).message || 'Algo deu errado. Tente de novo em instantes.'

/** `path` vem de window.location no navegador e da rota sendo gerada no build. */
export default function App({ path }: { path: string }) {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [view, setView] = useState<View>(() => viewFromPath(path))

  /** Abre um resultado pelo link (de quem recebeu o link ou de quem voltou a ele depois). */
  function fetchResult(id: string) {
    getResult(id)
      .then((data) => {
        setAnswers({ ...emptyAnswers(), ...data.answers, name: '' })
        setView({ name: 'result', data, displayName: nameFromHash(), isOwner: false })
      })
      .catch((err) => {
        track('result_error')
        setView({ name: 'error', message: shareFriendlyError(err) })
      })
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
      // O texto do guia ou da página institucional pode ainda não ter sido baixado nesta aba.
      const slug = normalize(current).slice(1)
      void Promise.all([loadGuide(slug), loadLegal(slug)]).then(() => setView(pageFromPath(current)))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.title = titleFor(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  /**
   * Gera as ideias. Em "Quero outras ideias", se algo falhar, o resultado anterior volta para a tela
   * (com um aviso) em vez de uma tela de erro: a pessoa não perde os botões de compra.
   */
  async function submit(current: Answers, options: { exclude?: string[]; parentId?: string | null; previous?: ResultView } = {}) {
    setAnswers(current)
    setView({ name: 'loading', who: current.name })
    track('quiz_submit')
    try {
      const data = await generateGift(current, { exclude: options.exclude, parentId: options.parentId })
      if (data.id) window.history.pushState(null, '', `/r/${data.id}`)
      setView({ name: 'result', data, displayName: current.name.trim(), isOwner: true })
    } catch (err) {
      track('result_error')
      if (options.previous) {
        setView({ ...options.previous, notice: `${shareFriendlyError(err)} Mantivemos as ideias anteriores.` })
        return
      }
      setView({ name: 'error', message: shareFriendlyError(err), retry: () => submit(current, options) })
    }
  }

  function goHome() {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/')
    setView({ name: 'landing' })
  }

  /** Abre o quiz na página atual, com respostas pré-preenchidas se vier de um guia. */
  function startQuiz(preset?: GuidePreset) {
    const start = applyPreset(emptyAnswers(), preset)
    setAnswers(start)
    setView({ name: 'quiz', startIndex: 0, skip: preset ? prefilledSteps(start) : [] })
  }

  /** Volta ao quiz com as respostas atuais (a partir do resultado). */
  function editAnswers() {
    if (resultIdFromPath(window.location.pathname)) window.history.pushState(null, '', '/')
    setView({ name: 'quiz', startIndex: 0, skip: [] })
  }

  function newQuiz() {
    if (window.location.pathname !== '/') window.history.pushState(null, '', '/')
    startQuiz()
  }

  function onBrandClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    goHome()
  }

  const key =
    view.name === 'result'
      ? `result-${view.data.id ?? view.data.createdAt}`
      : view.name === 'guide'
        ? `guide-${view.guide.slug}`
        : view.name === 'legal'
          ? `legal-${view.page.slug}`
          : view.name === 'app'
            ? `app-${view.page}`
            : view.name

  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <div className="app">
        <header className="topbar">
          <a className="brand" href="/" onClick={onBrandClick} aria-label="Mimo Certo: ir para o início">
            <Logo />
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
              {view.name === 'legal' && <LegalPageView page={view.page} />}
              {view.name === 'app' && <AdminPanel />}
              {view.name === 'notfound' && <NotFound onStart={() => startQuiz()} />}
              {view.name === 'quiz' && (
                <Quiz
                  initial={answers}
                  startIndex={view.startIndex}
                  skip={view.skip}
                  onSubmit={(a) => submit(a)}
                  onExit={() => setView(pageFromPath(window.location.pathname))}
                />
              )}
              {view.name === 'loading' && <Loading name={view.who} />}
              {view.name === 'result' && (
                <Result
                  data={view.data}
                  name={view.displayName}
                  isOwner={view.isOwner}
                  notice={view.notice}
                  onRestart={newQuiz}
                  onEdit={editAnswers}
                  onMoreIdeas={(exclude) => {
                    track('more_ideas', { resultId: view.data.id })
                    void submit(answers, { exclude, parentId: view.data.id, previous: { ...view, notice: null } })
                  }}
                />
              )}
              {view.name === 'error' && <ErrorState message={view.message} onRetry={view.retry} onHome={goHome} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  )
}
