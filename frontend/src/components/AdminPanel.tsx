import { useEffect, useState, type FormEvent } from 'react'
import { AlertTriangle, CheckCircle2, LogOut, RefreshCw } from 'lucide-react'
import { readSession, writeSession } from '../lib/storage.ts'

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

type Health = {
  db: { ok: boolean; sizeMB: number | null }
  ai: { configured: boolean; model: string; fallbackModel: string; today: { aiCalls: number; aiFailures: number; fallbacks: number; quizzes: number }; dailyCap: number }
  stores: string[]
  shopeeApi: boolean
  antiBot: boolean
  alerts: boolean
  warnings: string[]
}

type Stats = {
  days: number
  funnel: Record<'visits' | 'quizStarts' | 'submits' | 'results' | 'errors' | 'fallbacks' | 'moreIdeas' | 'shares' | 'clicks', number>
  steps: { step: number; sessions: number }[]
  channels: { channel: string; visit?: number; quiz_start?: number; result_view?: number; clicks: number }[]
  clicksByStore: { store: string; clicks: number }[]
  clicksByKind: { kind: string; clicks: number }[]
  topGifts: { title: string; clicks: number }[]
  topPages: { page: string; clicks: number }[]
  resultsByMode: Record<string, number>
  usage: { day: string; aiCalls: number; aiFailures: number; fallbacks: number; quizzes: number }[]
}

const pct = (part: number, total: number) => (total ? `${Math.round((part / total) * 100)}%` : '—')

