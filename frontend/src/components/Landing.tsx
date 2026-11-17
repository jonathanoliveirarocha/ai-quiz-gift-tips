import { motion } from 'motion/react'
import { ArrowRight, ShieldCheck, Sparkles, MessageCircleHeart, Gift } from 'lucide-react'
import { HOME_FAQ } from '../content/home.ts'
import Faq from './Faq.tsx'

const ORBIT = ['☕', '📚', '🎧', '🎮', '🌿', '📸', '🍷', '🎨']
const OCCASIONS = ['🎄 Natal', '🎂 Aniversário', '🤫 Amigo secreto', '💘 Namoro', '💐 Dia das Mães', '👔 Dia dos Pais', '🏆 Formatura', '💍 Casamento', '🙏 Agradecimento', '💝 Só porque sim']

const STEPS = [
  { icon: MessageCircleHeart, title: 'Conte sobre a pessoa', text: 'Jeito, gostos, rotina e aquele detalhe que só você sabe.' },
  { icon: Sparkles, title: 'A IA analisa tudo', text: 'A IA cruza as respostas e escolhe o presente que mais combina.' },
  { icon: Gift, title: 'A ideia já vem pronta', text: 'O presente ideal e outras opções, com o link para comprar.' },
]

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-copy">
          <motion.span className="pill" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Sparkles size={14} /> Presente escolhido por inteligência artificial
          </motion.span>
          <h1 className="hero-title">
            O presente <em className="grad-text">certo</em> para quem você ama.
          </h1>
          <p className="hero-text">
            Não sabe o que dar de presente? Responda perguntas rápidas sobre a pessoa e a IA indica o presente certo, pensado para o seu orçamento.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={onStart}>
              Descobrir o presente ideal <ArrowRight size={20} />
            </button>
            <span className="hero-note">
              <ShieldCheck size={16} /> Grátis · 2 minutos · sem cadastro
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit">
            {ORBIT.map((emoji, i) => (
              <span key={emoji} className="orbit-item" style={{ ['--i' as string]: i, ['--n' as string]: ORBIT.length }}>
                <span>{emoji}</span>
              </span>
            ))}
          </div>
          <div className="hero-gift">
            <span>🎁</span>
          </div>
        </div>
      </section>

      <div className="marquee" aria-label="Ocasiões">
        <div className="marquee-track">
          {[...OCCASIONS, ...OCCASIONS].map((o, i) => (
            <span key={i} className="marquee-item">
              {o}
            </span>
          ))}
        </div>
      </div>

      <h2 className="sr-only">Como funciona</h2>
      <section className="steps">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <motion.article
            key={title}
            className="step glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
          >
            <span className="step-icon">
              <Icon size={22} />
            </span>
            <span className="step-number">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </section>

      <section className="home-section" aria-labelledby="faq">
        <div className="section-head">
          <h2 id="faq">Perguntas frequentes</h2>
        </div>
        <Faq items={HOME_FAQ} />
      </section>
    </div>
  )
}
