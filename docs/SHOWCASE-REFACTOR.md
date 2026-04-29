# Showcase — Refatoração Completa

## Context

A seção Showcase do site sancochoz tem três bugs confirmados que comprometem a UX em produção:

1. **Botão de mute inconsistente** — race condition entre `userMuted` ref e o handler de hover do parent (`VideoCard.tsx:72-78` e `52-60`). Quando o usuário hover-in/hover-out durante um clique, o ref e o estado divergem.
2. **Som/destaque dessincronizados** — dois `useEffect` em `VideoCard.tsx` competindo por controle do play/pause/mute, com array de dependências incompleto. Som continua tocando após card sair do destaque, ou destaque persiste sem som.
3. **Vídeos transparentes** — `preload="metadata"` não garante que o primeiro frame renderize. Em conexões mais lentas, cards passam pelo viewport antes do browser ter pixels pra mostrar. Total atual: 497MB, com Videomaking sozinho em 390MB (vídeos de 30-67MB cada).

Causas raiz: estado distribuído entre cards e parent sem fonte única, falta de máquina de estados explícita, e arquivos de vídeo não otimizados para web.

**Objetivo:** Refatorar a seção pra ser confiável, rápida, e completamente autossuficiente do ponto de vista do cliente final (Gustavo, em Portugal). O cliente atualizará os vídeos ~4×/ano e não é técnico.

## Decisões confirmadas

- **Storage:** Cloudflare R2 free tier (10GB storage, egress sempre grátis). Estrutura de pastas: `showcase/videomaking/`, `showcase/webdesign/`, `showcase/socialmedia/`.
- **Listagem:** Auto-listagem do bucket R2 em Server Component via API S3, com `revalidate: 60`. **Sem manifest no repo, sem deploy a cada update.** Quantidade e nomes dos vídeos são totalmente dinâmicos — o site descobre o que existe no R2 a cada 60s. Cliente pode adicionar/remover/renomear arquivos livremente sem tocar em código ou avisar o desenvolvedor.
- **Compressão:** Manual pelo cliente via HandBrake usando preset documentado. Admin panel com compressão browser-side fica pra um futuro PR (não escopo agora).
- **Posters:** Não geramos. Usamos skeleton CSS animado durante o lazy-load. IntersectionObserver dispara `preload="auto"` quando vídeo se aproxima do viewport.
- **Naming convention:** Cliente nomeia com prefixo numérico para ordenação: `01-NomeProjeto.mp4`, `02-OutroProjeto.mp4`. Título derivado do nome (`02-Boat-Party.mp4` → "Boat Party").
- **Rollout:** 3 PRs separados.

## Arquitetura

### Máquina de estado central

Substituir o estado distribuído por um Context + Reducer único, em `components/Showcase/ShowcaseContext.tsx`.

```ts
type ShowcaseState = {
  category: Category              // categoria ativa
  activeVideoId: string | null    // vídeo em destaque (hover) — desktop only
  globalMuted: boolean            // mute global, persiste entre cards
  isDragging: boolean             // mobile only
}

type ShowcaseAction =
  | { type: "SET_CATEGORY"; category: Category }
  | { type: "SET_ACTIVE"; id: string }
  | { type: "RESET_ACTIVE" }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_DRAGGING"; dragging: boolean }
```

Estado inicial: `{ category: "videomaking", activeVideoId: null, globalMuted: true, isDragging: false }`.

**Quem dispatcha o quê:**
| Ação | Disparada por |
|---|---|
| `SET_CATEGORY` | `CategoryFilter` (click) |
| `SET_ACTIVE` | `VideoCardDesktop` (`onMouseEnter`) |
| `RESET_ACTIVE` | `ShowcaseDesktop` (`pointerleave` na track, `visibilitychange` hidden, `window.blur`) |
| `TOGGLE_MUTE` | `VideoCardDesktop` / `VideoCardMobile` (`onClick`) |
| `SET_DRAGGING` | `useMarquee` (mobile, em pointerdown/up) |

Cada `VideoCardDesktop` deriva seu visual do contexto: `isActive = state.activeVideoId === entry.id; isDimmed = state.activeVideoId !== null && !isActive`. **Zero estado interno** nos cards. Isso elimina por construção os bugs 1 e 2.

### Hook de marquee (`useMarquee.ts`)

Encapsula o loop GSAP infinito. Vanilla `useRef + useEffect` — não vale instalar `@gsap/react` só pra isso.

