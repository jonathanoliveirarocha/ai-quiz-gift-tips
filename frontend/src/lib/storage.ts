// Armazenamento da sessão no próprio navegador (some ao fechar a aba). Usado pela medição anônima e pelo painel.
// Toda leitura e escrita é protegida: em aba anônima ou com o armazenamento bloqueado, o site segue funcionando.

export function readSession<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeSession(key: string, value: unknown) {
  try {
    if (value === null) window.sessionStorage.removeItem(key)
    else window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sem armazenamento disponível: ignora.
  }
}
