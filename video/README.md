# Vídeos do Mimo Certo (Remotion)

Vídeos para o Instagram feitos em código com [Remotion](https://www.remotion.dev), usando a identidade visual do site (cores e fontes de `frontend/src/styles.css`, logo de `frontend/src/components/Logo.tsx`).

## O que tem aqui
- **Reels principal** (`MimoCertoReels`): 1080x1920, 30 fps, 24,5 s, sem áudio. A música entra pelo próprio Instagram.
- **Capa** (`Capa`): imagem 1080x1920 para escolher em "Editar capa".
- **Roteiro, legenda e ganchos alternativos:** [ROTEIRO.md](ROTEIRO.md).

## Comandos
Rode na pasta `video/`:

| Para | Comando |
|---|---|
| Instalar | `npm install` |
| Ver e ajustar no navegador (Remotion Studio) | `npm run dev` |
| Gerar o MP4 | `npx remotion render MimoCertoReels out/mimo-certo-reels.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p` |
| Gerar a capa | `npx remotion still Capa out/mimo-certo-capa.png` |

Os arquivos gerados ficam em `out/`, que está fora do Git.

## Onde mexer
| Arquivo | O que controla |
|---|---|
| `src/scenes/Intro.tsx` | Cenas 1 e 2: gancho, caixinha e logo |
| `src/scenes/Demo.tsx` | Cenas 3 a 6: textos e celular |
| `src/scenes/Outro.tsx` | Cenas 7 e 8: benefícios e chamada final |
| `src/components/Screens.tsx` | Telas do site dentro do celular (quiz, carregamento e resultado) |
| `src/components/Cursor.tsx` | Caminho e momentos dos toques |
| `src/theme.ts` | Cores e fontes |

Os frames de cada cena seguem a tabela do roteiro. Se mudar o endereço do site, troque na cena 8 (`Outro.tsx`), na legenda e na capa.

## Licença do Remotion
É gratuito para pessoa física e para empresas de até 3 pessoas. Acima disso, é preciso comprar uma licença: [remotion.dev/license](https://www.remotion.dev/docs/license).
