// Gera as imagens de prévia de link (Open Graph, 1200x630) e os ícones do site em public/.
// Rode `npm run og` sempre que criar ou renomear um guia. As imagens ficam no repositório,
// então o build da Vercel não precisa de navegador.
// Precisa do Google Chrome ou do Microsoft Edge instalado (ou CHROME_PATH apontando para um deles).
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { GUIDES } from '../src/content/guides/index.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)
  const found = candidates.find((p) => existsSync(p))
  if (!found) throw new Error('Chrome ou Edge não encontrado. Defina CHROME_PATH com o caminho do navegador.')
  return found
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const GIFT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`

const SPARKLES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 100, s: 2 + (i % 3) }))

/** Destaca o que vem depois de "Presente" no título, no mesmo estilo do site. */
function titleHtml(text) {
  const m = text.match(/^(Presentes?|Lembrancinhas?)\s+(.+)$/i)
  return m ? `${esc(m[1])} <em>${esc(m[2])}</em>` : esc(text)
}

function ogHtml({ kicker, title, tagline, emoji, orbit }) {
  const n = orbit.length
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Plus+Jakarta+Sans:wght@500;700;800&family=Noto+Color+Emoji&display=block" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; color: #f7f2ff;
    font-family: 'Plus Jakarta Sans', 'Noto Color Emoji', sans-serif;
    background: radial-gradient(ellipse at 30% 0%, #1d1238, #0f0a1f 70%); }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); }
  .b1 { width: 520px; height: 520px; background: #ff4fb3; opacity: .42; top: -260px; left: -160px; }
  .b2 { width: 520px; height: 520px; background: #8b6cff; opacity: .5; top: 120px; right: -140px; }
  .b3 { width: 380px; height: 380px; background: #ff7a6b; opacity: .3; bottom: -240px; left: 380px; }
  .spark { position: absolute; border-radius: 50%; background: #fff; opacity: .55; box-shadow: 0 0 8px #fff; }
  .frame { position: absolute; inset: 0; border: 1px solid rgba(255,255,255,.08); }
  .content { position: absolute; left: 72px; top: 60px; bottom: 60px; width: 640px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 14px; font-family: 'Fraunces', serif; font-weight: 700; font-size: 34px; letter-spacing: -.01em; }
  .brand-icon { width: 54px; height: 54px; border-radius: 17px; display: grid; place-items: center;
    background: linear-gradient(135deg, #ff7a6b, #ff4fb3 50%, #8b6cff); box-shadow: 0 10px 30px -6px rgba(255,79,179,.75); }
  .brand-icon svg { width: 28px; height: 28px; }
  em { font-style: italic; background: linear-gradient(135deg, #ff7a6b, #ff4fb3 50%, #8b6cff);
    -webkit-background-clip: text; background-clip: text; color: transparent; padding: .08em .2em .08em 0; margin-right: -.12em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .main { margin-top: auto; margin-bottom: auto; }
  .kicker { display: inline-block; padding: 9px 18px; border-radius: 999px; font-size: 21px; font-weight: 700; color: #ffd36e;
    background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.16); letter-spacing: .02em; }
  h1 { margin: 22px 0 18px; font-family: 'Fraunces', serif; font-weight: 700; font-size: 78px; line-height: 1.02; letter-spacing: -.03em; }
  .tagline { margin: 0; font-size: 29px; line-height: 1.35; color: #d3c9ee; font-weight: 500; }
  .foot { display: flex; align-items: center; gap: 12px; font-size: 21px; font-weight: 700; color: #bdb2dc; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #5ff2c3; box-shadow: 0 0 12px #5ff2c3; }
  .visual { position: absolute; right: 56px; top: 50%; width: 380px; height: 380px; transform: translateY(-50%); }
  .orbit { position: absolute; inset: 0; border-radius: 50%; border: 2px dashed rgba(255,255,255,.16); }
  .orbit span { position: absolute; left: 50%; top: 50%; width: 66px; height: 66px; margin: -33px; display: grid; place-items: center;
    font-family: 'Noto Color Emoji'; font-size: 32px; border-radius: 20px; background: rgba(255,255,255,.09); border: 1px solid rgba(255,255,255,.14); }
  .gift { position: absolute; inset: 70px; border-radius: 50%; display: grid; place-items: center;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.28), rgba(255,79,179,.3) 45%, rgba(139,108,255,.2) 70%);
    border: 1px solid rgba(255,255,255,.28); box-shadow: 0 0 110px rgba(255,79,179,.55), inset 0 0 40px rgba(255,255,255,.14); }
  .gift span { font-family: 'Noto Color Emoji'; font-size: 128px; line-height: 1; filter: drop-shadow(0 14px 26px rgba(0,0,0,.45)); }
</style></head><body>
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  ${SPARKLES.map((s) => `<i class="spark" style="left:${s.x}%;top:${s.y}%;width:${s.s}px;height:${s.s}px"></i>`).join('')}
  <div class="frame"></div>
  <div class="content">
    <div class="brand"><span class="brand-icon">${GIFT_ICON}</span><span>Presente <em>Certo</em></span></div>
    <div class="main">
      <span class="kicker">${esc(kicker)}</span>
      <h1 id="title">${title}</h1>
      <p class="tagline">${esc(tagline)}</p>
    </div>
    <div class="foot"><span class="dot"></span>Grátis · 2 minutos · sem cadastro</div>
  </div>
  <div class="visual">
    <div class="orbit">${orbit
      .map((e, i) => {
        const a = (2 * Math.PI * i) / n - Math.PI / 2
        return `<span style="transform:translate(${Math.cos(a) * 190}px, ${Math.sin(a) * 190}px)">${esc(e)}</span>`
      })
      .join('')}</div>
    <div class="gift"><span>${esc(emoji)}</span></div>
  </div>
</body></html>`
}

