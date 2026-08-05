# Standalone preview della toolbar (senza dev server)

## Problema

Oggi, per vedere la `DesignToolbar` bisogna lanciare `npm run dev` e aprire l'URL
`localhost:XXXX` nel browser. L'utente vuole poter aprire un file HTML con doppio
click (`file://...`) e vedere sempre il vero componente React, senza mai avviare
un server locale.

## Obiettivo

Un file `standalone/index.html` autosufficiente (JS + CSS inline, zero richieste
di rete) che:

- Renderizza il vero componente `DesignToolbar` da `src/components/ui/design-toolbar.tsx`
  (non una riscrittura statica) — resta fedele al codice sorgente per costruzione.
- Replica la demo attuale (`src/App.tsx`): sfondo centrato, pulsante di toggle
  light/dark mode.
- Si apre direttamente via `file://`, senza server.
- Si rigenera automaticamente ad ogni modifica del codice, mentre un comando resta
  attivo in un terminale.

## Non-obiettivi

- Live-reload automatico nel browser: senza un server non esiste un canale
  WebSocket per notificare la tab aperta. Il workflow accettato è: il file si
  rigenera da solo in background, l'utente ricarica la tab manualmente (Cmd+R)
  quando vuole vedere l'ultima versione.
- Non si tocca la build/dev flow esistente (`npm run dev`, `npm run build`,
  `dist/`) — restano invariate.

## Approccio

Vite di default produce asset con path assoluti (`/assets/...`), che non
funzionano da `file://`. Si usa il plugin `vite-plugin-singlefile`, che inlina
JS e CSS direttamente nell'HTML in un unico file autosufficiente.

### File toccati/aggiunti

- **`vite-plugin-singlefile`** — nuova devDependency.
- **`vite.standalone.config.ts`** (nuovo) — config Vite dedicata: stesso plugin
  `@vitejs/plugin-react` e stesso alias `@` della config principale, più
  `viteSingleFile()`. `build.outDir` impostato su `standalone/` per non
  interferire con `dist/`.
- **`package.json`** — due nuovi script:
  - `standalone:build` → `vite build --config vite.standalone.config.ts`
    (genera il file una volta).
  - `standalone:watch` → `vite build --config vite.standalone.config.ts --watch`
    (rigenera automaticamente ad ogni salvataggio; resta attivo in terminale).
- **`.gitignore`** — aggiunta `standalone/` (è un artefatto generato, come già
  `dist/`, non va committato).

### Entry point standalone

Riusa lo stesso `index.html` + `src/main.tsx` + `src/App.tsx` già esistenti
(nessuna duplicazione di markup o logica): la config standalone punta allo
stesso `root` del progetto, cambia solo `outDir` e attiva l'inlining via
`viteSingleFile()`.

## Testing / verifica

- `npm run standalone:build` produce `standalone/index.html`.
- Aprire `standalone/index.html` direttamente dal Finder (doppio click, quindi
  via `file://`) e verificare:
  - la toolbar è visibile e interattiva (toggle strumenti, dropdown Select/Shape,
    menu More, tooltip);
  - il toggle light/dark mode funziona;
  - nessun errore in console relativo a risorse non trovate (path assoluti,
    CORS su moduli ES, ecc.).
- Modificare un dettaglio visivo in `design-toolbar.tsx` con `standalone:watch`
  attivo, salvare, e verificare che `standalone/index.html` si rigeneri senza
  errori (poi ricaricare manualmente la tab per vedere la modifica).
