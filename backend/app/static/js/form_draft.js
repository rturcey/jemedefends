(function () {
  const API_BASE = "/api/v1/form-drafts";
  const DEFAULT_FORM_SLUG = "mise_en_demeure_v1";
  const DEBOUNCE_MS = 500;
  const ADDRESS_DEBOUNCE_MS = 200;

  const isProduction =
    window.location.hostname === "jeme-defends.com" ||
    window.location.hostname.includes("production");

  // Utils avec noms uniques pour éviter les conflits
  const selectElement = (sel, root = document) => root.querySelector(sel);
  const selectElements = (sel, root = document) => root.querySelectorAll(sel);
  const debounce = (fn, delay) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const STEPS = [
    {
      id: "buyer_info",
      title: "Vos informations",
      fields: [
        "buyer_name",
        "buyer_address_line_1",
        "buyer_postal_code",
        "buyer_city",
        "buyer_country",
      ],
    },
    {
      id: "seller_info",
      title: "Informations vendeur",
      fields: [
        "seller_name",
        "seller_address_line_1",
        "seller_postal_code",
        "seller_city",
        "seller_country",
      ],
    },
    {
      id: "purchase_info",
      title: "Informations achat",
      fields: [
        "product_name",
        "purchase_date",
        "product_price",
        "product_condition",
      ],
    },
    {
      id: "problem_info",
      title: "Description du problème",
      fields: ["defect_type", "defect_description"],
    },
  ];

  // API helper
  async function fetchJSON(url, opts = {}) {
    const res = await fetch(url, { credentials: "include", ...opts });
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j?.detail) msg = j.detail;
      } catch {}
      throw new Error(msg);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  }

  // Address autocomplete
  class AddressAutocomplete {
    constructor(prefix) {
      this.prefix = prefix;
      this.input = selectElement(`#${prefix}-address`);
      this.suggestions = selectElement(`#${prefix}-address-suggestions`);
      this.line1 = selectElement(`#${prefix}-address-line1`);
      this.line2 = selectElement(`#${prefix}-address-line2`);
      this.postalCode = selectElement(`#${prefix}-postal-code`);
      this.city = selectElement(`#${prefix}-city`);
      this.country = selectElement(`#${prefix}-country`);
      this.debounceTimer = null;
      this.isSelecting = false;
      this.currentFeatures = [];

      this.init();
    }

    init() {
      if (!this.input || !this.suggestions) return;

      this.input.addEventListener("input", this.handleInput.bind(this));
      this.input.addEventListener("focus", this.handleFocus.bind(this));
      this.input.addEventListener("blur", this.handleBlur.bind(this));
      this.input.addEventListener("keydown", this.handleKeydown.bind(this));

      // Sync subfields back to main condensed field
      [this.line1, this.line2, this.postalCode, this.city].forEach((field) => {
        if (field) {
          field.addEventListener(
            "input",
            debounce(this.updateMainField.bind(this), 300),
          );
          field.addEventListener("blur", this.updateMainField.bind(this));
          field.addEventListener("input", () => {
            window.JMD?.__formManager?.stepManager?.updateNavigationButtons();
          });
        }
      });

      document.addEventListener("click", this.handleOutsideClick.bind(this));
    }

    handleInput(e) {
      if (this.isSelecting) return;

      const query = e.target.value.trim();
      if (query.length < 3) {
        this.hideSuggestions();
        return;
      }
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(
        () => this.searchAddresses(query),
        ADDRESS_DEBOUNCE_MS,
      );
    }

    handleFocus() {
      const query = this.input.value.trim();
      if (query.length >= 3 && !this.isSelecting) {
        this.searchAddresses(query);
      }
    }

    handleBlur() {
      setTimeout(() => {
        if (!this.isSelecting) {
          this.hideSuggestions();
        }
      }, 100);
    }

    handleKeydown(e) {
      const items = Array.from(
        selectElements(".suggestion-item", this.suggestions),
      );
      const active = selectElement(".suggestion-item.active", this.suggestions);
      const activeIndex = items.indexOf(active);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (items.length === 0) return;
          if (activeIndex === -1) {
            items[0].classList.add("active");
            items[0].setAttribute("aria-selected", "true");
          } else {
            items[activeIndex].classList.remove("active");
            items[activeIndex].setAttribute("aria-selected", "false");
            const next = items[(activeIndex + 1) % items.length];
            next.classList.add("active");
            next.setAttribute("aria-selected", "true");
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (items.length === 0) return;
          if (activeIndex === -1) {
            const last = items[items.length - 1];
            last.classList.add("active");
            last.setAttribute("aria-selected", "true");
          } else {
            items[activeIndex].classList.remove("active");
            items[activeIndex].setAttribute("aria-selected", "false");
            const prev = items[(activeIndex - 1 + items.length) % items.length];
            prev.classList.add("active");
            prev.setAttribute("aria-selected", "true");
          }
          break;

        case "Enter":
          e.preventDefault();
          if (activeIndex !== -1) {
            this.selectAddress(this.currentFeatures[activeIndex]);
          }
          break;

        case "Escape":
          this.hideSuggestions();
          break;
      }
    }

    handleOutsideClick(e) {
      const inMain = !!e.target.closest(`#${this.prefix}-address`);
      const inSug = !!e.target.closest(`#${this.prefix}-address-suggestions`);
      if (!inMain && !inSug && !this.isSelecting) {
        this.hideSuggestions();
      }
    }

    async searchAddresses(query) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`,
          { signal: controller.signal, mode: "cors" },
        );
        clearTimeout(id);
        const data = await response.json();
        this.displaySuggestions(data.features || []);
      } catch (error) {
        console.error("Erreur recherche adresse:", error);
        this.showError("Erreur lors de la recherche d'adresse");
      }
    }

    displaySuggestions(features) {
      this.currentFeatures = features;
      if (!features.length) {
        this.hideSuggestions();
        return;
      }

      this.suggestions.innerHTML = features
        .map((feature, index) => {
          const props = feature.properties || {};
          return `
            <div class="suggestion-item p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === 0 ? "active" : ""}"
                 data-index="${index}"
                 role="option"
                 aria-selected="${index === 0}">
              <div class="font-medium text-gray-900">${props.label || ""}</div>
              <div class="text-sm text-gray-500">${props.context || ""}</div>
            </div>
          `;
        })
        .join("");

      this.suggestions.classList.remove("hidden");
      this.suggestions.setAttribute("role", "listbox");

      selectElements(".suggestion-item", this.suggestions).forEach((item) => {
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const idx = Number(item.getAttribute("data-index"));
          if (!Number.isNaN(idx)) {
            this.selectAddress(this.currentFeatures[idx]);
          }
        });

        item.addEventListener("mouseenter", () => {
          selectElements(".suggestion-item.active", this.suggestions).forEach(
            (el) => {
              el.classList.remove("active");
              el.setAttribute("aria-selected", "false");
            },
          );
          item.classList.add("active");
          item.setAttribute("aria-selected", "true");
        });
      });
    }

    selectAddress(feature) {
      const props = feature?.properties || {};
      this.isSelecting = true;

      this.hideSuggestions();

      if (this.input) this.input.value = "";

      if (this.line1)
        this.line1.value =
          `${props.housenumber || ""} ${props.street || ""}`.trim();
      if (this.postalCode) this.postalCode.value = props.postcode || "";
      if (this.city) this.city.value = props.city || "";
      if (this.country && props.country_code)
        this.country.value = (props.country_code || "FR").toUpperCase();

      setTimeout(() => {
        this.isSelecting = false;
        [this.line1, this.postalCode, this.city].forEach((field) => {
          if (field && field.value.trim()) {
            field.dispatchEvent(new Event("input", { bubbles: true }));
            field.dispatchEvent(new Event("blur", { bubbles: true }));
          }
        });
        if (window.JMD?.__formManager?.stepManager) {
          window.JMD.__formManager.stepManager.updateNavigationButtons();
        }

        setTimeout(() => {
          console.log("🔍 AUTO DEBUG après sélection d'adresse:");
          if (window.debugValidation) window.debugValidation();
        }, 100);
      }, 50);
    }

    updateMainField() {
      if (this.isSelecting) return;

      const parts = [
        this.line1?.value?.trim(),
        this.line2?.value?.trim(),
        `${this.postalCode?.value?.trim() || ""} ${this.city?.value?.trim() || ""}`.trim(),
      ].filter(Boolean);

      const condensed = parts.join(", ");
      if (condensed && this.input) {
        this.isSelecting = true;
        this.input.value = condensed;
        setTimeout(() => {
          this.isSelecting = false;
        }, 100);
      }
    }

    triggerValidation() {
      [this.input, this.line1, this.postalCode, this.city].forEach((field) => {
        if (field) {
          field.dispatchEvent(new Event("input", { bubbles: true }));
          field.dispatchEvent(new Event("blur", { bubbles: true }));
        }
      });
    }

    hideSuggestions() {
      if (!this.suggestions) return;
      this.suggestions.classList.add("hidden");
      this.suggestions.removeAttribute("role");
      this.suggestions.innerHTML = "";
      this.currentFeatures = [];
    }

    showError(message) {
      console.error(message);
    }
  }

  // Fonction debug (en dehors de la classe)
  function debugValidation() {
    const stepManager = window.JMD?.__formManager?.stepManager;
    if (!stepManager) {
      console.log("❌ Pas de stepManager");
      return;
    }

    const currentStep = STEPS[stepManager.currentStepIndex];
    console.log("🔍 Current step:", currentStep.id);
    console.log("🔍 Required fields:", currentStep.fields);

    let allValid = true;

    currentStep.fields.forEach((fieldName) => {
      const field = document.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const value = field.value?.trim() || "";
        const hasValue = value.length > 0;
        const validationResult = stepManager.validation.validateField(field);
        const isValid = validationResult.valid;

        console.log(`  📋 ${fieldName}:`);
        console.log(`     Value: "${value}"`);
        console.log(`     Has value: ${hasValue}`);
        console.log(`     Is valid: ${isValid}`);
        console.log(`     Error: "${validationResult.message}"`);

        if (!isValid || !hasValue) {
          allValid = false;
        }
      } else {
        const radios = document.querySelectorAll(`[name="${fieldName}"]`);
        if (radios.length > 0) {
          const isChecked = Array.from(radios).some((radio) => radio.checked);
          console.log(
            `  🔘 ${fieldName} (radio): ${isChecked ? "checked" : "not checked"}`,
          );
          if (!isChecked) allValid = false;
        } else {
          console.log(`  ❌ ${fieldName}: champ introuvable`);
          allValid = false;
        }
      }
    });

    console.log("🚀 All fields valid:", allValid);
    console.log(
      "🚀 Can continue (validateStep):",
      stepManager.validation.validateStep(currentStep.id),
    );

    const continueBtn = document.querySelector("#continue-seller-info");
    if (continueBtn) {
      console.log("🔘 Button disabled:", continueBtn.disabled);
    }
  }

  // Validation
  class ValidationManager {
    constructor() {
      this.hasInteracted = new Set();
      this.validators = {
        required: (value) => value.trim().length > 0,
        email: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        minLength: (value, min) => value.length >= Number(min),
        maxLength: (value, max) => value.length <= Number(max),
        pattern: (value, pattern) => {
          const source =
            typeof pattern === "string" ? pattern : String(pattern);
          const anchored = `^(?:${source})$`;
          return new RegExp(anchored).test(value);
        },
        number: (value) => !value || (!isNaN(value) && parseFloat(value) >= 0),
      };
    }

    markInteracted(field) {
      if (field?.name) {
        this.hasInteracted.add(field.name);
      }
    }

    validateField(field) {
      if (!field) return { valid: true, message: "" };

      const value = (field.value || "").trim();
      const rules = this.getFieldRules(field);

      for (const rule of rules) {
        const result = this.applyRule(value, rule);
        if (!result.valid) return result;
      }
      return { valid: true, message: "" };
    }

    getFieldRules(field) {
      const rules = [];

      if (field.required)
        rules.push({ type: "required", message: "Ce champ est requis" });
      if (field.type === "email")
        rules.push({ type: "email", message: "Format d'email invalide" });
      if (field.type === "number")
        rules.push({
          type: "number",
          message: "Veuillez saisir un montant valide",
        });

      if (typeof field.minLength === "number" && field.minLength >= 0) {
        rules.push({
          type: "minLength",
          value: field.minLength,
          message: `Minimum ${field.minLength} caractères`,
        });
      }
      if (typeof field.maxLength === "number" && field.maxLength >= 0) {
        rules.push({
          type: "maxLength",
          value: field.maxLength,
          message: `Maximum ${field.maxLength} caractères`,
        });
      }

      if (field.pattern)
        rules.push({
          type: "pattern",
          value: field.pattern,
          message: "Format invalide",
        });

      return rules;
    }

    applyRule(value, rule) {
      const validator = this.validators[rule.type];
      if (!validator) return { valid: true, message: "" };
      const valid =
        rule.value !== undefined
          ? validator(value, rule.value)
          : validator(value);
      return { valid, message: valid ? "" : rule.message };
    }

    showFieldError(field, message) {
      if (message && field?.name && !this.hasInteracted.has(field.name)) {
        return;
      }

      const parent = field.closest(".form-group");
      if (!parent) return;

      const errorEl = parent.querySelector(".error-message");
      const checkEl = parent.querySelector('[id$="-check"]');
      const fieldGroup = parent.querySelector(".field-group");

      if (message) {
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.classList.remove("hidden");
          errorEl.setAttribute("role", "alert");
        }
        if (fieldGroup) fieldGroup.classList.add("error");
        if (checkEl) checkEl.style.opacity = "0";
        field.setAttribute("aria-invalid", "true");
      } else {
        if (errorEl) {
          errorEl.classList.add("hidden");
          errorEl.removeAttribute("role");
        }
        if (fieldGroup) {
          fieldGroup.classList.remove("error");
          fieldGroup.classList.add("valid");
        }
        if (checkEl) checkEl.style.opacity = "1";
        field.setAttribute("aria-invalid", "false");
      }
    }

    validateStep(stepId) {
      const step = STEPS.find((s) => s.id === stepId);
      if (!step) return true;

      let isValid = true;

      step.fields.forEach((fieldName) => {
        let field = selectElement(`[name="${fieldName}"]`);

        if (!field) {
          const radios = selectElements(`[name="${fieldName}"]`);
          if (radios.length > 0) {
            field = radios[0];
            const isChecked = Array.from(radios).some((radio) => radio.checked);
            if (!isChecked) {
              const fieldset =
                radios[0].closest("fieldset") ||
                radios[0].closest(".form-group");
              if (fieldset) {
                const errorEl = fieldset.querySelector(".error-message");
                if (errorEl && this.hasInteracted.has(fieldName)) {
                  errorEl.textContent = "Ce champ est requis";
                  errorEl.classList.remove("hidden");
                  errorEl.setAttribute("role", "alert");
                }
              }
              isValid = false;
              return;
            } else {
              const fieldset =
                radios[0].closest("fieldset") ||
                radios[0].closest(".form-group");
              if (fieldset) {
                const errorEl = fieldset.querySelector(".error-message");
                if (errorEl) {
                  errorEl.classList.add("hidden");
                  errorEl.removeAttribute("role");
                }
              }
            }
          }
        } else {
          const result = this.validateField(field);
          this.showFieldError(field, result.message);
          if (!result.valid) isValid = false;
        }
      });

      return isValid;
    }
  }

  // Step manager
  class StepManager {
    constructor() {
      this.currentStepIndex = 0;
      this.validation = new ValidationManager();
    }

    getCurrentStep() {
      return STEPS[this.currentStepIndex];
    }

    canGoToStep(targetIndex) {
      for (let i = 0; i < targetIndex; i++) {
        if (!this.validation.validateStep(STEPS[i].id)) return false;
      }
      return true;
    }

    goToStep(targetIndex, force = false) {
      if (!force && !this.canGoToStep(targetIndex)) {
        this.showStepErrors(targetIndex);
        return false;
      }

      const curr = selectElement(
        `#step-${STEPS[this.currentStepIndex].id.replace(/_/g, "-")}`,
      );
      if (curr) {
        curr.classList.remove("active");
        curr.classList.add("hidden");
      }

      this.currentStepIndex = targetIndex;
      const next = selectElement(
        `#step-${STEPS[this.currentStepIndex].id.replace(/_/g, "-")}`,
      );
      if (next) {
        next.classList.remove("hidden");
        next.classList.add("active");
      }

      this.updateStepIndicators();
      this.updateNavigationButtons();
      this.updateMobileCounter();
      this.scrollToTop();

      const firstField = next?.querySelector("input, textarea, select");
      if (firstField) setTimeout(() => firstField.focus(), 100);

      return true;
    }

    showStepErrors(targetIndex) {
      for (let i = 0; i < targetIndex; i++)
        this.validation.validateStep(STEPS[i].id);

      for (let i = 0; i < targetIndex; i++) {
        if (!this.validation.validateStep(STEPS[i].id)) {
          this.goToStep(i, true);
          break;
        }
      }
    }

    nextStep() {
      if (this.currentStepIndex < STEPS.length - 1) {
        return this.goToStep(this.currentStepIndex + 1);
      }
      return false;
    }

    prevStep() {
      if (this.currentStepIndex > 0) {
        return this.goToStep(this.currentStepIndex - 1, true);
      }
      return false;
    }

    updateStepIndicators() {
      selectElements(".step-indicator").forEach((indicator, index) => {
        indicator.classList.remove("active", "completed", "pending");
        indicator.setAttribute("aria-selected", "false");
        indicator.setAttribute("tabindex", "-1");

        if (index === this.currentStepIndex) {
          indicator.classList.add("active");
          indicator.setAttribute("aria-selected", "true");
          indicator.setAttribute("tabindex", "0");
        } else if (index < this.currentStepIndex) {
          indicator.classList.add("completed");
        } else {
          indicator.classList.add("pending");
        }
      });
    }

    updateNavigationButtons() {
      const prevBtn = selectElement("#mobile-prev");
      const nextBtn = selectElement("#mobile-next");

      const continueButtons = [
        "#continue-seller-info",
        "#continue-purchase-info",
        "#continue-problem-info",
        "#submit-btn",
      ];

      if (prevBtn) prevBtn.disabled = this.currentStepIndex === 0;

      const canContinue = this.validation.validateStep(
        STEPS[this.currentStepIndex].id,
      );

      if (nextBtn) {
        nextBtn.disabled = !canContinue;
        const labelEl = nextBtn.querySelector("span") || nextBtn;
        labelEl.textContent =
          this.currentStepIndex === STEPS.length - 1 ? "Générer" : "Suivant";
      }

      const currentBtn = selectElement(continueButtons[this.currentStepIndex]);
      if (currentBtn) currentBtn.disabled = !canContinue;
    }

    updateMobileCounter() {
      const counter = selectElement("#mobile-step-counter");
      if (counter)
        counter.textContent = `${this.currentStepIndex + 1} / ${STEPS.length}`;
    }

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Main form
  class FormManager {
    constructor() {
      this.form = selectElement("#letter-form");
      this.progressBar = selectElement("#progress-bar");
      this.progressPercent = selectElement("#progress-percent");
      this.saveIndicator = selectElement("#auto-save-indicator");
      this.saveStatus = selectElement("#save-status");

      this.stepManager = new StepManager();
      this.validation = new ValidationManager();
      this.addressAutocompletes = {};

      this.formSlug = this.form?.dataset?.formSlug || DEFAULT_FORM_SLUG;
      this.draft = null;
      this.autosaveTimer = null;

      this.init();
    }

    init() {
      if (!this.form) return;

      if (this.progressBar) {
        this.progressBar.style.width = "0%";
        this.progressBar.setAttribute("aria-valuenow", "0");
      }
      if (this.progressPercent)
        this.progressPercent.textContent = "0% complété";

      this.initAddressAutocomplete();
      this.initEventListeners();
      this.initTestData();
      this.loadDraft();
      this.updateProgress();
      this.stepManager.updateStepIndicators();
      this.stepManager.updateNavigationButtons();
      window.JMD = window.JMD || {};
      window.JMD.__formManager = this;
    }

    initAddressAutocomplete() {
      if (selectElement("#buyer-address"))
        this.addressAutocompletes.buyer = new AddressAutocomplete("buyer");
      if (selectElement("#seller-address"))
        this.addressAutocompletes.seller = new AddressAutocomplete("seller");
    }

    initEventListeners() {
      selectElements(
        "#letter-form input, #letter-form textarea, #letter-form select",
      ).forEach((field) => {
        const markInteraction = () => {
          this.validation.markInteracted(field);
        };

        field.addEventListener("focus", markInteraction, { once: true });
        field.addEventListener("input", markInteraction, { once: true });

        field.addEventListener(
          "input",
          debounce(() => {
            this.validateFieldRealTime(field);
            this.updateProgress();
            this.stepManager.updateNavigationButtons();
            this.scheduleAutosave();
          }, 300),
        );
        field.addEventListener("blur", () => this.validateFieldRealTime(field));

        if (field.type === "radio") {
          field.addEventListener("change", () => {
            this.validation.markInteracted(field);
            this.updateProgress();
            this.stepManager.updateNavigationButtons();
            this.scheduleAutosave();
          });
        }
      });

      selectElements(".step-indicator").forEach((indicator, index) => {
        indicator.addEventListener("click", () =>
          this.stepManager.goToStep(index),
        );
        indicator.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.stepManager.goToStep(index);
          }
        });
      });

      selectElement("#mobile-prev")?.addEventListener("click", () =>
        this.stepManager.prevStep(),
      );
      selectElement("#mobile-next")?.addEventListener("click", () =>
        this.stepManager.nextStep(),
      );

      selectElement("#back-to-buyer-info")?.addEventListener("click", () =>
        this.stepManager.goToStep(0, true),
      );
      selectElement("#back-to-seller-info")?.addEventListener("click", () =>
        this.stepManager.goToStep(1, true),
      );
      selectElement("#back-to-purchase-info")?.addEventListener("click", () =>
        this.stepManager.goToStep(2, true),
      );

      selectElement("#continue-seller-info")?.addEventListener("click", () =>
        this.stepManager.nextStep(),
      );
      selectElement("#continue-purchase-info")?.addEventListener("click", () =>
        this.stepManager.nextStep(),
      );
      selectElement("#continue-problem-info")?.addEventListener("click", () =>
        this.stepManager.nextStep(),
      );

      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.submitForm();
      });

      this.form.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA")
          e.preventDefault();
      });

      const purchaseDateEl = selectElement("#purchase-date");
      if (purchaseDateEl) {
        const today = new Date().toISOString().split("T")[0];
        purchaseDateEl.setAttribute("max", today);
      }
    }

    initTestData() {
      if (isProduction) return;
      const testContainer = selectElement("#test-fill-container");
      if (testContainer) {
        testContainer.style.display = "block";
        selectElement("#test-fill-btn")?.addEventListener("click", () =>
          this.fillTestData(),
        );
      }
    }

    fillTestData() {
      const testData = {
        buyer_name: "Jean Dupont",
        buyer_address_line_1: "123 rue de la République",
        buyer_postal_code: "75001",
        buyer_city: "Paris",
        buyer_country: "FR",
        seller_name: "TechStore SARL",
        seller_address_line_1: "456 avenue du Commerce",
        seller_postal_code: "69000",
        seller_city: "Lyon",
        seller_country: "FR",
        product_name: "Smartphone XYZ Pro 256GB",
        purchase_date: "2024-06-15",
        product_price: "899",
        product_condition: "used",
        defect_type: "fonctionnement",
        defect_description:
          "L'écran présente des lignes verticales noires permanentes qui rendent l'appareil inutilisable. Le problème est apparu spontanément après seulement 2 mois d'utilisation normale.",
      };

      Object.entries(testData).forEach(([name, value]) => {
        const field = document.querySelector(`[name="${name}"]`);
        if (!field) return;
        if (field.type === "radio") {
          const radio = document.querySelector(
            `[name="${name}"][value="${value}"]`,
          );
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event("change", { bubbles: true }));
          }
        } else {
          field.value = value;
          field.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });

      const buyerAddress = selectElement("#buyer-address");
      const sellerAddress = selectElement("#seller-address");
      if (buyerAddress)
        buyerAddress.value = "123 rue de la République, 75001 Paris";
      if (sellerAddress)
        sellerAddress.value = "456 avenue du Commerce, 69000 Lyon";

      this.updateProgress();
      this.stepManager.updateNavigationButtons();
    }

    updateProgress() {
      let totalWeight = 0;
      let completedWeight = 0;

      STEPS.forEach((step) => {
        const stepWeight = 25;
        totalWeight += stepWeight;

        const requiredFields = step.fields.filter(
          (f) => !f.includes("_line_2"),
        );
        let validFieldsCount = 0;

        requiredFields.forEach((fieldName) => {
          let field = document.querySelector(`[name="${fieldName}"]`);

          if (!field || field.type === "radio") {
            const radios = document.querySelectorAll(`[name="${fieldName}"]`);
            if (radios.length > 0) {
              const isChecked = Array.from(radios).some(
                (radio) => radio.checked,
              );
              if (isChecked) validFieldsCount++;
            }
          } else {
            const isValid = this.validation.validateField(field).valid;
            const hasValue = (field.value || "").trim().length > 0;
            if (isValid && hasValue) validFieldsCount++;
          }
        });

        const stepCompletion =
          requiredFields.length > 0
            ? (validFieldsCount / requiredFields.length) * stepWeight
            : 0;

        completedWeight += stepCompletion;
      });

      const percentage = Math.round(Math.min(completedWeight, 100));

      if (this.progressBar) {
        const from = parseFloat(this.progressBar.style.width) || 0;
        this.progressBar.style.setProperty("--from", `${from}%`);
        this.progressBar.style.setProperty("--to", `${percentage}%`);
        this.progressBar.style.animation = "none";
        void this.progressBar.offsetWidth;
        this.progressBar.style.animation =
          "growBar 600ms var(--ease-out) forwards";
        this.progressBar.style.width = `${percentage}%`;
        this.progressBar.setAttribute("aria-valuenow", String(percentage));
      }

      if (this.progressPercent)
        this.progressPercent.textContent = `${percentage}% complété`;
    }

    validateFieldRealTime(field) {
      const result = this.validation.validateField(field);
      this.validation.showFieldError(field, result.message);
      return result.valid;
    }

    scheduleAutosave() {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = setTimeout(() => {
        this.autosave();
      }, DEBOUNCE_MS);
    }

    extractFormData() {
      const data = {};
      selectElements("#letter-form [data-step]").forEach((field) => {
        if (!field.name) return;
        if (field.type === "radio") {
          if (field.checked) data[field.name] = field.value;
        } else if ((field.value || "").trim()) {
          data[field.name] = field.value.trim();
        }
      });

      const purchaseDate =
        selectElement("#purchase-date")?.value ||
        selectElement('[name="purchase_date"]')?.value;
      const condition =
        document.querySelector('input[name="product_condition"]:checked')
          ?.value || "new";
      if (purchaseDate) {
        const purchaseDateObj = new Date(purchaseDate);
        const now = new Date();
        const monthsDiff =
          (now.getFullYear() - purchaseDateObj.getFullYear()) * 12 +
          (now.getMonth() - purchaseDateObj.getMonth());

        data.used = condition === "used";
        data.presumption_limit_months = condition === "used" ? 12 : 24;
        data.presumption_months_since_delivery = monthsDiff;
        data.presumption_active =
          monthsDiff <= (condition === "used" ? 12 : 24);
      }

      return data;
    }

    populateForm(data) {
      Object.entries(data || {}).forEach(([name, value]) => {
        const field = document.querySelector(`[name="${name}"]`);
        if (!field) return;
        if (field.type === "radio") {
          const radio = document.querySelector(
            `[name="${name}"][value="${value}"]`,
          );
          if (radio) radio.checked = true;
        } else {
          field.value = value;
        }
        field.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }

    showSaveStatus(message, type) {
      if (!this.saveIndicator || !this.saveStatus) return;

      this.saveIndicator.classList.remove("success", "error", "saving");
      this.saveIndicator.classList.add(type);
      this.saveStatus.textContent = message;
      this.saveIndicator.classList.add("show");

      if (type !== "saving") {
        setTimeout(() => {
          this.saveIndicator.classList.remove("show");
        }, 2000);
      }
    }

    async autosave() {
      try {
        const data = this.extractFormData();
        if (Object.keys(data).length === 0) return;

        this.showSaveStatus("Sauvegarde...", "saving");

        await fetchJSON(`${API_BASE}/${encodeURIComponent(this.formSlug)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });

        this.showSaveStatus("Sauvegardé", "success");
      } catch (error) {
        console.error("Erreur autosave:", error);
        this.showSaveStatus("Erreur sauvegarde", "error");
      }
    }

    async loadDraft() {
      try {
        const draft = await fetchJSON(
          `${API_BASE}/${encodeURIComponent(this.formSlug)}`,
        );
        if (draft?.data) {
          this.populateForm(draft.data);
          this.draft = draft;
        }
      } catch (error) {
        console.error("Erreur chargement draft:", error);
      }
    }

    async submitForm() {
      try {
        let firstInvalidIndex = null;
        STEPS.forEach((step, index) => {
          if (
            !this.validation.validateStep(step.id) &&
            firstInvalidIndex === null
          ) {
            firstInvalidIndex = index;
          }
        });

        if (firstInvalidIndex !== null) {
          this.stepManager.goToStep(firstInvalidIndex, true);
          this.showSaveStatus("Veuillez corriger les erreurs", "error");
          return;
        }

        this.showSaveStatus("Génération en cours...", "saving");

        const data = this.extractFormData();
        await fetchJSON(`${API_BASE}/${encodeURIComponent(this.formSlug)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });

        const result = await fetchJSON(
          `${API_BASE}/submit/${encodeURIComponent(this.formSlug)}`,
          { method: "POST", headers: { "Content-Type": "application/json" } },
        );

        if (result.redirect_url) {
          window.location.href = result.redirect_url;
        } else {
          this.showSaveStatus("Lettre générée avec succès!", "success");
        }
      } catch (error) {
        console.error("Erreur soumission:", error);
        this.showSaveStatus(`Erreur: ${error.message}`, "error");
      }
    }
  }

  // Init hook
  window.JMD = window.JMD || {};
  window.JMD.initDraftForm = function () {
    new FormManager();
  };

  // Export debug function
  window.debugValidation = debugValidation;

  // Auto-boot
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
})();
