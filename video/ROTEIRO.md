# Roteiro do Reels: Mimo Certo

**Peça:** "Não sabe o que dar de presente?" · vertical 1080x1920 · 30 fps · 735 frames (24,5 s) · 8 cenas · sem locução, sem filmagem

## Hipóteses assumidas

- **Público:** adultos de 18 a 45 anos, no celular, que precisam comprar um presente e não têm ideia. O pico é em novembro e dezembro, com Natal e amigo secreto.
- **Onde sai:** no perfil do próprio Mimo Certo, com o site no link da bio.
- **Exemplo no mockup:** "Ana", amiga, orçamento de R$ 100 a R$ 200, gosta de café, leitura e plantas. O nome e as respostas são fictícios. Os presentes vêm do acervo do próprio site (`backend/src/services/demo.js`).
- **Textos das telas:** são os textos reais do site (`quiz.ts`, `Quiz.tsx`, `StepBody.tsx`, `Loading.tsx`, `Result.tsx`, `GiftCard.tsx`, `Landing.tsx`), com uma exceção: os botões de compra dizem "Ver na loja" no lugar do nome da loja.

---

## 1. Conceito

**Em uma frase:** uma caixinha de presente cheia de pontos de interrogação se abre, vira o logo do Mimo Certo e, na tela de um celular, transforma "não faço ideia" em "achei" com poucos toques.

**Por que prende a atenção:**

- **O frame 0 já tem texto e movimento.** A pergunta aparece inteira, sem fade a partir do preto, e a caixa treme enquanto os "?" pipocam. Quem está rolando o feed vê algo se mexer e lê uma pergunta à qual responde "sim" mentalmente.
- **A dor é universal e está no auge.** Natal e amigo secreto chegam já. A pergunta usa as palavras do público, que são as mesmas do site: "Não sabe o que dar de presente?".
- **O alívio vem em 2 segundos, já com a marca.** O "*certo*" grande da frase "Relaxa. A IA indica o presente certo." rima com o "*Certo*" do logo, e isso ajuda a lembrar o nome.
- **A prova é o próprio produto:**
  - toques nas opções mostram que é fácil;
  - a barra de progresso andando mostra que é rápido;
  - "Pode pular" responde a quem pensa "mal conheço a pessoa";
  - o resultado com explicação e o botão para a loja mostram que é útil.
- **Os benefícios confirmam o que a pessoa já viu.** Grátis, sem cadastro, sem e-mail, sem cartão e em 2 minutos aparecem depois da demonstração. O CTA repete o endereço e o "link na bio".
- **Funciona no mudo.** Todo o sentido está nos textos e nas telas.

---

## 2. Ficha técnica para o Remotion

### Composição

- `id: "MimoCertoReels"`, `width: 1080`, `height: 1920`, `fps: 30`, `durationInFrames: 735` (24,5 s).
- Exportação: MP4 H.264, yuv420p, CRF 18, sem faixa de áudio (a música entra pelo Instagram).

### Zonas seguras

As fontes divergem, então adotei as margens mais conservadoras.

| Área | Margem livre | O que o Instagram põe ali |
|---|---|---|
| Topo | 250 px | Rótulo "Reels" e câmera |
| Base | 480 px | Perfil, legenda e áudio |
| Direita | 140 px | Curtir, comentar e compartilhar |
| Esquerda | 80 px | |

- **Nada abaixo de y = 1440:** nenhum texto nem toque importante.
- **Caixa de conteúdo:** x de 80 a 940 (860 px de largura) e y de 250 a 1440.
- **Centro do texto em x = 510, e não 540,** para fugir dos ícones da direita.
- **Nenhuma linha passa de 860 px de largura.** Os tamanhos abaixo são estimativas que cabem. Confirme com `measureText` ou `fitText` de `@remotion/layout-utils` e reduza a fonte se passar.

### Camadas fixas (do fundo para a frente)

1. **Fundo (frames 0 a 734):** #0f0a1f com três manchas desfocadas (blur 140 px), cada uma derivando devagar (seno, amplitude 40 px, período 8 s):

   | Cor | Centro | Raio | Opacidade |
   |---|---|---|---|
   | Coral #ff7a6b | (180, 320) | 520 | 0,28 |
   | Rosa #ff4fb3 | (900, 950) | 460 | 0,20 |
   | Violeta #8b6cff | (300, 1620) | 600 | 0,30 |

   - Por cima, 28 brilhos brancos de 3 a 5 px piscando (opacidade de 0,2 a 0,8) e uma vinheta radial escura nas bordas.
   - É o mesmo clima do `Background.tsx` do site.
2. **Conteúdo de cada cena.**
3. **Degradê da base (cenas 3 a 6):** de #0f0a1f transparente em y 1440 até #0f0a1f sólido em y 1760, por cima do celular. Esconde a parte de baixo do aparelho e deixa limpa a área da legenda do Instagram.
4. **Cursor de toque (cenas 3, 4, 6 e 8).**

