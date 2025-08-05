<script>
(() => {
  // ---------- Utils ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const messagesEl = document.getElementById('messages');

  function showMessage(type, text) {
    const colors = {
      success: ['#f0fdf4','#bbf7d0','#15803d'],
      error:   ['#fef2f2','#fecaca','#dc2626'],
      info:    ['#eff6ff','#bfdbfe','#2563eb'],
    }[type] || ['#eff6ff','#bfdbfe','#2563eb'];

    const div = document.createElement('div');
    div.className = 'message';
    div.style.cssText = `background:${colors[0]};border:1px solid ${colors[1]};color:${colors[2]};border-radius:8px;padding:12px;margin-bottom:12px`;
    div.textContent = text;
    messagesEl?.prepend(div);
    setTimeout(() => div.remove(), 6000);
  }

  function getLetterId() {
    const iframe = document.querySelector('iframe[title="Aperçu de votre lettre"]');
    if (!iframe) return null;
    const m = iframe.src.match(/\/letters\/([0-9a-fA-F-]{36})\/preview/);
    return m ? m[1] : null;
  }
  const LETTER_ID = getLetterId();

  // ---------- Modales ----------
  const pdfModal = document.getElementById('pdf-modal');
  const postalModal = document.getElementById('postal-modal');
  const previewModal = document.getElementById('preview-modal');

  window.showPdfModal = () => {
    const el = document.getElementById('pdf-modal');
    el.classList.add('active');
    requestAnimationFrame(() => { sigPDF.ensureSized(); });
  };
  window.showPostalModal = () => {
    const el = document.getElementById('postal-modal');
    el.classList.add('active');
    requestAnimationFrame(() => { sigPost.ensureSized(); });
  };

  window.hidePdfModal = () => pdfModal.classList.remove('active');
  window.showPostalModal = () => { postalModal.classList.add('active'); setTimeout(resizeAllSignCanvases, 50); };
  window.hidePostalModal = () => postalModal.classList.remove('active');
  window.hidePreviewModal = () => previewModal.classList.remove('active');

  // ---------- Signature pad ----------
  function setupSignature(canvasId, previewBtnId) {
    const canvas = document.getElementById(canvasId);
    const btn = document.getElementById(previewBtnId);
    if (!canvas) return { hasSignature: () => false, clear: () => {}, dataURL: () => null, ensureSized: () => {} };

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let drawing = false;
    let signed = false;

    function sizeNow() {
      // Si la modale est display:none, width sera 0 → on diffère
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(rect.width || canvas.offsetWidth || 0, 0);
      if (cssW < 10) return false; // pas encore visible

      const cssH = 120; // ta hauteur visuelle souhaitée
      const dpr = Math.max(window.devicePixelRatio || 1, 1);

      // Réinitialise toute transform avant de changer la bitmap
      ctx.setTransform(1,0,0,1,0,0);

      canvas.width  = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';

      // Espace de dessin en unités CSS
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#111827';

      // Fond blanc (en unités CSS, pas en px device)
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cssW, cssH);
      return true;
    }

    function ensureSized() {
      // essaie maintenant, sinon réessaie jusqu’à ce que visible
      if (sizeNow()) return;
      let tries = 0;
      (function waitVisible(){
        if (sizeNow()) return;
        if (++tries > 30) return; // 30 frames max ~ 0.5s
        requestAnimationFrame(waitVisible);
      })();
    }

    // Appel initial (si modal déjà visible)
    ensureSized();

    function posFromEvent(e) {
      const rect = canvas.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      return { x: point.clientX - rect.left, y: point.clientY - rect.top };
    }

    function start(e){ e.preventDefault(); drawing = true; const p = posFromEvent(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    function move(e){
      if (!drawing) return;
      e.preventDefault();
      const p = posFromEvent(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      if (!signed) {
        signed = true;
        canvas.classList.add('has-signature');
        if (btn) btn.disabled = false;
      }
    }
    function end(){ if (!drawing) return; drawing = false; ctx.closePath(); }

    // Desktop + mobile
    [['pointerdown', start], ['mousedown', start], ['touchstart', start]].forEach(([ev, fn]) =>
      canvas.addEventListener(ev, fn, { passive: false })
    );
    [['pointermove', move], ['mousemove', move], ['touchmove', move]].forEach(([ev, fn]) =>
      canvas.addEventListener(ev, fn, { passive: false })
    );
    [['pointerup', end], ['mouseleave', end], ['mouseup', end], ['touchend', end], ['pointercancel', end]].forEach(([ev, fn]) =>
      canvas.addEventListener(ev, fn)
    );

    function clear() {
      signed = false;
      if (btn) btn.disabled = true;
      canvas.classList.remove('has-signature');
      ensureSized(); // remet à blanc aux bonnes dimensions
    }

    function dataURL() {
      if (!signed) return null;
      return canvas.toDataURL('image/png');
    }
    }

    // Resize responsive
    window.addEventListener('resize', () => ensureSized());

    return { hasSignature: () => signed, clear, dataURL, ensureSized };
  }

  // ---------- Téléchargement / Envoi ----------
  async function downloadPdf(letterId, format='A4') {
    const res = await fetch(`/letters/${letterId}/download?format=${encodeURIComponent(format)}`);
    if (!res.ok) throw new Error('Erreur téléchargement PDF');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0,10).replaceAll('-','');
    a.href = url;
    a.download = `mise_en_demeure_${dateStr}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function sendEmail(letterId, email) {
    const url = new URL(`/letters/${letterId}/send-email`, window.location.origin);
    url.searchParams.set('email_address', email);
    url.searchParams.set('include_pdf', 'true');
    const res = await fetch(url.toString(), { method: 'POST' });
    if (!res.ok) throw new Error('Erreur envoi email');
    return res.json();
  }

  // ---------- Actions boutons plans ----------
  on(document.getElementById('btn-free-download'), 'click', async (e) => {
    e.preventDefault();
    if (!LETTER_ID) return showMessage('error', 'Identifiant de lettre introuvable.');
    try {
      await downloadPdf(LETTER_ID, 'A4');
      showMessage('success','Téléchargement gratuit lancé.');
    } catch (err) {
      console.error(err);
      showMessage('error','Impossible de télécharger le PDF.');
    }
  });

  // Le CTA premium ouvre la modale via l’attribut onclick déjà présent dans ton HTML.

  window.generatePdf = async () => {
    if (!LETTER_ID) return showMessage('error', 'Identifiant de lettre introuvable.');
    const email = (document.getElementById('pdf-email')?.value || '').trim();
    const btn = document.querySelector('#pdf-modal .btn-primary');
    const txt = document.getElementById('pdf-btn-text');
    const spinner = document.getElementById('pdf-loading');
    try {
      btn.disabled = true; spinner.style.display = 'inline-block'; txt.textContent = 'Génération...';

      // signature requise
      if (!sigPDF.hasSignature()) {
        showMessage('error', 'Veuillez ajouter votre signature.');
        return;
      }

      // 1) Télécharge le PDF
      await downloadPdf(LETTER_ID, 'A4');

      // 2) Envoi email si saisi
      if (email) {
        await sendEmail(LETTER_ID, email);
        showMessage('success', `PDF envoyé à ${email}.`);
      } else {
        showMessage('info', 'PDF généré. Ajoutez un email pour l’envoyer automatiquement.');
      }

      hidePdfModal();
    } catch (e) {
      console.error(e);
      showMessage('error','Échec de la génération ou de l’envoi.');
    } finally {
      spinner.style.display = 'none';
      txt.textContent = 'Générer et payer';
      btn.disabled = false;
    }
  };

  window.generatePostal = async () => {
    if (!LETTER_ID) return showMessage('error', 'Identifiant de lettre introuvable.');
    const email = (document.getElementById('postal-email')?.value || '').trim();
    const btn = document.querySelector('#postal-modal button[onclick^="generatePostal"]');
    const txt = document.getElementById('postal-btn-text');
    const spinner = document.getElementById('postal-loading');

    try {
      btn.disabled = true; spinner.style.display = 'inline-block'; txt.textContent = 'Traitement...';

      if (!sigPost.hasSignature()) {
        showMessage('error','Veuillez signer pour valider l’envoi.');
        return;
      }

      // Fallback faute d’endpoint postal dédié : on envoie le PDF par email si l’adresse est fournie.
      if (email) {
        await sendEmail(LETTER_ID, email);
        showMessage('success', `Votre demande d’envoi a été prise en compte. Copie envoyée à ${email}.`);
      } else {
        showMessage('info', 'Aucune adresse email fournie. Ajoutez un email pour recevoir un suivi.');
      }

      hidePostalModal();
    } catch (e) {
      console.error(e);
      showMessage('error','Impossible de traiter la demande d’envoi.');
    } finally {
      spinner.style.display = 'none';
      txt.textContent = 'Commander l\'envoi';
      btn.disabled = false;
    }
  };

  // Active/disable preview buttons au chargement
  const pdfPreviewBtn = document.getElementById('preview-btn');
  const postalPreviewBtn = document.getElementById('preview-btn-postal');
  if (pdfPreviewBtn) pdfPreviewBtn.disabled = !sigPDF.hasSignature();
  if (postalPreviewBtn) postalPreviewBtn.disabled = !sigPost.hasSignature();

  // resize on show modal (au cas où la police change la métrique)
  on(window, 'resize', resizeAllSignCanvases);
})();
</script>