```ts
useMarquee({
  trackRef,
  enabled,        // false em prefers-reduced-motion ou enquanto carrega
  paused,         // true quando activeVideoId !== null OU isDragging
  pxPerSecond,    // 30 desktop, 60 mobile
  itemCount,
  category,       // remount-key para tween
  enableDrag,     // true só no mobile
  dispatch,
})
```

- **Um único** tween persistente por instância. Recomputa width via `tween.invalidate()` em ResizeObserver.
- Effect separado pra `paused` apenas chama `tween.pause()` / `tween.resume()` — nunca recria o tween.
- `setTimeout(150)` atual é substituído por `requestAnimationFrame` pra evitar marquee começar mid-paint.

### Lazy loading com IntersectionObserver

`useViewportVideos.ts` retorna `Set<string>` de IDs visíveis. `VideoCardDesktop`:

1. **Não no viewport** → renderiza só wrapper com skeleton CSS (sem `<video>`)
2. **Entrou no viewport** → monta `<video preload="auto" muted loop playsInline>`. Browser baixa metadata + primeiro frame. Skeleton fade-out quando `loadeddata` dispara.
3. **Hovered** → effect com dep `[isActive]` chama `video.muted = state.globalMuted; video.play()`
4. **Click no vídeo** → dispatch `TOGGLE_MUTE`. Effect com dep `[state.globalMuted, isActive]` aplica `video.muted` no DOM. Sem refs.
5. **Reset** → effect cleanup `video.pause(); video.currentTime = 0; video.muted = true`
6. **Saiu do viewport** → desmonta `<video>`, libera decoder

### Reset triggers (mata o bug 2 de uma vez)

`ShowcaseDesktop` registra:
- `pointerleave` na track → `RESET_ACTIVE`
- `document.visibilitychange` (hidden) → `RESET_ACTIVE`
- `window.blur` → `RESET_ACTIVE`

### Stacking shadow (efeito de empilhamento)

Cada card recebe `box-shadow: -12px 0 24px -8px rgba(0,0,0,0.5)` + z-index incremental por posição (cards à direita ficam por cima). Custo zero, look profissional.

## File-by-file

### Criados
- `components/Showcase/showcase.types.ts` — `Category`, `VideoEntry`, `ShowcaseState`, `ShowcaseAction`
- `components/Showcase/ShowcaseContext.tsx` — Provider + hooks `useShowcaseState`, `useShowcaseDispatch`
- `components/Showcase/showcaseReducer.ts` — reducer puro (testável)
- `components/Showcase/useMarquee.ts` — hook GSAP
- `components/Showcase/useViewportVideos.ts` — IntersectionObserver
- `components/Showcase/MuteIcon.tsx` — extrai SVGs duplicados
- `components/Showcase/VideoCardDesktop.tsx` — substitui `VideoCard.tsx`
- `components/Showcase/VideoCardMobile.tsx` — substitui `MobileVideoCard` inline
- `components/Showcase/Skeleton.tsx` — placeholder durante lazy load
- `lib/r2-client.ts` — wrapper S3 client pra Cloudflare R2
- `app/showcase/videos/route.ts` — Route handler que lista vídeos do R2 (ou usar Server Component fetch direto)
- `docs/HANDBRAKE-PRESET.md` — instruções pro cliente

### Modificados
- `components/Showcase/index.tsx` — server component, faz fetch da lista R2, passa pro client component (Provider). Detecta `prefers-reduced-motion`.
- `components/Showcase/ShowcaseDesktop.tsx` — drop drag, drop refs, consome contexto, registra reset triggers
- `components/Showcase/ShowcaseMobile.tsx` — usa `useMarquee` no modo drag, consome contexto
- `components/Showcase/CategoryFilter.tsx` — drop props, usa contexto

### Deletados (no PR2)
- `components/Showcase/VideoCard.tsx`
- `components/Showcase/showcaseData.ts`
- `app/api/video/route.ts` (dead code)
- `public/ShowcaseVideos/**` (após upload pro R2 confirmado)

## Roadmap em 3 PRs

### PR1 — Refatoração de estado, mata os 3 bugs

Sem mudar storage. Vídeos continuam em `public/ShowcaseVideos/`. Foco em consertar comportamento.

1. Criar `showcase.types.ts`, `ShowcaseContext.tsx`, `showcaseReducer.ts`
2. Converter `showcaseData.ts` em `VideoEntry[]` (id sintetizado a partir do filename)
3. Refatorar `VideoCard.tsx` → `VideoCardDesktop.tsx` lendo do contexto
4. Extrair `MuteIcon.tsx`
5. Criar `useMarquee.ts`, ambos children usam
6. Adicionar reset triggers em `ShowcaseDesktop`
7. Drop drag desktop, manter drag mobile via `useMarquee`
8. `IntersectionObserver` via `useViewportVideos.ts`
9. Skeleton CSS placeholder

