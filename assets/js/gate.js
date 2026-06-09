/* ══════════════════════════════════════════════
   Cosmic Chaos Production — Access Gate (WIP)
   Code d'accès : theo2026
   Protection cliente simple — désactiver en supprimant
   l'inclusion de ce fichier dans les pages HTML.
══════════════════════════════════════════════ */
(function () {
  const ACCESS_CODE = 'theo2026';
  const STORAGE_KEY = 'ccp_access_v1';

  // Déjà authentifié : on sort tout de suite
  if (sessionStorage.getItem(STORAGE_KEY) === 'granted') {
    document.documentElement.classList.add('ccp-authed');
    return;
  }
  // Le masquage est déjà inline dans le <head> de chaque page

  function mountGate() {
    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #ccp-gate {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: #060606;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        animation: gateIn 0.5s ease;
      }
      @keyframes gateIn { from { opacity: 0; } to { opacity: 1; } }

      #ccp-gate::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 60% 80% at 20% 50%, rgba(74,124,247,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 80% 50%, rgba(212,149,60,0.08) 0%, transparent 70%);
        pointer-events: none;
      }

      .ccp-gate-grain {
        position: absolute; inset: 0; pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        opacity: 0.03;
        mix-blend-mode: overlay;
      }

      .ccp-gate-card {
        position: relative;
        z-index: 2;
        max-width: 420px;
        width: 100%;
        text-align: center;
        animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
      }
      @keyframes cardIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: none; }
      }

      .ccp-gate-logo {
        font-family: 'Anton', 'Bebas Neue', Impact, sans-serif;
        font-size: 22px;
        font-weight: 400;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .ccp-gate-logo .digital { color: #F0EEE8; }
      .ccp-gate-logo .dot { color: rgba(240,238,232,0.25); margin: 0 8px; }
      .ccp-gate-logo .studio { color: #F0EEE8; }
      .ccp-gate-sub-logo {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.3em;
        color: rgba(240,238,232,0.45);
        text-transform: uppercase;
        margin-bottom: 32px;
      }

      .ccp-gate-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: 'DM Sans', sans-serif;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: rgba(240,238,232,0.35);
        padding: 4px 12px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 999px;
        margin-bottom: 32px;
      }
      .ccp-gate-badge::before {
        content: '';
        width: 6px; height: 6px;
        background: #D4953C;
        border-radius: 50%;
        animation: pulseDot 1.8s infinite;
      }
      @keyframes pulseDot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      .ccp-gate-title {
        font-family: 'Syne', sans-serif;
        font-size: clamp(1.8rem, 4vw, 2.4rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #F0EEE8;
        margin-bottom: 14px;
        line-height: 1.1;
      }
      .ccp-gate-title em {
        font-style: italic;
        font-family: 'Fraunces', Georgia, serif;
        font-weight: 300;
        background: linear-gradient(90deg, #9D5CFF, #00E0FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .ccp-gate-sub {
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        color: #6B6966;
        line-height: 1.6;
        font-weight: 300;
        margin-bottom: 32px;
      }

      .ccp-gate-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .ccp-gate-input {
        width: 100%;
        background: rgba(17,17,17,0.8);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        padding: 14px 18px;
        font-family: 'DM Sans', sans-serif;
        font-size: 15px;
        color: #F0EEE8;
        text-align: center;
        letter-spacing: 0.1em;
        outline: none;
        transition: all 0.25s;
      }
      .ccp-gate-input:focus {
        border-color: rgba(74,124,247,0.4);
        box-shadow: 0 0 0 3px rgba(74,124,247,0.08);
      }
      .ccp-gate-input::placeholder {
        color: rgba(107,105,102,0.6);
        letter-spacing: 0.05em;
        text-transform: none;
      }

      .ccp-gate-btn {
        width: 100%;
        background: linear-gradient(90deg, #9D5CFF, #00E0FF);
        color: #04020F;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 700;
        padding: 14px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        letter-spacing: 0.02em;
        transition: all 0.25s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .ccp-gate-btn:hover {
        transform: translateY(-1px);
        filter: brightness(1.08);
        box-shadow: 0 8px 30px rgba(157,92,255,0.3), 0 8px 30px rgba(0,224,255,0.2);
      }

      .ccp-gate-error {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        color: #ff6b6b;
        margin-top: 4px;
        min-height: 16px;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .ccp-gate-error.visible { opacity: 1; }

      .ccp-gate-foot {
        margin-top: 28px;
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        color: rgba(107,105,102,0.5);
        letter-spacing: 0.05em;
      }

      .ccp-gate-shake {
        animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }
      @keyframes shake {
        10%, 90% { transform: translateX(-2px); }
        20%, 80% { transform: translateX(3px); }
        30%, 50%, 70% { transform: translateX(-5px); }
        40%, 60% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);

    // Markup
    const overlay = document.createElement('div');
    overlay.id = 'ccp-gate';
    overlay.innerHTML = `
      <div class="ccp-gate-grain"></div>
      <div class="ccp-gate-card">
        <div class="ccp-gate-logo">
          <span class="digital">Cosmic</span><span class="dot">·</span><span class="studio">Chaos</span>
        </div>
        <div class="ccp-gate-sub-logo">Production · MMXXVI</div>
        <div class="ccp-gate-badge">Site en construction</div>
        <h1 class="ccp-gate-title">Accès <em>réservé.</em></h1>
        <p class="ccp-gate-sub">Le nouveau studio est en cours de finalisation. Entrez votre code d'accès pour découvrir le projet.</p>
        <form class="ccp-gate-form" id="ccp-gate-form" autocomplete="off">
          <input
            id="ccp-gate-input"
            class="ccp-gate-input"
            type="password"
            placeholder="Code d'accès"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            autofocus
          />
          <button type="submit" class="ccp-gate-btn">
            Entrer
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
          <p class="ccp-gate-error" id="ccp-gate-error"></p>
        </form>
        <p class="ccp-gate-foot">© 2026 Cosmic Chaos Production</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const form = document.getElementById('ccp-gate-form');
    const input = document.getElementById('ccp-gate-input');
    const errorEl = document.getElementById('ccp-gate-error');
    const card = overlay.querySelector('.ccp-gate-card');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim().toLowerCase();
      if (value === ACCESS_CODE.toLowerCase()) {
        sessionStorage.setItem(STORAGE_KEY, 'granted');
        document.documentElement.classList.add('ccp-authed');
        // Fade out
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
      } else {
        errorEl.textContent = 'Code incorrect. Réessayez.';
        errorEl.classList.add('visible');
        card.classList.add('ccp-gate-shake');
        input.value = '';
        setTimeout(() => card.classList.remove('ccp-gate-shake'), 400);
        input.focus();
      }
    });

    // Focus input asap
    setTimeout(() => input.focus(), 100);
  }

  // Monte la gate dès que possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountGate);
  } else {
    mountGate();
  }
})();
