# Gabriel's Portfolio

Sito web personale e portfolio FSL (Formazione Scuola-Lavoro) di **Gabriel Mazzucchelli**,
realizzato per la presentazione orale dell'Esame di Stato (indirizzo SIA — Sistemi Informativi Aziendali).

Il sito raccoglie e racconta in modo organico le esperienze del percorso FSL (Formazione Scuola-Lavoro) svolto
durante il terzo e il quarto anno: il Project Work sull'app *LV8*, le visite aziendali,
lo stage presso *Nettuno Srl* e i collegamenti con le discipline di indirizzo
(Diritto/Economia e Matematica), oltre a un approfondimento di Educazione civica
sull'accessibilità digitale e a una riflessione finale in inglese.

---

## Struttura del progetto

```
site/
├── index.html               Home: presentazione + indice delle sezioni
├── chi-sono.html            Chi sono: profilo, percorso, interessi, obiettivi
├── project-work.html        Project Work — app LV8 (cybersecurity gamificata)
├── visite-aziendali.html    Visite: Fonti Pineta e Project for Building
├── esperienza-fsl.html      Stage Nettuno + Diritto/Economia + Matematica
├── educazione-civica.html   Accessibilità digitale ("Il Web è per Tutti")
├── final-reflections.html   Riflessioni conclusive (interamente in inglese)
│
├── css/
│   └── styles.css           Design system completo (tema chiaro/scuro)
├── js/
│   └── main.js              Comportamenti condivisi (tema, nav, animazioni, a11y)
├── img/                     Immagini, video, poster, loghi, favicon
│
├── favicon → img/favicon.svg
├── .nojekyll                Disattiva Jekyll su GitHub Pages
└── README.md
```

## Tecnologie

- **HTML5** semantico (landmark `header`/`main`/`footer`, heading gerarchici, `alt` su tutte le immagini).
- **Bootstrap 5.3.3** (griglia, carosello, accordion) + **Bootstrap Icons 1.11.3**, via CDN.
- **CSS personalizzato** (`css/styles.css`): palette navy + ambra su carta calda, tipografia
  *Fraunces* (display) e *Manrope* (testo), numerazione editoriale delle sezioni.
- **JavaScript vanilla** (`js/main.js`), senza dipendenze: nessun framework, nessun build step.

## Funzionalità

- **Tema chiaro/scuro** con pulsante nella barra di navigazione; la preferenza viene
  ricordata (localStorage) e applicata prima del rendering per evitare sfarfallii.
- **Navigazione responsive**: menu a comparsa su mobile, stato "attivo" per la pagina corrente,
  link "Salta al contenuto principale" per la tastiera.
- **Animazioni discrete** all'ingresso nello schermo (IntersectionObserver), automaticamente
  disattivate se l'utente preferisce ridurre il movimento (`prefers-reduced-motion`).
- **Barra di accessibilità** (pagina di Educazione civica): ingrandimento/riduzione del testo
  e **lettura ad alta voce** della pagina tramite la sintesi vocale del browser.

## Pubblicazione su GitHub Pages

1. Caricare **il contenuto della cartella `site/`** nella radice del repository
   (i file `.html` devono stare al primo livello, non dentro una sottocartella).
2. In *Settings → Pages*, impostare la sorgente sul branch desiderato (es. `main`) e cartella `/ (root)`.
3. Il file `.nojekyll` è già incluso: impedisce a Jekyll di interferire con i file del sito.
4. La home (`index.html`) viene servita automaticamente come pagina iniziale.

> I riferimenti a Bootstrap, alle icone e ai Google Fonts usano CDN pubblici: il sito
> necessita di una connessione a Internet per visualizzarsi con tutti gli stili.
> Le immagini e i video sono invece locali (cartella `img/`).

## Manutenzione

- I colori, gli spazi e i caratteri sono definiti come **variabili CSS** all'inizio di
  `css/styles.css`: modificandole lì, l'intero sito si aggiorna in modo coerente.
- L'intestazione (`head`), la barra di navigazione e il piè di pagina sono **identici**
  su tutte le pagine: per modificarli, replicare la stessa modifica su ogni file `.html`.
- L'anno nel piè di pagina è aggiornato automaticamente via JavaScript (attributo `data-year`).

---

*Realizzato con HTML & Bootstrap 5 — Gabriel Mazzucchelli, Esame di Stato.*
