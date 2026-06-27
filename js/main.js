/* ============================================================
   Gabriel's Portfolio — comportamenti condivisi (JavaScript)
   ------------------------------------------------------------
   Questo file gestisce le funzioni interattive comuni a tutte
   le pagine: cambio tema chiaro/scuro, barra di navigazione,
   animazioni allo scorrimento, barra di accessibilità, video
   in autoplay e anno nel footer.

   Tutto è racchiuso in una IIFE (funzione che si esegue da
   sola): in questo modo le variabili restano "private" e non
   sporcano lo spazio globale della pagina. "use strict" attiva
   una modalità più rigorosa che aiuta a evitare errori.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Accesso sicuro al localStorage ----
     Alcuni browser (es. navigazione privata) possono bloccare
     il localStorage. Avvolgo lettura/scrittura in try/catch così
     un eventuale errore non blocca tutto il resto della pagina. */
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ============================================================
     TEMA CHIARO / SCURO
     Il tema viene salvato in localStorage (chiave "gp-theme") e
     applicato all'elemento <html> tramite l'attributo
     data-theme. Il CSS legge quell'attributo per cambiare i
     colori. NB: il tema viene già impostato nel <head> (script
     anti-flash) per evitare il "lampo" bianco al caricamento.
     ============================================================ */
  var root = document.documentElement;
  function applyTheme(t) {
    root.setAttribute("data-theme", t);            // aggiorna i colori
    store.set("gp-theme", t);                       // ricorda la scelta
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.setAttribute("aria-label", t === "dark" ? "Attiva il tema chiaro" : "Attiva il tema scuro");
  }
  function initTheme() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    // Allinea l'etichetta accessibile (aria-label) al tema GIÀ attivo al
    // caricamento: lo script "anti-lampo" nel <head> può aver impostato il
    // tema scuro fin da subito (preferenza di sistema), quindi qui sincronizzo
    // il testo del pulsante con lo stato reale, utile per gli screen reader.
    var current0 = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    btn.setAttribute("aria-label", current0 === "dark" ? "Attiva il tema chiaro" : "Attiva il tema scuro");
    // al clic, inverte il tema corrente
    btn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ============================================================
     BARRA DI NAVIGAZIONE
     1) aggiunge la classe "is-scrolled" quando si scorre (per
        mostrare l'ombra sotto la navbar);
     2) gestisce il menu a comparsa su mobile (apri/chiudi).
     ============================================================ */
  function initNav() {
    var nav = document.querySelector(".site-nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    var toggler = document.querySelector(".nav-toggler");   // bottone "hamburger"
    var collapse = document.querySelector(".nav-collapse");  // contenitore dei link
    if (toggler && collapse) {
      var setOpen = function (open) {
        collapse.classList.toggle("open", open);
        toggler.setAttribute("aria-expanded", open ? "true" : "false");
        toggler.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
      };
      toggler.addEventListener("click", function () {
        setOpen(!collapse.classList.contains("open"));
      });
      // chiude il menu quando si clicca un link
      collapse.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { setOpen(false); });
      });
      // chiude il menu con il tasto ESC
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
      });
      // se la finestra torna grande, richiude il menu mobile
      window.addEventListener("resize", function () { if (window.innerWidth > 1024) setOpen(false); });
    }
  }

  /* ============================================================
     ANIMAZIONI ALLO SCORRIMENTO (scroll reveal)
     Ogni elemento con classe ".reveal" compare con una piccola
     animazione quando entra nello schermo. Uso IntersectionObserver,
     che avvisa quando un elemento diventa visibile: è molto più
     efficiente che ascoltare di continuo l'evento "scroll".
     Se il browser non lo supporta, mostro tutto subito.
     ============================================================ */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible"); // fa partire l'animazione
          io.unobserve(en.target);               // una volta sola: smette di osservarlo
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     BARRA DI ACCESSIBILITÀ (solo pagina Educazione civica)
     Due funzioni:
     1) ingrandire/rimpicciolire il testo (variabile CSS
        --user-scale, salvata in "gp-scale");
     2) leggere la pagina ad alta voce con la sintesi vocale
        del browser (SpeechSynthesis), in italiano o inglese a
        seconda dell'attributo lang della pagina.
     ============================================================ */
  function initA11y() {
    var scope = document.querySelector(".a11y-scope");      // contenitore del testo da scalare
    var inc = document.getElementById("a11y-inc");          // bottone A+
    var dec = document.getElementById("a11y-dec");          // bottone A-
    var rst = document.getElementById("a11y-reset");        // bottone reset
    var speakBtn = document.getElementById("a11y-speak");   // bottone "ascolta"

    // --- ridimensionamento del testo ---
    if (scope && (inc || dec || rst)) {
      var scale = parseFloat(store.get("gp-scale")) || 1;
      // mantiene il fattore tra 0.85 e 1.4 (limiti ragionevoli)
      var clamp = function (v) { return Math.max(0.85, Math.min(1.4, v)); };
      var apply = function () {
        scale = clamp(scale);
        scope.style.setProperty("--user-scale", scale);
        store.set("gp-scale", String(scale));
      };
      apply();
      if (inc) inc.addEventListener("click", function () { scale += 0.1; apply(); });
      if (dec) dec.addEventListener("click", function () { scale -= 0.1; apply(); });
      if (rst) rst.addEventListener("click", function () { scale = 1; apply(); });
    }

    // --- lettura ad alta voce ---
    if (speakBtn) {
      var synth = window.speechSynthesis;
      // se il browser non supporta la sintesi vocale, disabilito il bottone
      if (!synth) { speakBtn.disabled = true; speakBtn.style.opacity = ".5"; return; }
      var speaking = false;
      // sceglie la lingua in base all'attributo lang della pagina
      var lang = (document.documentElement.getAttribute("lang") || "it").indexOf("en") === 0 ? "en-US" : "it-IT";
      var setState = function (on) {
        speaking = on;
        speakBtn.classList.toggle("is-active", on);
        speakBtn.innerHTML = on
          ? '<i class="bi bi-stop-fill"></i> Ferma la lettura'
          : '<i class="bi bi-volume-up-fill"></i> Ascolta la pagina';
      };
      var stop = function () { try { synth.cancel(); } catch (e) {} setState(false); };
      speakBtn.addEventListener("click", function () {
        if (speaking) { stop(); return; }                 // se sta leggendo, ferma
        var target = document.getElementById("speakable") || document.querySelector("main");
        if (!target) return;
        var text = target.innerText.replace(/\s+/g, " ").trim(); // prende il testo visibile
        if (!text) return;
        try { synth.cancel(); } catch (e) {}
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang; u.rate = 1; u.pitch = 1;
        u.onend = function () { setState(false); };
        u.onerror = function () { setState(false); };
        synth.speak(u);                                    // avvia la lettura
        setState(true);
      });
      // ferma la lettura se si cambia/chiude pagina
      window.addEventListener("beforeunload", stop);
      document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); });
    }
  }

  /* ============================================================
     VIDEO IN AUTOPLAY (pagina Visite aziendali)
     I video partono da soli, senza audio (muted) e in loop.
     Qui, con IntersectionObserver, li metto in play quando
     entrano nello schermo e in pausa quando escono: così
     l'autoplay è affidabile e non spreca risorse fuori vista.
     I controlli restano visibili, quindi l'utente può
     riattivare l'audio quando vuole.
     ============================================================ */
  function initVideos() {
    var vids = document.querySelectorAll("video[autoplay]");
    if (!vids.length) return;
    vids.forEach(function (v) { v.muted = true; });        // garantisce il muto (richiesto per l'autoplay)

    if (!("IntersectionObserver" in window)) {
      vids.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function(){}); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          var p = v.play();                                // riprende quando è in vista
          if (p && p.catch) p.catch(function () {});        // ignora il blocco autoplay senza errori
        } else {
          v.pause();                                       // mette in pausa quando esce dallo schermo
        }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
  }

  /* ============================================================
     ANNO NEL FOOTER
     Inserisce automaticamente l'anno corrente in ogni elemento
     con attributo [data-year], così il copyright è sempre
     aggiornato senza modificare l'HTML.
     ============================================================ */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ============================================================
     AVVIO
     Lancia tutte le funzioni quando il DOM è pronto.
     ============================================================ */
  function boot() { initTheme(); initNav(); initReveal(); initA11y(); initVideos(); initYear(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
