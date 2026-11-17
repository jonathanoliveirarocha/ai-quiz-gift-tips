// A IA escreve {nome} no lugar do nome da pessoa presenteada: o nome nunca sai do navegador.
const TOKEN = /\{nome\}/g

/** Troca o marcador pelo nome; sem nome, usa "essa pessoa" (com maiúscula no começo de frase). */
export function personalize(text: string, name: string) {
  if (!text) return text
  const who = name.trim()
  return text.replace(TOKEN, (_match, offset: number, whole: string) => {
    if (who) return who
    const before = whole.slice(0, offset).trimEnd()
    return before === '' || /[.!?]$/.test(before) ? 'Essa pessoa' : 'essa pessoa'
  })
}

/** Lê o nome do link compartilhado (#n=Ana). A parte depois do # nunca é enviada a servidores. */
export function nameFromHash() {
  try {
    const value = new URLSearchParams(window.location.hash.slice(1)).get('n')
    return value ? value.slice(0, 40) : ''
  } catch {
    return ''
  }
}
