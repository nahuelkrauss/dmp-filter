(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const fileInput = $("#fileInput");
  const dropZone = $("#dropZone");
  const toast = $("#toast");
  const PAGE_SIZE = 25;
  const DEFAULT_COLUMNS = [
    "SR #", "Project Name", "Workflow Phase", "Request Status",
    "Service", "Pfizer Digital Project Manager", "Ready to invoice", "Target Date"
  ];
  const CATEGORY_FIELDS = new Set([
    "Workflow Phase", "Request Status", "Service", "Service Group", "Service Type",
    "Pfizer Digital Project Manager", "Pfizer Digital Status", "Region", "Country",
    "Business Unit", "Finance Validation", "Asset Status"
  ]);
  const DATE_FIELD = /date|updated/i;
  const translations = {
    es: {
      "nav.aria": "Navegación principal", "nav.workspace": "ESPACIO", "nav.requests": "Solicitudes",
      "nav.import": "Importar datos", "nav.local": "Procesamiento local", "nav.privacy": "Tus datos no salen de este navegador",
      "topbar.local": "SOLO EN ESTE DISPOSITIVO", "language.label": "Idioma",
      "intro.eyebrow": "DMP · GESTIÓN DE PORTAFOLIO",
      "intro.subtitle": "Una vista clara de lo que está en marcha, quién lo lleva y qué está listo para facturar.",
      "import.title": "Carga tu archivo DMP", "import.drag": "Arrastra un .xlsx aquí o", "import.browse": "busca en tu equipo",
      "views.eyebrow": "VISTAS RÁPIDAS", "views.title": "Encuentra lo que necesitas", "import.waiting": "Esperando archivo",
      "view.all": "Todas las SR", "view.all.description": "El portafolio completo, de un vistazo.",
      "view.invoice": "Listas para facturar", "view.invoice.description": "Ready to invoice al 100%.",
      "view.pm": "Por Pfizer Digital PM", "view.pm.description": "Distribución de solicitudes por responsable.",
      "view.develop": "En desarrollo", "view.develop.description": "Solicitudes que están en Develop.",
      "metric.visible": "SOLICITUDES EN ESTA VISTA", "metric.matches": "Coincidencias con los filtros actuales",
      "metric.ready": "READY TO INVOICE · 100%", "metric.readyWithin": "Listas dentro de esta vista",
      "metric.phase": "POR ETAPA", "metric.phaseTitle": "Workflow phase", "empty.phase": "Carga un archivo para ver la distribución.",
      "table.eyebrow": "EXPLORADOR", "table.export": "Exportar CSV", "table.clear": "Limpiar filtros",
      "table.search": "Buscar en todos los campos…", "filter.field": "Campo", "filter.condition": "Condición",
      "filter.valueLabel": "Valor del filtro", "filter.value": "Valor…", "filter.add": "+ Añadir filtro",
      "filter.contains": "contiene", "filter.is": "es exactamente", "filter.not": "no es",
      "filter.empty": "está vacío", "filter.notEmpty": "tiene valor", "filter.gte": "es mayor o igual",
      "filter.lte": "es menor o igual", "filter.noValue": "No requiere valor", "filter.remove": "Quitar filtro",
      "empty.title": "Tu próximo reporte empieza aquí.",
      "empty.description": "Importa el Excel que genera DMP para explorar las solicitudes localmente.",
      "empty.choose": "Elegir archivo", "page.noData": "Sin datos para mostrar",
      "page.previous": "Página anterior", "page.next": "Página siguiente",
      "footer.privacy": "Hecho para explorar. Los datos se procesan en este navegador.",
      "detail.eyebrow": "DETALLE DE SOLICITUD", "detail.close": "Cerrar detalle",
      "title.all": "Todas las solicitudes", "title.invoice": "Listas para facturar · 100%",
      "title.pm": "Solicitudes por Pfizer Digital PM", "title.develop": "Solicitudes en desarrollo",
      "count.requests": "solicitudes", "count.managers": "responsables", "count.sr": "SR",
      "phase.none": "Sin etapa", "phase.empty": "Sin solicitudes en esta vista.",
      "table.showing": "Mostrando {from}–{to} de {total}", "table.noResults": "No encontramos solicitudes con estos criterios. Prueba quitar algún filtro.",
      "table.untitled": "Sin título", "table.viewDetails": "Ver detalle de SR {id}", "table.empty": "—",
      "pm.unassigned": "Sin asignar", "operator.contains": "contiene", "operator.is": "es",
      "operator.not": "no es", "operator.empty": "está vacío", "operator.notEmpty": "tiene valor",
      "error.format": "No se reconoció el formato de exportación de DMP. Verifica que la primera fila tenga los encabezados.",
      "error.noRows": "El archivo no contiene solicitudes.",
      "error.csv": "El CSV debe incluir encabezados y al menos una fila de datos.",
      "error.noSheet": "No se encontró una hoja de datos en el archivo.",
      "error.noSheetRows": "La primera hoja no tiene solicitudes.",
      "error.unsupported": "Formato no compatible. Selecciona un archivo .xlsx, .xls o .csv.",
      "error.read": "No se pudo leer el archivo.", "error.filterValue": "Escribe un valor para aplicar este filtro.",
      "error.noExport": "No hay solicitudes para exportar con los filtros actuales.",
      "success.loaded": "{count} solicitudes cargadas. El archivo se procesó solo en este navegador.",
      "success.export": "{count} solicitudes exportadas en CSV.",
      "error.reader": "No se pudo cargar el lector de Excel local. Comprueba que vendor/xlsx.full.min.js esté junto a index.html.",
      "detail.summary": "Resumen", "detail.team": "Equipo", "detail.dates": "Fechas",
      "detail.finance": "Finanzas", "detail.context": "Contexto", "detail.links": "Enlaces",
      "detail.open": "Abrir solicitud ↗"
    },
    en: {
      "nav.aria": "Main navigation", "nav.workspace": "WORKSPACE", "nav.requests": "Requests",
      "nav.import": "Import data", "nav.local": "Local processing", "nav.privacy": "Your data never leaves this browser",
      "topbar.local": "ON THIS DEVICE ONLY", "language.label": "Language",
      "intro.eyebrow": "DMP · PORTFOLIO MANAGEMENT",
      "intro.subtitle": "A clear view of what’s in progress, who owns it, and what’s ready to invoice.",
      "import.title": "Load your DMP file", "import.drag": "Drop a .xlsx file here or", "import.browse": "browse your computer",
      "views.eyebrow": "QUICK VIEWS", "views.title": "Find what you need", "import.waiting": "Waiting for a file",
      "view.all": "All service requests", "view.all.description": "Your full portfolio, at a glance.",
      "view.invoice": "Ready to invoice", "view.invoice.description": "Requests marked 100% ready to invoice.",
      "view.pm": "By Pfizer Digital PM", "view.pm.description": "Requests grouped by project manager.",
      "view.develop": "In development", "view.develop.description": "Requests currently in Develop.",
      "metric.visible": "REQUESTS IN THIS VIEW", "metric.matches": "Matches for the current filters",
      "metric.ready": "READY TO INVOICE · 100%", "metric.readyWithin": "Ready within this view",
      "metric.phase": "BY PHASE", "metric.phaseTitle": "Workflow phase", "empty.phase": "Load a file to see the breakdown.",
      "table.eyebrow": "EXPLORER", "table.export": "Export CSV", "table.clear": "Clear filters",
      "table.search": "Search all fields…", "filter.field": "Field", "filter.condition": "Condition",
      "filter.valueLabel": "Filter value", "filter.value": "Value…", "filter.add": "+ Add filter",
      "filter.contains": "contains", "filter.is": "is exactly", "filter.not": "is not",
      "filter.empty": "is empty", "filter.notEmpty": "is not empty", "filter.gte": "is greater than or equal to",
      "filter.lte": "is less than or equal to", "filter.noValue": "No value required", "filter.remove": "Remove filter",
      "empty.title": "Your next report starts here.",
      "empty.description": "Import a DMP Excel export to explore your requests locally.",
      "empty.choose": "Choose a file", "page.noData": "No data to display",
      "page.previous": "Previous page", "page.next": "Next page",
      "footer.privacy": "Built for exploration. Your data stays in this browser.",
      "detail.eyebrow": "REQUEST DETAILS", "detail.close": "Close details",
      "title.all": "All service requests", "title.invoice": "Ready to invoice · 100%",
      "title.pm": "Requests by Pfizer Digital PM", "title.develop": "Requests in development",
      "count.requests": "requests", "count.managers": "project managers", "count.sr": "SRs",
      "phase.none": "No phase", "phase.empty": "No requests in this view.",
      "table.showing": "Showing {from}–{to} of {total}", "table.noResults": "No requests match these criteria. Try removing a filter.",
      "table.untitled": "Untitled", "table.viewDetails": "View details for SR {id}", "table.empty": "—",
      "pm.unassigned": "Unassigned", "operator.contains": "contains", "operator.is": "is",
      "operator.not": "is not", "operator.empty": "is empty", "operator.notEmpty": "is not empty",
      "error.format": "This doesn't look like a DMP export. Check that the first row contains the column headers.",
      "error.noRows": "The file contains no service requests.",
      "error.csv": "The CSV must include headers and at least one data row.",
      "error.noSheet": "No data sheet was found in the file.",
      "error.noSheetRows": "The first sheet contains no requests.",
      "error.unsupported": "Unsupported format. Choose an .xlsx, .xls, or .csv file.",
      "error.read": "Could not read the file.", "error.filterValue": "Enter a value to apply this filter.",
      "error.noExport": "There are no requests to export with the current filters.",
      "success.loaded": "{count} requests loaded. The file was processed in this browser only.",
      "success.export": "{count} requests exported to CSV.",
      "error.reader": "The local Excel reader could not be loaded. Make sure vendor/xlsx.full.min.js is beside index.html.",
      "detail.summary": "Summary", "detail.team": "Team", "detail.dates": "Dates",
      "detail.finance": "Finance", "detail.context": "Context", "detail.links": "Links",
      "detail.open": "Open request ↗"
    }
  };
  const translatedFields = {
    "SR #": "SR #", "SR Link": "Enlace de SR", "Project Name": "Nombre del proyecto",
    "Project Description": "Descripción del proyecto",
    "Project Description": "Descripción del proyecto", "Workflow Phase": "Etapa del flujo de trabajo",
    "Request Status": "Estado de la solicitud", "Service Type": "Tipo de servicio", "Service": "Servicio",
    "Service Group": "Grupo de servicios", "New/Modify": "Nuevo/Modificación", "Request Type": "Tipo de solicitud",
    "Request Date": "Fecha de solicitud", "Target Date": "Fecha objetivo",
    "Actual Site Launch Date": "Fecha real de lanzamiento del sitio", "D&T Lead/MCD": "Líder D&T/MCD",
    "Delivery Lead": "Líder de entrega", "Business Owner": "Responsable de negocio",
    "Engineering Lead": "Líder de ingeniería", "Accountable Build Team": "Equipo de desarrollo responsable",
    "Project Manager": "Project Manager", "Agency": "Agencia", "Agency Contact": "Contacto de la agencia",
    "Ready to invoice": "Listo para facturar", "Pfizer Digital Project Manager": "Project Manager de Pfizer Digital",
    "Pfizer Digital Status": "Estado de Pfizer Digital", "Requestor": "Solicitante",
    "Last Updated": "Última actualización", "Asset Status": "Estado del activo",
    "Business Unit": "Unidad de negocio", "Brand(s)": "Marca(s)", "Audience": "Audiencia",
    "Production domain": "Dominio de producción", "Country": "País", "Region": "Región",
    "Finance Validation": "Validación financiera", "Finance Contact": "Contacto de finanzas",
    "Partial Payment": "Pago parcial", "Final Payment": "Pago final", "Event Start Date": "Fecha de inicio del evento",
    "Event Location": "Ubicación del evento", "SR Link": "Enlace de SR",
    "Business Impact": "Impacto en el negocio", "Chargeback # 1": "Cargo a cuenta #1",
    "Chargeback Contract # 1": "Contrato de cargo #1", "Chargeback # 1 Used?": "¿Se usó el cargo #1?",
    "Chargeback Month # 1": "Mes del cargo #1", "Chargeback # 2": "Cargo a cuenta #2",
    "Chargeback Contract # 2": "Contrato de cargo #2", "Chargeback # 2 Used?": "¿Se usó el cargo #2?",
    "Chargeback Month # 2": "Mes del cargo #2", "Chargeback # 3": "Cargo a cuenta #3",
    "Chargeback Contract # 3": "Contrato de cargo #3", "Chargeback # 3 Used?": "¿Se usó el cargo #3?",
    "Chargeback Month # 3": "Mes del cargo #3", "Total Eligible Chargeback": "Cargo total elegible",
    "Chargeback available": "Cargo disponible", "One Time Environment Setup Cost": "Costo único de configuración del entorno",
    "One Time Project Cost": "Costo único del proyecto",
    "Are One Time Project Costs charged through umbrella SOW?": "¿Los costos únicos del proyecto se cobran por el SOW marco?",
    "Business Cost Center": "Centro de costos del negocio", "Business WBS Number": "Número WBS del negocio",
    "Company Code/Legal Entity": "Código de empresa/Entidad legal", "Funding Country": "País de financiación",
    "Transfer Year": "Año de transferencia", "Transfer Year overridden?": "¿Se modificó el año de transferencia?",
    "One Time PM/ Testing Cost": "Costo único de PM/Pruebas",
    "One Time Engineering Costs": "Costos únicos de ingeniería",
    "Site Complexity": "Complejidad del sitio", "Internal Facing / External Facing": "Uso interno / externo",
    "App Supp Cost / Year": "Costo anual de soporte de la aplicación",
    "Application Support / Month": "Soporte de la aplicación / mes",
    "Application Support First Year": "Soporte de la aplicación / primer año",
    "Hosting Cost / Month": "Costo de hosting / mes", "Hosting Cost / Year": "Costo de hosting / año",
    "Hosting Cost First Year": "Costo de hosting / primer año",
    "Engineering Cost / Month": "Costo de ingeniería / mes",
    "Engineering Cost First Year": "Costo de ingeniería / primer año",
    "Engineering Cost / Year": "Costo de ingeniería / año",
    "What type of Analytics do you need?": "¿Qué tipo de analítica necesitas?",
    "CEP": "CEP", "CEP ID": "ID de CEP", "FDM Division Code": "Código de división FDM",
    "FDM Market Code": "Código de mercado FDM", "FDM Function Code": "Código de función FDM",
    "Extra Support is required": "Se requiere soporte adicional",
    "Please indicate the Extra Support needed": "Indica el soporte adicional requerido",
    "Asset ID": "ID del activo", "Date Knowledge Transfer was completed": "Fecha de finalización de la transferencia de conocimiento",
    "Upjohn BCCs": "BCC de Upjohn", "Watchers": "Observadores", "Related SR": "SR relacionada",
    "Jira Link": "Enlace de Jira", "Single/Series Webinars": "Webinars individuales/en serie",
    "Number of Webinars": "Número de webinars"
  };
  const state = {
    headers: [],
    rows: [],
    filters: [],
    search: "",
    view: "all",
    sortKey: "SR #",
    sortDirection: "desc",
    page: 1,
    fileName: "",
    language: "es",
    toastTimer: null
  };

  function t(key, values = {}) {
    let text = translations[state.language][key] ?? translations.en[key] ?? key;
    Object.entries(values).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)); });
    return text;
  }

  function fieldLabel(field) {
    return state.language === "es" ? (translatedFields[field] || field) : field;
  }

  function applyLanguage() {
    document.documentElement.lang = state.language;
    document.title = `DMP / SR Monitor`;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (key) element.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.title = t(element.dataset.i18nTitle);
    });
    document.querySelectorAll(".language-option").forEach((button) => {
      const active = button.dataset.language === state.language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const operator = $("#operatorSelect");
    [...operator.options].forEach((option) => { option.textContent = t(`filter.${option.value}`); });
    const fieldSelect = $("#fieldSelect");
    const selectedField = fieldSelect.value;
    if (state.headers.length) {
      fieldSelect.innerHTML = `<option value="">${escapeHTML(t("filter.field"))}</option>` +
        state.headers.map((field) => `<option value="${escapeHTML(field)}">${escapeHTML(fieldLabel(field))}</option>`).join("");
      fieldSelect.value = selectedField;
    } else {
      fieldSelect.options[0].textContent = t("filter.field");
    }
    const noValue = ["empty", "notEmpty"].includes($("#operatorSelect").value);
    $("#filterValue").placeholder = noValue ? t("filter.noValue") : t("filter.value");
    if (state.rows.length) {
      if (state.fileName) {
        $("#updatedLabel").textContent = `${state.fileName} · ${state.rows.length} ${t("count.requests")}`;
        $("#importSubtitle").textContent = `${state.rows.length} ${t("count.requests")} · ${state.language === "es" ? "Selecciona para reemplazar el archivo" : "Select to replace the file"}`;
      }
      render();
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3800);
  }

  function displayValue(value, field) {
    if (value === null || value === undefined || value === "") return "";
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return new Intl.DateTimeFormat(state.language === "es" ? "es-AR" : "en-US", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(value);
    }
    if (DATE_FIELD.test(field) && typeof value === "number" && value > 20000 && value < 80000 && window.XLSX) {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) return new Intl.DateTimeFormat(state.language === "es" ? "es-AR" : "en-US", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
        .format(new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)));
    }
    return String(value);
  }

  function normalizeText(value) {
    return String(value ?? "").trim().toLocaleLowerCase(state.language === "es" ? "es" : "en");
  }

  function invoicePercent(value) {
    const text = String(value ?? "").trim().replace(",", ".");
    if (!text) return null;
    const hasPercent = text.endsWith("%");
    const number = Number(text.replace(/%$/, ""));
    if (!Number.isFinite(number)) return null;
    return hasPercent && number <= 1 ? number * 100 : number;
  }

  function isInvoiceReady(row) {
    return invoicePercent(row["Ready to invoice"]) === 100;
  }

  function getPresetRows(view) {
    if (view === "invoice") return state.rows.filter(isInvoiceReady);
    if (view === "develop") return state.rows.filter((row) => normalizeText(row["Workflow Phase"]) === "develop");
    return state.rows;
  }

  function applyFilters(rows) {
    return rows.filter((row) => {
      if (state.search) {
        const haystack = state.headers.map((field) => displayValue(row[field], field)).join(" ").toLocaleLowerCase(state.language);
        if (!haystack.includes(state.search)) return false;
      }
      return state.filters.every((filter) => {
        const raw = row[filter.field];
        const actual = displayValue(raw, filter.field);
        const expected = filter.value.trim();
        if (filter.operator === "empty") return actual.trim() === "";
        if (filter.operator === "notEmpty") return actual.trim() !== "";
        if (filter.operator === "contains") {
          const searchableValue = filter.field === "Ready to invoice" && invoicePercent(raw) !== null
            ? `${invoicePercent(raw)}%`
            : actual;
          return normalizeText(searchableValue).includes(normalizeText(expected));
        }
        if (filter.operator === "is") {
          if (filter.field === "Ready to invoice") return invoicePercent(raw) === invoicePercent(expected);
          return normalizeText(actual) === normalizeText(expected);
        }
        if (filter.operator === "not") return normalizeText(actual) !== normalizeText(expected);
        const left = Number(String(raw ?? "").replace("%", ""));
        const right = Number(expected.replace("%", ""));
        if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
        return filter.operator === "gte" ? left >= right : left <= right;
      });
    });
  }

  function getResults() {
    const selected = getPresetRows(state.view);
    return applyFilters(selected).sort((a, b) => {
      const left = a[state.sortKey];
      const right = b[state.sortKey];
      let comparison;
      if (typeof left === "number" && typeof right === "number") comparison = left - right;
      else comparison = displayValue(left, state.sortKey).localeCompare(displayValue(right, state.sortKey), state.language, { numeric: true, sensitivity: "base" });
      return comparison * (state.sortDirection === "asc" ? 1 : -1);
    });
  }

  function setView(view) {
    state.view = view;
    state.page = 1;
    document.querySelectorAll(".view-card").forEach((card) => card.classList.toggle("is-selected", card.dataset.view === view));
    $("#requestsTitle").firstChild.textContent = `${t(`title.${view}`)} `;
    $("#pmBreakdown").hidden = view !== "pm";
    if (view === "pm") state.filters = state.filters.filter((filter) => filter.field !== "Pfizer Digital Project Manager");
    render();
  }

  function renderMetrics() {
    const total = state.rows.length;
    const ready = state.rows.filter(isInvoiceReady).length;
    const pmValues = new Set(state.rows.map((row) => String(row["Pfizer Digital Project Manager"] ?? "").trim()).filter(Boolean));
    const develop = state.rows.filter((row) => normalizeText(row["Workflow Phase"]) === "develop").length;
    $("#allCount").innerHTML = `${total} <small>${t("count.requests")}</small>`;
    $("#invoiceCount").innerHTML = `${ready} <small>${t("count.requests")}</small>`;
    $("#pmCount").innerHTML = `${pmValues.size} <small>${t("count.managers")}</small>`;
    $("#developCount").innerHTML = `${develop} <small>${t("count.requests")}</small>`;

    const results = getResults();
    $("#visibleMetric").textContent = results.length;
    $("#readyMetric").textContent = results.filter(isInvoiceReady).length;
    $("#phaseTotal").textContent = `${results.length} ${t("count.sr")}`;
    const phases = new Map();
    results.forEach((row) => {
      const phase = String(row["Workflow Phase"] ?? "").trim() || t("phase.none");
      phases.set(phase, (phases.get(phase) || 0) + 1);
    });
    const sortedPhases = [...phases.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    $("#phaseBreakdown").innerHTML = sortedPhases.length
      ? sortedPhases.map(([phase, count]) => `<div class="phase-item"><div class="phase-item-label"><span>${escapeHTML(phase)}</span><b>${count}</b></div><div class="phase-track"><div class="phase-bar" style="width:${results.length ? (count / results.length) * 100 : 0}%"></div></div></div>`).join("")
      : `<div class="empty-inline">${escapeHTML(t("phase.empty"))}</div>`;
  }

  function renderTable() {
    const results = getResults();
    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PAGE_SIZE;
    const pageRows = results.slice(start, start + PAGE_SIZE);
    $("#resultCount").textContent = results.length;
    $("#pageLabel").textContent = results.length
      ? t("table.showing", { from: start + 1, to: Math.min(start + PAGE_SIZE, results.length), total: results.length })
      : t("table.noResults");
    $("#pageNumber").textContent = results.length ? `${state.page} / ${totalPages}` : "—";
    $("#prevPage").disabled = state.page <= 1 || !results.length;
    $("#nextPage").disabled = state.page >= totalPages || !results.length;

    const columns = DEFAULT_COLUMNS.filter((field) => state.headers.includes(field));
    $("#tableHead").innerHTML = columns.map((field) => {
      const arrow = state.sortKey === field ? (state.sortDirection === "asc" ? "↑" : "↓") : "";
      return `<th scope="col"><button type="button" data-sort="${escapeHTML(field)}">${escapeHTML(fieldLabel(field))} <span>${arrow}</span></button></th>`;
    }).join("");
    if (!state.headers.length) return;
    if (!pageRows.length) {
      $("#tableBody").innerHTML = `<tr class="empty-row"><td colspan="${columns.length}"><div class="empty-results">${escapeHTML(t("table.noResults"))}</div></td></tr>`;
      return;
    }
    $("#tableBody").innerHTML = pageRows.map((row) => {
      const cells = columns.map((field) => {
        const value = displayValue(row[field], field);
        if (field === "SR #") return `<td class="sr-cell">${escapeHTML(value || "—")}</td>`;
        if (field === "Project Name") return `<td><span class="project-cell" title="${escapeHTML(value)}">${escapeHTML(value || t("table.untitled"))}</span></td>`;
        if (field === "Request Status" && value) return `<td><span class="status-pill">${escapeHTML(value)}</span></td>`;
        if (field === "Ready to invoice" && value) {
          const percent = invoicePercent(value);
          const formatted = percent === null ? value : `${percent}%`;
          return `<td><span class="invoice-pill ${percent === 100 ? "" : "is-not-ready"}">${escapeHTML(formatted)}</span></td>`;
        }
        return `<td title="${escapeHTML(value)}">${escapeHTML(value || t("table.empty"))}</td>`;
      }).join("");
      return `<tr class="data-row" data-row="${row.__index}" tabindex="0" aria-label="${escapeHTML(t("table.viewDetails", { id: displayValue(row["SR #"], "SR #") }))}">${cells}</tr>`;
    }).join("");
  }

  function renderFilters() {
    $("#activeFilters").innerHTML = state.filters.map((filter, index) => {
      const operators = { contains: t("operator.contains"), is: t("operator.is"), not: t("operator.not"), empty: t("operator.empty"), notEmpty: t("operator.notEmpty"), gte: "≥", lte: "≤" };
      return `<span class="filter-chip"><b>${escapeHTML(fieldLabel(filter.field))}</b> ${operators[filter.operator]}${filter.value ? ` “${escapeHTML(filter.value)}”` : ""}<button type="button" data-remove-filter="${index}" aria-label="${escapeHTML(t("filter.remove"))}">×</button></span>`;
    }).join("");
  }

  function renderPmBreakdown() {
    const counts = new Map();
    state.rows.forEach((row) => {
      const pm = String(row["Pfizer Digital Project Manager"] ?? "").trim();
      counts.set(pm, (counts.get(pm) || 0) + 1);
    });
    const current = state.filters.find((filter) => filter.field === "Pfizer Digital Project Manager");
    $("#pmBreakdown").innerHTML = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], state.language))
      .map(([pm, count]) => `<button class="pm-chip ${current?.value === pm ? "is-active" : ""}" type="button" data-pm="${escapeHTML(pm)}"><span>${escapeHTML(pm || t("pm.unassigned"))}</span><b>${count}</b></button>`).join("");
  }

  function render() {
    if (!state.rows.length) return;
    $("#requestTitleText").textContent = t(`title.${state.view}`);
    renderMetrics();
    renderFilters();
    renderTable();
    renderPmBreakdown();
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function setImportEnabled(enabled) {
    $("#exportButton").disabled = !enabled;
    $("#searchInput").disabled = !enabled;
    $("#fieldSelect").disabled = !enabled;
    $("#operatorSelect").disabled = !enabled;
    $("#filterValue").disabled = !enabled;
    $("#addFilterButton").disabled = !enabled;
  }

  function populateFilterFields() {
    const select = $("#fieldSelect");
    select.innerHTML = `<option value="">${escapeHTML(t("filter.field"))}</option>` + state.headers.map((field) => `<option value="${escapeHTML(field)}">${escapeHTML(fieldLabel(field))}</option>`).join("");
  }

  function cleanCell(value) {
    if (value === null || value === undefined) return "";
    return value instanceof Date ? value : value;
  }

  function loadRows(headers, sourceRows, fileName) {
    const normalizedHeaders = headers.map((value, index) => String(value ?? "").trim() || `Columna ${index + 1}`);
    if (!normalizedHeaders.some((header) => header === "SR #" || /project name/i.test(header))) {
      throw new Error(t("error.format"));
    }
    const records = sourceRows.map((values, index) => {
      const record = { __index: index };
      normalizedHeaders.forEach((field, column) => { record[field] = cleanCell(values[column]); });
      return record;
    }).filter((row) => normalizedHeaders.some((field) => String(row[field] ?? "").trim() !== ""));
    if (!records.length) throw new Error(t("error.noRows"));
    state.headers = normalizedHeaders;
    state.rows = records;
    state.fileName = fileName;
    state.filters = [];
    state.search = "";
    state.view = "all";
    state.page = 1;
    state.sortKey = normalizedHeaders.includes("SR #") ? "SR #" : normalizedHeaders[0];
    state.sortDirection = "desc";
    $("#searchInput").value = "";
    $("#updatedLabel").textContent = `${fileName} · ${records.length} ${t("count.requests")}`;
    $("#importTitle").textContent = fileName;
    $("#importSubtitle").textContent = `${records.length} ${t("count.requests")} · ${state.language === "es" ? "Selecciona para reemplazar el archivo" : "Select to replace the file"}`;
    $("#tableBody").innerHTML = "";
    $("#pmBreakdown").hidden = true;
    document.querySelectorAll(".view-card").forEach((card) => card.classList.toggle("is-selected", card.dataset.view === "all"));
    populateFilterFields();
    setImportEnabled(true);
    render();
    showToast(t("success.loaded", { count: records.length }));
  }

  async function readFile(file) {
    if (!file) return;
    try {
      const extension = file.name.split(".").pop().toLowerCase();
      if (extension === "csv") {
        const text = await file.text();
        const workbook = XLSX.read(text, { type: "string", cellDates: true });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const values = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: "", raw: true });
        if (values.length < 2) throw new Error(t("error.csv"));
        loadRows(values[0], values.slice(1), file.name);
      } else if (extension === "xlsx" || extension === "xls") {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!firstSheet) throw new Error(t("error.noSheet"));
        const values = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: "", raw: true });
        if (values.length < 2) throw new Error(t("error.noSheetRows"));
        loadRows(values[0], values.slice(1), file.name);
      } else {
        throw new Error(t("error.unsupported"));
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : t("error.read"));
    }
  }

  function addFilter(field, operator, value) {
    if (!field || !state.headers.includes(field)) return;
    if (["contains", "is", "not", "gte", "lte"].includes(operator) && !value.trim()) {
      showToast(t("error.filterValue"));
      $("#filterValue").focus();
      return;
    }
    state.filters.push({ field, operator, value });
    state.page = 1;
    $("#filterValue").value = "";
    render();
  }

  function csvEscape(value) {
    let text = displayValue(value, "");
    if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    const results = getResults();
    if (!results.length) {
      showToast(t("error.noExport"));
      return;
    }
    const csv = [
      state.headers.map(csvEscape).join(","),
      ...results.map((row) => state.headers.map((field) => csvEscape(row[field])).join(","))
    ].join("\r\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `dmp-sr-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(t("success.export", { count: results.length }));
  }

  function renderDetails(rowIndex) {
    const row = state.rows.find((item) => item.__index === Number(rowIndex));
    if (!row) return;
    $("#detailTitle").textContent = `SR #${displayValue(row["SR #"], "SR #") || "—"}`;
    const groups = [
      ["detail.summary", ["SR #", "Project Name", "Project Description", "Request Status", "Workflow Phase", "Service Type", "Service", "Service Group", "Request Type", "New/Modify"]],
      ["detail.team", ["Pfizer Digital Project Manager", "Project Manager", "Delivery Lead", "D&T Lead/MCD", "Engineering Lead", "Business Owner", "Requestor", "Accountable Build Team"]],
      ["detail.dates", ["Request Date", "Target Date", "Actual Site Launch Date", "Last Updated", "Event Start Date"]],
      ["detail.finance", ["Ready to invoice", "Partial Payment", "Final Payment", "Total Eligible Chargeback", "Chargeback available", "Finance Validation", "Business Cost Center", "Business WBS Number"]],
      ["detail.context", ["Business Unit", "Brand(s)", "Country", "Region", "Production domain", "Asset Status"]]
    ];
    const groupsHTML = groups.map(([name, fields]) => {
      const present = fields.filter((field) => state.headers.includes(field) && displayValue(row[field], field) !== "");
      if (!present.length) return "";
      return `<section class="detail-group"><h3>${escapeHTML(t(name))}</h3>${present.map((field) => `<div class="detail-field"><span>${escapeHTML(fieldLabel(field))}</span><span>${escapeHTML(displayValue(row[field], field))}</span></div>`).join("")}</section>`;
    }).join("");
    const linkGroup = state.headers.includes("SR Link") && row["SR Link"]
      ? `<section class="detail-group"><h3>${escapeHTML(t("detail.links"))}</h3><div class="detail-field"><span>${escapeHTML(fieldLabel("SR Link"))}</span><a href="${escapeHTML(row["SR Link"])}" target="_blank" rel="noopener noreferrer">${escapeHTML(t("detail.open"))}</a></div></section>`
      : "";
    $("#detailContent").innerHTML = groupsHTML + linkGroup;
    $("#detailBackdrop").hidden = false;
    $("#closeDrawer").focus();
  }

  $("#browseButton").addEventListener("click", (event) => { event.stopPropagation(); fileInput.click(); });
  $("#emptyBrowseButton").addEventListener("click", () => fileInput.click());
  $("#railImport").addEventListener("click", () => fileInput.click());
  dropZone.addEventListener("click", (event) => { if (event.target.closest("button")) return; fileInput.click(); });
  fileInput.addEventListener("change", () => { readFile(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  }));
  ["dragleave", "drop"].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  }));
  dropZone.addEventListener("drop", (event) => readFile(event.dataTransfer.files[0]));
  document.querySelectorAll(".view-card").forEach((card) => card.addEventListener("click", () => setView(card.dataset.view)));
  $("#searchInput").addEventListener("input", (event) => {
    state.search = normalizeText(event.target.value);
    state.page = 1;
    render();
  });
  $("#addFilterButton").addEventListener("click", () => addFilter($("#fieldSelect").value, $("#operatorSelect").value, $("#filterValue").value));
  $("#filterValue").addEventListener("keydown", (event) => { if (event.key === "Enter") $("#addFilterButton").click(); });
  $("#operatorSelect").addEventListener("change", (event) => {
    const noValue = ["empty", "notEmpty"].includes(event.target.value);
    $("#filterValue").disabled = noValue || !state.rows.length;
    $("#filterValue").placeholder = noValue ? t("filter.noValue") : t("filter.value");
  });
  $("#clearButton").addEventListener("click", () => {
    state.filters = [];
    state.search = "";
    state.page = 1;
    $("#searchInput").value = "";
    if (state.view === "pm") setView("all");
    else render();
  });
  $("#exportButton").addEventListener("click", exportCsv);
  $("#prevPage").addEventListener("click", () => { state.page--; renderTable(); });
  $("#nextPage").addEventListener("click", () => { state.page++; renderTable(); });
  $("#tableHead").addEventListener("click", (event) => {
    const button = event.target.closest("[data-sort]");
    if (!button) return;
    if (state.sortKey === button.dataset.sort) state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    else { state.sortKey = button.dataset.sort; state.sortDirection = "asc"; }
    renderTable();
  });
  $("#tableBody").addEventListener("click", (event) => {
    const row = event.target.closest("[data-row]");
    if (row) renderDetails(row.dataset.row);
  });
  $("#tableBody").addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-row]")) {
      event.preventDefault();
      renderDetails(event.target.dataset.row);
    }
  });
  $("#activeFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-filter]");
    if (!button) return;
    state.filters.splice(Number(button.dataset.removeFilter), 1);
    render();
  });
  $("#pmBreakdown").addEventListener("click", (event) => {
    const button = event.target.closest("[data-pm]");
    if (!button) return;
    const existingIndex = state.filters.findIndex((filter) => filter.field === "Pfizer Digital Project Manager");
    if (existingIndex >= 0 && state.filters[existingIndex].value === button.dataset.pm) state.filters.splice(existingIndex, 1);
    else {
      if (existingIndex >= 0) state.filters.splice(existingIndex, 1);
      state.filters.push({ field: "Pfizer Digital Project Manager", operator: "is", value: button.dataset.pm });
    }
    state.page = 1;
    render();
  });
  document.querySelectorAll(".language-option").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = button.dataset.language;
      applyLanguage();
    });
  });
  $("#closeDrawer").addEventListener("click", () => { $("#detailBackdrop").hidden = true; });
  $("#detailBackdrop").addEventListener("click", (event) => { if (event.target === $("#detailBackdrop")) $("#detailBackdrop").hidden = true; });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("#searchInput").focus();
    }
    if (event.key === "Escape") $("#detailBackdrop").hidden = true;
  });

  applyLanguage();
  if (!window.XLSX) showToast(t("error.reader"));
})();