**Resultado visível:** os 3 bugs sumirão. Carregamento ainda lento por vídeos grandes em `/public/`, mas sem mais transparências/áudio preso.

### PR2 — Migração pra R2 + auto-listagem

1. Cliente comprime os 13 vídeos atuais com HandBrake (preset documentado em `docs/HANDBRAKE-PRESET.md`)
2. Cliente renomeia com convenção `NN-Nome.mp4`
3. Cliente cria conta R2 (você guia), gera API tokens, cria bucket `sancochoz-showcase`
4. Upload manual via dashboard R2 nas pastas certas
5. Configurar bucket público + CORS pra domínio do site
6. `lib/r2-client.ts` com `@aws-sdk/client-s3` (R2 é S3-compatible)
7. Server Component em `components/Showcase/index.tsx` chama `ListObjectsV2` por categoria
8. `revalidate: 60` no fetch
9. Filename → title transform: `slug-to-title("02-Boat-Party")` → `"Boat Party"`
10. Deletar `app/api/video/route.ts`
11. Deletar `public/ShowcaseVideos/**` (após verificar produção)
12. Verificar build size cai de ~500MB → ~10MB

Variáveis de ambiente novas (`.env.local`):
```
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=sancochoz-showcase
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://cdn.sancochoz.com  # custom domain ou pub-xxxx.r2.dev
```

### PR3 — Polish

1. Stacking shadow + z-index gradient
2. `prefers-reduced-motion` desabilita marquee
3. Cálculo correto de duplicatas: `Math.ceil((viewport*2)/setWidth) + 1` (evita snap quando categoria tem só 1 vídeo)
4. Animação suave de transição entre categorias (fade out/in)

## Como a auto-listagem funciona na prática

Cenário concreto: cliente quer adicionar 1 vídeo novo em Web Design.

**Estado antes:**
- R2 bucket `sancochoz-showcase`, pasta `webdesign/` contém: `01-Amanda.mp4`, `02-Projeto.mp4`, `03-Outro.mp4`
- Site mostra 3 vídeos

**Cliente faz:**
1. Comprime `04-NovoProjeto.mp4` no HandBrake
2. Loga no R2 dashboard (cloudflare.com)
3. Drag-drop em `webdesign/`
4. Acabou — não te avisa, não commita, não faz deploy

**Site reage automaticamente:**
- Próximo visitante pós-60s da última requisição → Server Component re-executa o fetch
- `ListObjectsV2` retorna agora 4 arquivos
- Showcase renderiza com 4 vídeos
- Cache 60s

Código em `app/page.tsx`:

```ts
import { listVideosByCategory } from "@/lib/r2-client";

export const revalidate = 60;

export default async function Page() {
  const videos = await listVideosByCategory("webdesign");
  // videos.length é dinâmico: 3, 4, 100... o que o R2 tem agora
  return <Showcase initialVideos={videos} />;
}
```

**Mesmo comportamento pra:**
- Remover vídeo (deleta no R2 → 60s depois sai do site)
- Renomear (renomeia no R2 → 60s depois título muda no site)
- Reordenar (renomeia com prefixo numérico diferente)
- Mudar de categoria (move pra outra pasta)

**Nenhum deploy necessário pra qualquer mudança de conteúdo, sempre.** Só código requer deploy.

## PR4 (futuro, pré-aprovado): Sync Google Drive → R2

Caso o cliente prefira manter Drive como fonte de verdade no futuro, dá pra automatizar:

- **GitHub Action manual ou em cron** (recomendado): lista pasta Drive via API, baixa novos arquivos, comprime com ffmpeg em runner Ubuntu, faz upload pro R2
- Custo: zero (2000 min/mês free em repos privados)
- Build effort: ~1 dia
- **Pré-requisito:** cliente cria projeto no Google Cloud Console, gera credenciais OAuth, salva refresh token nos secrets do GitHub

**Não escopo agora porque:** atualizações trimestrais não justificam a complexidade. O R2 dashboard direto é suficiente. Reavaliar se a frequência aumentar ou se o cliente reclamar do dashboard.

## Preset HandBrake (pro cliente)

Documentar em `docs/HANDBRAKE-PRESET.md`:

