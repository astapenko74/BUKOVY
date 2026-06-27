(function () {
  "use strict";

  const ROWS = 6;
  const COLS = 5;
  const FLIP_STAGGER_MS = 150;
  const FLIP_DURATION_MS = 550;
  const NORMAL_WORD_MS = 1000;
  const WIN_HERO_MS = 800;
  const UNFLIP_DIAGONAL_COUNT = ROWS + COLS - 1;
  const UNFLIP_DIAGONAL_STAGGER_MS =
    UNFLIP_DIAGONAL_COUNT > 1
      ? Math.floor((WIN_HERO_MS - FLIP_DURATION_MS) / (UNFLIP_DIAGONAL_COUNT - 1))
      : 0;
  const REVERSE_NORMAL_WORD_MS = 1000;
  const PROGRESS_PHASE1_MS = 280;
  const PROGRESS_PHASE2_MS = 420;
  const PROGRESS_PHASE3_MS = 380;
  const PROGRESS_WORD_DOTS_AT = 0.05;
  const PROGRESS_WORD_DOTS_FOR = 0.25;
  const PROGRESS_WORD_DONE_AT = 0.95;

  const KB_ROWS = ["ЙЦУКЕНГШЩЗХЪ", "ФЫВАПРОЛДЖЭ", "ЯЧСМИТЬБЮ"];

  const ANSWER = "ВКЛАД";

  const gridEl = document.getElementById("grid");
  const kbEl = document.getElementById("keyboard");
  const tooltipEl = document.getElementById("tooltip");
  const winPanelEl = document.getElementById("win-panel");
  const frameEl = document.getElementById("game-frame");
  const confettiEl = document.getElementById("confetti");
  const winProgressStageEl = document.getElementById("win-progress-stage");
  const winProgressPrizeOverlayEl = document.getElementById("win-progress-prize-overlay");
  let winProgressPanelEl = document.getElementById("win-progress-panel");
  let fifthWordPanelIndex = 0;
  let fifthWordPrizeLabelRevealed = false;
  const mainEl = document.querySelector(".main");
  const gameScreenEl = document.getElementById("game-screen");
  const profileScreenEl = document.getElementById("profile-screen");
  const winMessageEl = document.getElementById("win-message");
  const winWordEl = document.getElementById("win-word");
  const winShareEl = document.getElementById("win-share");
  const scenarioSelectEl = document.getElementById("scenario-select");
  const thematicWordSwitchEl = document.getElementById("thematic-word-switch");

  let activeScenario = scenarioSelectEl?.value ?? "2-4-word";
  let activeThematicWord = Boolean(thematicWordSwitchEl?.checked);
  let profileSettingsDirty = false;
  let isWordNotGuessedActive = false;

  const WIN_RESULT_DEFAULT = {
    messageHtml:
      "Ах вот вы как... В следующий раз<br />загадаем слово по-сложнее!",
    shareText: "Похвастаться",
  };

  const WIN_RESULT_THEMATIC = {
    messageHtml: "Это надежно, стабильно,<br />а ещё и очень прибыльно",
    shareText: "Узнать больше",
  };

  const WIN_RESULT_NOT_GUESSED = {
    messageHtml: "Не сдавайтесь, следующее<br />слово точно отгадаете",
  };

  const WIN_PROGRESS_WORDS = ["АРТЕМ", null, null, null];

  const FIFTH_WORD_PROGRESS_WORDS = ["АРТЕМ", "ПАЛКА", "БАРОН", "ПЕТЛЯ"];
  const FIFTH_WORD_BADGES = [36, 37, 38, 39];
  const FIFTH_WORD_NEXT_BADGES = [41, 42, 43, 44];
  const PRIZE_COLUMN_WORD = "ВКЛАД";
  const PRIZE_TO_TAB_MS = 1200;
  const PROGRESS_SWAP_MS = 900;
  const FIFTH_WORD_PRIZE_LINE_MS = 420;
  const PRIZE_FLY_DELAY_MS = 1000;
  const PRIZE_POP_SCALE = 1.2;
  const PRIZE_LAYER_BOTTOM_SRC = "assets/prize-bottom.png?v=1";
  const PRIZE_LAYER_TOP_SRC = "assets/prize-top.png?v=1";
  const PRIZE_EARNED_STICKER_SRC = "assets/prize-earned-sticker.png?v=1";
  const PRIZE_REVEAL_MS = 700;

  const CONFETTI_COUNT = 200;
  const CONFETTI_COLORS = ["#ffdd2d", "#19b1ff", "#7d3bc0", "#ffb400"];
  const CONFETTI_SPEED_MIN = 4.5;
  const CONFETTI_SPEED_RANGE = 5;
  const CONFETTI_GRAVITY_MIN = 0.11;
  const CONFETTI_GRAVITY_RANGE = 0.07;
  const CONFETTI_DECAY_MIN = 0.005;
  const CONFETTI_DECAY_RANGE = 0.004;
  const PRIZE_WIGGLE_INTERVAL_MS = 7000;
  const PRIZE_PARTICLE_COLORS = ["#ffdd2d", "#ffb400", "#ffcd33", "#ffe566"];

  const PRIZE_CAROUSEL_ITEMS = [
    {
      title: "Кэшбэк 10% за оплату отеля в Т-Путешествиях",
      date: "До 28 ноября",
    },
    {
      title: "Кэшбэк 10% за оплату отеля в Т-Путешествиях",
      date: "До 28 ноября",
    },
    {
      title: "Кэшбэк 10% за оплату отеля в Т-Путешествиях",
      date: "До 28 ноября",
    },
  ];

  let confettiRafId = null;
  let prizeAnimTimer = null;
  let prizesCarouselTrack = null;
  let progressAnimTimers = [];
  let savedGameCellWidth = null;
  let savedGameCellHeight = null;

  let curRow = 0;
  let curCol = 0;
  let gameOver = false;
  let isAnimating = false;
  let board = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
  const submittedWords = [];

  const ACTION_ICONS = {
    enter: "assets/key-enter.svg",
    backspace: "assets/key-backspace.svg",
  };

  function buildGrid() {
    if (!gridEl) return;

    for (let r = 0; r < ROWS; r++) {
      const rowEl = document.createElement("div");
      rowEl.className = "grid-row";
      rowEl.dataset.row = String(r);

      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.innerHTML =
          '<div class="cell-inner"><div class="cell-front"></div><div class="cell-back"></div></div>';
        rowEl.appendChild(cell);
      }

      gridEl.appendChild(rowEl);
    }
  }

  function buildKeyboard() {
    if (!kbEl) return;

    KB_ROWS.forEach((row, index) => {
      const rowEl = document.createElement("div");
      rowEl.className = "kb-row" + (index === 1 ? " kb-row--middle" : "");

      if (index === 2) {
        rowEl.appendChild(createActionKey("enter", "✓"));
      }

      for (const ch of row) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "key";
        btn.textContent = ch;
        btn.dataset.key = ch;
        btn.addEventListener("click", () => onKey(ch));
        rowEl.appendChild(btn);
      }

      if (index === 2) {
        rowEl.appendChild(createActionKey("backspace", "⌫"));
      }

      kbEl.appendChild(rowEl);
    });
  }

  function createActionKey(type, dataKey) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `key key--action key--${type} is-disabled`;
    btn.dataset.key = dataKey;
    btn.innerHTML = `<img src="${ACTION_ICONS[type]}" alt="" width="24" height="24" />`;
    btn.addEventListener("click", () => onKey(dataKey));
    return btn;
  }

  function getRowEl(row) {
    return gridEl?.querySelector(`.grid-row[data-row="${row}"]`) ?? null;
  }

  function getCell(row, col) {
    return getRowEl(row)?.children[col] ?? null;
  }

  function updateMainScrollFade() {
    if (!mainEl) return;
    mainEl.classList.toggle(
      "is-scrolled",
      mainEl.classList.contains("main--scrollable") && mainEl.scrollTop > 0
    );
  }

  function setMainScrollable(enabled) {
    if (!mainEl) return;
    mainEl.classList.toggle("main--scrollable", enabled);
    if (!enabled) {
      if (mainEl.scrollTop > 0) {
        mainEl.scrollTop = 0;
      }
      mainEl.classList.remove("is-scrolled");
      return;
    }
    updateMainScrollFade();
  }

  function isThematicWordEnabled() {
    return activeThematicWord;
  }

  function isWordNotGuessedScenario() {
    return isWordNotGuessedActive;
  }

  function isFifthWordScenario() {
    return activeScenario === "5-word";
  }

  function isPrizeWiggleAllowed() {
    return !isFifthWordScenario() || fifthWordPanelIndex >= 1;
  }

  function markProfileSettingsDirty() {
    profileSettingsDirty = true;
  }

  function commitProfileSettingsIfNeeded() {
    if (!profileSettingsDirty) return;

    const nextScenario = scenarioSelectEl?.value ?? "2-4-word";
    const nextThematic = Boolean(thematicWordSwitchEl?.checked);
    const scenarioChanged = nextScenario !== activeScenario;
    const thematicChanged = nextThematic !== activeThematicWord;

    activeScenario = nextScenario;
    activeThematicWord = nextThematic;
    profileSettingsDirty = false;

    if (scenarioChanged) {
      resetWinProgress();
    }
    if (thematicChanged) {
      applyWinResultContent();
    }
  }

  function shouldAttachThematicSticker() {
    return (
      isThematicWordEnabled() &&
      !isFifthWordScenario() &&
      !isWordNotGuessedScenario()
    );
  }

  function getActiveWinProgress() {
    return document.getElementById("win-progress");
  }

  function refreshWinProgressRefs() {
    winProgressPanelEl = document.getElementById("win-progress-panel");
    return getActiveWinProgress();
  }

  function getPrizePanelId(panel) {
    if (!panel) return "";
    if (!panel.dataset.prizePanelId) {
      panel.dataset.prizePanelId =
        panel.id || `panel-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    }
    return panel.dataset.prizePanelId;
  }

  function getPanelPrizeUnit(panel) {
    const panelId = getPrizePanelId(panel);
    return winProgressPrizeOverlayEl?.querySelector(`[data-prize-panel="${panelId}"]`);
  }

  function getActivePrizeUnit() {
    return getPanelPrizeUnit(winProgressPanelEl);
  }

  function setPrizePopOverflowEnabled(enabled) {
    winProgressStageEl?.classList.toggle("win-progress-stage--prize-pop", enabled);
  }

  function getPrizeColumnLabelWord() {
    if (isFifthWordScenario()) {
      return fifthWordPanelIndex === 0 && fifthWordPrizeLabelRevealed
        ? PRIZE_COLUMN_WORD
        : null;
    }

    return getCompletedCount() >= 4 ? PRIZE_COLUMN_WORD : null;
  }

  function shouldSplitPrizeLayers() {
    return isFifthWordScenario();
  }

  function buildPrizeOverlayHtml(options = {}) {
    const { topOnly = false } = options;
    const bottomLayer =
      `<img class="win-progress__prize-layer win-progress__prize-layer--bottom" src="${PRIZE_LAYER_BOTTOM_SRC}" alt="" width="44" height="52" />`;
    const topLayer =
      `<img class="win-progress__prize-layer win-progress__prize-layer--top" src="${PRIZE_LAYER_TOP_SRC}" alt="" width="44" height="52" />`;

    return (
      '<div class="win-progress__prize-stack win-progress__prize--overlay" aria-hidden="true">' +
      (topOnly ? "" : bottomLayer) +
      topLayer +
      "</div>"
    );
  }

  function getActivePrizeBottomWrap() {
    return winProgressPanelEl?.querySelector(".win-progress__prize-panel-layer");
  }

  function removePrizePanelBottomLayer(panel) {
    panel?.querySelector(".win-progress__prize-panel-layer")?.remove();
  }

  function mountPrizePanelBottomLayer(panel, options = {}) {
    const { hidden = false } = options;
    const slot = panel?.querySelector(".win-progress__prize-slot");
    if (!slot) return null;

    let wrap = slot.querySelector(".win-progress__prize-panel-layer");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "win-progress__prize-panel-layer";
      wrap.setAttribute("aria-hidden", "true");
      wrap.innerHTML = `<img class="win-progress__prize-layer win-progress__prize-layer--bottom" src="${PRIZE_LAYER_BOTTOM_SRC}" alt="" width="44" height="52" />`;
      slot.appendChild(wrap);
    }

    wrap.classList.remove("is-revealing", "is-popped", "is-wiggling");
    if (hidden) {
      wrap.classList.add("win-progress__prize-panel-layer--hidden");
      wrap.classList.remove("is-revealed");
    } else {
      wrap.classList.remove("win-progress__prize-panel-layer--hidden");
      wrap.classList.add("is-revealed");
    }

    return wrap;
  }

  function revealActivePrizeBottom() {
    const wrap = getActivePrizeBottomWrap();
    if (!wrap) return;

    syncActivePrizePosition();
    wrap.classList.add("win-progress__prize-panel-layer--hidden", "is-revealing");
    wrap.classList.remove("is-revealed");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrap.classList.remove("win-progress__prize-panel-layer--hidden");
        wrap.classList.add("is-revealed");
      });
    });
  }

  function getActivePrizeEl() {
    return getActivePrizeUnit()?.querySelector(".win-progress__prize--overlay");
  }

  function getActivePrizeParticlesEl() {
    return getActivePrizeUnit()?.querySelector(".win-progress-prize-unit__particles");
  }

  function getPrizeAlignElement(panel) {
    if (!panel) return null;

    if (shouldSplitPrizeLayers()) {
      return (
        panel.querySelector(".win-progress__prize-panel-layer") ||
        panel.querySelector("[data-prize-anchor]")
      );
    }

    return panel.querySelector("[data-prize-anchor]");
  }

  function syncPrizeUnitPosition(unit, alignEl) {
    if (!unit || !alignEl || !winProgressPrizeOverlayEl) return;

    const alignRect = alignEl.getBoundingClientRect();
    const overlayRect = winProgressPrizeOverlayEl.getBoundingClientRect();
    const centerX = alignRect.left + alignRect.width / 2 - overlayRect.left;
    const centerY = alignRect.top + alignRect.height / 2 - overlayRect.top;

    unit.style.left = `${centerX}px`;
    unit.style.top = `${centerY}px`;
  }

  function syncActivePrizePosition() {
    const panel = winProgressPanelEl;
    const unit = getPanelPrizeUnit(panel);
    const alignEl = getPrizeAlignElement(panel);
    if (unit && alignEl) {
      syncPrizeUnitPosition(unit, alignEl);
    }
  }

  function clearPrizeOverlay() {
    if (winProgressPrizeOverlayEl) {
      winProgressPrizeOverlayEl.replaceChildren();
    }
  }

  function mountPrizeForPanel(panel, options = {}) {
    const { hidden = false, bottomHidden = hidden } = options;
    if (!panel || !winProgressPrizeOverlayEl) return null;

    const splitLayers = shouldSplitPrizeLayers();
    const panelId = getPrizePanelId(panel);
    let unit = getPanelPrizeUnit(panel);

    if (!unit) {
      unit = document.createElement("div");
      unit.className = "win-progress-prize-unit";
      unit.dataset.prizePanel = panelId;
      unit.innerHTML =
        '<div class="win-progress-prize-unit__particles" aria-hidden="true"></div>' +
        buildPrizeOverlayHtml({ topOnly: splitLayers });
      winProgressPrizeOverlayEl.appendChild(unit);
    }

    const prize = unit.querySelector(".win-progress__prize--overlay");
    if (prize) {
      prize.classList.remove("is-revealing", "is-popped", "is-wiggling");
      prize.style.visibility = "";
      if (hidden) {
        prize.classList.add("win-progress__prize--hidden");
        prize.classList.remove("is-revealed");
      } else {
        prize.classList.remove("win-progress__prize--hidden");
        prize.classList.add("is-revealed");
      }
    }

    if (splitLayers) {
      mountPrizePanelBottomLayer(panel, { hidden: bottomHidden });
    } else {
      removePrizePanelBottomLayer(panel);
    }

    const alignEl = getPrizeAlignElement(panel);
    if (alignEl) {
      syncPrizeUnitPosition(unit, alignEl);
    }

    return unit;
  }

  function removePrizeForPanel(panel) {
    getPanelPrizeUnit(panel)?.remove();
  }

  function revealActivePrize() {
    const prize = getActivePrizeEl();
    if (!prize) return;

    syncActivePrizePosition();
    prize.classList.add("win-progress__prize--hidden", "is-revealing");
    prize.classList.remove("is-revealed");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        prize.classList.remove("win-progress__prize--hidden");
        prize.classList.add("is-revealed");
      });
    });
  }

  function buildPrizeColumnHtml() {
    return (
      '<div class="win-progress__col win-progress__col--prize">' +
      '<div class="win-progress__prize-badge-ref" aria-hidden="true">' +
      `<img class="win-progress__sticker win-progress__sticker--prize" src="${PRIZE_EARNED_STICKER_SRC}" alt="" width="20" height="20" hidden />` +
      "</div>" +
      '<div class="win-progress__prize-slot">' +
      '<div class="win-progress__prize-connector" aria-hidden="true">' +
      '<span class="win-progress__prize-connector-fill"></span>' +
      "</div>" +
      '<span class="win-progress__prize-anchor" data-prize-anchor aria-hidden="true">' +
      '<span class="win-progress__prize-anchor-fill" aria-hidden="true"></span>' +
      "</span>" +
      "</div>" +
      '<div class="win-progress__label"></div>' +
      "</div>"
    );
  }

  function buildProgressBadgeHtml(badgeNum) {
    return (
      '<span class="win-progress__badge">' +
      '<span class="win-progress__badge-layer win-progress__badge-layer--outer">' +
      '<span class="win-progress__badge-fill win-progress__badge-fill--white" aria-hidden="true"></span>' +
      "</span>" +
      '<span class="win-progress__badge-layer win-progress__badge-layer--inner">' +
      '<span class="win-progress__badge-fill win-progress__badge-fill--yellow" aria-hidden="true"></span>' +
      "</span>" +
      `<span class="win-progress__badge-text">${badgeNum}</span>` +
      '<img class="win-progress__sticker" src="assets/thematic-sticker.png" alt="" width="20" height="20" hidden />' +
      "</span>"
    );
  }

  function buildProgressHtml(badgeNums) {
    let html = "";

    badgeNums.forEach((badgeNum, index) => {
      html +=
        `<div class="win-progress__col" data-step="${index}">` +
        '<div class="win-progress__step">' +
        buildProgressBadgeHtml(badgeNum) +
        "</div>" +
        '<div class="win-progress__label"></div>' +
        "</div>" +
        `<div class="win-progress__line" data-line="${index}">` +
        '<span class="win-progress__line-fill"></span>' +
        "</div>";
    });

    html += buildPrizeColumnHtml();

    return html;
  }

  function resetProgressStageToDefault() {
    if (!winProgressStageEl) return;

    fifthWordPanelIndex = 0;
    fifthWordPrizeLabelRevealed = false;
    setPrizePopOverflowEnabled(false);

    winProgressStageEl.innerHTML =
      '<div class="win-progress-panel is-active" id="win-progress-panel">' +
      `<div class="win-progress" id="win-progress">${buildProgressHtml(FIFTH_WORD_BADGES)}</div>` +
      "</div>";

    refreshWinProgressRefs();
    clearPrizeOverlay();
    mountPrizeForPanel(winProgressPanelEl, { hidden: false });
    syncActivePrizePosition();
  }

  function applyWinResultContent() {
    const app = document.querySelector(".app");
    app?.classList.toggle("scenario-thematic-word", isThematicWordEnabled());
    app?.classList.toggle("scenario-word-not-guessed", isWordNotGuessedScenario());
    app?.classList.toggle("scenario-fifth-word", isFifthWordScenario());

    if (isWordNotGuessedScenario()) {
      if (winWordEl) {
        winWordEl.textContent = ANSWER;
      }
      if (isThematicWordEnabled()) {
        if (winMessageEl) {
          winMessageEl.innerHTML = WIN_RESULT_THEMATIC.messageHtml;
        }
        if (winShareEl) {
          winShareEl.textContent = WIN_RESULT_THEMATIC.shareText;
          winShareEl.hidden = false;
        }
      } else {
        if (winMessageEl) {
          winMessageEl.innerHTML = WIN_RESULT_NOT_GUESSED.messageHtml;
        }
        if (winShareEl) {
          winShareEl.hidden = true;
        }
      }
      return;
    }

    const content = isThematicWordEnabled() ? WIN_RESULT_THEMATIC : WIN_RESULT_DEFAULT;

    if (winMessageEl) {
      winMessageEl.innerHTML = content.messageHtml;
    }
    if (winShareEl) {
      winShareEl.textContent = content.shareText;
      winShareEl.hidden = false;
    }
  }

  function prepareWordNotGuessedProgress() {
    fifthWordPanelIndex = 0;
    resetProgressStageToDefault();
    clearProgressAnimTimers();

    WIN_PROGRESS_WORDS[0] = "АРТЕМ";
    for (let i = 1; i < WIN_PROGRESS_WORDS.length; i += 1) {
      WIN_PROGRESS_WORDS[i] = null;
    }

    renderWinProgress();
    resetProgressStickers();
  }

  function resetProgressStickers() {
    getActiveWinProgress()?.querySelectorAll(".win-progress__sticker").forEach((sticker) => {
      sticker.hidden = true;
      sticker.classList.remove("is-attaching");
    });
  }

  function attachPrizeSticker() {
    if (!shouldSplitPrizeLayers()) return;

    const sticker = getActiveWinProgress()?.querySelector(
      ".win-progress__col--prize .win-progress__sticker"
    );
    if (!sticker) return;

    sticker.hidden = false;
    sticker.classList.remove("is-attaching");
    void sticker.offsetWidth;
    sticker.classList.add("is-attaching");
  }

  function attachThematicSticker(slot) {
    if (!shouldAttachThematicSticker()) return;

    const progressEl = getActiveWinProgress();
    if (!progressEl) return;

    const cols = progressEl.querySelectorAll(
      ".win-progress__col:not(.win-progress__col--prize)"
    );
    const sticker = cols[slot]?.querySelector(".win-progress__sticker");
    if (!sticker) return;

    sticker.hidden = false;
    sticker.classList.remove("is-attaching");
    void sticker.offsetWidth;
    sticker.classList.add("is-attaching");
  }

  function initTabBar() {
    const tabs = document.querySelectorAll(".tab-bar .tab[data-tab]");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabId = tab.dataset.tab;
        if (tabId !== "game" && tabId !== "profile") return;

        tabs.forEach((item) => {
          item.classList.toggle("tab--active", item === tab);
        });

        if (tabId === "game") {
          if (gameScreenEl) gameScreenEl.hidden = false;
          if (profileScreenEl) profileScreenEl.hidden = true;
          updateLayout();
          return;
        }

        if (gameScreenEl) gameScreenEl.hidden = true;
        if (profileScreenEl) profileScreenEl.hidden = false;
      });
    });
  }

  function updateLayout(options = {}) {
    const app = document.querySelector(".app");
    if (!options.force && !options.gameMode && app?.classList.contains("scenario-normal-word")) {
      return;
    }

    const gridArea = document.querySelector(".grid-area");
    if (!gridArea || !gridEl) return;

    const gap =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--grid-gap")) || 6;

    let availW = gridArea.clientWidth;
    let availH = gridArea.clientHeight;

    if (availH <= 0 && mainEl && kbEl) {
      const styles = getComputedStyle(document.documentElement);
      const sideMargin =
        parseFloat(styles.getPropertyValue("--side-margin")) || 20;
      const gridKbMargin =
        parseFloat(styles.getPropertyValue("--grid-kb-margin")) || 24;
      const mainStyles = getComputedStyle(mainEl);

      availW = mainEl.clientWidth - sideMargin * 2;
      availH =
        mainEl.clientHeight -
        kbEl.offsetHeight -
        parseFloat(mainStyles.paddingTop || "0") -
        parseFloat(mainStyles.paddingBottom || "0") -
        8 -
        gridKbMargin -
        parseFloat(getComputedStyle(kbEl).paddingBottom || "0");
    } else if (options.gameMode && mainEl && kbEl) {
      const styles = getComputedStyle(document.documentElement);
      const sideMargin =
        parseFloat(styles.getPropertyValue("--side-margin")) || 20;
      const gridKbMargin =
        parseFloat(styles.getPropertyValue("--grid-kb-margin")) || 24;

      availW = mainEl.clientWidth - sideMargin * 2;
      availH =
        mainEl.clientHeight -
        kbEl.offsetHeight -
        8 -
        gridKbMargin -
        parseFloat(getComputedStyle(kbEl).paddingBottom || "0");
    }

    let cellW = (availW - (COLS - 1) * gap) / COLS;
    let cellH = (availH - (ROWS - 1) * gap) / ROWS;

    if (cellW > cellH * 1.2) cellW = cellH * 1.2;
    if (cellH > cellW * 1.1) cellH = cellW * 1.1;
    if (cellW > cellH * 1.2) cellW = cellH * 1.2;

    cellW = Math.floor(cellW);
    cellH = Math.floor(cellH);

    gridArea.style.setProperty("--cell-width", `${cellW}px`);
    gridArea.style.setProperty("--cell-height", `${cellH}px`);

    const row1 = kbEl?.querySelector(".kb-row");
    if (row1) {
      const keyW = (row1.clientWidth - 11 * 3) / 12;
      kbEl.style.setProperty("--kb-mid-pad", `${(keyW + 3) / 2}px`);
    }

    updateMainScrollFade();
  }

  function syncFrameViewportHeight() {
    if (!frameEl) return;

    const isMobileLayout = window.matchMedia("(max-width: 450px)").matches;
    if (!isMobileLayout) {
      frameEl.style.height = "";
      frameEl.style.maxHeight = "";
      document.documentElement.style.removeProperty("--app-height");
      return;
    }

    const height = Math.round(window.visualViewport?.height ?? window.innerHeight);
    document.documentElement.style.setProperty("--app-height", `${height}px`);
    frameEl.style.height = `${height}px`;
    frameEl.style.maxHeight = `${height}px`;
  }

  function handleViewportChange() {
    syncFrameViewportHeight();
    updateLayout();
    syncActivePrizePosition();
    layoutPrizesCarousel();
  }

  function updateActionKeys() {
    const enterKey = kbEl?.querySelector(".key--enter");
    const backspaceKey = kbEl?.querySelector(".key--backspace");

    if (enterKey) {
      const enabled = curCol >= COLS && !gameOver && !isAnimating;
      enterKey.classList.toggle("is-enabled", enabled);
      enterKey.classList.toggle("is-disabled", !enabled);
    }

    if (backspaceKey) {
      const enabled = curCol > 0 && !gameOver && !isAnimating;
      backspaceKey.classList.toggle("is-enabled", enabled);
      backspaceKey.classList.toggle("is-disabled", !enabled);
    }
  }

  function showTooltip(message, duration = 1800) {
    if (!tooltipEl || !frameEl) return;

    const rowEl = getRowEl(curRow);
    if (!rowEl) return;

    const frameRect = frameEl.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();

    tooltipEl.textContent = message;
    tooltipEl.style.top = `${rowRect.top - frameRect.top - 12}px`;
    tooltipEl.classList.add("is-visible");

    window.clearTimeout(showTooltip._timer);
    showTooltip._timer = window.setTimeout(() => {
      tooltipEl.classList.remove("is-visible");
    }, duration);
  }

  function shakeRow(row) {
    const rowEl = getRowEl(row);
    if (!rowEl) return;

    rowEl.classList.remove("shake");
    void rowEl.offsetWidth;
    rowEl.classList.add("shake");
    rowEl.addEventListener("animationend", () => rowEl.classList.remove("shake"), { once: true });
  }

  function showRowError(row) {
    for (let c = 0; c < COLS; c++) {
      getCell(row, c)?.classList.add("error");
    }
  }

  function clearRowError(row) {
    for (let c = 0; c < COLS; c++) {
      getCell(row, c)?.classList.remove("error");
    }
  }

  function evaluateGuess(guess) {
    const answerArr = ANSWER.split("");
    const status = Array(COLS).fill("absent");

    for (let i = 0; i < COLS; i++) {
      if (guess[i] === answerArr[i]) {
        status[i] = "correct";
        answerArr[i] = null;
      }
    }

    for (let i = 0; i < COLS; i++) {
      if (status[i] === "correct") continue;
      const idx = answerArr.indexOf(guess[i]);
      if (idx !== -1) {
        status[i] = "present";
        answerArr[idx] = null;
      }
    }

    return status;
  }

  function updateKeyboardKey(letter, state) {
    const key = kbEl?.querySelector(`[data-key="${letter}"]`);
    if (!key || key.classList.contains("key--action")) return;

    const rank = { absent: 0, present: 1, correct: 2 };
    const current =
      key.classList.contains("correct") ? "correct" :
      key.classList.contains("present") ? "present" :
      key.classList.contains("absent") ? "absent" : null;

    if (!current || rank[state] > rank[current]) {
      key.classList.remove("absent", "present", "correct");
      key.classList.add(state);
    }
  }

  function playWinScaleAnimation(row) {
    return new Promise((resolve) => {
      isAnimating = true;
      updateActionKeys();

      for (let col = 0; col < COLS; col++) {
        const cell = getCell(row, col);
        if (!cell) continue;
        cell.style.setProperty("--win-col", String(col));
        cell.classList.add("win-scale");
      }

      const totalMs = (COLS - 1) * 100 + 1000;
      window.setTimeout(() => {
        document.querySelectorAll(".cell.win-scale").forEach((cell) => cell.classList.remove("win-scale"));
        isAnimating = false;
        updateActionKeys();
        resolve();
      }, totalMs);
    });
  }

  function placeholderMarkup() {
    return (
      '<div class="win-progress__placeholder" aria-hidden="true">' +
      "<span></span><span></span><span></span><span></span><span></span>" +
      "</div>"
    );
  }

  function applyProgressVisuals(progressEl, completedSteps) {
    if (!progressEl) return;

    progressEl
      .querySelectorAll(".win-progress__col:not(.win-progress__col--prize)")
      .forEach((col, index) => {
        const step = col.querySelector(".win-progress__step");
        const fills = col.querySelectorAll(".win-progress__badge-fill");
        const text = col.querySelector(".win-progress__badge-text");
        const isDone = index < completedSteps;

        step?.classList.toggle("win-progress__step--done", isDone);

        fills.forEach((fill) => {
          fill.classList.remove("is-transitioning");
          fill.style.transform = isDone ? "scaleX(1)" : "scaleX(0)";
        });
        if (text) {
          text.classList.remove("is-transitioning");
          text.style.color = isDone ? "#333333" : "#7a7a7b";
        }
      });

    progressEl.querySelectorAll(".win-progress__line-fill").forEach((fill, index) => {
      fill.classList.remove("is-transitioning", "is-transitioning--slow");
      fill.style.width = `${lineFillPercent(index, completedSteps)}%`;
    });

    const connector = progressEl.querySelector(".win-progress__prize-connector-fill");
    if (connector) {
      connector.classList.remove("is-transitioning", "is-transitioning--slow");
      connector.style.width = "0%";
    }

    const anchorFill = progressEl.querySelector(".win-progress__prize-anchor-fill");
    const anchor = progressEl.querySelector(".win-progress__prize-anchor");
    if (anchorFill) {
      anchorFill.classList.remove("is-transitioning", "is-transitioning--slow");
      anchorFill.style.transform = "scaleX(0)";
    }
    anchor?.classList.remove("is-filled");
  }

  function applyPanelPlaceholders(progressEl) {
    if (!progressEl) return;

    progressEl.querySelectorAll(".win-progress__label").forEach((label) => {
      label.innerHTML = placeholderMarkup();
    });
  }

  function waitTransition(el, propertyName) {
    return new Promise((resolve) => {
      if (!el) {
        resolve();
        return;
      }

      const durationSec = parseFloat(getComputedStyle(el).transitionDuration) || 0;
      if (durationSec <= 0) {
        resolve();
        return;
      }

      const fallbackMs = Math.ceil(durationSec * 1000) + 40;
      let done = false;

      const finish = () => {
        if (done) return;
        done = true;
        el.removeEventListener("transitionend", onEnd);
        resolve();
      };

      const onEnd = (event) => {
        if (event.target !== el || event.propertyName !== propertyName) return;
        finish();
      };

      el.addEventListener("transitionend", onEnd);
      progressAnimTimers.push(window.setTimeout(finish, fallbackMs));
    });
  }

  function getCompletedCount() {
    return WIN_PROGRESS_WORDS.filter(Boolean).length;
  }

  function lineFillPercent(lineIndex, completedSteps) {
    if (completedSteps <= 0) return 0;
    if (lineIndex < completedSteps - 1) return 100;
    if (lineIndex === completedSteps - 1) return 50;
    return 0;
  }

  function clearProgressAnimTimers() {
    progressAnimTimers.forEach((id) => window.clearTimeout(id));
    progressAnimTimers = [];
  }

  function scheduleProgressPhase(fn, delay) {
    progressAnimTimers.push(window.setTimeout(fn, delay));
  }

  function getLineFill(lineIndex) {
    return getActiveWinProgress()?.querySelectorAll(".win-progress__line-fill")[lineIndex];
  }

  function getConnectorFill() {
    return getActiveWinProgress()?.querySelector(".win-progress__prize-connector-fill");
  }

  function getPrizeAnchor() {
    return getActiveWinProgress()?.querySelector(".win-progress__prize-anchor");
  }

  function getAnchorFill() {
    return getPrizeAnchor()?.querySelector(".win-progress__prize-anchor-fill");
  }

  function setAnchorFill(scale, animate, slow) {
    const anchor = getPrizeAnchor();
    const fill = getAnchorFill();
    if (!anchor || !fill) return;

    fill.classList.remove("is-transitioning", "is-transitioning--slow");
    if (animate) {
      fill.classList.add(slow ? "is-transitioning--slow" : "is-transitioning");
    }
    void fill.offsetWidth;
    fill.style.transform = `scaleX(${scale})`;
    anchor.classList.toggle("is-filled", scale >= 1);
  }

  function setConnectorFill(percent, animate, slow) {
    const el = getConnectorFill();
    if (!el) return;

    el.classList.remove("is-transitioning", "is-transitioning--slow");
    if (animate) {
      el.classList.add(slow ? "is-transitioning--slow" : "is-transitioning");
    }
    void el.offsetWidth;
    el.style.width = `${percent}%`;
  }

  function setLineFill(lineIndex, percent, animate, slow) {
    const el = getLineFill(lineIndex);
    if (!el) return;

    el.classList.remove("is-transitioning", "is-transitioning--slow");
    if (animate) {
      el.classList.add(slow ? "is-transitioning--slow" : "is-transitioning");
    }
    void el.offsetWidth;
    el.style.width = `${percent}%`;
  }

  function setBadgeFillScale(slot, scale, animate) {
    const cols = getActiveWinProgress()?.querySelectorAll(
      ".win-progress__col:not(.win-progress__col--prize)"
    );
    const col = cols?.[slot];
    const fills = col?.querySelectorAll(".win-progress__badge-fill");
    const text = col?.querySelector(".win-progress__badge-text");
    if (!fills?.length) return;

    fills.forEach((fill) => {
      fill.classList.toggle("is-transitioning", animate);
      if (!animate) {
        fill.style.transform = `scaleX(${scale})`;
      } else {
        void fill.offsetWidth;
        fill.style.transform = `scaleX(${scale})`;
      }
    });

    if (text) {
      if (animate) {
        text.classList.add("is-transitioning");
        void text.offsetWidth;
        text.style.color = scale >= 1 ? "#333333" : "#7a7a7b";
      } else {
        text.classList.remove("is-transitioning");
        text.style.color = scale >= 1 ? "#333333" : "#7a7a7b";
      }
    }
  }

  function setProgressLines(completedSteps) {
    const progressEl = getActiveWinProgress();
    if (!progressEl) return;

    if (isFifthWordScenario() && progressEl.dataset.fifthToPrize === "pending") {
      progressEl.querySelectorAll(".win-progress__line-fill").forEach((fill, index) => {
        fill.classList.remove("is-transitioning", "is-transitioning--slow");
        fill.style.width = index < 3 ? "100%" : "50%";
      });
      setConnectorFill(0, false);
      setAnchorFill(0, false);
      return;
    }

    progressEl.querySelectorAll(".win-progress__line-fill").forEach((fill, index) => {
      fill.classList.remove("is-transitioning", "is-transitioning--slow");
      fill.style.width = `${lineFillPercent(index, completedSteps)}%`;
    });

    const connector = getConnectorFill();
    if (connector) {
      connector.classList.remove("is-transitioning", "is-transitioning--slow");
      connector.style.width = "0%";
    }

    setAnchorFill(0, false);
  }

  function setProgressBadges(completedSteps) {
    const progressEl = getActiveWinProgress();
    if (!progressEl) return;

    progressEl
      .querySelectorAll(".win-progress__col:not(.win-progress__col--prize)")
      .forEach((col, index) => {
        const step = col.querySelector(".win-progress__step");
        const fills = col.querySelectorAll(".win-progress__badge-fill");
        const text = col.querySelector(".win-progress__badge-text");
        const isDone = index < completedSteps;

        step?.classList.toggle("win-progress__step--done", isDone);

        fills.forEach((fill) => {
          fill.classList.remove("is-transitioning");
          fill.style.transform = isDone ? "scaleX(1)" : "scaleX(0)";
        });
        if (text) {
          text.classList.remove("is-transitioning");
          text.style.color = isDone ? "#333333" : "#7a7a7b";
        }
      });
  }

  function setProgressLabel(col, word) {
    const label = col.querySelector(".win-progress__label");
    if (!label) return;

    label.innerHTML = word
      ? `<span class="win-progress__word">${word}</span>`
      : placeholderMarkup();
  }

  function renderWinProgress() {
    const progressEl = getActiveWinProgress();
    if (!progressEl) return;

    const completed = isWordNotGuessedScenario()
      ? 1
      : isFifthWordScenario()
        ? fifthWordPanelIndex === 0
          ? FIFTH_WORD_PROGRESS_WORDS.length
          : 0
        : getCompletedCount();

    setProgressBadges(completed);
    setProgressLines(completed);

    progressEl
      .querySelectorAll(".win-progress__col:not(.win-progress__col--prize)")
      .forEach((col, index) => {
        let words = WIN_PROGRESS_WORDS;
        if (isWordNotGuessedScenario()) {
          words = ["АРТЕМ", null, null, null];
        } else if (isFifthWordScenario()) {
          words =
            fifthWordPanelIndex === 0
              ? FIFTH_WORD_PROGRESS_WORDS
              : [null, null, null, null];
        }
        setProgressLabel(col, words[index]);
      });

    const prizeCol = progressEl.querySelector(".win-progress__col--prize");
    if (prizeCol) {
      setProgressLabel(prizeCol, getPrizeColumnLabelWord());
    }

    syncActivePrizePosition();
  }

  function getProgressTotalMs(slot) {
    return (
      (slot === 0 ? 0 : PROGRESS_PHASE1_MS) +
      PROGRESS_PHASE2_MS +
      PROGRESS_PHASE3_MS
    );
  }

  function getProgressWordTiming(slot) {
    const totalMs = getProgressTotalMs(slot);
    const dotsStartMs = Math.round(totalMs * PROGRESS_WORD_DOTS_AT);
    const dotsDurationMs = Math.round(totalMs * PROGRESS_WORD_DOTS_FOR);
    const revealStartMs = dotsStartMs + dotsDurationMs;
    const revealEndMs = Math.round(totalMs * PROGRESS_WORD_DONE_AT);
    const wordRevealDurationMs = Math.max(revealEndMs - revealStartMs, 240);

    return {
      dotsStartMs,
      dotsDurationMs,
      revealStartMs,
      wordRevealDurationMs,
    };
  }

  function applyProgressWordTiming(el, timing) {
    el.style.setProperty("--dots-duration", `${timing.dotsDurationMs}ms`);
    el.style.setProperty(
      "--word-reveal-duration",
      `${timing.wordRevealDurationMs}ms`
    );
  }

  function scheduleWordAnimation(word, label, slot) {
    if (!label) return;

    const timing = getProgressWordTiming(slot);

    scheduleProgressPhase(() => {
      const placeholder = label.querySelector(".win-progress__placeholder");
      if (!placeholder) return;

      applyProgressWordTiming(placeholder, timing);
      requestAnimationFrame(() => {
        placeholder.classList.add("win-progress__placeholder--collapse");
      });
    }, timing.dotsStartMs);

    scheduleProgressPhase(() => {
      label.innerHTML = `<span class="win-progress__word win-progress__word--enter">${word}</span>`;
      const wordEl = label.querySelector(".win-progress__word");
      if (!wordEl) return;

      applyProgressWordTiming(wordEl, timing);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wordEl.classList.add("win-progress__word--visible");
        });
      });
    }, timing.revealStartMs);
  }

  function animateWinProgress(word) {
    const progressEl = getActiveWinProgress();
    if (!progressEl) return;

    const slot = getCompletedCount();
    if (slot >= 4) return;

    clearProgressAnimTimers();
    resetProgressStickers();
    renderWinProgress();

    const cols = progressEl.querySelectorAll(
      ".win-progress__col:not(.win-progress__col--prize)"
    );
    const label = cols[slot]?.querySelector(".win-progress__label");
    const prizeLabel = progressEl.querySelector(
      ".win-progress__col--prize .win-progress__label"
    );

    progressEl.classList.add("win-progress--animating");
    setProgressBadges(slot);
    setProgressLines(slot);
    setBadgeFillScale(slot, 0, false);
    scheduleWordAnimation(word, label, slot);
    if (slot === 3) {
      scheduleWordAnimation(PRIZE_COLUMN_WORD, prizeLabel, 3);
    }

    const finish = () => {
      WIN_PROGRESS_WORDS[slot] = word;
      progressEl.classList.remove("win-progress--animating");
      progressEl
        .querySelectorAll(
          ".win-progress__line-fill, .win-progress__badge-fill, .win-progress__badge-text, .win-progress__prize-anchor-fill"
        )
        .forEach((el) => {
          el.classList.remove("is-transitioning", "is-transitioning--slow");
        });
      renderWinProgress();
    };

    const runPhase3 = () => {
      setLineFill(slot, 50, true, true);
      scheduleProgressPhase(finish, PROGRESS_PHASE3_MS);
    };

    const runPhase2 = () => {
      setBadgeFillScale(slot, 1, true);
      if (shouldAttachThematicSticker()) {
        attachThematicSticker(slot);
      }
      scheduleProgressPhase(runPhase3, PROGRESS_PHASE2_MS);
    };

    const runPhase1 = () => {
      if (slot === 0) {
        runPhase2();
        return;
      }
      setLineFill(slot - 1, 100, true, false);
      scheduleProgressPhase(runPhase2, PROGRESS_PHASE1_MS);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(runPhase1);
    });
  }

  function getGiftIconEl() {
    return document.querySelector('.tab[data-tab="prizes"] .tab__icon img');
  }

  function revealActivePanelContent(options = {}) {
    const { revealBottom = true } = options;
    revealActivePrize();
    if (shouldSplitPrizeLayers() && revealBottom) {
      revealActivePrizeBottom();
    }
  }

  function bounceGiftIcon() {
    const giftIcon = getGiftIconEl();
    if (!giftIcon) return;

    giftIcon.classList.remove("is-prize-landing");
    void giftIcon.offsetWidth;
    giftIcon.classList.add("is-prize-landing");
    giftIcon.addEventListener(
      "animationend",
      () => {
        giftIcon.classList.remove("is-prize-landing");
      },
      { once: true }
    );
  }

  function flyOpacity(rawT) {
    if (rawT <= 0.4) return 1;
    return 1 - (rawT - 0.4) / 0.6;
  }

  function quadraticBezierPoint(p0, p1, p2, t) {
    const u = 1 - t;
    return {
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    };
  }

  function settleBottomPrizeLayer() {
    return new Promise((resolve) => {
      const bottomWrap = getActivePrizeBottomWrap();
      if (!bottomWrap?.classList.contains("is-popped")) {
        resolve();
        return;
      }

      bottomWrap.classList.remove("is-popped");
      bottomWrap.classList.add("is-settling");

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        bottomWrap.classList.remove("is-settling");
        resolve();
      };

      bottomWrap.addEventListener(
        "transitionend",
        (event) => {
          if (event.target !== bottomWrap || event.propertyName !== "transform") return;
          finish();
        },
        { once: true }
      );

      progressAnimTimers.push(window.setTimeout(finish, 320));
    });
  }

  function flyPrizeToGiftIcon() {
    return new Promise((resolve) => {
      const prize = getActivePrizeEl();
      const panel = winProgressPanelEl;
      const giftIcon = getGiftIconEl();
      const splitLayers = shouldSplitPrizeLayers();
      const flySource = splitLayers
        ? prize?.querySelector(".win-progress__prize-layer--top")
        : prize;

      if (splitLayers) {
        settleBottomPrizeLayer().then(attachPrizeSticker);
      }

      if (!flySource || !giftIcon) {
        removePrizeForPanel(panel);
        resolve();
        return;
      }

      const startRect = flySource.getBoundingClientRect();
      const startX = startRect.left + startRect.width / 2;
      const startY = startRect.top + startRect.height / 2;
      const endRect = giftIcon.getBoundingClientRect();
      const endX = endRect.left + endRect.width / 2;
      const endY = endRect.top + endRect.height / 2;
      const controlX = (startX + endX) / 2;
      const controlY =
        Math.min(startY, endY) - Math.max(48, Math.abs(endX - startX) * 0.22);

      const ghost = flySource.cloneNode(true);
      ghost.classList.add("win-progress__prize-fly-ghost");
      ghost.classList.remove(
        "win-progress__prize-stack",
        "win-progress__prize--overlay",
        "win-progress__prize--hidden",
        "is-revealed",
        "is-revealing",
        "is-popped",
        "is-wiggling"
      );
      ghost.style.width = `${startRect.width}px`;
      ghost.style.height = `${startRect.height}px`;
      ghost.style.left = `${startX}px`;
      ghost.style.top = `${startY}px`;
      ghost.style.transform = `translate(-50%, -50%) scale(${PRIZE_POP_SCALE})`;
      ghost.style.opacity = "1";
      document.body.appendChild(ghost);

      if (splitLayers) {
        flySource.style.visibility = "hidden";
      } else {
        prize.style.visibility = "hidden";
      }

      const startScale = PRIZE_POP_SCALE;
      const endScale = 0.5;
      const startTime = performance.now();
      let giftLandingPlayed = false;

      function tick(now) {
        const rawT = Math.min(1, (now - startTime) / PRIZE_TO_TAB_MS);
        const t = 1 - Math.pow(1 - rawT, 3);
        const pos = quadraticBezierPoint(
          { x: startX, y: startY },
          { x: controlX, y: controlY },
          { x: endX, y: endY },
          t
        );
        const scale = startScale + (endScale - startScale) * t;
        const opacity = flyOpacity(rawT);

        if (!giftLandingPlayed && rawT >= 0.6) {
          giftLandingPlayed = true;
          bounceGiftIcon();
        }

        ghost.style.left = `${pos.x}px`;
        ghost.style.top = `${pos.y}px`;
        ghost.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ghost.style.opacity = String(opacity);

        if (rawT < 1) {
          requestAnimationFrame(tick);
        } else {
          ghost.remove();
          removePrizeForPanel(panel);
          resolve();
        }
      }

      requestAnimationFrame(tick);
    });
  }

  function swapProgressToNext() {
    return new Promise((resolve) => {
      setPrizePopOverflowEnabled(false);
      const stage = winProgressStageEl;
      const currentPanel = winProgressPanelEl;
      if (!stage || !currentPanel) {
        resolve();
        return;
      }

      const nextPanel = document.createElement("div");
      nextPanel.className = "win-progress-panel win-progress-panel--enter";
      nextPanel.innerHTML = `<div class="win-progress" id="win-progress-next">${buildProgressHtml(
        FIFTH_WORD_NEXT_BADGES
      )}</div>`;

      const nextProgress = nextPanel.querySelector(".win-progress");
      applyProgressVisuals(nextProgress, 0);
      applyPanelPlaceholders(nextProgress);

      if (shouldSplitPrizeLayers()) {
        mountPrizePanelBottomLayer(nextPanel, { hidden: false });
      }

      stage.appendChild(nextPanel);

      requestAnimationFrame(() => {
        currentPanel.classList.add("win-progress-panel--exit");
        nextPanel.classList.add("is-active");
      });

      window.setTimeout(() => {
        removePrizeForPanel(currentPanel);
        currentPanel.remove();
        nextPanel.classList.remove("win-progress-panel--enter");
        nextPanel.id = "win-progress-panel";
        const inner = nextPanel.querySelector("#win-progress-next");
        if (inner) {
          inner.id = "win-progress";
        }
        fifthWordPanelIndex = 1;
        refreshWinProgressRefs();
        renderWinProgress();
        mountPrizeForPanel(winProgressPanelEl, { hidden: true, bottomHidden: false });
        revealActivePanelContent({ revealBottom: false });
        window.setTimeout(resolve, PRIZE_REVEAL_MS);
      }, PROGRESS_SWAP_MS);
    });
  }

  function animateFifthWordProgress() {
    const progressEl = getActiveWinProgress();
    if (!progressEl) return;

    clearProgressAnimTimers();
    resetProgressStickers();
    stopPrizeIdleAnimation();
    fifthWordPrizeLabelRevealed = false;

    progressEl.dataset.fifthToPrize = "pending";
    renderWinProgress();
    progressEl.classList.add("win-progress--animating");

    const prizeLabel = progressEl.querySelector(
      ".win-progress__col--prize .win-progress__label"
    );
    const prizeWordTiming = getProgressWordTiming(3);
    scheduleWordAnimation(PRIZE_COLUMN_WORD, prizeLabel, 3);
    scheduleProgressPhase(() => {
      fifthWordPrizeLabelRevealed = true;
    }, prizeWordTiming.revealStartMs + prizeWordTiming.wordRevealDurationMs);

    const finish = () => {
      setPrizePopOverflowEnabled(false);
      fifthWordPrizeLabelRevealed = false;
      const activeProgress = getActiveWinProgress();
      if (activeProgress) {
        delete activeProgress.dataset.fifthToPrize;
        activeProgress.classList.remove("win-progress--animating");
        activeProgress
          .querySelectorAll(
            ".win-progress__line-fill, .win-progress__badge-fill, .win-progress__badge-text, .win-progress__prize-anchor-fill"
          )
          .forEach((el) => {
            el.classList.remove("is-transitioning", "is-transitioning--slow");
          });
      }
      renderWinProgress();
      startPrizeIdleAnimation();
    };

    const runSwap = () => {
      swapProgressToNext().then(finish);
    };

    const runFlyPrize = () => {
      flyPrizeToGiftIcon().then(runSwap);
    };

    const runAfterAnchorFilled = () => {
      const prize = getActivePrizeEl();
      const bottomWrap = getActivePrizeBottomWrap();
      const particlesEl = getActivePrizeParticlesEl();

      syncActivePrizePosition();

      if (prize) {
        prize.classList.remove("is-wiggling", "is-popped");
        void prize.offsetWidth;
        prize.classList.add("is-popped");
      }
      if (bottomWrap) {
        bottomWrap.classList.remove("is-wiggling", "is-popped");
        void bottomWrap.offsetWidth;
        bottomWrap.classList.add("is-popped");
        setPrizePopOverflowEnabled(true);
      }
      if (particlesEl) {
        spawnPrizeParticles(particlesEl, 1.7);
      }
      scheduleProgressPhase(runFlyPrize, PRIZE_FLY_DELAY_MS);
    };

    const runPrizeLine = () => {
      const lineEl = getLineFill(3);
      setLineFill(3, 100, true, true);

      waitTransition(lineEl, "width").then(() => {
        const connectorEl = getConnectorFill();
        setConnectorFill(100, true, true);

        waitTransition(connectorEl, "width").then(() => {
          const anchorFillEl = getAnchorFill();
          setAnchorFill(1, true, true);

          waitTransition(anchorFillEl, "transform").then(runAfterAnchorFilled);
        });
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(runPrizeLine);
    });
  }

  function prizeDateIconMarkup() {
    return (
      '<svg class="win-prize-card__date-icon" viewBox="0 0 12 12" aria-hidden="true">' +
      '<circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M6 3.2V6.2L7.8 7.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function prizeCardMarkup(item) {
    return (
      '<article class="win-prize-card">' +
      '<img class="win-prize-card__image" src="assets/prize-card.png" alt="" />' +
      '<div class="win-prize-card__content">' +
      `<p class="win-prize-card__title">${item.title}</p>` +
      `<span class="win-prize-card__date">${prizeDateIconMarkup()}${item.date}</span>` +
      "</div>" +
      "</article>"
    );
  }

  function layoutPrizesCarousel() {
    const track = prizesCarouselTrack;
    const block = track?.closest(".win-block--3");
    const allBtn = block?.querySelector(".win-prizes__all");
    if (!track || !allBtn) return;

    const cardWidth = allBtn.offsetWidth;
    if (!cardWidth) return;

    track.style.setProperty("--prize-card-width", `${cardWidth}px`);
  }

  function initPrizesCarousel() {
    const track = document.getElementById("prizes-track");
    if (!track) return;

    prizesCarouselTrack = track;
    track.innerHTML = PRIZE_CAROUSEL_ITEMS.map(prizeCardMarkup).join("");

    requestAnimationFrame(() => {
      layoutPrizesCarousel();
      track.scrollLeft = 0;
    });
    window.addEventListener("resize", layoutPrizesCarousel);
  }

  function spawnPrizeParticles(stage, particleScale = 1) {
    const count = Math.floor((12 + Math.floor(Math.random() * 6)) * particleScale);

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      const isSpark = Math.random() > 0.55;
      particle.className = isSpark
        ? "win-progress__prize-particle win-progress__prize-particle--spark"
        : "win-progress__prize-particle";
      particle.setAttribute("aria-hidden", "true");

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
      const distance = 28 + Math.random() * 34;
      const size = isSpark ? 4 + Math.random() * 4 : 6 + Math.random() * 5;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
      particle.style.background =
        PRIZE_PARTICLE_COLORS[Math.floor(Math.random() * PRIZE_PARTICLE_COLORS.length)];
      particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
      particle.style.animationDuration = `${0.7 + Math.random() * 0.45}s`;

      stage.appendChild(particle);
      particle.addEventListener(
        "animationend",
        () => {
          particle.remove();
        },
        { once: true }
      );
    }
  }

  function wigglePrize() {
    if (!isPrizeWiggleAllowed()) return;

    const prize = getActivePrizeEl();
    const bottomWrap = getActivePrizeBottomWrap();
    const particlesEl = getActivePrizeParticlesEl();
    if (!prize || !particlesEl) return;

    prize.classList.remove("is-wiggling");
    void prize.offsetWidth;
    prize.classList.add("is-wiggling");
    spawnPrizeParticles(particlesEl);

    prize.addEventListener(
      "animationend",
      () => {
        prize.classList.remove("is-wiggling");
      },
      { once: true }
    );

    if (!bottomWrap) return;

    bottomWrap.classList.remove("is-wiggling");
    void bottomWrap.offsetWidth;
    bottomWrap.classList.add("is-wiggling");
    bottomWrap.addEventListener(
      "animationend",
      () => {
        bottomWrap.classList.remove("is-wiggling");
      },
      { once: true }
    );
  }

  function startPrizeIdleAnimation() {
    if (!isPrizeWiggleAllowed()) return;
    if (prizeAnimTimer) return;

    window.setTimeout(() => {
      wigglePrize();
      prizeAnimTimer = window.setInterval(wigglePrize, PRIZE_WIGGLE_INTERVAL_MS);
    }, PRIZE_WIGGLE_INTERVAL_MS);
  }

  function stopPrizeIdleAnimation() {
    if (prizeAnimTimer) {
      clearInterval(prizeAnimTimer);
      prizeAnimTimer = null;
    }
    getActivePrizeEl()?.classList.remove("is-wiggling");
    getActivePrizeBottomWrap()?.classList.remove("is-wiggling");
  }

  function scrollMainToTop(durationMs) {
    if (!mainEl || mainEl.scrollTop <= 0) return;

    const start = mainEl.scrollTop;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      mainEl.scrollTop = Math.round(start * (1 - eased));
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        mainEl.scrollTop = 0;
        updateMainScrollFade();
      }
    }

    requestAnimationFrame(step);
  }

  function clearKeyboardHighlights() {
    kbEl?.querySelectorAll(".key").forEach((key) => {
      if (!key.classList.contains("key--action")) {
        key.classList.remove("absent", "present", "correct");
      }
    });
  }

  function resetWinProgress() {
    resetProgressStageToDefault();
    clearProgressAnimTimers();

    if (isFifthWordScenario()) {
      for (let i = 0; i < WIN_PROGRESS_WORDS.length; i += 1) {
        WIN_PROGRESS_WORDS[i] = FIFTH_WORD_PROGRESS_WORDS[i];
      }
    } else {
      WIN_PROGRESS_WORDS[0] = "АРТЕМ";
      for (let i = 1; i < WIN_PROGRESS_WORDS.length; i += 1) {
        WIN_PROGRESS_WORDS[i] = null;
      }
    }

    const progressEl = getActiveWinProgress();
    if (progressEl) {
      delete progressEl.dataset.fifthToPrize;
      progressEl.classList.remove("win-progress--animating");
      progressEl
        .querySelectorAll(
          ".win-progress__line-fill, .win-progress__badge-fill, .win-progress__badge-text, .win-progress__prize-anchor-fill"
        )
        .forEach((el) => {
          el.classList.remove("is-transitioning", "is-transitioning--slow");
        });
    }

    renderWinProgress();
    resetProgressStickers();
  }

  function unflipAllCells() {
    clearKeyboardHighlights();

    for (let d = 0; d < UNFLIP_DIAGONAL_COUNT; d += 1) {
      const delay = d * UNFLIP_DIAGONAL_STAGGER_MS;

      for (let row = 0; row < ROWS; row += 1) {
        const col = d - row;
        if (col < 0 || col >= COLS) continue;

        const cell = getCell(row, col);
        const inner = cell?.querySelector(".cell-inner");
        if (!inner?.classList.contains("flipped")) continue;

        window.setTimeout(() => {
          const front = cell.querySelector(".cell-front");
          const back = cell.querySelector(".cell-back");

          inner.classList.remove("flipped");

          window.setTimeout(() => {
            if (front) front.textContent = "";
            if (back) {
              back.textContent = "";
              back.className = "cell-back";
            }

            cell.classList.remove("filled", "error", "win-scale");
            cell.style.removeProperty("--win-col");
          }, FLIP_DURATION_MS);
        }, delay);
      }
    }
  }

  function stopConfetti() {
    if (confettiRafId !== null) {
      cancelAnimationFrame(confettiRafId);
      confettiRafId = null;
    }
    if (confettiEl) {
      confettiEl.classList.remove("is-playing");
      confettiEl.innerHTML = "";
    }
  }

  function playConfetti() {
    const main = document.querySelector(".main");
    const gridArea = document.querySelector(".grid-area");
    const heroSlot = document.querySelector(".win-hero-slot");
    if (!confettiEl || !main) return;

    stopConfetti();

    const width = main.clientWidth;
    const height = main.clientHeight;
    if (!width || !height) return;

    const mainRect = main.getBoundingClientRect();
    const gridRect = gridArea?.getBoundingClientRect();
    const heroRect = heroSlot?.getBoundingClientRect();

    let spawnYMin = height * 0.12;
    let spawnYMax = height * 0.42;

    if (gridRect && heroRect) {
      spawnYMin = Math.max(0, gridRect.bottom - mainRect.top - 16);
      spawnYMax = Math.min(height, heroRect.top - mainRect.top + heroRect.height * 0.6);
      if (spawnYMax <= spawnYMin) {
        spawnYMax = spawnYMin + 80;
      }
    }

    confettiEl.classList.add("is-playing");

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    confettiEl.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const particles = [];
    let lastFrameTime = performance.now();

    function spawnParticle(side) {
      const y = spawnYMin + Math.random() * (spawnYMax - spawnYMin);
      const fromLeft = side === "left";
      const x = fromLeft ? 0 : width;
      const angle = fromLeft
        ? -Math.PI / 2 + Math.random() * (Math.PI / 3.5)
        : -Math.PI / 2 - Math.random() * (Math.PI / 3.5);
      const speed = CONFETTI_SPEED_MIN + Math.random() * CONFETTI_SPEED_RANGE;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: CONFETTI_GRAVITY_MIN + Math.random() * CONFETTI_GRAVITY_RANGE,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.4,
        w: 3 + Math.random() * 5,
        h: 5 + Math.random() * 9,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 1,
        decay: CONFETTI_DECAY_MIN + Math.random() * CONFETTI_DECAY_RANGE,
      });
    }

    for (let i = 0; i < CONFETTI_COUNT; i += 1) {
      spawnParticle(i % 2 === 0 ? "left" : "right");
    }

    function drawParticle(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.min(1, p.life * 1.4);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    function tick(now) {
      const dt = Math.min((now - lastFrameTime) / (1000 / 60), 2.5);
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.spin * dt;
        p.life -= p.decay * dt;

        if (p.life <= 0 || p.y > height + 24 || p.x < -24 || p.x > width + 24) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(p);
      }

      if (particles.length > 0) {
        confettiRafId = requestAnimationFrame(tick);
      } else {
        stopConfetti();
      }
    }

    confettiRafId = requestAnimationFrame(tick);
  }

  function playWinHeroAnimation(word) {
    return new Promise((resolve) => {
      const app = document.querySelector(".app");
      if (!app) {
        resolve();
        return;
      }

      isAnimating = true;
      updateActionKeys();

      if (word) {
        if (isFifthWordScenario()) {
          animateFifthWordProgress();
        } else {
          animateWinProgress(word);
        }
      }

      app.classList.add("is-animating-win-hero");

      requestAnimationFrame(() => {
        app.classList.add("scenario-win-hero");
      });

      window.setTimeout(() => {
        app.classList.remove("is-animating-win-hero");
        isAnimating = false;
        updateActionKeys();
        resolve();
      }, WIN_HERO_MS);
    });
  }

  function playNormalWordAnimation() {
    return new Promise((resolve) => {
      const app = document.querySelector(".app");
      const main = document.querySelector(".main");
      if (!app || !kbEl || !main) {
        resolve();
        return;
      }

      isAnimating = true;
      updateActionKeys();

      const gridArea = document.querySelector(".grid-area");
      if (gridArea) {
        savedGameCellWidth = gridArea.style.getPropertyValue("--cell-width");
        savedGameCellHeight = gridArea.style.getPropertyValue("--cell-height");
      }

      const mainRect = main.getBoundingClientRect();
      const kbRect = kbEl.getBoundingClientRect();
      const frameRect = frameEl?.getBoundingClientRect();
      const kbBottom = mainRect.bottom - kbRect.bottom;
      const kbHide = frameRect
        ? frameRect.bottom - kbRect.top + kbEl.offsetHeight
        : kbEl.offsetHeight + 200;

      app.style.setProperty("--kb-bottom", `${kbBottom}px`);
      app.style.setProperty("--kb-hide-y", `${kbHide}px`);
      app.classList.add("keyboard-detached");

      if (winPanelEl) {
        winPanelEl.hidden = false;
        syncActivePrizePosition();
        if (!isFifthWordScenario()) {
          startPrizeIdleAnimation();
        }
        requestAnimationFrame(() => {
          layoutPrizesCarousel();
          syncActivePrizePosition();
        });
        const panelRect = winPanelEl.getBoundingClientRect();
        const panelOffset = Math.max(0, kbRect.top - panelRect.top);
        app.style.setProperty("--win-panel-offset", `${panelOffset}px`);
      }

      void kbEl.offsetHeight;

      app.classList.add("is-animating-normal-word");

      window.setTimeout(() => {
        if (!isWordNotGuessedScenario()) {
          playConfetti();
        }
      }, NORMAL_WORD_MS * 0.2);

      requestAnimationFrame(() => {
        app.classList.add("scenario-normal-word");
      });

      window.setTimeout(() => {
        app.classList.remove("is-animating-normal-word");
        isAnimating = false;
        updateActionKeys();
        updateMainScrollFade();
        resolve();
      }, NORMAL_WORD_MS);
    });
  }

  function playReverseWinHeroAnimation() {
    return new Promise((resolve) => {
      const app = document.querySelector(".app");
      if (!app) {
        resolve();
        return;
      }

      isAnimating = true;
      updateActionKeys();
      stopConfetti();
      stopPrizeIdleAnimation();
      scrollMainToTop(WIN_HERO_MS);

      board = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
      submittedWords.length = 0;
      curRow = 0;
      curCol = 0;

      unflipAllCells();

      app.classList.add("is-animating-reverse-win-hero");

      requestAnimationFrame(() => {
        app.classList.remove("scenario-win-hero");
      });

      window.setTimeout(() => {
        app.classList.remove("is-animating-reverse-win-hero");
        resolve();
      }, WIN_HERO_MS);
    });
  }

  function playReverseNormalWordAnimation() {
    return new Promise((resolve) => {
      const app = document.querySelector(".app");
      if (!app || !kbEl) {
        resolve();
        return;
      }

      const gridArea = document.querySelector(".grid-area");
      if (gridArea) {
        if (savedGameCellWidth && savedGameCellHeight) {
          gridArea.style.setProperty("--cell-width", savedGameCellWidth);
          gridArea.style.setProperty("--cell-height", savedGameCellHeight);
        } else {
          updateLayout({ force: true, gameMode: true });
        }
      }

      app.classList.add("is-animating-reverse-normal-word");

      requestAnimationFrame(() => {
        app.classList.add("is-returning-to-game");
      });

      window.setTimeout(() => {
        app.classList.remove(
          "is-animating-reverse-normal-word",
          "is-returning-to-game"
        );

        if (winPanelEl) {
          winPanelEl.hidden = true;
        }

        setMainScrollable(false);
        resolve();
      }, REVERSE_NORMAL_WORD_MS);
    });
  }

  function resetGameState() {
    const app = document.querySelector(".app");
    app?.classList.remove(
      "scenario-normal-word",
      "scenario-win-hero",
      "scenario-thematic-word",
      "scenario-word-not-guessed",
      "keyboard-detached",
      "is-animating-reverse-win-hero",
      "is-animating-reverse-normal-word",
      "is-returning-to-game"
    );
    app?.style.removeProperty("--kb-bottom");
    app?.style.removeProperty("--kb-hide-y");
    app?.style.removeProperty("--win-panel-offset");

    curRow = 0;
    curCol = 0;
    gameOver = false;
    isWordNotGuessedActive = false;
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
    submittedWords.length = 0;

    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const cell = getCell(row, col);
        if (!cell) continue;

        cell.classList.remove("filled", "error", "win-scale");
        cell.style.removeProperty("--win-col");

        const front = cell.querySelector(".cell-front");
        const back = cell.querySelector(".cell-back");
        const inner = cell.querySelector(".cell-inner");

        if (front) front.textContent = "";
        if (back) {
          back.textContent = "";
          back.className = "cell-back";
        }
        inner?.classList.remove("flipped");
      }
    }

    kbEl?.querySelectorAll(".key").forEach((key) => {
      if (!key.classList.contains("key--action")) {
        key.classList.remove("absent", "present", "correct");
      }
    });

    stopPrizeIdleAnimation();
    resetWinProgress();
    applyWinResultContent();
    isAnimating = false;
    updateLayout();
    updateActionKeys();
    updateMainScrollFade();
  }

  async function playAgain() {
    const app = document.querySelector(".app");
    if (isAnimating || !app?.classList.contains("scenario-normal-word")) return;

    await playReverseWinHeroAnimation();
    await playReverseNormalWordAnimation();
    resetGameState();
  }

  function revealRow(row) {
    const guess = board[row].join("");
    const status = evaluateGuess(guess);
    isAnimating = true;
    updateActionKeys();

    return new Promise((resolve) => {
      let completed = 0;

      status.forEach((state, col) => {
        const cell = getCell(row, col);
        if (!cell) return;

        const back = cell.querySelector(".cell-back");
        const inner = cell.querySelector(".cell-inner");

        if (back) {
          back.textContent = guess[col];
          back.className = `cell-back ${state}`;
        }

        window.setTimeout(() => {
          inner?.classList.add("flipped");

          window.setTimeout(() => {
            completed += 1;
            if (completed === COLS) {
              for (let c = 0; c < COLS; c++) {
                updateKeyboardKey(guess[c], status[c]);
              }
              window.setTimeout(() => {
                isAnimating = false;
                updateActionKeys();
                resolve(guess === ANSWER);
              }, 120);
            }
          }, FLIP_DURATION_MS);
        }, col * FLIP_STAGGER_MS);
      });
    });
  }

  async function submitRow() {
    if (curCol < COLS || gameOver || isAnimating) return;

    const guess = board[curRow].join("");

    if (submittedWords.includes(guess)) {
      shakeRow(curRow);
      showRowError(curRow);
      window.setTimeout(() => clearRowError(curRow), 600);
      return;
    }

    commitProfileSettingsIfNeeded();

    submittedWords.push(guess);
    const won = await revealRow(curRow);

    if (won) {
      gameOver = true;
      applyWinResultContent();
      await playWinScaleAnimation(curRow);
      await playNormalWordAnimation();
      setMainScrollable(true);
      await playWinHeroAnimation(guess);
      updateActionKeys();
      return;
    }

    curRow += 1;
    curCol = 0;

    if (curRow >= ROWS) {
      gameOver = true;
      isWordNotGuessedActive = true;
      prepareWordNotGuessedProgress();
      applyWinResultContent();
      await playNormalWordAnimation();
      setMainScrollable(true);
      await playWinHeroAnimation(null);
      updateActionKeys();
      return;
    }

    updateActionKeys();
  }

  function onKey(ch) {
    if (gameOver || isAnimating || curRow >= ROWS) return;

    if (ch === "⌫") {
      if (curCol > 0) {
        curCol -= 1;
        board[curRow][curCol] = "";
        const cell = getCell(curRow, curCol);
        const front = cell?.querySelector(".cell-front");
        if (front) front.textContent = "";
        cell?.classList.remove("filled", "error");
      }
      updateActionKeys();
      return;
    }

    if (ch === "✓") {
      submitRow();
      return;
    }

    if (curCol < COLS && /^[А-ЯЁ]$/.test(ch)) {
      board[curRow][curCol] = ch;
      const cell = getCell(curRow, curCol);
      const front = cell?.querySelector(".cell-front");
      if (front) front.textContent = ch;
      cell?.classList.add("filled");
      cell?.classList.remove("error");
      curCol += 1;
      updateActionKeys();
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key.toUpperCase();
    if (key === "ENTER") onKey("✓");
    else if (key === "BACKSPACE") onKey("⌫");
    else if (/^[А-ЯЁ]$/.test(key)) onKey(key);
  });

  scenarioSelectEl?.addEventListener("change", markProfileSettingsDirty);
  thematicWordSwitchEl?.addEventListener("change", markProfileSettingsDirty);

  buildGrid();
  buildKeyboard();
  initTabBar();
  applyWinResultContent();
  syncFrameViewportHeight();
  updateLayout();
  updateActionKeys();
  renderWinProgress();
  mountPrizeForPanel(winProgressPanelEl, { hidden: false });
  syncActivePrizePosition();
  initPrizesCarousel();
  updateMainScrollFade();

  mainEl?.addEventListener("scroll", updateMainScrollFade, { passive: true });
  document.querySelector(".win-block--yellow")?.addEventListener("click", playAgain);
  window.addEventListener("resize", handleViewportChange);
  window.visualViewport?.addEventListener("resize", handleViewportChange);
  window.visualViewport?.addEventListener("scroll", handleViewportChange);
  window.addEventListener("orientationchange", () => {
    window.setTimeout(handleViewportChange, 100);
  });
  if (document.fonts?.ready) {
    document.fonts.ready.then(handleViewportChange);
  }
})();
