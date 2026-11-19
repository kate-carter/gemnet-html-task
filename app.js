(function () {
  "use strict";

  var CONFIG = window.STUDY_CONFIG;
  var STORAGE_KEY = "surveyStudyState_v1";
  var DURATION_MS = CONFIG.durationMinutes * 60 * 1000;
  var WARNING_MS = 5 * 60 * 1000;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    timer: $("timer"),
    timerValue: $("timer-value"),
    startScreen: $("start-screen"),
    endScreen: $("end-screen"),
    startInstructions: $("start-instructions"),
    endInstructions: $("end-instructions"),
    getFirst: $("get-first"),
    linkArea: $("link-area"),
    surveyCount: $("survey-count"),
    surveyLink: $("survey-link"),
    linkHint: $("link-hint"),
    nextSurvey: $("next-survey"),
    allDone: $("all-done"),
  };

  // ---------------------------------------------------------------- state

  // position: index into `order` of the link currently shown (-1 = none yet).
  // State persists in localStorage so a refresh cannot reshuffle or reset the timer.
  function freshState() {
    return { order: null, position: -1, currentOpened: false, startedAt: null, finished: false, log: [] };
  }

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === "object") return saved;
    } catch (e) { /* fall through */ }
    return freshState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function shuffledIndices(n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return a;
  }

  // ------------------------------------------------------- researcher tools

  var params = new URLSearchParams(window.location.search);

  if (params.has("reset")) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.replace(window.location.pathname);
    return;
  }

  var state = loadState();

  if (params.has("export")) {
    exportLog();
    history.replaceState(null, "", window.location.pathname);
  }

  function csvCell(v) {
    var s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function iso(ms) { return ms ? new Date(ms).toISOString() : ""; }

  function exportLog() {
    var rows = [["sequence", "survey_name", "url", "shown_at", "opened_at", "next_clicked_at", "session_started_at"]];
    state.log.forEach(function (entry, i) {
      rows.push([i + 1, entry.name, entry.url, iso(entry.shownAt), iso(entry.openedAt), iso(entry.nextAt), iso(state.startedAt)]);
    });
    var csv = rows.map(function (r) { return r.map(csvCell).join(","); }).join("\n");
    var blob = new Blob([csv], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "survey-session-" + new Date().toISOString().replace(/[:.]/g, "-") + ".csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ------------------------------------------------------------- markdown

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inline(s) {
    s = escapeHtml(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return s;
  }

  function renderMarkdown(md) {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var para = [];
    var list = null; // { tag: "ul"|"ol", items: [] }
    var quote = [];

    function flush() {
      if (para.length) { html.push("<p>" + inline(para.join(" ")) + "</p>"); para = []; }
      if (list) {
        html.push("<" + list.tag + ">" + list.items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</" + list.tag + ">");
        list = null;
      }
      if (quote.length) { html.push("<blockquote>" + inline(quote.join(" ")) + "</blockquote>"); quote = []; }
    }

    lines.forEach(function (raw) {
      var line = raw.trim();
      var m;
      if (!line) { flush(); return; }
      if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
        flush();
        html.push("<h" + m[1].length + ">" + inline(m[2]) + "</h" + m[1].length + ">");
      } else if (/^(-{3,}|\*{3,})$/.test(line)) {
        flush();
        html.push("<hr>");
      } else if ((m = line.match(/^[-*+]\s+(.*)$/))) {
        if (!list || list.tag !== "ul") { flush(); list = { tag: "ul", items: [] }; }
        list.items.push(m[1]);
      } else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
        if (!list || list.tag !== "ol") { flush(); list = { tag: "ol", items: [] }; }
        list.items.push(m[1]);
      } else if ((m = line.match(/^>\s?(.*)$/))) {
        if (!quote.length) flush();
        quote.push(m[1]);
      } else {
        if (list || quote.length) flush();
        para.push(line);
      }
    });
    flush();
    return html.join("\n");
  }

  // ------------------------------------------------------------- rendering

  var tickHandle = null;

  function formatTime(ms) {
    var total = Math.max(0, Math.ceil(ms / 1000));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    var mm = (h ? String(m).padStart(2, "0") : String(m));
    return (h ? h + ":" : "") + mm + ":" + String(s).padStart(2, "0");
  }

  function render() {
    if (state.finished) {
      el.timer.classList.add("hidden");
      el.startScreen.classList.add("hidden");
      el.endScreen.classList.remove("hidden");
      el.surveyLink.removeAttribute("href");
      return;
    }

    var n = CONFIG.surveys.length;
    var started = state.position >= 0;

    el.getFirst.classList.toggle("hidden", started);

    if (state.startedAt) {
      el.timer.classList.remove("hidden");
    } else {
      el.timerValue.textContent = formatTime(DURATION_MS);
    }

    if (started && state.position < n) {
      var survey = CONFIG.surveys[state.order[state.position]];
      el.linkArea.classList.remove("hidden");
      el.allDone.classList.add("hidden");
      el.surveyCount.textContent = "Survey " + (state.position + 1) + " of " + n;
      el.surveyLink.href = survey.url;
      el.surveyLink.textContent = state.position === 0 ? "Open your first survey" : "Open survey";
      el.nextSurvey.disabled = !state.currentOpened;
      el.linkHint.textContent = state.currentOpened
        ? "When you have submitted this survey, click the button below for the next one."
        : "Click the link above to open the survey in a new tab." + (state.position === 0 ? " The timer starts when you click it." : "");
    } else if (started) {
      el.linkArea.classList.add("hidden");
      el.allDone.classList.remove("hidden");
    }
  }

  function tick() {
    var remaining = state.startedAt + DURATION_MS - Date.now();
    el.timerValue.textContent = formatTime(remaining);
    el.timer.classList.toggle("warning", remaining <= WARNING_MS);
    if (remaining <= 0) endSession();
  }

  function startTicking() {
    if (tickHandle) return;
    tick();
    tickHandle = setInterval(tick, 250);
  }

  function endSession() {
    clearInterval(tickHandle);
    tickHandle = null;
    state.finished = true;
    saveState();
    render();
    window.scrollTo(0, 0);
  }

  // --------------------------------------------------------------- events

  el.getFirst.addEventListener("click", function () {
    if (!state.order) state.order = shuffledIndices(CONFIG.surveys.length);
    state.position = 0;
    state.currentOpened = false;
    logShown();
    saveState();
    render();
  });

  function onLinkOpened() {
    if (state.finished || state.position < 0) return;
    var now = Date.now();
    if (!state.startedAt) {
      state.startedAt = now;
      el.timer.classList.remove("hidden");
      startTicking();
    }
    if (!state.currentOpened) {
      state.currentOpened = true;
      var entry = state.log[state.log.length - 1];
      if (entry && !entry.openedAt) entry.openedAt = now;
    }
    saveState();
    render();
  }

  el.surveyLink.addEventListener("click", onLinkOpened);
  el.surveyLink.addEventListener("auxclick", function (e) { if (e.button === 1) onLinkOpened(); });

  el.nextSurvey.addEventListener("click", function () {
    if (!state.currentOpened) return;
    var entry = state.log[state.log.length - 1];
    if (entry) entry.nextAt = Date.now();
    state.position += 1;
    state.currentOpened = false;
    if (state.position < CONFIG.surveys.length) logShown();
    saveState();
    render();
  });

  function logShown() {
    var survey = CONFIG.surveys[state.order[state.position]];
    state.log.push({ name: survey.name || "", url: survey.url, shownAt: Date.now(), openedAt: null, nextAt: null });
  }

  // ------------------------------------------------------------------ init

  el.startInstructions.innerHTML = renderMarkdown(CONFIG.startInstructions);
  el.endInstructions.innerHTML = renderMarkdown(CONFIG.endInstructions);
  el.allDone.innerHTML = renderMarkdown(CONFIG.allSurveysDoneMessage);

  if (state.startedAt && !state.finished && Date.now() >= state.startedAt + DURATION_MS) {
    state.finished = true;
    saveState();
  }

  render();
  if (state.startedAt && !state.finished) startTicking();
})();
