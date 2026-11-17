/**
 * Lojas que aparecem como botão em cada sugestão. Os botões em si vêm do backend (ACTIVE_STORES);
 * esta lista só alimenta os textos do site. Ao ativar uma loja no backend, adicione o nome aqui também.
 */
export const STORE_NAMES = ['Amazon', 'Shopee']

/** Ex.: "Amazon e Shopee" ou "Amazon, Shopee e Mercado Livre". */
export const STORE_LIST = new Intl.ListFormat('pt-BR', { type: 'conjunction' }).format(STORE_NAMES)
