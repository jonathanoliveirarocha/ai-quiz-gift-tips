/**
 * Quem responde pelo site (controlador dos dados, LGPD). PREENCHA antes de publicar:
 * o build avisa enquanto algum campo ainda tiver colchetes.
 */
export const OWNER = {
  /** Nome completo (pessoa física) ou razão social (empresa). */
  name: '[NOME OU RAZÃO SOCIAL]',
  /** CPF ou CNPJ. Com CNPJ, basta o número; com CPF, pode deixar só "pessoa física". */
  document: '[CPF OU CNPJ]',
  /** E-mail para dúvidas, pedidos sobre dados pessoais (encarregado/DPO) e denúncias. */
  email: '[E-MAIL DE CONTATO]',
  /** Cidade e estado de onde o site é operado. */
  city: '[CIDADE - UF]',
}

export const hasOwnerPlaceholders = () => Object.values(OWNER).some((v) => v.includes('['))