const HOME_ORBIT = ['☕', '📚', '🎧', '🎮', '🌿', '📸', '🍷', '🎨']

const images = [
  {
    name: 'home',
    kicker: 'Quiz grátis com IA',
    title: 'O presente <em>certo</em> para quem você ama.',
    tagline: 'Responda perguntas rápidas sobre a pessoa e a IA indica o presente ideal.',
    emoji: '🎁',
    orbit: HOME_ORBIT,
  },
  {
    name: 'resultado',
    kicker: 'Resultado do quiz',
    title: 'Olha o presente <em>certo</em> que a IA escolheu',
    tagline: 'Abra para ver a sugestão, as outras ideias e a mensagem para o cartão.',
    emoji: '🎉',
    orbit: ['🎁', '💌', '✨', '🎀', '💝', '🛍️'],
  },
  ...GUIDES.map((g) => ({
    name: g.slug,
    kicker: 'Guia de presentes',
    title: titleHtml(g.label),
    tagline: g.tagline,
    emoji: g.emoji,
    orbit: [...new Set(g.ideas.flatMap((group) => group.items.map((i) => i.emoji)))].slice(0, 8),
  })),
]

// ICO com várias resoluções, cada uma guardada como PNG (aceito por todos os navegadores atuais).
function icoFromPngs(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(entries.length, 4)
  let offset = 6 + 16 * entries.length
  const dir = entries.map(({ size, png }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(png.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += png.length
    return e
  })
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)])
}

const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: true, args: ['--font-render-hinting=none'] })
try {
  const page = await browser.newPage()
  await mkdir(path.join(pub, 'og'), { recursive: true })
  await mkdir(path.join(pub, 'icons'), { recursive: true })

  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  for (const img of images) {
    await page.setContent(ogHtml(img), { waitUntil: 'load', timeout: 60000 })
    await page.evaluate(async () => {
      // Carrega de forma explícita os pedaços das fontes usados pelo texto da imagem (principalmente os emojis).
      const text = document.body.innerText
      await Promise.all([
        document.fonts.load('32px "Noto Color Emoji"', text),
        document.fonts.load('700 78px Fraunces', text),
        document.fonts.load('italic 700 78px Fraunces', text),
        document.fonts.load('500 29px "Plus Jakarta Sans"', text),
        document.fonts.load('700 21px "Plus Jakarta Sans"', text),
      ])
      await document.fonts.ready
      // Diminui o título até caber no espaço (no máximo 3 linhas), medindo já com as fontes certas.
      const h1 = document.getElementById('title')
      const main = document.querySelector('.main')
      let size = 78
      while (size > 44 && (h1.scrollHeight > size * 1.02 * 3 + 4 || main.offsetHeight > 360)) {
        size -= 2
        h1.style.fontSize = `${size}px`
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    })
    const jpg = await page.screenshot({ type: 'jpeg', quality: 86 })
    await writeFile(path.join(pub, 'og', `${img.name}.jpg`), jpg)
    console.log(`og/${img.name}.jpg  ${(jpg.length / 1024).toFixed(0)} KB`)
  }

  // Ícones a partir do favicon.svg.
  const svg = await readFile(path.join(pub, 'favicon.svg'), 'utf8')
  const svgUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  async function icon(size, { background = null, scale = 1 } = {}) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
    const inner = Math.round(size * scale)
    await page.setContent(
      `<html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${background ?? 'transparent'}"><img src="${svgUrl}" width="${inner}" height="${inner}"></body></html>`,
    )
    return page.screenshot({ type: 'png', omitBackground: !background })
  }

  const icoEntries = []
  for (const size of [16, 32, 48]) icoEntries.push({ size, png: await icon(size) })
  const ico = icoFromPngs(icoEntries)
  await writeFile(path.join(pub, 'favicon.ico'), ico)
  await writeFile(path.join(pub, 'apple-touch-icon.png'), await icon(180, { background: '#120c24', scale: 0.72 }))
  await writeFile(path.join(pub, 'icons', 'icon-192.png'), await icon(192, { background: '#120c24', scale: 0.72 }))
  await writeFile(path.join(pub, 'icons', 'icon-512.png'), await icon(512, { background: '#120c24', scale: 0.72 }))
  console.log('favicon.ico, apple-touch-icon.png, icons/icon-192.png, icons/icon-512.png')
} finally {
  await browser.close()
}