async function adminGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}/api/admin${path}`, { headers: { 'x-admin-token': token } })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error ?? `Erro ${res.status}`)
  return data as T
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  if (!rows.length) return <p className="panel-empty">Sem dados no período.</p>
  return (
    <div className="panel-table-wrap">
      <table className="panel-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Painel do dono: saúde da operação e números do negócio. Protegido pelo ADMIN_TOKEN do backend. */
export default function AdminPanel() {
  const [token, setToken] = useState(() => (typeof window === 'undefined' ? '' : (readSession<string>('pc:admin') ?? '')))
  const [input, setInput] = useState('')
  const [days, setDays] = useState(30)
  const [reload, setReload] = useState(0)
  const [data, setData] = useState<{ key: string; health: Health | null; stats: Stats | null; error: string }>({
    key: '',
    health: null,
    stats: null,
    error: '',
  })
  const key = `${token}|${days}|${reload}`
  const loading = Boolean(token) && data.key !== key
  const { health, stats, error } = data

  useEffect(() => {
    if (!token) return
    let alive = true
    Promise.all([adminGet<Health>('/health', token), adminGet<Stats>(`/stats?days=${days}`, token).catch(() => null)])
      .then(([h, s]) => {
        if (alive) setData({ key, health: h, stats: s, error: '' })
      })
      .catch((err: Error) => {
        if (!alive) return
        setData({ key, health: null, stats: null, error: err.message })
        if (/token/i.test(err.message)) {
          writeSession('pc:admin', null)
          setToken('')
        }
      })
    return () => {
      alive = false
    }
  }, [key, token, days])

  function login(e: FormEvent) {
    e.preventDefault()
    writeSession('pc:admin', input.trim())
    setToken(input.trim())
  }

  if (!token) {
    return (
      <section className="panel">
        <h1 className="guide-title">Painel</h1>
        <form className="panel-login glass" onSubmit={login}>
          <label htmlFor="token">Token de administrador (ADMIN_TOKEN do backend)</label>
          <input id="token" className="input" type="password" autoComplete="current-password" value={input} onChange={(e) => setInput(e.target.value)} />
          <button className="btn btn-primary" disabled={!input.trim()}>
            Entrar
          </button>
          {error && <p className="panel-error">{error}</p>}
        </form>
      </section>
    )
  }

  const f = stats?.funnel
  return (
    <section className="panel">
      <div className="panel-head">
        <h1 className="guide-title">Painel</h1>
        <div className="panel-controls">
          <select className="input" value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Período">
            <option value={1}>Hoje</option>
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
            <option value={365}>12 meses</option>
          </select>
          <button className="btn btn-ghost" onClick={() => setReload((r) => r + 1)} disabled={loading}>
            <RefreshCw size={16} /> Atualizar
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              writeSession('pc:admin', null)
              setToken('')
            }}
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>
      {error && <p className="panel-error">{error}</p>}

      {health && (
        <div className="panel-block glass">
          <h2>Saúde da operação</h2>
          {health.warnings.length ? (
            <ul className="panel-warnings">
              {health.warnings.map((w) => (
                <li key={w}>
                  <AlertTriangle size={16} aria-hidden="true" /> {w}
                </li>
              ))}
            </ul>
          ) : (
            <p className="panel-ok">
              <CheckCircle2 size={16} aria-hidden="true" /> Tudo certo: nenhum alerta.
            </p>
          )}
          <div className="panel-cards">
            <div>
              <strong>{health.ai.today.aiCalls}</strong>
              <span>
                chamadas de IA hoje (teto {health.ai.dailyCap || 'sem teto'})
              </span>
            </div>
            <div>
              <strong>{health.ai.today.aiFailures}</strong>
              <span>falhas da IA hoje</span>
            </div>
            <div>
              <strong>{health.ai.today.fallbacks}</strong>
              <span>resultados do acervo hoje</span>
            </div>
            <div>
              <strong>{health.db.sizeMB ?? '—'} MB</strong>
              <span>banco de dados</span>
            </div>
          </div>
          <p className="panel-meta">
            Modelo {health.ai.model} (reserva: {health.ai.fallbackModel}) · lojas: {health.stores.join(', ')} · API Shopee {health.shopeeApi ? 'ativa' : 'desligada'} ·
            anti-robô {health.antiBot ? 'ativo' : 'desligado'} · alertas {health.alerts ? 'ativos' : 'desligados'}
          </p>
        </div>
      )}

      {f && stats && (
        <>
          <div className="panel-block glass">
            <h2>Funil ({stats.days === 1 ? 'hoje' : `últimos ${stats.days} dias`})</h2>
            <div className="panel-cards">
              <div>
                <strong>{f.visits}</strong>
                <span>visitas</span>
              </div>
              <div>
                <strong>{f.quizStarts}</strong>
                <span>começaram o quiz ({pct(f.quizStarts, f.visits)})</span>
              </div>
              <div>
                <strong>{f.submits}</strong>
                <span>terminaram ({pct(f.submits, f.quizStarts)})</span>
              </div>
              <div>
                <strong>{f.results}</strong>
                <span>viram resultado</span>
              </div>
              <div>
                <strong>{f.clicks}</strong>
                <span>cliques nas lojas ({pct(f.clicks, f.results)} por resultado)</span>
              </div>
              <div>
                <strong>{f.shares}</strong>
                <span>compartilhamentos</span>
              </div>
            </div>
            <p className="panel-meta">
              Erros: {f.errors} · resultados do acervo: {f.fallbacks} · outras ideias: {f.moreIdeas} · por modo:{' '}
              {Object.entries(stats.resultsByMode)
                .map(([k, v]) => `${k} ${v}`)
                .join(', ') || '—'}
            </p>
          </div>

          <div className="panel-block glass">
            <h2>Onde as pessoas desistem do quiz</h2>
            <Table head={['Pergunta', 'Pessoas que chegaram', 'Em relação à 1ª']} rows={stats.steps.map((s) => [s.step, s.sessions, pct(s.sessions, stats.steps[0]?.sessions ?? 0)])} />
          </div>

          <div className="panel-block glass">
            <h2>Canais</h2>
            <Table
              head={['Canal', 'Visitas', 'Começaram', 'Resultados', 'Cliques', 'Cliques por visita']}
              rows={stats.channels.map((c) => [c.channel, c.visit ?? 0, c.quiz_start ?? 0, c.result_view ?? 0, c.clicks, pct(c.clicks, c.visit ?? 0)])}
            />
            <p className="panel-meta">
              Use links com <code>?utm_source=instagram</code> (ou tiktok, whatsapp...) nas suas divulgações. Para ver a comissão por canal, crie uma tag da Amazon
              por canal e coloque em AMAZON_TRACKING_IDS.
            </p>
          </div>

          <div className="panel-grid">
            <div className="panel-block glass">
              <h2>Cliques por loja</h2>
              <Table head={['Loja', 'Cliques']} rows={stats.clicksByStore.map((r) => [r.store, r.clicks])} />
            </div>
            <div className="panel-block glass">
              <h2>Cliques por origem</h2>
              <Table head={['Origem', 'Cliques']} rows={stats.clicksByKind.map((r) => [r.kind, r.clicks])} />
            </div>
          </div>

          <div className="panel-grid">
            <div className="panel-block glass">
              <h2>Presentes mais clicados</h2>
              <Table head={['Presente', 'Cliques']} rows={stats.topGifts.map((r) => [r.title, r.clicks])} />
            </div>
            <div className="panel-block glass">
              <h2>Páginas que mais geram cliques</h2>
              <Table head={['Página', 'Cliques']} rows={stats.topPages.map((r) => [r.page, r.clicks])} />
            </div>
          </div>

          <div className="panel-block glass">
            <h2>Uso diário da IA</h2>
            <Table
              head={['Dia', 'Quizzes', 'Chamadas de IA', 'Falhas', 'Acervo']}
              rows={stats.usage
                .slice()
                .reverse()
                .map((u) => [u.day, u.quizzes, u.aiCalls, u.aiFailures, u.fallbacks])}
            />
          </div>
        </>
      )}
    </section>
  )
}
