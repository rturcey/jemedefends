// /static/js/form_draft.js
// Pilote le formulaire multi-étapes via l'API drafts (GET/PATCH/EVENTS/SUBMIT)

(function () {
  const API_BASE = "/api/v1/form-drafts";
  const DEFAULT_FORM_SLUG = "mise_en_demeure_v1";
  const DEBOUNCE_MS = 800;

  // utils
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const debounce = (fn, delay) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  };

  async function fetchJSON(url, opts = {}) {
    const res = await fetch(url, { credentials: "include", ...opts });
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const j = await res.json(); if (j?.detail) msg = j.detail; } catch {}
      throw new Error(msg);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  }

  function stepKeyToDOMId(step) {
    return `#step-${step.replace(/_/g, "-")}`;
  }

  // Expose global
  window.JMD = window.JMD || {};

  window.JMD.initDraftForm = function initDraftForm(options = {}) {
    const form = $("#letter-form");
    if (!form) return;

    const formSlug = form.dataset.formSlug || DEFAULT_FORM_SLUG;
    // empêcher Enter de soumettre le formulaire (hors textarea)
    form.addEventListener("keydown", (e) => {
      const t = e.target;
      if (e.key === "Enter" && t && t.tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    });

    // UI refs
    const btnSubmit = $("#submit-btn");
    const progressBar = $("#progress-bar");
    const progressPercent = $("#progress-percent");
    const saveIndicator = $("#auto-save-indicator");
    const saveStatus = $("#save-status");

    const steps = ["buyer_info", "seller_info", "purchase_info", "problem_info"];
    let currentStep = "buyer_info";
    let draft = null;

    // --- helpers UI ---
    const showSaving = (label, color) => {
      if (!saveIndicator || !saveStatus) return;
      saveIndicator.classList.remove("bg-green-500", "bg-red-500", "bg-blue-500");
      saveIndicator.classList.add(color);
      saveStatus.textContent = label;
      saveIndicator.classList.add("show");
      setTimeout(() => saveIndicator.classList.remove("show"), 1600);
    };

    function updateProgress() {
      const required = $$("input[required], textarea[required], select[required]", form);
      const filled = required.filter((el) => {
        if (el.type === "radio") {
          const group = $$(`input[name="${el.name}"]`, form);
          return group.some((r) => r.checked);
        }
        return (el.value || "").trim().length > 0;
      });
      const pct = required.length ? Math.round((filled.length / required.length) * 100) : 0;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressPercent) progressPercent.textContent = `${pct}% complété`;
    }

    function updateStepIndicators() {
      $$(".step-indicator").forEach((ind) => {
        const s = ind.dataset.step;
        ind.classList.remove("active", "completed", "pending");
        if (s === currentStep) ind.classList.add("active");
        else if (draft?.steps_completed && Array.isArray(draft.steps_completed) && draft.steps_completed.includes(s)) {
          ind.classList.add("completed");
        } else {
          ind.classList.add("pending");
        }
      });
    }

    function validateField(field, show = true) {
      const parent = field.closest(".form-group") || field.parentElement;
      const err = parent ? parent.querySelector(".error-message") : null;

      let ok = true;
      let message = "";

      const val = (field.value || "").trim();
      if (field.required) {
        if (field.type === "radio") {
          const checked = $$(`input[name="${field.name}"]`, form).some((r) => r.checked);
          if (!checked) { ok = false; message = "Veuillez sélectionner une option"; }
        } else if (!val) {
          ok = false; message = "Ce champ est requis";
        }
      }
      if (ok && val && field.type === "email") {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(val)) { ok = false; message = "Format d'email invalide"; }
      }
      if (ok && val && field.type === "number") {
        const n = Number(val);
        if (!Number.isFinite(n) || n <= 0) { ok = false; message = "Veuillez saisir un montant valide"; }
      }
      if (ok && field.minLength > 0 && val.length < field.minLength) {
        ok = false; message = `Minimum ${field.minLength} caractères`;
      }

      if (show && err) {
        if (ok) err.classList.add("hidden");
        else {
          err.textContent = message || "Champ invalide";
          err.classList.remove("hidden");
        }
      }
      field.classList.toggle("border-red-500", !ok);
      field.classList.toggle("border-gray-200", ok);
      return ok;
    }

    function validateStep(step) {
      const fields = $$(`[data-step="${step}"]`, form);
      let ok = true;
      fields.forEach((f) => { if (!validateField(f)) ok = false; });
      return ok;
    }

    // 🔥 CORRECTION : Extraire TOUTES les données du formulaire, pas seulement par étape
    function extractAllFormData() {
      const acc = {};

      // Récupérer TOUS les champs avec data-step
      $$('[data-step]', form).forEach((el) => {
        if (el.type === "radio") {
          if (el.checked) {
            acc[el.name] = el.value;
            console.log(`📋 Radio: ${el.name} = ${el.value}`);
          }
        } else if ("value" in el && el.name) {
          const v = (el.value || "").trim();
          if (v) {
            acc[el.name] = v;
            console.log(`📋 Field: ${el.name} = ${v}`);
          }
        }
      });

      console.log('📋 All form data extracted:', acc);
      return acc;
    }

    function extractStepData(step) {
      const acc = {};
      $$(`[data-step="${step}"]`, form).forEach((el) => {
        if (el.type === "radio") {
          if (el.checked) {
            acc[el.name] = el.value;
            console.log(`📋 Radio saved: ${el.name} = ${el.value}`);
          }
        } else if ("value" in el && el.name) {
          const v = (el.value || "").trim();
          if (v) {
            acc[el.name] = v;
            console.log(`📋 Field saved: ${el.name} = ${v}`);
          }
        }
      });
      console.log(`📋 Step ${step} data:`, acc);
      return acc;
    }

    // --- API ---
    async function loadDraft() {
      try {
        draft = await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`, {
          method: "GET",
        });

        // hydrate form
        const d = (draft && draft.data) ? draft.data : {};
        Object.entries(d).forEach(([k, v]) => {
          const nodes = $$(`[name="${CSS.escape(k)}"]`, form);
          nodes.forEach((el) => {
            if (el.type === "radio") {
              el.checked = el.value === String(v);
              // rafraichir styles radio si besoin
              const option = el.closest(".defect-option");
              const indicator = option ? option.querySelector(".radio-indicator") : null;
              if (option && indicator) {
                const on = el.checked;
                option.classList.toggle("border-blue-500", on);
                option.classList.toggle("bg-blue-50", on);
                option.classList.toggle("border-gray-200", !on);
                indicator.classList.toggle("bg-blue-500", on);
                indicator.classList.toggle("border-blue-500", on);
                indicator.classList.toggle("border-gray-300", !on);
              }
            } else if ("value" in el) {
              el.value = String(v);
            }
          });
        });

        updateProgress();
        updateStepIndicators();
        console.log("✅ Draft loaded successfully:", draft);
      } catch (e) {
        console.error("❌ Error loading draft:", e);
      }
    }

    const autosave = debounce(async (payload) => {
          try {
            console.log(`💾 Autosaving payload:`, payload);

            // 🔥 CORRECTION : D'abord récupérer les données existantes
            let existingData = {};
            try {
              const currentDraft = await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`, {
                method: "GET",
              });
              existingData = currentDraft.data || {};
              console.log(`📋 Existing data before merge:`, existingData);
            } catch (e) {
              console.warn("Could not fetch existing data, starting fresh:", e);
            }

            // 🔥 FUSIONNER les nouvelles données avec les existantes
            const mergedData = { ...existingData, ...payload };
            console.log(`📋 Merged data:`, mergedData);

            const response = await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: mergedData }), // 🔥 Envoyer les données fusionnées
            });
            console.log(`✅ Autosave response:`, response);
            showSaving("Sauvegardé", "bg-green-500");
          } catch (e) {
            console.error("❌ Autosave error:", e);
            showSaving("Erreur de sauvegarde", "bg-red-500");
          }
        }, DEBOUNCE_MS);

    async function autosaveStep(step) {
      const data = extractStepData(step);
      if (Object.keys(data).length > 0) {
        showSaving("Sauvegarde...", "bg-blue-500");
        await autosave(data);
      } else {
        console.warn(`⚠️ No data to save for step: ${step}`);
      }
    }

    async function saveAllFormData() {
          const allData = extractAllFormData();
          if (Object.keys(allData).length > 0) {
            console.log("💾 Saving ALL form data (force complete save):", allData);
            showSaving("Sauvegarde complète...", "bg-blue-500");

            try {
              // 🔥 Sauvegarder directement TOUTES les données sans fusion
              const response = await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: allData }),
              });
              console.log(`✅ Complete save response:`, response);
              showSaving("Toutes données sauvées", "bg-green-500");
            } catch (e) {
              console.error("❌ Complete save error:", e);
              showSaving("Erreur sauvegarde complète", "bg-red-500");
              throw e;
            }
          } else {
            console.warn("⚠️ No form data to save");
          }
        }

    async function submitDraft() {
          try {
            btnSubmit && btnSubmit.setAttribute("disabled", "true");
            $("#loading-spinner") && $("#loading-spinner").classList.remove("hidden");
            $("#submit-icon") && $("#submit-icon").classList.add("hidden");
            if ($("#submit-text")) $("#submit-text").textContent = "Génération en cours...";

            console.log("🚀 Starting submit process...");

            // 🔥 CORRECTION : Double sauvegarde pour être sûr
            console.log("💾 Step 1: Save all form data...");
            await saveAllFormData();

            console.log("💾 Step 2: Wait and verify...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Plus de temps

            // 🔥 VÉRIFICATION : S'assurer que les données sont bien sauvées
            console.log("🔍 Step 3: Verify draft contains all data...");
            const verifyDraft = await window.debugFormDraft.checkDraft();
            console.log("📋 Draft verification:", verifyDraft);

            if (!verifyDraft.data || Object.keys(verifyDraft.data).length < 5) {
              console.error("❌ Draft verification failed - not enough data saved");
              throw new Error("Les données du formulaire n'ont pas été sauvegardées correctement. Veuillez réessayer.");
            }

            // Debug: vérifier que les données sont bien remplies
            console.log("📋 Step 4: Final form data check:");
            const allFormData = new FormData(form);
            for (let [key, value] of allFormData.entries()) {
              console.log(`  ${key}: ${value}`);
            }

            // 🔥 RÉCUPÉRER LA RÉPONSE pour obtenir l'ID de lettre
            console.log(`📤 Step 5: Submitting to: ${API_BASE}/submit/${encodeURIComponent(formSlug)}`);
            const response = await fetchJSON(`${API_BASE}/submit/${encodeURIComponent(formSlug)}`, {
              method: "POST",
            });

            console.log('📋 Réponse submit:', response);

            // 🔥 STOCKER l'ID de lettre dans sessionStorage
            if (response && response.letter_id) {
              sessionStorage.setItem('currentLetterId', response.letter_id);
              console.log('✅ Letter ID stocké:', response.letter_id);
            } else {
              console.warn('⚠️ Aucun letter_id dans la réponse:', response);
            }

            // Redirection vers /resultats
            console.log("🔄 Redirecting to /resultats");
            window.location.href = "/resultats";

          } catch (e) {
            console.error('❌ Erreur lors de la soumission:', e);

            // Afficher plus de détails sur l'erreur
            if (e.message.includes("Missing fields") || e.message.includes("too short")) {
              alert(`Erreur de données : ${e.message}\n\nVeuillez vérifier que tous les champs obligatoires sont bien remplis et réessayez.`);
            } else if (e.message.includes("sauvegardées")) {
              alert(`${e.message}\n\nVeuillez rafraîchir la page et recommencer.`);
            } else {
              alert(`Erreur lors de la génération: ${e.message}`);
            }
          } finally {
            btnSubmit && btnSubmit.removeAttribute("disabled");
            $("#loading-spinner") && $("#loading-spinner").classList.add("hidden");
            $("#submit-icon") && $("#submit-icon").classList.remove("hidden");
            if ($("#submit-text")) $("#submit-text").textContent = "Générer ma lettre de mise en demeure";
          }
        }

    // --- Navigation d'étapes ---
    function goToStep(step) {
      // 1) Valide l'étape courante
      validateStep(currentStep);

      // 2) Cache toutes les étapes
      steps.forEach((s) => {
        const el = document.querySelector(stepKeyToDOMId(s));
        if (el) el.classList.add("hidden");
      });

      // 3) Affiche l'étape cible
      const target = document.querySelector(stepKeyToDOMId(step));
      if (target) target.classList.remove("hidden");

      // 4) Autosave non bloquant de l'étape qu'on quitte
      void autosaveStep(currentStep);

      // 5) Met à jour l'état UI
      currentStep = step;
      updateStepIndicators();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Boutons de navigation
    $("#continue-seller-info") && $("#continue-seller-info").addEventListener("click", () => goToStep("seller_info"));
    $("#continue-purchase-info") && $("#continue-purchase-info").addEventListener("click", () => goToStep("purchase_info"));
    $("#continue-problem-info") && $("#continue-problem-info").addEventListener("click", () => goToStep("problem_info"));
    $("#back-to-buyer-info") && $("#back-to-buyer-info").addEventListener("click", () => goToStep("buyer_info"));
    $("#back-to-seller-info") && $("#back-to-seller-info").addEventListener("click", () => goToStep("seller_info"));
    $("#back-to-purchase-info") && $("#back-to-purchase-info").addEventListener("click", () => goToStep("purchase_info"));

    // 🔥 CORRECTION : Améliorer les event listeners
    $$('input[data-step], textarea[data-step], select[data-step]', form).forEach((el) => {
      // Validation et sauvegarde en temps réel
      el.addEventListener("input", () => {
        updateProgress();
        validateField(el, false);

        // 🔥 Sauvegarder les données de l'étape courante
        autosaveStep(currentStep);
      });

      el.addEventListener("blur", () => {
        validateField(el, true);

        // 🔥 Sauvegarder après avoir quitté le champ
        autosaveStep(currentStep);
      });

      // 🔥 AJOUT : Sauvegarder aussi au changement (pour les selects)
      el.addEventListener("change", () => {
        updateProgress();
        validateField(el, true);
        autosaveStep(currentStep);
      });
    });

    // Radio styles
    $$('input[type="radio"]', form).forEach((radio) => {
      radio.addEventListener("change", () => {
        const group = $$(`input[name="${radio.name}"]`, form);
        group.forEach((r) => {
          const option = r.closest(".defect-option");
          const indicator = option ? option.querySelector(".radio-indicator") : null;
          if (!option || !indicator) return;
          const on = r.checked;
          option.classList.toggle("border-blue-500", on);
          option.classList.toggle("bg-blue-50", on);
          option.classList.toggle("border-gray-200", !on);
          indicator.classList.toggle("bg-blue-500", on);
          indicator.classList.toggle("border-blue-500", on);
          indicator.classList.toggle("border-gray-300", !on);
        });

        // 🔥 AJOUT : Sauvegarder après changement de radio
        updateProgress();
        autosaveStep(currentStep);
      });
    });

    // Date max aujourd'hui
    const purchaseDate = $("#purchase-date");
    if (purchaseDate) {
      const today = new Date().toISOString().split("T")[0];
      purchaseDate.setAttribute("max", today);
    }

    // Submit handler
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Valider toutes les étapes
      for (const s of steps) {
        if (!validateStep(s)) {
          goToStep(s);
          return;
        }
      }
      void submitDraft();
    });

    // Boot - afficher l'étape 1 au chargement
    steps.forEach((s, i) => {
      const el = document.querySelector(stepKeyToDOMId(s));
      if (el) el.classList.toggle("hidden", i !== 0);
    });

    void loadDraft();
    updateProgress();
    updateStepIndicators();

    // 🔥 AJOUT : Bouton de debug manuel
    console.log("🔧 Adding debug helpers to window object");
    window.debugFormDraft = {
      extractAllData: extractAllFormData,
      saveAll: saveAllFormData,
      checkDraft: async () => {
        try {
          const draftResponse = await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`);
          console.log("📋 Current draft:", draftResponse);
          return draftResponse;
        } catch (e) {
          console.error("❌ Error fetching draft:", e);
        }
      }
    };

    console.log("💪 JMD form_draft.js initialisé avec support letter_id et debug complet");
    console.log("💡 Debug helper available: window.debugFormDraft.checkDraft()");
  };
})();

// Boot auto quand le DOM est prêt
function boot() {
  if (window.JMD && typeof window.JMD.initDraftForm === "function") {
    window.JMD.initDraftForm();
  } else {
    console.error("JMD.initDraftForm introuvable");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}