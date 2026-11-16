import type { Guide } from '../types.ts'
import mae from './presente-para-mae.ts'
import pai from './presente-para-pai.ts'
import namorado from './presente-para-namorado.ts'
import namorada from './presente-para-namorada.ts'
import amiga from './presente-para-amiga.ts'
import amigo from './presente-para-amigo.ts'
import avo from './presente-para-avo.ts'
import crianca from './presente-para-crianca.ts'
import adolescente from './presente-para-adolescente.ts'
import colega from './presente-para-colega-de-trabalho.ts'
import amigoSecreto from './presente-amigo-secreto.ts'
import natal from './presente-de-natal.ts'
import aniversario from './presente-de-aniversario.ts'
import ate50 from './presente-ate-50-reais.ts'
import criativo from './presente-criativo.ts'
import quemTemTudo from './presente-para-quem-tem-tudo.ts'

/**
 * Todos os guias com o texto completo. Usado só no build (pré-renderização, SEO e imagens de prévia).
 * O site no navegador usa registry.ts, que baixa só o guia da página aberta.
 * Para criar um guia: novo arquivo nesta pasta, import aqui e uma linha em GUIDE_LINKS (registry.ts).
 */
export const GUIDES: Guide[] = [
  mae,
  pai,
  namorado,
  namorada,
  amiga,
  amigo,
  avo,
  crianca,
  adolescente,
  colega,
  amigoSecreto,
  natal,
  aniversario,
  ate50,
  criativo,
  quemTemTudo,
]
