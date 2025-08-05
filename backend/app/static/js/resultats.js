// static/js/resultats.js
// ========================================================
// Page Résultats - aperçu FILIGRANÉ lié à la signature + contrôle paiement
// - L'aperçu en modale inclut la signature (upload côté API avant affichage)
// - Jamais de téléchargement du PDF final avant paiement
// - "Générer et payer" désactivé si email invalide
// - CORRECTION: Sépare version gratuite (sans signature) et premium (avec signature)
// - MISE À JOUR: Utilise le nouvel endpoint unifié /generate-pdf
// ========================================================

(() => {
  "use strict";

  console.log("🚀 resultats.js chargé");

  // ----------------------------------------
  // CONFIG / UTILS
  // ----------------------------------------
  const API_BASE = "/api/v1";
  const $ = (sel, root = document) => root.querySelector(sel);
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  function getLetterId() {
    let letterId = sessionStorage.getItem("currentLetterId");
    if (letterId) {
      console.log("✅ Letter ID dans sessionStorage:", letterId);
      return letterId;
    }

    const iframe =
      document.querySelector('iframe[title="Aperçu de votre lettre"]') ||
      document.querySelector(".pdf-preview iframe");

    if (iframe && iframe.src) {
      const m = iframe.src.match(/\/letters\/([0-9a-fA-F-]{36})\/preview/);
      if (m) {
        letterId = m[1];
        sessionStorage.setItem("currentLetterId", letterId);
        console.log("✅ Letter ID extrait de l'iframe:", letterId);
        return letterId;
      }
    }

    console.warn("⚠️ Aucun Letter ID trouvé");
    return null;
  }

  let LETTER_ID = null;

  function showMessage(type, text) {
    const msgEl = document.getElementById("messages");
    if (!msgEl) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message p-4 rounded-lg text-center font-semibold mb-4 ${
      type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`;
    messageDiv.textContent = text;

    msgEl.appendChild(messageDiv);

    setTimeout(
      () => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      },
      type === "success" ? 3000 : 5000,
    );
  }

  // ----------------------------------------
  // MODALES - SYSTÈME GÉNÉRAL
  // ----------------------------------------
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Sauvegarder l'état original
    document.body.dataset.originalOverflow = document.body.style.overflow || "";

    // Bloquer le scroll
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    modal.classList.add("active");
    console.log(`📚 Modale ouverte: ${modalId}`);

    setTimeout(() => {
      if (modalId === "pdf-modal" && typeof SIG_PDF?._resize === "function") {
        SIG_PDF._resize();
      }
      if (
        modalId === "postal-modal" &&
        typeof SIG_POSTAL?._resize === "function"
      ) {
        SIG_POSTAL._resize();
      }
    }, 50);
  }

  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");

      // Restaurer l'état original
      const originalOverflow = document.body.dataset.originalOverflow || "";
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("modal-open");
      delete document.body.dataset.originalOverflow;

      console.log(`📚 Modale fermée: ${modalId}`);
    }
  }

  // Fonctions globales pour les modales
  window.showPdfModal = () => showModal("pdf-modal");
  window.hidePdfModal = () => hideModal("pdf-modal");
  window.showPostalModal = () => showModal("postal-modal");
  window.hidePostalModal = () => hideModal("postal-modal");
  window.showPreviewModal = () => showModal("preview-modal");
  window.hidePreviewModal = () => hideModal("preview-modal");

  function setupModalExteriorClickClose() {
    document.addEventListener("click", (e) => {
      // Ne pas fermer si on est en train de dessiner une signature
      if (document.body.dataset.isDrawingSignature === "true") return;

      // Fermeture par clic extérieur pour toutes les modales
      if (e.target.classList.contains("modal") && e.target.id) {
        const modalId = e.target.id;
        if (modalId === "basic-modal") {
          window.hideBasicModal();
        } else {
          hideModal(modalId);
        }
      }
    });
  }

  // ----------------------------------------
  // MODALES - VERSION GRATUITE
  // ----------------------------------------
  /** Affiche la modale de version gratuite */
  window.showBasicModal = async () => {
    console.log("🆓 Ouverture modale version basic gratuite");

    if (!LETTER_ID) {
      showMessage("error", "Identifiant de lettre introuvable.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/letters/preview-basic`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter_id: LETTER_ID }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const htmlContent = await response.text();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      const bodyContent =
        tempDiv.querySelector("body")?.innerHTML || htmlContent;

      const contentDiv = document.getElementById("basic-letter-content");
      if (contentDiv) {
        // Créer un iframe isolé pour éviter les conflits CSS
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "400px"; // Hauteur fixe plus petite
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";

        // Retirer la scrollbar du conteneur parent
        const parentContainer = contentDiv.closest(".max-h-96.overflow-y-auto");
        if (parentContainer) {
          parentContainer.classList.remove("max-h-96", "overflow-y-auto");
          parentContainer.style.maxHeight = "none";
          parentContainer.style.overflow = "visible";
        }

        contentDiv.innerHTML = "";
        contentDiv.appendChild(iframe);

        // Injecter le contenu dans l'iframe isolé
        iframe.contentDocument.open();
        iframe.contentDocument.write(bodyContent);
        iframe.contentDocument.close();

        // Ajuster automatiquement la hauteur de l'iframe au contenu
        iframe.onload = () => {
          const iframeDoc = iframe.contentDocument;
          const height = iframeDoc.body.scrollHeight;
          iframe.style.height = Math.min(height, 500) + "px"; // Max 500px
        };

        contentDiv.style.color = "#000000";
        contentDiv.style.backgroundColor = "#ffffff";
        contentDiv.style.padding = "1rem";

        // Harmoniser couleurs internes si nécessaire
        const allElements = contentDiv.querySelectorAll("*");
        allElements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          if (
            computedStyle.color &&
            computedStyle.color !== "rgb(0, 0, 0)" &&
            computedStyle.color !== "#000000"
          ) {
            el.style.color = "#000000";
          }
          if (
            el.style.backgroundColor &&
            el.style.backgroundColor !== "transparent" &&
            el.style.backgroundColor !== ""
          ) {
            el.style.backgroundColor = "transparent";
          }
        });
      }

      const modal = document.getElementById("basic-modal");
      if (modal) modal.classList.add("active");
    } catch (error) {
      console.error("❌ Erreur chargement version basic:", error);
      showMessage(
        "error",
        `Impossible de charger la version gratuite: ${error.message}`,
      );
    }
  };

  window.hideBasicModal = () => {
    const modal = document.getElementById("basic-modal");
    if (modal) modal.classList.remove("active");
  };

  window.copyBasicText = async (event) => {
    try {
      const contentDiv = document.getElementById("basic-letter-content");
      if (!contentDiv) throw new Error("Contenu introuvable");

      // Chercher l'iframe dans le contentDiv
      const iframe = contentDiv.querySelector("iframe");
      let textContent;

      if (iframe && iframe.contentDocument) {
        // Récupérer le texte depuis l'iframe
        textContent =
          iframe.contentDocument.body.innerText ||
          iframe.contentDocument.body.textContent;
      } else {
        // Fallback si pas d'iframe (ancien système)
        textContent = contentDiv.innerText || contentDiv.textContent;
      }

      if (!textContent || !textContent.trim())
        throw new Error("Aucun contenu à copier");

      await navigator.clipboard.writeText(textContent);

      // Feedback sur le bouton
      const button = event?.target?.closest("button");
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
</svg>
Copié !`;
        button.classList.remove("bg-blue-600", "hover:bg-blue-700");
        button.classList.add("bg-green-600", "hover:bg-green-700");

        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove("bg-green-600", "hover:bg-green-700");
          button.classList.add("bg-blue-600", "hover:bg-blue-700");
        }, 2000);
      }

      showMessage("success", "Texte copié dans le presse-papiers !");
      console.log("✅ Texte copié avec succès");
    } catch (error) {
      console.error("❌ Erreur copie:", error);
      showMessage("error", `Impossible de copier: ${error.message}`);
    }
  };

  // ----------------------------------------
  // GESTION SIGNATURE CANVAS
  // ----------------------------------------
  let SIG_PDF = null;
  let SIG_POSTAL = null;

  function setupSignature(canvasId, buttonId) {
    const canvas = document.getElementById(canvasId);
    const button = document.getElementById(buttonId);
    if (!canvas) {
      console.warn(`⚠️ Canvas ${canvasId} non trouvé`);
      return null;
    }

    let isDrawing = false;
    let hasSignature = false;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
    }

    resizeCanvas();

    // Dessin
    function startDrawing(e) {
      e.preventDefault();
      e.stopPropagation();
      isDrawing = true;

      // Bloquer la fermeture de modale pendant le dessin
      document.body.dataset.isDrawingSignature = "true";

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
      hasSignature = true;
      if (button) button.disabled = false;
    }

    function stopDrawing(e) {
      if (isDrawing) {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
          delete document.body.dataset.isDrawingSignature;
        }, 100);
      }
      isDrawing = false;
    }

    // Events souris
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    document.addEventListener("mousemove", (e) => {
      if (isDrawing) draw(e);
    });
    document.addEventListener("mouseup", (e) => {
      if (isDrawing) stopDrawing(e);
    });

    // Events tactiles
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
    document.addEventListener("touchmove", (e) => {
      if (isDrawing) draw(e);
    });
    document.addEventListener("touchend", (e) => {
      if (isDrawing) stopDrawing(e);
    });

    const signatureAPI = {
      clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasSignature = false;
        if (button) button.disabled = true;
      },
      has() {
        return hasSignature;
      },
      toPNG() {
        return canvas.toDataURL("image/png");
      },
      _resize: resizeCanvas,
    };

    // Clear button (identifiants alternatifs pour compat)
    const clearBtnId =
      canvasId.replace("signature-canvas", "clear-signature") + "-btn";
    const clearBtn =
      document.getElementById(clearBtnId) ||
      document.getElementById(
        canvasId.replace("signature-canvas", "clear-signature"),
      ) ||
      document.querySelector(`[onclick*="clearSignature"]`);

    if (clearBtn) {
      clearBtn.onclick = (e) => {
        e.preventDefault();
        signatureAPI.clear();
        console.log(`🧹 Signature ${canvasId} effacée`);
      };
    }

    return signatureAPI;
  }

  // Fonctions globales pour nettoyer signatures
  window.clearSignature = () => {
    if (SIG_PDF) SIG_PDF.clear();
  };
  window.clearSignaturePostal = () => {
    if (SIG_POSTAL) SIG_POSTAL.clear();
  };

  // ----------------------------------------
  // GÉNÉRATION PDF UNIFIÉE
  // ----------------------------------------
  /**
   * Fonction unifiée pour générer des PDFs avec le nouvel endpoint
   */
  async function generatePDF({
    pdfType = "preview", // "preview" ou "final"
    forPostal = false,
    addWatermark = null, // null = auto selon type
  } = {}) {
    console.log(`📄 Génération PDF type=${pdfType}, postal=${forPostal}`);

    if (!LETTER_ID) {
      showMessage("error", "Identifiant de lettre introuvable.");
      return;
    }

    // Signature à utiliser
    const sig = forPostal ? SIG_POSTAL : SIG_PDF;
    if (!sig || !sig.has()) {
      showMessage(
        "error",
        "Merci d'ajouter votre signature avant de générer le PDF.",
      );
      return;
    }

    // UI
    const previewBtn = forPostal ? $("#preview-btn-postal") : $("#preview-btn");
    const spinner = forPostal
      ? $("#preview-postal-loading")
      : $("#preview-loading");
    const textEl = forPostal
      ? $("#preview-btn-postal-text")
      : $("#preview-btn-text");

    try {
      if (previewBtn) previewBtn.disabled = true;
      if (spinner) spinner.style.display = "inline-block";
      if (textEl) textEl.textContent = "Génération du PDF...";

      // Signature
      const signatureDataUrl = sig.toPNG();
      console.log("📝 Signature récupérée");

      // Filigrane ?
      const shouldAddWatermark = addWatermark ?? pdfType === "preview";

      // Appel API
      const response = await fetch(`${API_BASE}/letters/generate-pdf`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letter_id: LETTER_ID,
          signature_data_url: signatureDataUrl,
          add_watermark: shouldAddWatermark,
          pdf_type: pdfType,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Vérifier type de contenu
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/pdf")) {
        console.error("Type de contenu reçu:", contentType);
        throw new Error("Le serveur n'a pas retourné un PDF valide");
      }

      // Télécharger
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const prefix = pdfType === "preview" ? "apercu" : "lettre";
      const suffix = forPostal ? "postal" : "pdf";
      const watermark = shouldAddWatermark ? "filigrane" : "final";
      a.download = `${prefix}-${suffix}-${watermark}-${LETTER_ID.substring(0, 8)}.pdf`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      const action = pdfType === "preview" ? "Aperçu" : "PDF";
      showMessage("success", `${action} téléchargé avec succès !`);
    } catch (error) {
      console.error(`❌ Erreur génération PDF ${pdfType}:`, error);
      showMessage("error", `Impossible de générer le PDF: ${error.message}`);
    } finally {
      if (previewBtn) previewBtn.disabled = false;
      if (spinner) spinner.style.display = "none";
      if (textEl) {
        const defaultText =
          pdfType === "preview"
            ? "Télécharger un aperçu (PDF filigrané)"
            : "Télécharger le PDF final";
        textEl.textContent = defaultText;
      }
    }
  }

  // Wrappers
  async function generatePreview(options = {}) {
    return generatePDF({ pdfType: "preview", addWatermark: true, ...options });
  }
  async function generatePreviewPostal(options = {}) {
    return generatePDF({
      pdfType: "preview",
      addWatermark: true,
      forPostal: true,
      ...options,
    });
  }
  async function generateFinalPDF(options = {}) {
    return generatePDF({ pdfType: "final", addWatermark: false, ...options });
  }

  // Rétrocompatibilité
  async function openSignedPreview(options = {}) {
    return generatePreview(options);
  }

  // ----------------------------------------
  // PAIEMENT ET PDF FINAL
  // ----------------------------------------
  window.generatePdf = async () => {
    console.log("💳 Génération PDF final avec paiement");

    const emailInput = $("#pdf-email");
    if (!emailInput || !isValidEmail(emailInput.value)) {
      showMessage("error", "Veuillez saisir un email valide.");
      emailInput?.focus();
      return;
    }

    if (!SIG_PDF || !SIG_PDF.has()) {
      showMessage("error", "Veuillez ajouter votre signature.");
      return;
    }

    try {
      // Simulation de paiement
      showMessage("success", "Redirection vers le paiement...");
      // Exemple: window.location.href = "/payment?email=" + encodeURIComponent(emailInput.value);

      // Pour la démo : on génère directement le PDF final
      await generateFinalPDF();
    } catch (error) {
      console.error("❌ Erreur paiement/génération:", error);
      showMessage("error", "Erreur lors du processus de paiement.");
    }
  };

  window.generatePostal = async () => {
    console.log("📮 Génération service postal");

    const emailInput = $("#postal-email");
    if (!emailInput || !isValidEmail(emailInput.value)) {
      showMessage("error", "Veuillez saisir un email valide.");
      emailInput?.focus();
      return;
    }

    if (!SIG_POSTAL || !SIG_POSTAL.has()) {
      showMessage("error", "Veuillez ajouter votre signature.");
      return;
    }

    try {
      showMessage("success", "Commande postal en cours...");
      await generateFinalPDF({ forPostal: true });
    } catch (error) {
      console.error("❌ Erreur service postal:", error);
      showMessage("error", "Erreur lors de la commande d'envoi postal.");
    }
  };

  window.downloadPDF = () => {
    console.log("📥 Redirection vers paiement pour téléchargement");
    showMessage(
      "error",
      "Veuillez d'abord effectuer le paiement pour obtenir le PDF final.",
    );
    if (window.showPdfModal) window.showPdfModal();
  };

  // ----------------------------------------
  // VALIDATION EMAIL
  // ----------------------------------------
  function setupEmailValidation() {
    const emailInput = $("#pdf-email");
    const generateBtn = $("#generate-btn");
    if (emailInput && generateBtn) {
      const validateEmail = () => {
        const ok = isValidEmail(emailInput.value);
        generateBtn.disabled = !ok;
        generateBtn.style.opacity = ok ? "1" : "0.5";
      };
      emailInput.addEventListener("input", validateEmail);
      emailInput.addEventListener("blur", validateEmail);
      validateEmail();
    }
  }

  // ----------------------------------------
  // EXPORT DES FONCTIONS GLOBALES
  // ----------------------------------------
  window.generatePreview = generatePreview;
  window.generatePreviewPostal = generatePreviewPostal;
  window.generateFinalPDF = generateFinalPDF;
  window.openSignedPreview = openSignedPreview;

  // ----------------------------------------
  // INITIALISATION
  // ----------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    console.log("📄 Initialisation page résultats");

    // Letter ID
    LETTER_ID = getLetterId();
    if (!LETTER_ID) {
      showMessage(
        "error",
        "Aucune lettre trouvée. Veuillez remplir le formulaire.",
      );
      setTimeout(() => {
        if (
          confirm(
            "Aucune lettre trouvée. Voulez-vous retourner au formulaire ?",
          )
        ) {
          window.location.href = "/formulaire";
        }
      }, 3000);
      return;
    }

    // Boutons version gratuite (sans signature)
    const downloadBtnFree = document.getElementById("btn-free-download");
    const downloadBtnOld = document.getElementById("download-btn");

    if (downloadBtnFree) {
      on(downloadBtnFree, "click", (e) => {
        e.preventDefault();
        console.log("🆓 Clic sur téléchargement gratuit");
        window.showBasicModal();
      });
    }
    if (downloadBtnOld) {
      on(downloadBtnOld, "click", (e) => {
        e.preventDefault();
        console.log("🆓 Clic sur téléchargement gratuit (ancien bouton)");
        window.showBasicModal();
      });
    }

    // Boutons aperçu premium (avec signature)
    const previewBtn = document.getElementById("preview-btn");
    if (previewBtn) {
      previewBtn.onclick = null;
      previewBtn.removeAttribute("onclick");
      previewBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("💎 Clic sur aperçu premium avec signature");
        window.generatePreview();
      });
    }

    const previewBtnPostal = document.getElementById("preview-btn-postal");
    if (previewBtnPostal) {
      previewBtnPostal.onclick = null;
      previewBtnPostal.removeAttribute("onclick");
      previewBtnPostal.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("💎 Clic sur aperçu postal avec signature");
        window.generatePreviewPostal();
      });
    }

    // Dans la modale d'aperçu, "Télécharger PDF" => paiement
    const dlFromPreview = document.getElementById("download-from-preview");
    if (dlFromPreview) {
      dlFromPreview.textContent = "Obtenir le PDF (après paiement)";
      dlFromPreview.onclick = (e) => {
        e.preventDefault();
        window.downloadPDF();
      };
    }

    // Pricing -> modales
    const premiumBtn = document.getElementById("btn-premium-pdf");
    if (premiumBtn) {
      on(premiumBtn, "click", () => {
        if (window.showPdfModal) window.showPdfModal();
        else document.getElementById("pdf-modal")?.classList.add("active");
      });
    }

    const postalBtn = document.getElementById("btn-postal");
    if (postalBtn) {
      on(postalBtn, "click", () => {
        if (window.showPostalModal) window.showPostalModal();
        else document.getElementById("postal-modal")?.classList.add("active");
      });
    }

    // Fermer modales par clic extérieur
    setupModalExteriorClickClose();

    // Validation email
    setupEmailValidation();

    // Signature canvases (après un court délai)
    setTimeout(() => {
      SIG_PDF = setupSignature("signature-canvas", "preview-btn");
      SIG_POSTAL = setupSignature(
        "signature-canvas-postal",
        "preview-btn-postal",
      );

      // Par défaut, les boutons d'aperçu premium sont désactivés sans signature
      const previewBtnPdf = $("#preview-btn");
      const previewBtnPostalEl = $("#preview-btn-postal");
      if (previewBtnPdf) previewBtnPdf.disabled = true;
      if (previewBtnPostalEl) previewBtnPostalEl.disabled = true;

      console.log("✅ Signature canvases initialisés");
    }, 100);

    console.log("✅ Page résultats initialisée");
  });
})();