- **Format:** MP4
- **Web Optimized:** ✅ (gera +faststart, crítico)
- **Resolution:** 720×1280 (anamorphic: None, crop: custom para forçar 9:16)
- **Framerate:** Same as source, Constant
- **Video codec:** H.264 (x264)
- **Quality:** RF 23 (constant quality, balanceado)
- **Audio codec:** AAC, 96 kbps, Stereo
- **Naming:** `NN-Nome.mp4` (numerado pra ordem)

Tempo estimado: ~30s por vídeo de 15s. Tamanho final esperado: 2-4MB cada.

## Verificação

### Após PR1
- [ ] Hover em qualquer card: cresce, ativa som (se não globalMuted)
- [ ] Hover em outro card: anterior pausa+muda, novo cresce+toca
- [ ] Click no card ativo: toggle global mute. Próximo card hover respeita esse mute.
- [ ] Mouse sai da seção: card volta ao tamanho normal, áudio para
- [ ] Tab em background (cmd+tab pra outro app): áudio para imediatamente
- [ ] Trocar categoria: vídeos antigos somem, novos aparecem, marquee continua
- [ ] Mobile: vídeo full screen, drag funciona, click toggle mute, categoria troca
- [ ] DevTools throttling "Slow 3G": vídeos mostram skeleton enquanto carregam, nunca transparência

### Após PR2
- [ ] Upload via R2 dashboard de um vídeo novo: aparece no site dentro de 60s
- [ ] Build size do projeto ≤ 50MB (era ~500MB)
- [ ] Lighthouse Performance ≥ 85 na home
- [ ] Network tab: vídeos carregam de `cdn.sancochoz.com` (ou domínio R2), não de `/public/`
- [ ] Acesso de Lisboa: latência inicial < 200ms (Cloudflare PoP local)
- [ ] Acesso de São Paulo: latência inicial < 250ms

### Após PR3
- [ ] `prefers-reduced-motion: reduce` no DevTools: marquee fica parado, hover ainda funciona
- [ ] Categoria com 1 vídeo (Web Design hoje): renderiza N cópias suficientes pra encher viewport sem snap

## Riscos e tradeoffs

- **CORS no R2.** Bucket precisa permitir o domínio de produção e localhost:3000. Se mal configurado, vídeo falha silenciosamente. Mitigação: incluir comando `wrangler r2 bucket cors put` no setup do PR2.
- **Autoplay policy iOS Safari.** Mesmo com `muted+playsInline` pode bloquear. Fallback: overlay de "tap to play" no primeiro vídeo se `play().catch()` disparar. Testar com iPhone real antes de fechar PR2.
- **Cliente esquecer de comprimir.** Se subir vídeo de 60MB, vai funcionar mas ficar lento. Mitigação: documentação clara + futuramente o admin panel rejeita arquivos > 8MB.
- **Auto-listagem ordenação.** Sem prefixo numérico, ordem é alfabética. Combinado com cliente que vai usar `NN-Nome.mp4`. Se ele esquecer o prefixo, ordem fica imprevisível. Mitigação: documentar.
- **`revalidate: 60` durante deploy.** Primeira requisição após deploy faz fetch real do R2. Mitigação: aceitar (~200ms a mais no primeiro hit pós-deploy é trivial).
- **`@aws-sdk/client-s3` é grande (~1MB).** Mas só roda no servidor, não vai pro client bundle. OK.
- **Categoria com 0 vídeos.** Cliente pode acidentalmente esvaziar uma pasta. Mitigação: mostrar mensagem "em breve" + botão pra outra categoria.
- **Compressão local depende do hardware do cliente.** HandBrake em Mac M1 é rápido; em laptop antigo pode demorar. Aceitável pra updates trimestrais.

## Arquivos críticos

- `/home/dev-unirv/workspace/freelas/sancochoz/components/Showcase/ShowcaseContext.tsx` (novo, núcleo do estado)
- `/home/dev-unirv/workspace/freelas/sancochoz/components/Showcase/useMarquee.ts` (novo, isola GSAP)
- `/home/dev-unirv/workspace/freelas/sancochoz/components/Showcase/VideoCardDesktop.tsx` (novo, substitui VideoCard.tsx)
- `/home/dev-unirv/workspace/freelas/sancochoz/components/Showcase/index.tsx` (modificado, vira server component no PR2)
- `/home/dev-unirv/workspace/freelas/sancochoz/lib/r2-client.ts` (novo no PR2)
- `/home/dev-unirv/workspace/freelas/sancochoz/docs/HANDBRAKE-PRESET.md` (novo no PR2)
