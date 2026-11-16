import { RefreshCw, Home } from 'lucide-react'

type Props = { message: string; onRetry?: () => void; onHome: () => void }

export default function ErrorState({ message, onRetry, onHome }: Props) {
  return (
    <section className="error-state glass">
      <span className="error-emoji">🎀</span>
      <h2>Ops, o laço enroscou</h2>
      <p>{message}</p>
      <div className="error-actions">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={18} /> Tentar de novo
          </button>
        )}
        <button className="btn btn-ghost" onClick={onHome}>
          <Home size={18} /> Voltar ao início
        </button>
      </div>
    </section>
  )
}