### Tipografia

| Estilo | Definição | Uso |
|---|---|---|
| Título | Fraunces 700, letter-spacing -0,03em, line-height 1,02, cor #f7f2ff, sombra 0 6px 30px rgba(0,0,0,.45) | Linhas principais |
| Destaque | Fraunces 700 itálico com o degradê da marca no texto: linear-gradient(135deg, #ff7a6b, #ff4fb3, #8b6cff), background-size 200%, background-clip text | Palavras entre asteriscos no roteiro (ex.: *certo*) |
| Apoio | Plus Jakarta Sans 700, 50 px, cor #bdb2dc | Linha secundária |
| Manuscrito | Caveat 700, cor #ffd36e | "Relaxa." e "link na bio" |

- **Fontes:** carregue com `@remotion/google-fonts` (Fraunces com itálico, Plus Jakarta Sans e Caveat).
- **Emojis:** o Chrome do Remotion usa o emoji do sistema. Para ficarem iguais em qualquer máquina, carregue a Noto Color Emoji (disponível no Google Fonts) como fonte de emoji.
- **Emojis compostos:** evite-os. O 🧑‍🤝‍🧑 de "Irmão ou irmã" pode sair quebrado. Se sair, troque essa opção por "👵 Avô ou avó", que também existe no quiz.

### Animações padrão (presets usados nas cenas)

- **ENTRA (cada linha de texto):**
  - spring com damping 14 e stiffness 160;
  - translateY de 48 a 0, opacidade de 0 a 1 nos 6 primeiros frames e blur de 8 a 0 px;
  - cada linha seguinte começa 5 frames depois.
- **SAI:** em 8 frames, translateY de 0 a -36 e opacidade de 1 a 0, com 2 frames de atraso entre as linhas.
- **BRILHO (palavras em Destaque):** o background-position do degradê vai de 100% a 0% em 24 frames, uma vez.
- **TOQUE:**
  - **Cursor:** círculo branco de 72 px (preenchimento rgba(255,255,255,.9), borda de 4 px rgba(255,255,255,.35) e sombra suave).
  - **Ida ao alvo:** spring com damping 20 e stiffness 140, em cerca de 12 frames.
  - **Aperto:** escala 1 → 0,82 → 1 em 6 frames, com um anel de onda (borda branca de 4 px, escala de 0,6 a 1,9 e opacidade de 0,7 a 0 em 14 frames).
  - **Elemento tocado:** escala 1 → 0,96 → 1.
  - **Saída:** o cursor some com fade de 6 frames quando a cena muda.
- **TROCA DE TELA (dentro do celular, igual ao site):**
  - a tela atual sai com x de 0 a -60 e opacidade de 1 a 0 em 8 frames;
  - a próxima entra com x de 60 a 0 e opacidade de 0 a 1 em 8 frames;
  - a troca começa 10 frames depois do toque, que são os 320 ms do avanço automático do quiz.

### Mockup do celular

Cenas 3 a 6. Use um único componente, dos frames 132 a 551, que troca de tela conforme o frame, sem entrar de novo a cada cena.

- **Aparelho:**
  - 700 x 1440 px, raio 96, corpo #0b0716, borda de 3 px rgba(255,255,255,.14), sombra 0 40px 120px rgba(0,0,0,.6);
  - posição final com o canto superior esquerdo em (160, 610), ou seja, centro em x = 510;
  - a parte de baixo passa do limite do quadro e some no degradê da base.
- **Tela:** recuo de 16 px, raio 82, fundo #0f0a1f com versões pequenas das manchas do fundo, largura útil de 668 px.
- **Barra de status (56 px):** "9:41" à esquerda (Plus Jakarta Sans 700, 26 px) e uma ilha preta de 180 x 44 px no centro.
- **Cabeçalho do site (72 px):** logo de 40 px e "Mimo *Certo*" (Fraunces 600, 34 px, "Certo" em itálico e sem degradê), como no topo do site.
- **Elementos do quiz** (copie de `frontend/src/styles.css` e `StepBody.tsx`):
  - **Barra de topo:**
    - botão circular "←" de 52 px, em vidro;
    - barra de progresso com 12 px de altura, fundo rgba(255,255,255,.1), preenchimento com o degradê e brilho 0 0 16px rgba(255,79,179,.7);
    - contador "2/11" em Plus Jakarta Sans 700, 28 px, #bdb2dc.
  - **Cartão de vidro:** fundo rgba(255,255,255,.055), borda de 1 px rgba(255,255,255,.12), raio 32, padding 28.
  - **Sobretítulo:** Plus Jakarta Sans 800, 22 px, caixa alta, espaçamento 0,12em, dourado #ffd36e.
  - **Pergunta:** Fraunces 700, 44 px.
  - **Opção:**
    - 274 x 104 px, em 2 colunas com 16 px de espaço, raio 22, em vidro;
    - emoji num quadrado de 56 px e rótulo em Plus Jakarta Sans 600, 28 px;
    - quando selecionada: borda de 3 px com o degradê, fundo rgba(30,18,52,.85), sombra rosa e um selo redondo de 34 px com o degradê e "✓" branco no canto superior direito (entra com spring).
  - **Chip:** pílula em vidro, Plus Jakarta Sans 600, 28 px. Quando ativo: fundo com o degradê e texto branco.
  - **Botão "Pular →":** fundo branco, texto #1b1030, Plus Jakarta Sans 700, 32 px, altura de 84 px, formato de pílula.
- **Caixinha (logo):** use o SVG de `frontend/src/components/Logo.tsx` (viewBox 64x64).
  - **Peças:**
    - corpo: retângulo x 8, y 26, 48x32, raio 6;
    - tampa: retângulo x 4, y 18, 56x12, raio 5;
    - ambos com o degradê coral → rosa → violeta;
    - fita branca: x 28, y 18, 8x40, opacidade 0,9;
    - laço: `M32 18c-4-10-16-12-16-4 0 5 9 5 16 4zm0 0c4-10 16-12 16-4 0 5-9 5-16 4z`, com traço #ffd36e de 4 px e sem preenchimento.
  - **Grupos para abrir a tampa:**
    - grupo da tampa: retângulo de cima, laço e o trecho da fita entre y 18 e 30;
    - grupo da caixa: o resto;
    - ponto de giro da tampa: (4, 30).

---

## 3. Cena a cena

| # | Início e fim | Texto na tela (linha por linha) | O que aparece e como anima | Tela no mockup |
|---|---|---|---|---|
| 1. Gancho | 0,0 a 2,0 s (frames 0 a 59) | Não sabe<br>o que dar<br>de *presente?* | O texto já está inteiro no frame 0 e assenta de 1,06 para 1. Uma caixinha de presente grande treme em rajadas, e três "?" (dourado, menta e rosa) pipocam ao redor. Na saída, a tampa salta e solta uma explosão de brilhos dourados. | Nenhuma |
| 2. Virada | 2,0 a 4,4 s (frames 60 a 131) | Relaxa.<br>A IA indica<br>o presente<br>*certo*. | "Relaxa." se escreve à mão em dourado e as outras linhas sobem. A caixinha fecha a tampa, encolhe e vira o logo, com "Mimo Certo" deslizando ao lado. "certo" e "Certo" brilham juntos. | Nenhuma |
| 3. Responda | 4,4 a 8,8 s (frames 132 a 263) | Responda sobre<br>a pessoa<br>(apoio) É só tocar nas opções | O celular sobe de baixo. O cursor toca três respostas (relação, orçamento e gostos), e cada toque avança a tela e a barra de progresso. Um sublinhado dourado é desenhado sob "pessoa". | Quiz: "Qual é a sua relação com Ana?" → "Quanto você quer investir?" → "Do que Ana gosta?" |
| 4. Pular | 8,8 a 10,8 s (frames 264 a 323) | Não sabe?<br>Pode *pular*. | O cursor toca "Pular →" e a barra corre até 11/11. | Quiz: "Como é o sábado perfeito de Ana?" (pergunta opcional) |
| 5. Resultado | 10,8 a 15,0 s (frames 324 a 449) | O presente *ideal*<br>(apoio) e por que ele combina | Tela de carregamento com a caixinha pulando. A tampa voa e surge o cartão do presente ideal, peça por peça. A explicação do "por que combina" ganha um destaque dourado quando a linha de apoio entra. | Carregamento → resultado: ☕ "Moedor de café manual", "Estimativa R$ 100 a R$ 200", botão "Ver na loja ↗" |
| 6. Mais ideias | 15,0 a 18,4 s (frames 450 a 551) | Outras *ideias*<br>(apoio) no mesmo orçamento<br>(menta) Cada uma com link pro produto | A tela rola até as outras ideias. O cursor toca "Ver na loja" no primeiro cartão e os botões dos outros pulsam em sequência. No fim, o celular desce e sai. | Resultado: "Outras ideias que combinam", com 3 cartões |
| 7. Benefícios | 18,4 a 21,1 s (frames 552 a 632) | (ícone ✓) *Grátis*<br>(ícone ✓) Sem cadastro<br>(ícone ✓) Sem e-mail<br>(ícone ✓) Sem cartão<br>(ícone ✓) Em 2 minutos | Uma lista que se marca sozinha: cada check menta estoura e o texto desliza da esquerda, um item a cada 7 frames. "Grátis" é maior, em degradê e com brilho. | Nenhuma |
| 8. CTA | 21,1 a 24,5 s (frames 633 a 734) | Mimo *Certo* (logo)<br>Descubra o<br>presente *ideal*<br>mimocerto.vercel.app<br>link na bio<br>Grátis · 2 minutos · sem cadastro | O logo cai com um quique e o título sobe. A pílula com o endereço cresce, com borda em degradê animada. "link na bio" se escreve à mão, com uma seta, e o cursor toca a pílula. No fim, a tampa da caixinha balança e o último frame fica completo. | Nenhuma |

---

## 4. Detalhamento por frame

### Cena 1: Gancho (frames 0 a 59)

- **Texto:** Título de 128 px em 3 linhas ("Não sabe" / "o que dar" / "de *presente?*"), centrado em x 510, com topo em y 300 (vai até cerca de y 700). "presente?" usa o estilo Destaque.
- **Frame 0:**
  - o texto está 100% visível, sem fade a partir do preto, e vai da escala 1,06 a 1 com spring (damping 14) até por volta do frame 10;
  - a caixinha (380 px, centro em 510, 1060) já está visível e tremendo.
- **Tremida:**
  - rotate = 7° × sen(frame × 1,1), em três rajadas: frames 0 a 14, 20 a 34 e 40 a 50;
  - no começo de cada rajada, um pulinho de -10 px no eixo y.
- **Pontos de interrogação:** Fraunces 700 itálico, 160 px, com spring de damping 9 e stiffness 200 (passam um pouco do tamanho e voltam). Depois de entrar, flutuam ±8 px no eixo y (seno).

  | Cor | Centro | Rotação | Entra no frame |
  |---|---|---|---|
  | Dourado #ffd36e | (290, 900) | -14° | 3 |
  | Menta #5ff2c3 | (750, 880) | 12° | 8 |
  | Rosa #ff4fb3 | (720, 1250) | 10° | 13 |
- **Saída:**
  - frames 50 a 56: os "?" encolhem até sumir;
  - frames 50 a 59: o texto usa o preset SAI;
  - frame 52: a tampa salta (translateY de 0 a -90 e rotate de 0 a -20°, spring com damping 10);
  - ao mesmo tempo, 8 brilhos "✦" dourados de 48 px se espalham do topo da caixa até 240 px de distância em 14 frames e somem nos últimos 6. Eles terminam no frame 66, já na cena 2.

### Cena 2: Virada (frames 60 a 131)

- **"Relaxa.":** Caveat 700, 130 px, dourado, girado -4°, topo em y 280. Nos frames 60 a 70, aparece da esquerda para a direita (clip-path de inset(0 100% 0 0) até inset(0 0 0 0)), com efeito de escrita.
- **Linhas seguintes (preset ENTRA):**
  - frame 66: "A IA indica" (Título, 100 px);
  - frame 71: "o presente" (100 px);
  - frame 76: "*certo*." (Destaque, 150 px).

  O bloco termina por volta de y 790.
- **Caixinha virando logo (frames 64 a 90):**
  - a caixinha da cena 1 fecha a tampa (rotate de -20° a 0 e translateY de -90 a 0);
  - ao mesmo tempo, encolhe de 380 para 150 px e vai do centro (510, 1060) até (236, 1010);
  - spring com damping 15 e stiffness 120.
- **Nome da marca (frames 80 a 94):**
  - "Mimo *Certo*" (Fraunces 600, 96 px, com "Certo" em itálico e degradê) entra deslizando de x +40 com fade, à direita da caixinha (começa em x 339, com centro vertical em 1010);
  - o conjunto do logo tem cerca de 700 px de largura e fica centrado em x 510.
- **Frames 96 a 120:** BRILHO ao mesmo tempo em "certo." e em "Certo".
- **Frames 124 a 131:** os textos SAEM; o logo sobe 40 px, encolhe para 0,6 e some.

### Cena 3: Responda (frames 132 a 263)

- **Entrada do celular (frames 132 a 154):** translateY de +1400 a 0 e rotate de 6° a 0°, spring com damping 16 e stiffness 110. O degradê da base aparece junto, nos frames 132 a 144.
- **Texto:**
  - frame 136: "Responda sobre" (Título, 100 px, topo em y 270);
  - frame 141: "a pessoa" (100 px);
  - frames 150 a 162: um sublinhado dourado desenhado à mão sob "pessoa" (traço SVG de 8 px, com stroke-dashoffset);
  - frame 168: "É só tocar nas opções" (Apoio, topo em y 500).
- **Tela A (relação),** já visível quando o celular entra:
  - progresso 2/11 (18%), sobretítulo "PERGUNTA 2 DE 11" e a pergunta "Qual é a sua relação com Ana?";
  - opções: 👩 Mãe · 👨 Pai · 💞 Par romântico · 🤝 Amigo ou amiga · 🧑‍🤝‍🧑 Irmão ou irmã · 🧒 Filho ou filha;
  - frame 158: o cursor aparece em (760, 1380) com fade;
  - frame 170: o cursor chega em "🤝 Amigo ou amiga";
  - frame 172: toque, e a opção fica selecionada;
  - frames 182 a 198: TROCA DE TELA.
- **Tela B (orçamento):**
  - o progresso anima até 5/11 (45%) nos frames 190 a 205; sobretítulo "PERGUNTA 5 DE 11" e pergunta "Quanto você quer investir?";
  - opções: 🪙 Até R$ 50 · 💵 R$ 50 a R$ 100 · 💳 R$ 100 a R$ 200 · 💎 R$ 200 a R$ 500 · 👑 R$ 500 a R$ 1.000 · 🚀 Acima de R$ 1.000;
  - frame 204: o cursor chega em "💳 R$ 100 a R$ 200";
  - frame 206: toque;
  - frames 216 a 232: TROCA DE TELA.
- **Tela C (gostos):**
  - o progresso vai até 7/11 (64%) nos frames 224 a 238; sobretítulo "PERGUNTA 7 DE 11" e pergunta "Do que Ana gosta?";
  - chips: 🎵 Música · ☕ Café · 📚 Leitura · 🎬 Séries e filmes · 🎮 Games · 🪴 Plantas · 🐾 Pets · 📸 Fotografia · ✈️ Viagens;
  - abaixo dos chips, o contador "0/8 escolhidos";
  - toques em "☕ Café" no frame 236, "📚 Leitura" no 244 e "🪴 Plantas" no 252 (o cursor viaja 6 frames entre eles);
  - cada chip ativado faz escala 1,08 → 1, e o contador passa por 1/8, 2/8 e 3/8.
- **Frames 256 a 263:** o texto SAI.

### Cena 4: Pode pular (frames 264 a 323)

- **Tela D (frames 264 a 280, TROCA DE TELA):**
  - progresso 8/11 (73%), sobretítulo "PERGUNTA 8 DE 11 · OPCIONAL" e pergunta "Como é o sábado perfeito de Ana?";
  - quatro opções, nenhuma selecionada: 🛋️ Maratonando séries no sofá · 🥾 Numa trilha ou na natureza · 🎉 Numa festa com amigos · 🍲 Cozinhando um almoço caprichado;
  - abaixo do cartão, à direita, o botão "Pular →".
- **Texto:**
  - frame 266: "Não sabe?" (Título, 120 px, topo em y 290);
  - frame 272: "Pode *pular*." (120 px; aqui "pular" fica em itálico verde-menta #5ff2c3, no lugar do degradê).
- **Toque:** o cursor vai até "Pular →" nos frames 278 a 290 e toca no frame 292.
- **Barra até o fim:**
  - frames 296 a 304: a tela D sai para a esquerda;
  - frames 300 a 318: a barra corre de 73% a 100% (ease in-out);
  - o contador passa por 9/11, 10/11 e 11/11 nos frames 304, 308 e 312;
  - o brilho da barra dobra (0 0 32px rosa).
- **Frames 316 a 323:** o texto SAI e, dentro do celular, começa a transição para o carregamento (fade de 8 frames).

### Cena 5: Presente ideal (frames 324 a 449)

- **Carregamento (frames 318 a 356):**
  - caixinha com o degradê (200 px) no meio da tela, com a tampa pulando (translateY 0 → -28 → 0 a cada 12 frames) e três brilhos dourados "✦ ✧ ✦" piscando;
  - mensagem em Plus Jakarta Sans 600, 32 px: "Lendo tudo sobre Ana..." nos frames 324 a 340, depois "Embrulhando a ideia perfeita..." nos frames 340 a 356;
  - a mensagem troca subindo e descendo 10 px, como no site;
  - barra de brilho de 360 x 10 px com o degradê correndo;
  - embaixo, em 22 px e cor #8d82b0: "Costuma levar de 10 a 25 segundos.". É o texto real do site e mantém a demonstração honesta mesmo acelerada.
- **Texto:**
  - frame 328: "O presente *ideal*" (Título, 96 px, topo em y 290);
  - frame 392: "e por que ele combina" (Apoio, topo em y 410).
- **Saída do carregamento (frames 356 a 364):**
  - a tampa voa (translateY -200 e rotate 25°) e some;
  - a caixa cresce até 1,3 e some;
  - a tela de resultado entra com escala de 0,97 a 1 e opacidade de 0 a 1 em 15 frames.
- **Cartão do presente ideal:**
  - borda de 3 px com o degradê, vidro, raio 34, padding 28;
  - cada peça entra com fade e subida de 16 px em 8 frames:

  | Frame | Peça |
  |---|---|
  | 360 | Quadrado de 128 px com ☕ (spring: escala de 0 a 1 e rotate de -20° a 0, damping 12, stiffness 180, igual ao site) |
  | 366 | Selo "✨ Escolha principal" (pílula, Plus Jakarta Sans 700, 24 px) |
  | 368 | "O PRESENTE IDEAL PARA ANA" (sobretítulo dourado) |
  | 372 | "Moedor de café manual" (Fraunces 700, 46 px) |
  | 378 | Pílula "ESTIMATIVA R$ 100 a R$ 200" (rótulo de 20 px em #bdb2dc e valor em Plus Jakarta Sans 700, 28 px) e etiqueta "Casa" |
  | 384 | Citação com ícone 💡 e borda esquerda dourada: "Ana ama café: moer o grão na hora deixa o ritual ainda mais especial." (Plus Jakarta Sans 500, 26 px) |
  | 390 | Botão "Ver na loja ↗" em largura total (76 px de altura, fundo com o degradê, Plus Jakarta Sans 700, 30 px, branco) |
- **Frames 392 a 420:** a citação ganha destaque (fundo dourado de 8% → 22% → 12% de opacidade, escala 1 → 1,03 → 1), sincronizado com a linha de apoio.
- **Frames 420 a 449:** tudo parado na tela.
- **Limite vertical:** o fim do cartão fica por volta de y 1414, ainda acima do limite de 1440.

### Cena 6: Outras ideias (frames 450 a 551)

- **Texto:**
  - frames 450 a 458: o texto da cena 5 SAI;
  - frame 456: "Outras *ideias*" (Título, 100 px, topo em y 270);
  - frame 461: "no mesmo orçamento" (Apoio, topo em y 392).
- **Rolagem (frames 450 a 474):** o conteúdo do celular rola para cima com `Easing.inOut(Easing.cubic)` até o título "Outras ideias que combinam" (Fraunces 700, 40 px) ficar logo abaixo do cabeçalho.
- **Cartões:** em vidro, raio 28, padding 24, um por linha, entrando com subida de 24 px nos frames 462, 466 e 470:
  1. 💡, etiqueta "Leitura", "Luminária de leitura recarregável" e botão "Ver na loja ↗".
  2. 🫘, etiqueta "Gourmet", "Kit de cafés especiais brasileiros" e botão "Ver na loja ↗".
  3. 🌿, etiqueta "Casa", "Kit de vasos autoirrigáveis" e botão "Ver na loja ↗" (meio escondido no degradê da base).

  O título dos cartões é em Fraunces 600, 34 px. O botão é uma pílula com contorno branco de 2 px, 64 px de altura, em Plus Jakarta Sans 700, 28 px. Os cartões menores não mostram preço, para não poluir a tela e não exibir nenhum preço exato.
- **Toque no primeiro cartão:**
  - frame 484: o cursor aparece;
  - frame 496: chega ao botão do cartão 1;
  - frame 498: toque; o botão passa de contorno para degradê em 6 frames e o ícone ↗ dá um pulinho de 6 px para cima e para a direita.
- **Frame 502:** entra "Cada uma com link pro produto" (Plus Jakarta Sans 800, 44 px, verde-menta #5ff2c3, com o ícone Link do lucide de 44 px à esquerda, topo em y 476).
- **Frames 508 e 516:** os botões dos cartões 2 e 3 pulsam (sombra rosa 0 → 24 px → 0 e escala 1 → 1,04 → 1), reforçando o "cada uma".
- **Frames 540 a 551:** o texto SAI; o celular desce 300 px, encolhe para 0,92 e some (ease in, 12 frames); o degradê da base some junto.

### Cena 7: Benefícios (frames 552 a 632)

- **Lista:** alinhada à esquerda, num bloco centrado em x 510 (de x 160 a 860 aproximadamente), de y 400 a cerca de 1190.
- **Cada linha:** um círculo verde-menta #5ff2c3 com "✓" desenhado em #0f0a1f (traço de 10 px), seguido do texto em Título:

  | Linha | Estilo | Círculo | Topo em y |
  |---|---|---|---|
  | "*Grátis*" | Destaque, 150 px | 110 px | 400 |
  | "Sem cadastro" | Título, 84 px | 96 px | 640 |
  | "Sem e-mail" | Título, 84 px | 96 px | 790 |
  | "Sem cartão" | Título, 84 px | 96 px | 940 |
  | "Em 2 minutos" | Título, 84 px | 96 px | 1090 |
- **Entradas nos frames 554, 562, 569, 576 e 583:** o círculo estoura (spring com damping 10 e stiffness 220), o "✓" se desenha em 6 frames e o texto desliza de x -40 com fade em 8 frames.
- **Frames 596 a 620:** BRILHO em "Grátis".
- **Frames 624 a 632:** as linhas saem para a esquerda (x de 0 a -60, com fade), com 1 frame de atraso entre elas.

### Cena 8: CTA (frames 633 a 734)

- **Logo (frames 633 a 652):** caixinha de 170 px e "Mimo *Certo*" (Fraunces 600, 100 px). Cai de y -120 com quique (spring com damping 9) e fica centrado em x 510, com centro vertical em y 420.
- **Título:** "Descubra o" no frame 642 e "presente *ideal*" no frame 647 (Título, 104 px, topo em y 560).
- **Pílula do endereço (frame 654):**
  - 760 x 124 px, topo em y 850, fundo de vidro e borda de 3 px com o degradê correndo em loop de 90 frames;
  - cresce de 0,8 para 1 com spring;
  - texto "mimocerto.vercel.app" em Plus Jakarta Sans 800, 54 px, branco.
- **"link na bio":**
  - frames 664 a 680: o texto (Caveat 700, 96 px, dourado, girado -3°, topo em y 1010) se escreve com clip-path;
  - frames 670 a 686: uma seta curva desenhada à mão (traço dourado de 6 px) sai do texto e aponta para a pílula.
- **Frame 676:** entra "Grátis · 2 minutos · sem cadastro" (Plus Jakarta Sans 600, 40 px, #bdb2dc, com o ícone ShieldCheck do lucide em verde-menta à esquerda, topo em y 1170). É o mesmo texto que fica ao lado do botão na home.
- **Toque:** o cursor aparece no frame 686, chega à pílula no frame 698 e toca no frame 700 (a pílula faz 0,97 → 1).
- **Frames 712 a 724:** a tampa da caixinha do logo balança (rotate ±8°, dois ciclos), lembrando a caixa do gancho.
- **Frames 724 a 734:** tudo fica na tela, sem saída. Quando o Reels repetir, ele volta para a caixa tremendo do frame 0.

---

## 5. Capa do Reels

Faça um `<Still>` de 1080x1920 (ou um frame da cena 1 com estes ajustes):

- **Faixa segura:** tudo entre y 285 e 1250, faixa que sobrevive ao recorte 3:4 da grade do perfil e ao 4:5 do feed. Centro em x 540.
- **Texto principal:**
  - Não sabe
  - o que dar
  - de *presente?*

  Título de 128 px, topo em y 300.
- **Meio (y 740 a 1040):** a caixinha de 300 px com os três "?" coloridos.
- **Linha manuscrita:** "a IA descobre em 2 minutos" (Caveat 700, 80 px, dourado, girado -3°, topo em y 1100).
- **Fundo:** igual ao do vídeo.
- **Ao publicar:** confira a aba "Grade do perfil" em "Editar capa".

---

## 6. Legenda do post

```
Não sabe o que dar de presente? 🎁

Responda perguntas rápidas sobre a pessoa e a IA do Mimo Certo indica o presente ideal, explica por que ele combina e sugere outras ideias no seu orçamento. Cada ideia já vem com o link pro produto.

Grátis, sem cadastro e em 2 minutos.
👉 Faça o quiz pelo link na bio (mimocerto.vercel.app)

Salve pra hora do amigo secreto 😉

#ideiasdepresente #dicadepresente #amigosecreto #presentedenatal #presentes
```

---

## 7. Ganchos alternativos para testar depois

Os dois trocam só a cena 1 (frames 0 a 59). O resto do vídeo fica igual.

### A) "Amigo secreto" (sazonal)

- **Texto:**
  - "Amigo secreto..." (Caveat 700, 120 px, dourado)
  - "e nenhuma" (Título, 128 px)
  - "*ideia*?" (Título, 128 px)
- **Visual:**
  - no lugar da caixa, um papelzinho dobrado (branco-creme, cantos arredondados) tremendo;
  - ele abre no frame 6 e mostra "???" escrito à mão;
  - na saída, o papel se dobra, vira a caixinha, e a cena 2 segue igual.
- **Hipótese:** em novembro e dezembro, citar a situação exata do público (o sorteio do amigo secreto) aumenta a identificação e reduz a taxa de pulo. Perde força depois de janeiro.

### B) "Resultado primeiro" (demonstração)

- **Texto:**
  - "A IA escolheu" (Título, 120 px)
  - "esse presente" (Título, 120 px)
  - "Veja como ↓" (Apoio)
- **Visual:**
  - o celular já aparece no frame 0 com o cartão do presente ideal da cena 5 (☕ "Moedor de café manual", "O PRESENTE IDEAL PARA ANA", selo "Escolha principal"), com brilhos ao redor;
  - no frame 50, a tela "rebobina" (desliza rápido para a direita com leve desfoque) até a pergunta da relação;
  - o vídeo segue direto para a cena 3, e a cena 2 vira só um selo rápido do logo.
- **Hipótese:** mostrar o resultado no primeiro segundo prova o produto e desperta a curiosidade pelo "como". Isso pode funcionar melhor com quem não está com a dor agora.
- **Atenção:** use um resultado real tirado do site (veja os próximos passos) para que "a IA escolheu" seja verdade.

### Qual testar primeiro e como medir

- **Ordem:** teste primeiro o roteiro principal (dor) contra o B (resultado primeiro). São as hipóteses mais diferentes, então a diferença aparece mais rápido. Use o A como terceira peça durante novembro e dezembro.
- **Como comparar:** publique as versões em dias diferentes, no mesmo horário. Outra opção são os Reels de teste (trial reels), que mostram o vídeo primeiro a quem não segue o perfil, se o recurso estiver disponível na conta.
- **Métrica do gancho:** taxa de pulo e retenção nos 3 primeiros segundos, nos Insights do Reels.
- **Métricas de atenção:** tempo médio de visualização, porcentagem que assiste até o fim, salvamentos e compartilhamentos.
- **Métricas de negócio:**
  - no Instagram: visitas ao perfil e toques no link da bio;
  - no painel `/painel` do site: visitas com canal "instagram", quizzes iniciados e resultados vistos.
- **Link da bio:** use `https://mimocerto.vercel.app/?utm_source=instagram`.
  - O navegador interno do Instagram às vezes não informa a origem, e o site lê o `utm_source`.
  - O valor "instagram" também casa com a tag de afiliado por canal, se ela estiver configurada em `AMAZON_TRACKING_IDS`.

---

## 8. Conferência das regras

- **Lojas:** nenhuma é citada e nenhum logo de loja aparece. Os botões do mockup dizem "Ver na loja".
- **Urgência e dark patterns:** nada de "só hoje", "últimas horas", contagem regressiva ou escassez.
- **Números na tela:** só aparecem os que são reais:
  - "2 minutos", que o site já afirma;
  - as faixas de orçamento do próprio quiz;
  - o "X/11" da barra de progresso, que é o número real de perguntas em `quiz.ts`.
- **Prova social:** não há depoimentos, avaliações, estrelas nem contagem de usuários. A nota de produto que o site às vezes mostra ficou fora do mockup.
- **Resultado de exemplo:**
  - os presentes são genéricos e vêm do acervo do próprio site;
  - o preço aparece como faixa ("Estimativa R$ 100 a R$ 200"), com o mesmo rótulo "Estimativa" que o site usa.
- **Tempo de espera:**
  - a demonstração é acelerada;
  - mesmo assim, a tela de carregamento mostra o texto real "Costuma levar de 10 a 25 segundos.";
  - nada no vídeo promete resultado instantâneo.
- **"Grátis":** é verdade para quem usa. O site ganha comissão das lojas, e isso está explicado na FAQ e no aviso de afiliado da página de resultado.
- **Acessibilidade:** nada pisca mais de 3 vezes por segundo, e todos os textos têm bom contraste com o fundo.

---

## 9. Próximos passos e o que verificar

1. **Rodar o quiz real com as respostas do exemplo:** Ana, Amigo ou amiga, R$ 100 a R$ 200, Café, Leitura e Plantas, pulando o resto. Se a IA indicar outro presente ou outra explicação, use o resultado real no mockup. Se o presente mudar, mantenha a faixa de orçamento no lugar do preço.
2. **Preencher `frontend/src/content/legal/owner.ts` antes de levar tráfego ao site.** Os campos ainda estão entre colchetes, e a política de privacidade precisa dizer quem é o responsável pelos dados e como falar com ele (LGPD).
3. **Confirmar o endereço:** se mimocerto.vercel.app não for o definitivo e vier um domínio próprio depois, troque na cena 8, na capa e na legenda.
4. **Escolher a música:** se o perfil for conta comercial, o Instagram limita a biblioteca a áudios liberados para uso comercial. Escolha um desses, instrumental, para não competir com o texto.
5. **Testar no celular antes de postar:** mande o MP4 para você mesmo e confira se nada fica atrás da legenda e dos botões. Ajuste as margens se a sua tela mostrar diferente.
6. **Capa:** exporte como imagem separada e escolha em "Editar capa", conferindo a aba da grade do perfil.

---

## Fontes

Consultadas para as zonas seguras do Reels e o recorte da grade do perfil (3:4 desde 2025). As margens variam entre as fontes, por isso adotei as mais conservadoras.

- [Hopper HQ: Instagram Reel Size, dimensões e zonas seguras](https://www.hopperhq.com/blog/instagram-reel-size/)
- [SocialBu: Instagram Post Aspect Ratio, tamanhos e zonas seguras](https://socialbu.com/blog/?p=26562)
- [Revid: Instagram Reels Safe Zone Checker](https://www.revid.ai/instagram-reels-safe-zone)
