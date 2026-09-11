(function () {
  "use strict";

  const ROWS = 6;
  const COLS = 5;
  const FLIP_STAGGER_MS = 150;
  const FLIP_DURATION_MS = 750;
  const NORMAL_WORD_MS = 1000;
  const WIN_HERO_MS = 800;
  const MINI_UNFLIP_FLIP_MS = 360;
  const MINI_UNFLIP_WAVE_COUNT = ROWS + COLS - 1;
  const MINI_UNFLIP_WAVE_STAGGER_MS =
    MINI_UNFLIP_WAVE_COUNT > 1
      ? (WIN_HERO_MS - MINI_UNFLIP_FLIP_MS) / (MINI_UNFLIP_WAVE_COUNT - 1)
      : 0;
  const MINI_GRID_GAP_PX = 4;
  const MINI_CELL_RATIO_W = 23;
  const MINI_CELL_RATIO_H = 22;
  const MINI_GRID_MARGIN_TOP_PX = 24;
  const REVERSE_NORMAL_WORD_MS = 1000;
  const WIN_SPLASH_FADE_MS = 600;
  const ONBOARDING_LEAVE_MS = 600;
  const ONBOARDING_ANSWER = "СЛОВО";
  const ONBOARDING_WORD_SAHAR = "САХАР";
  const ONBOARDING_WORD_SOVET = "СОВЕТ";
  const ONBOARDING_TOOLTIP_MS = 3000;
  const ONBOARDING_PLAQUE_FADE_MS = 400;
  const ONBOARDING_TOOLTIP_IN_MS = 300;
  const ONBOARDING_TOOLTIP_OUT_MS = 150;
  const ONBOARDING_TOOLTIP_EDGE_PX = 16;
  const ONBOARDING_TOOLTIP_GAP_PX = 8;
  const ONBOARDING_SPOTLIGHT_MS = 3000;
  const ONBOARDING_HELP_PAUSE_MS = 600;
  const ONBOARDING_INTRO_MS = 300;
  const ONBOARDING_INTRO_CLOSE_MS = 300;
  const ONBOARDING_DIALOG_EXIT_MS = 600;
  const ONBOARDING_CHROME_MS = 400;
  const ONBOARDING_TAB_BAR_MS = 600;
  const ONBOARDING_FLIP_TO_SCALE_MS = 400;
  const ONBOARDING_NOTIFY_SHEET_DELAY_MS = 600;
  const ONBOARDING_TASK_TOOLTIP_DELAY_MS = 500;
  const ONBOARDING_ENERGY_HINT_DIM_MS = 300;
  const ONBOARDING_ENERGY_TOOLTIP_MS = 300;
  const ONBOARDING_PROGRESS_BADGES = [1, 2, 3, 4];
  const ONBOARDING_RESULT_MESSAGE = "Первое слово — и сразу в яблочко!";
  const ONBOARDING_RESULT_YELLOW_TEXT = "Новое слово через 12:37";
  const DEFAULT_YELLOW_BUTTON_TEXT = "Играть ещё за 3";
  const WIN_SPLASH_CONTENT_DELAY_MS = 200;
  const WIN_SPLASH_CONTENT_MS = 700;
  const WIN_SPLASH_CONFETTI_AT = 0.3;
  const WIN_SPLASH_TITLE_AT = 0.6;
  const WIN_SPLASH_TITLE_MS = 700;
  const WIN_SPLASH_CONTENT_OUT_MS = 1000;
  const WIN_SPLASH_SECONDARY_AT = 0.7;
  const WIN_SPLASH_RESULT_AT = 0.7;
  const WIN_SPLASH_TASKS_CONTENT_MS = 1000;
  const WIN_SPLASH_TASKS_PROGRESS_AT = 0.9;
  const WIN_SPLASH_TASKS_PROGRESS_DELAY_MS = 500;
  const WIN_SPLASH_TASKS_PROGRESS_MS = 1000;
  const WIN_SPLASH_TASKS_SWEEP_MS = 500;
  const WIN_SPLASH_TASKS_SHIMMER_DELAY_MS = 1000;
  const WIN_SPLASH_TASKS_SHIMMER_EVERY_MS = 4000;
  const LOSE_SPLASH_FLIP_DELAY_MS = 100;
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
  const winSplashEl = document.getElementById("win-splash");
  const winSplashConfettiEl = document.getElementById("win-splash-confetti");
  const winSplashBodyWinEl = document.getElementById("win-splash-body-win");
  const winSplashBodyLoseEl = document.getElementById("win-splash-body-lose");
  const winSplashBodyThematicEl = document.getElementById(
    "win-splash-body-thematic"
  );
  const winSplashBodyNotifyEl = document.getElementById(
    "win-splash-body-notify"
  );
  const winSplashBodyTasksEl = document.getElementById(
    "win-splash-body-tasks"
  );
  const winSplashImageAreaEl = document.getElementById("win-splash-image-area");
  const winSplashImageEl = document.getElementById("win-splash-image");
  const winSplashAnswerRowEl = document.getElementById("win-splash-answer-row");
  const winSplashTitleEl = document.getElementById("win-splash-title");
  const winSplashSubtitleEl = document.getElementById("win-splash-subtitle");
  const winSplashShareEl = document.getElementById("win-splash-share");
  const winSplashSkipEl = document.getElementById("win-splash-skip");
  const winSplashThematicCtaEl = document.getElementById(
    "win-splash-thematic-cta"
  );
  const winSplashThematicSkipEl = document.getElementById(
    "win-splash-thematic-skip"
  );
  const winSplashNotifyCtaEl = document.getElementById("win-splash-notify-cta");
  const winSplashTasksCtaEl = document.getElementById("win-splash-tasks-cta");
  const winSplashTasksListEl = document.getElementById("win-splash-tasks-list");
  const winSplashTasksCoinValueEl = document.getElementById(
    "win-splash-tasks-coin-value"
  );
  const winSplashTasksClaimIconEl = document.getElementById(
    "win-splash-tasks-claim-icon"
  );
  const winProgressStageEl = document.getElementById("win-progress-stage");
  const winProgressPrizeOverlayEl = document.getElementById("win-progress-prize-overlay");
  let winProgressPanelEl = document.getElementById("win-progress-panel");
  let fifthWordPanelIndex = 0;
  let fifthWordPrizeLabelRevealed = false;
  const mainEl = document.querySelector(".main");
  const gameScreenEl = document.getElementById("game-screen");
  const raffleScreenEl = document.getElementById("raffle-screen");
  const rafflePageEl = document.querySelector(".raffle-page");
  const prizesScreenEl = document.getElementById("prizes-screen");
  const prizesPageEl = document.querySelector(".prizes-page");
  const profileScreenEl = document.getElementById("profile-screen");
  const winMessageEl = document.getElementById("win-message");
  const winWordEl = document.getElementById("win-word");
  const resultSheetEl = document.getElementById("result-sheet");
  const resultSheetBackdropEl = document.getElementById("result-sheet-backdrop");
  const resultSheetPanelEl = document.getElementById("result-sheet-panel");
  const resultSheetBarEl = document.getElementById("result-sheet-bar");
  const resultSheetCloseEl = document.getElementById("result-sheet-close");
  const resultSheetTitleEl = document.getElementById("result-sheet-title");
  const resultSheetSubtitleEl = document.getElementById("result-sheet-subtitle");
  const resultSheetGridAreaEl = document.getElementById("result-sheet-grid-area");
  const resultSheetGridEl = document.getElementById("result-sheet-grid");
  const resultSheetActionEl = document.getElementById("result-sheet-action");
  const taskSheetEl = document.getElementById("task-sheet");
  const taskSheetBackdropEl = document.getElementById("task-sheet-backdrop");
  const taskSheetPanelEl = document.getElementById("task-sheet-panel");
  const taskSheetBarEl = document.getElementById("task-sheet-bar");
  const taskSheetCloseEl = document.getElementById("task-sheet-close");
  const taskSheetBadgeEl = document.getElementById("task-sheet-badge");
  const taskSheetBadgeIconEl = document.getElementById("task-sheet-badge-icon");
  const taskSheetBadgeDateEl = document.getElementById("task-sheet-badge-date");
  const taskSheetTitleEl = document.getElementById("task-sheet-title");
  const taskSheetSubtitleEl = document.getElementById("task-sheet-subtitle");
  const taskSheetRewardIconEl = document.getElementById("task-sheet-reward-icon");
  const taskSheetRewardLabelEl = document.getElementById("task-sheet-reward-label");
  const taskSheetRewardTicketEl = document.getElementById("task-sheet-reward-ticket");
  const taskSheetRewardOnboardingPrizeEl = document.getElementById(
    "task-sheet-reward-onboarding-prize"
  );
  const taskSheetRewardNoteEl = document.getElementById("task-sheet-reward-note");
  const taskSheetActionEl = document.getElementById("task-sheet-action");
  const onboardingNotifySheetEl = document.getElementById("onboarding-notify-sheet");
  const onboardingNotifyBackdropEl = document.getElementById(
    "onboarding-notify-backdrop"
  );
  const onboardingNotifyPanelEl = document.getElementById("onboarding-notify-panel");
  const onboardingNotifyBarEl = document.getElementById("onboarding-notify-bar");
  const onboardingNotifyCloseEl = document.getElementById("onboarding-notify-close");
  const onboardingNotifyEnableEl = document.getElementById(
    "onboarding-notify-enable"
  );
  const onboardingNotifyLaterEl = document.getElementById("onboarding-notify-later");
  const onboardingRulesSheetEl = document.getElementById("onboarding-rules-sheet");
  const onboardingRulesBackdropEl = document.getElementById(
    "onboarding-rules-backdrop"
  );
  const onboardingRulesPanelEl = document.getElementById("onboarding-rules-panel");
  const onboardingRulesBarEl = document.getElementById("onboarding-rules-bar");
  const onboardingRulesCloseEl = document.getElementById("onboarding-rules-close");
  const onboardingRulesBodyEl = document.getElementById("onboarding-rules-body");
  const onboardingTaskTooltipEl = document.getElementById("onboarding-task-tooltip");
  const onboardingEnergyTooltipEl = document.getElementById(
    "onboarding-energy-tooltip"
  );
  const taskExecuteStubEl = document.getElementById("task-execute-stub");
  const scenarioSelectEl = document.getElementById("scenario-select");
  const thematicWordSwitchEl = document.getElementById("thematic-word-switch");
  const notifySplashSwitchEl = document.getElementById("notify-splash-switch");
  const tasksProgressSplashSwitchEl = document.getElementById(
    "tasks-progress-splash-switch"
  );
  const raffleSectionSwitchEl = document.getElementById("raffle-section-switch");
  const raffleCardsPaginationLabelEl = document.getElementById("raffle-cards-pagination-label");
  const coinBadgeEl = document.getElementById("coin-badge");
  const coinBadgeValueEl = coinBadgeEl?.querySelector(".energy-badge__value");
  const energyBadgeEl = document.querySelector(
    ".app > .header .nav-row__badges .energy-badge:not(.coin-badge)"
  );
  const energyBadgeValueEl = energyBadgeEl?.querySelector(".energy-badge__value");
  const raffleResetProgressBtnEl = document.getElementById("raffle-reset-progress-btn");
  const startOnboardingBtnEl = document.getElementById("start-onboarding-btn");
  const onboardingEl = document.getElementById("onboarding");
  const onboardingCloseBtnEl = document.getElementById("onboarding-close-btn");
  const onboardingInfoBtnEl = document.getElementById("onboarding-info-btn");
  const onboardingGridAreaEl = document.getElementById("onboarding-grid-area");
  const onboardingGridEl = document.getElementById("onboarding-grid");
  const onboardingKbEl = document.getElementById("onboarding-keyboard");
  const onboardingDialogTextEl = document.getElementById("onboarding-dialog-text");
  const onboardingTooltipEl = document.getElementById("onboarding-tooltip");
  const onboardingTooltipTextEl = document.getElementById("onboarding-tooltip-text");
  const onboardingTooltipTailEl = onboardingTooltipEl?.querySelector(
    ".onboarding-tooltip__tail"
  );
  const onboardingTooltipBodyEl = onboardingTooltipEl?.querySelector(
    ".onboarding-tooltip__body"
  );
  const onboardingIntroEl = document.getElementById("onboarding-intro");
  const onboardingIntroBackEl = document.getElementById("onboarding-intro-back");
  const onboardingIntroActionEl = document.getElementById(
    "onboarding-intro-action"
  );
  const onboardingIntroActionLabels = onboardingIntroActionEl
    ? Array.from(
        onboardingIntroActionEl.querySelectorAll(".onboarding-intro__action-label")
      )
    : [];
  const raffleTabEl = document.querySelector('.tab[data-tab="raffle"]');

  let onboardingActive = false;
  let onboardingClosing = false;
  let onboardingAnimating = false;
  let onboardingDone = false;
  let mainGameChromeSnapshot = null;
  let onboardingStep = "sahar";
  let onboardingWrongCount = 0;
  let onboardingAbsentTipShown = false;
  let onboardingSubmitted = [];
  let onboardingCurRow = 0;
  let onboardingCurCol = 0;
  let onboardingBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
  let onboardingTooltipTimer = null;
  let onboardingTooltipResolve = null;
  let onboardingTooltipArmed = false;
  let onboardingSpotlightTimer = null;
  let onboardingSpotlightResolve = null;
  let onboardingSpotlightArmed = false;
  let onboardingSpotlightActive = false;
  let onboardingSpotlightBaseText = null;
  let onboardingIntroStep = 0;
  let onboardingIntroOpen = false;
  let onboardingIntroAnimating = false;

  let activeScenario = scenarioSelectEl?.value ?? "2-4-word";
  let activeThematicWord = Boolean(thematicWordSwitchEl?.checked);
  let activeNotifySplash = Boolean(notifySplashSwitchEl?.checked);
  let activeTasksProgressSplash = Boolean(
    tasksProgressSplashSwitchEl?.checked
  );
  let profileSettingsDirty = false;
  let isWordNotGuessedActive = false;

  const WIN_MESSAGES_ATTEMPT_1 = [
    "Этого не может быть.<br />Вы точно не робот?",
    "Магия? Интуиция?<br />Или вы просто гений?",
    "Ну вы даете... В следующий раз<br />загадаем слово посложнее!",
    "Вот как выглядит умнейший человек.<br />Приятно видеть вас в игре!",
  ];

  const WIN_MESSAGES_ATTEMPT_2_3 = [
    "Точно в цель!<br />Ловко вы это",
    "Отгадали на раз-два.<br />Вот это да!",
    "Легендарно!<br />Может, сделаем победную серию?",
    "Вот как выглядит умнейший человек.<br />Приятно видеть вас в игре!",
  ];

  const WIN_MESSAGES_ATTEMPT_4_6 = [
    "Угаданное слово уже в кармане!<br />А мы и не сомневались",
    "У вас отлично получается —<br />продолжайте",
    "Не сдавались — и угадали!<br />Так играют мастера",
    "Что-что, а гениальность<br />у вас не отнять",
  ];

  const WIN_MESSAGES_FIFTH_WORD = [
    "Нет слов, одни эмоции<br />от вашей легендарной игры",
    "У самурая нет цели, а у вас есть.<br />Так держать",
    "В шоке от вашей эрудиции,<br />так держать!",
  ];

  const WIN_MESSAGES_NOT_GUESSED = [
    "Не сошлось — но вы были близко.<br />В следующий раз точно получится",
    "Это была тренировка.<br />Попробуем снова?",
    "Не сомневаемся, что следующее<br />слово — точно ваше",
    "Слово осталось загадкой. Не беда —<br />в следующий раз точно получится",
  ];

  const WIN_PROGRESS_WORDS = ["АРТЕМ", null, null, null];

  const FIFTH_WORD_PROGRESS_WORDS = ["АРТЕМ", "ПАЛКА", "БАРОН", "ПЕТЛЯ"];
  const FIFTH_WORD_BADGES = [36, 37, 38, 39];
  const FIFTH_WORD_NEXT_BADGES = [41, 42, 43, 44];
  const PRIZE_COLUMN_WORD = "ВКЛАД";
  const PRIZE_TO_TAB_MS = 1200;
  const PROGRESS_SWAP_MS = 1200;
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

  const RESULT_SHEET_OPEN_MS = 500;
  const RESULT_SHEET_CLOSE_MS = 300;
  const RAFFLE_CARD_COUNT = 3;
  const RAFFLE_CARD_WIDTH = 270;
  const RAFFLE_CARD_HEIGHT = 388;
  const RAFFLE_CARD_GAP = 20;
  const RAFFLE_SLIDE_STEP = RAFFLE_CARD_WIDTH + RAFFLE_CARD_GAP;
  const RAFFLE_CARD_SRC = "assets/raffle-event-card-inactive.svg";
  const RAFFLE_TOKEN_SRC = "assets/Монетка активная.png";
  const RAFFLE_TOKEN_INACTIVE_SRC = "assets/Монетка неактивная.png";
  const INITIAL_COIN_BALANCE = 0;
  const RAFFLE_BTN_TRANSITION_MS = 400;
  const TASK_REWARD_READY_TEXT = "Заберите до 25 ноября";
  const TASK_CLAIM_BUTTON_TEXT = "Забрать награду";
  const ONBOARDING_TASK_SHEET_CLAIM_TEXT = "Забрать";
  const ONBOARDING_TASK_ENERGY_AMOUNT = 6;
  const ONBOARDING_TASK_GIFT_SRC = "assets/icon-gift.png";
  const ENERGY_FLY_SRC = "assets/Энергия.png";
  const TASK_SWAP_MS = 800;
  const TASK_BADGE_MS = 400;
  const TASK_CLAIM_MS = 300;
  const TASK_CLAIM_REORDER_MS = 300;
  const TASK_COIN_BURST_MS = 350;
  const TASK_COIN_BURST_DISTANCE = 36;
  const TASK_COIN_COUNT_MIN = 5;
  const TASK_COIN_COUNT_MAX = 7;
  const TASK_REWARD_COIN_AMOUNT = 250;
  const WORD_GUESS_COIN_REWARD = 10;
  const COIN_FLY_SRC = "assets/badge-coin.png?v=2";
  const COIN_FLY_SIZE = 24;
  const COIN_COUNTER_START_PROGRESS = 0.8;
  const TASK_STUB_FADE_MS = 300;
  const TASK_STUB_HOLD_MS = 1200;
  const TASK_STUB_ACTION_DELAY_MS = 300;
  const RAFFLE_CHECK_SRC = "assets/check-circle-positive.svg";
  const RAFFLE_TURNOVER_SRC = "assets/raffle-turnover.svg";
  const RAFFLE_TURNOVER_ENTRY_SRC = "assets/raffle-turnover-entry.svg";
  const RAFFLE_INTRO_SEEN_KEY = "raffle-intro-seen";
  const RAFFLE_INTRO_ENTRY_DELAY_MS = 400;
  const RAFFLE_INTRO_STAGE1_MS = 900;
  const RAFFLE_INTRO_PAUSE_MS = 400;
  const RAFFLE_INTRO_STAGE2_MS = 1200;
  const RAFFLE_PARTICIPATE_SCALE = 1.05;
  const RAFFLE_PARTICIPATE_SCALE_DELAY_MS = 200;
  const RAFFLE_PARTICIPATE_SCALE_MS = 600;
  const RAFFLE_PARTICIPATE_FLIP_SLOW_MS = 500;
  const RAFFLE_PARTICIPATE_FLIP_FAST_MS = 1200;
  const RAFFLE_PARTICIPATE_PAUSE_MS = 400;
  const RAFFLE_PARTICIPATE_RETURN_MS = 300;
  const RAFFLE_PARTICIPATE_SPARKS_AT_MS = Math.round(
    RAFFLE_PARTICIPATE_RETURN_MS * 0.5
  );
  const RAFFLE_CARDS = [
    {
      badge: "Делим деньги",
      title: "5 000 000₽",
      subtitle: "Получите долю от суммы",
      buttonCost: 200,
      visualSrc: "assets/raffle-visual-money.png",
      activeBaseSrc: "assets/raffle-event-card-1-active.svg",
      participatedSubtitle: "Делят 155 456 игроков",
      backTitle: "Делим деньги",
      backSubtitle:
        "Разделим 5 000 000 рублей между всеми игроками, принявшими участие в розыгрыше этого приза",
    },
    {
      badge: "Розыгрыш",
      title: "Кэшбэк 50%<br>в шопинге",
      subtitle: "Разыграем 1 000 призов",
      buttonCost: 50,
      visualSrc: "assets/raffle-visual-cashback.png",
      activeBaseSrc: "assets/raffle-event-card-2-active.svg",
      participatedSubtitle: "Участвуют 564 238 игроков",
      backTitle: "Розыгрыш",
      backSubtitle:
        "Разыграем 1 000 призов с кэшбэком 50% в шопинге между всеми игроками, принявшими участие в этом розыгрыше",
    },
    {
      badge: "Розыгрыш",
      title: "Аааавтомобиль<br>от Fresh Auto",
      subtitle: "Разыграем 1 приз",
      buttonCost: 500,
      visualSrc: "assets/raffle-visual-car.png",
      activeBaseSrc: "assets/raffle-event-card-3-active.svg",
      participatedSubtitle: "Участвуют 37 174 игрока",
      backTitle: "Розыгрыш",
      backSubtitle:
        "Разыграем Jeepv X-Cross 7 от Fresh Auto в полной комплектации между всеми игроками, принявшими участие в этом розыгрыше",
    },
  ];
  const RAFFLE_SLIDE_INDICES = [0, 1, 2];
  const RAFFLE_CENTER_ROTATIONS = [1, -2, 0];

  let raffleCarouselRefs = null;
  let raffleParticipateSession = null;
  let isTask2RewardReady = false;
  let isTask2RewardClaimed = false;
  let isTask2ClaimAnimating = false;
  let isOnboardingTrainingTaskClaimed = false;
  let isOnboardingTrainingTaskClaiming = false;
  let removedOnboardingTaskListItem = null;
  let onboardingEnergyHintTimer = null;
  let onboardingEnergyHintHiding = false;
  let taskExecuteStubRunning = false;
  let removedTask2ListItem = null;
  let coinBalance = INITIAL_COIN_BALANCE;
  let activeTaskSheetCard = null;
  let raffleIntroRunning = false;
  let raffleIntroLayerEl = null;
  const raffleParticipatedIndices = new Set();

  let confettiRafId = null;
  let splashConfettiRafId = null;
  let prizeAnimTimer = null;
  let progressAnimTimers = [];
  let savedGameCellWidth = null;
  let savedGameCellHeight = null;

  let curRow = 0;
  let curCol = 0;
  let gameOver = false;
  let lastResultAttempts = null;
  let isAnimating = false;
  let board = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
  const submittedWords = [];

  const ACTION_ICONS = {
    enter: "assets/key-enter.svg",
    backspace: "assets/key-backspace.svg",
  };

  const HAPTIC_KEY_MS = 12;
  const HAPTIC_TICK_MS = 8;
  const HAPTIC_SELECTION_MS = 10;

  function triggerHaptic(durationMs) {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
      return;
    }
    try {
      navigator.vibrate(durationMs);
    } catch (_) {
      /* Vibration API may throw if blocked */
    }
  }

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

  function updateRaffleScrollFade() {
    if (!rafflePageEl) return;
    rafflePageEl.classList.toggle("is-scrolled", rafflePageEl.scrollTop > 0);
  }

  function syncRafflePageOverflow() {
    if (!rafflePageEl) return;
    if (rafflePageEl.classList.contains("raffle-page--scroll-locked")) return;
    if (document.getElementById("raffle-screen")?.hidden) return;

    rafflePageEl.classList.remove("raffle-page--fit");
    const paddingBottom =
      Number.parseFloat(window.getComputedStyle(rafflePageEl).paddingBottom) || 0;
    const paddingSlack = Math.max(0, paddingBottom - 24);
    const overflows =
      rafflePageEl.scrollHeight - paddingSlack > rafflePageEl.clientHeight + 0.5;

    if (!overflows) {
      rafflePageEl.scrollTop = 0;
      rafflePageEl.classList.add("raffle-page--fit");
      rafflePageEl.classList.remove("is-scrolled");
      return;
    }

    updateRaffleScrollFade();
  }

  function updatePrizesScrollFade() {
    if (!prizesPageEl) return;
    prizesPageEl.classList.toggle("is-scrolled", prizesPageEl.scrollTop > 0);
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

  function isNotifySplashEnabled() {
    return activeNotifySplash;
  }

  function isTasksProgressSplashEnabled() {
    return activeTasksProgressSplash;
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

  function setCoinBadgeVisible(visible) {
    const badge = coinBadgeEl ?? document.getElementById("coin-badge");
    if (!badge) return;
    badge.hidden = !visible;
  }

  function setRaffleTabVisible(visible) {
    setCoinBadgeVisible(visible);

    if (!raffleTabEl) return;

    raffleTabEl.hidden = !visible;

    if (!visible && raffleTabEl.classList.contains("tab--active")) {
      activateTab("game");
      showAppScreen("game");
      updateLayout();
    }
  }

  function applyRaffleSectionVisibility() {
    setCoinBadgeVisible(true);
    if (raffleTabEl) raffleTabEl.hidden = false;

    const active = isRaffleSectionEnabled();
    const availableEl = document.querySelector(".prizes-available");
    const cardsEl = availableEl?.querySelector(".raffle-cards-block");
    const stubEl =
      document.getElementById("prizes-stage-stub") ??
      availableEl?.querySelector(".prizes-stage-stub");

    if (cardsEl) cardsEl.hidden = !active;
    if (stubEl) stubEl.hidden = active;
    availableEl?.classList.toggle("is-stage-inactive", !active);

    if (!active) {
      skipRaffleParticipateAnimation();
      cancelRaffleIntro(false);
      cancelRaffleIntroPresentation();
      return;
    }

    if (prizesScreenEl && !prizesScreenEl.hidden) {
      prepareRaffleIntroPresentation();
      void maybePlayRaffleIntro();
    }
  }

  function isRaffleSectionEnabled() {
    return Boolean(raffleSectionSwitchEl?.checked);
  }

  const TAB_SCREENS = {
    game: () => gameScreenEl,
    raffle: () => raffleScreenEl,
    prizes: () => prizesScreenEl,
    profile: () => profileScreenEl,
  };

  function showAppScreen(tabId) {
    if (tabId !== "raffle") {
      closeTaskSheet({ animateClose: false });
    }

    if (tabId !== "prizes") {
      skipRaffleParticipateAnimation();
      cancelRaffleIntro(false);
      cancelRaffleIntroPresentation();
    }

    Object.entries(TAB_SCREENS).forEach(([id, getScreen]) => {
      const screen = getScreen();
      if (!screen) return;
      screen.hidden = id !== tabId;
    });

    if (tabId === "raffle") {
      syncOnboardingTrainingTask();
      requestAnimationFrame(syncRafflePageOverflow);
    }

    if (tabId === "prizes") {
      setPrizesTabDot(false);
      if (isRaffleSectionEnabled()) {
        prepareRaffleIntroPresentation();
        void maybePlayRaffleIntro();
      }
      requestAnimationFrame(updatePrizesScrollFade);
    }
  }

  function activateTab(tabId) {
    document.querySelectorAll(".tab-bar .tab[data-tab]").forEach((tab) => {
      tab.classList.toggle("tab--active", tab.dataset.tab === tabId);
    });
  }

  function commitProfileSettingsIfNeeded() {
    if (!profileSettingsDirty) return;

    const nextScenario = scenarioSelectEl?.value ?? "2-4-word";
    const nextThematic = Boolean(thematicWordSwitchEl?.checked);
    const nextNotifySplash = Boolean(notifySplashSwitchEl?.checked);
    const nextTasksProgressSplash = Boolean(
      tasksProgressSplashSwitchEl?.checked
    );
    const scenarioChanged = nextScenario !== activeScenario;
    const thematicChanged = nextThematic !== activeThematicWord;

    activeScenario = nextScenario;
    activeThematicWord = nextThematic;
    activeNotifySplash = nextNotifySplash;
    activeTasksProgressSplash = nextTasksProgressSplash;
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

  function pickRandomItem(items) {
    if (!items.length) return "";
    return items[Math.floor(Math.random() * items.length)];
  }

  function getWinMessageHtml() {
    if (isWordNotGuessedScenario()) {
      return pickRandomItem(WIN_MESSAGES_NOT_GUESSED);
    }

    if (isFifthWordScenario()) {
      return pickRandomItem(WIN_MESSAGES_FIFTH_WORD);
    }

    if (lastResultAttempts === 1) {
      return pickRandomItem(WIN_MESSAGES_ATTEMPT_1);
    }

    if (lastResultAttempts === 2 || lastResultAttempts === 3) {
      return pickRandomItem(WIN_MESSAGES_ATTEMPT_2_3);
    }

    if (
      lastResultAttempts === 4 ||
      lastResultAttempts === 5 ||
      lastResultAttempts === 6
    ) {
      return pickRandomItem(WIN_MESSAGES_ATTEMPT_4_6);
    }

    return WIN_MESSAGES_ATTEMPT_4_6[0];
  }

  function applyWinResultContent() {
    const app = document.querySelector(".app");
    app?.classList.toggle("scenario-thematic-word", isThematicWordEnabled());
    app?.classList.toggle("scenario-word-not-guessed", isWordNotGuessedScenario());
    app?.classList.toggle("scenario-fifth-word", isFifthWordScenario());

    if (winWordEl && !app?.classList.contains("scenario-onboarding-result")) {
      winWordEl.textContent = ANSWER;
    }

    if (winMessageEl) {
      winMessageEl.innerHTML = getWinMessageHtml();
    }
  }

  function isResultSheetOpen() {
    return (
      resultSheetEl?.classList.contains("is-open") ||
      resultSheetEl?.classList.contains("is-closing") ||
      false
    );
  }

  function finishResultSheetClose() {
    resultSheetEl?.classList.remove("is-closing");
    resultSheetBackdropEl?.classList.remove("is-closing");
    resultSheetPanelEl?.classList.remove("is-dragging");
    if (resultSheetPanelEl) {
      resultSheetPanelEl.style.transform = "";
    }
    if (resultSheetEl) {
      resultSheetEl.hidden = true;
      resultSheetEl.setAttribute("aria-hidden", "true");
    }
    if (resultSheetBackdropEl) {
      resultSheetBackdropEl.hidden = true;
      resultSheetBackdropEl.setAttribute("aria-hidden", "true");
    }
  }

  function canOpenResultSheet() {
    const app = document.querySelector(".app");
    if (!app?.classList.contains("scenario-normal-word")) return false;
    if (
      app.classList.contains("is-animating-normal-word") ||
      app.classList.contains("is-animating-reverse-normal-word") ||
      app.classList.contains("is-returning-to-game")
    ) {
      return false;
    }
    return !isAnimating;
  }

  function getResultSheetTitle() {
    return isFifthWordScenario() ? "40 слово" : "37 слово";
  }

  function getResultSheetActionText() {
    if (isWordNotGuessedScenario() && !isThematicWordEnabled()) {
      return "Поделиться результатом";
    }
    return "Похвастаться";
  }

  function getResultSheetSubtitle() {
    if (isWordNotGuessedScenario()) {
      return "Не смогли отгадать";
    }

    const subtitles = {
      1: "Отгадали с 1 попытки",
      2: "Отгадали со 2 попытки",
      3: "Отгадали с 3 попытки",
      4: "Отгадали с 4 попытки",
      5: "Отгадали с 5 попытки",
      6: "Отгадали с 6 попытки",
    };

    return subtitles[lastResultAttempts] ?? "Не смогли отгадать";
  }

  function updateResultSheetContent() {
    if (resultSheetTitleEl) {
      resultSheetTitleEl.textContent = getResultSheetTitle();
    }
    if (resultSheetSubtitleEl) {
      resultSheetSubtitleEl.textContent = getResultSheetSubtitle();
    }
    if (resultSheetActionEl) {
      resultSheetActionEl.textContent = getResultSheetActionText();
    }
  }

  function syncResultSheetGridFromBoard() {
    if (!resultSheetGridEl || !gridEl) return;

    resultSheetGridEl.innerHTML = "";

    for (let row = 0; row < ROWS; row += 1) {
      const sourceRow = getRowEl(row);
      const rowEl = document.createElement("div");
      rowEl.className = "grid-row";
      rowEl.dataset.row = String(row);

      for (let col = 0; col < COLS; col += 1) {
        const sourceCell = sourceRow?.children[col];
        const cell = document.createElement("div");
        cell.className = sourceCell?.className || "cell";
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        const sourceInner = sourceCell?.querySelector(".cell-inner");
        const sourceFront = sourceCell?.querySelector(".cell-front");
        const sourceBack = sourceCell?.querySelector(".cell-back");
        const flipped = sourceInner?.classList.contains("flipped");
        const frontText = sourceFront?.textContent ?? "";
        const backText = sourceBack?.textContent ?? "";
        const backClass = sourceBack?.className || "cell-back";

        cell.innerHTML =
          '<div class="cell-inner' +
          (flipped ? " flipped" : "") +
          '"><div class="cell-front">' +
          frontText +
          '</div><div class="' +
          backClass +
          '">' +
          backText +
          "</div></div>";
        rowEl.appendChild(cell);
      }

      resultSheetGridEl.appendChild(rowEl);
    }
  }

  function layoutResultSheetGrid() {
    if (!resultSheetGridAreaEl || !resultSheetGridEl || !isResultSheetOpen()) return;
    if (resultSheetGridAreaEl.clientWidth <= 0 || resultSheetGridAreaEl.clientHeight <= 0) {
      return;
    }

    const gap = 3;
    const availW = resultSheetGridAreaEl.clientWidth;
    const availH = resultSheetGridAreaEl.clientHeight;

    let cellW = (availW - (COLS - 1) * gap) / COLS;
    let cellH = (availH - (ROWS - 1) * gap) / ROWS;

    if (cellW > cellH * 1.2) cellW = cellH * 1.2;
    if (cellH > cellW * 1.1) cellH = cellW * 1.1;
    if (cellW > cellH * 1.2) cellW = cellH * 1.2;

    cellW = Math.floor(cellW);
    cellH = Math.floor(cellH);

    resultSheetGridEl.style.setProperty("--cell-width", cellW + "px");
    resultSheetGridEl.style.setProperty("--cell-height", cellH + "px");
  }

  function setAppSheetChrome(open, animateClose) {
    const app = document.querySelector(".app");
    if (!app) return;

    if (open) {
      app.classList.add("is-sheet-open");
      app.classList.remove("is-sheet-closing");
      return;
    }

    app.classList.remove("is-sheet-open");
    if (animateClose) {
      app.classList.add("is-sheet-closing");
      window.setTimeout(() => {
        app.classList.remove("is-sheet-closing");
      }, RESULT_SHEET_CLOSE_MS);
      return;
    }

    app.classList.remove("is-sheet-closing");
  }

  function openResultSheet() {
    if (!resultSheetEl || !resultSheetBackdropEl || !resultSheetPanelEl || isResultSheetOpen()) {
      return;
    }

    updateResultSheetContent();
    syncResultSheetGridFromBoard();

    resultSheetEl.hidden = false;
    resultSheetBackdropEl.hidden = false;
    resultSheetEl.classList.remove("is-closing");
    resultSheetBackdropEl.classList.remove("is-closing");
    resultSheetPanelEl?.classList.remove("is-dragging");
    if (resultSheetPanelEl) {
      resultSheetPanelEl.style.transform = "";
    }
    resultSheetEl.setAttribute("aria-hidden", "false");
    resultSheetBackdropEl.setAttribute("aria-hidden", "false");
    mainEl?.classList.add("result-sheet-open");
    setAppSheetChrome(true);

    requestAnimationFrame(() => {
      resultSheetEl.classList.add("is-open");
      resultSheetBackdropEl.classList.add("is-visible");
      layoutResultSheetGrid();
      requestAnimationFrame(layoutResultSheetGrid);
    });
  }

  function closeResultSheet(options = {}) {
    if (!resultSheetEl || !resultSheetBackdropEl) return;
    if (!resultSheetEl.classList.contains("is-open") && !resultSheetEl.classList.contains("is-closing")) {
      return;
    }

    const animateClose = options.animateClose !== false;

    mainEl?.classList.remove("result-sheet-open");
    resultSheetBackdropEl.classList.remove("is-visible");
    setAppSheetChrome(false, animateClose);

    if (animateClose) {
      resultSheetEl.classList.add("is-closing");
      resultSheetEl.classList.remove("is-open");
      resultSheetBackdropEl.classList.add("is-closing");
      resultSheetPanelEl?.classList.remove("is-dragging");
      if (resultSheetPanelEl) {
        resultSheetPanelEl.style.transform = "";
      }
      window.setTimeout(finishResultSheetClose, RESULT_SHEET_CLOSE_MS);
      return;
    }

    resultSheetEl.classList.remove("is-open", "is-closing");
    resultSheetBackdropEl.classList.remove("is-visible", "is-closing");
    finishResultSheetClose();
  }

  function initResultSheet() {
    const gridArea = document.querySelector(".grid-area");
    let dragStartY = 0;
    let isDragging = false;
    let activePointerId = null;

    const finishDrag = (clientY) => {
      if (!isDragging || !resultSheetPanelEl) return;
      isDragging = false;
      activePointerId = null;
      resultSheetPanelEl.classList.remove("is-dragging");

      const delta = Math.max(0, clientY - dragStartY);
      if (delta > resultSheetPanelEl.offsetHeight * 0.25) {
        resultSheetPanelEl.style.transform = "";
        closeResultSheet({ animateClose: true });
        return;
      }

      resultSheetPanelEl.style.transform = "";
    };

    resultSheetCloseEl?.addEventListener("click", () => {
      closeResultSheet({ animateClose: true });
    });

    gridArea?.addEventListener("click", () => {
      if (canOpenResultSheet()) {
        openResultSheet();
      }
    });

    resultSheetBarEl?.addEventListener("pointerdown", (event) => {
      if (!isResultSheetOpen() || !resultSheetPanelEl) return;
      isDragging = true;
      activePointerId = event.pointerId;
      dragStartY = event.clientY;
      resultSheetPanelEl.classList.add("is-dragging");
      resultSheetBarEl.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    resultSheetBarEl?.addEventListener("pointermove", (event) => {
      if (!isDragging || event.pointerId !== activePointerId || !resultSheetPanelEl) return;
      const offset = Math.max(0, event.clientY - dragStartY);
      resultSheetPanelEl.style.transform = "translateY(" + offset + "px)";
    });

    resultSheetBarEl?.addEventListener("pointerup", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });

    resultSheetBarEl?.addEventListener("pointercancel", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });
  }

  function isTaskSheetOpen() {
    return (
      taskSheetEl?.classList.contains("is-open") ||
      taskSheetEl?.classList.contains("is-closing") ||
      false
    );
  }

  function finishTaskSheetClose() {
    taskSheetEl?.classList.remove("is-closing");
    taskSheetBackdropEl?.classList.remove("is-closing");
    taskSheetPanelEl?.classList.remove("is-dragging");
    if (taskSheetPanelEl) {
      taskSheetPanelEl.style.transform = "";
    }
    if (taskSheetEl) {
      taskSheetEl.hidden = true;
      taskSheetEl.setAttribute("aria-hidden", "true");
    }
    if (taskSheetBackdropEl) {
      taskSheetBackdropEl.hidden = true;
      taskSheetBackdropEl.setAttribute("aria-hidden", "true");
    }
    activeTaskSheetCard = null;
  }

  function getTaskRewardType(cardEl) {
    if (cardEl.querySelector('.raffle-task-card__reward-item[data-reward="coin"]')) {
      return "coin";
    }
    if (cardEl.querySelector('.raffle-task-card__reward-item[data-reward="energy"]')) {
      return "energy";
    }
    if (cardEl.querySelector('.raffle-task-card__reward-item[data-reward="ticket"]')) {
      return "ticket";
    }
    return "coin";
  }

  function getTaskRewardAmount(cardEl) {
    const preferred =
      cardEl.querySelector(
        '.raffle-task-card__reward-item[data-reward="coin"] .raffle-task-card__reward-value'
      ) ??
      cardEl.querySelector(
        '.raffle-task-card__reward-item[data-reward="energy"] .raffle-task-card__reward-value'
      ) ??
      cardEl.querySelector(".raffle-task-card__reward-value");
    const value = preferred?.textContent ?? "";
    return value.replace(/^\+/, "").trim();
  }

  function getTaskCardRewardIcon(cardEl) {
    return (
      cardEl.querySelector(
        '.raffle-task-card__reward-item[data-reward="coin"] .raffle-task-card__reward-icon'
      ) ?? cardEl.querySelector(".raffle-task-card__reward-icon")
    );
  }

  function formatTaskRewardLabel(amount, type) {
    if (type === "energy") {
      return amount + " энергии";
    }
    if (type === "ticket") {
      return "Участие в розыгрыше";
    }

    const n = Number(amount);
    const mod10 = n % 10;
    const mod100 = n % 100;
    let word = "монет";
    if (mod10 === 1 && mod100 !== 11) word = "монета";
    else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = "монеты";
    return amount + " " + word;
  }

  function isTaskRewardReady(cardEl) {
    if (!cardEl) return false;
    if (cardEl.dataset.taskId === "onboarding") {
      return !isOnboardingTrainingTaskClaimed;
    }
    return cardEl.dataset.taskId === "2" && isTask2RewardReady;
  }

  function getOnboardingTrainingCardEl() {
    return document.querySelector('.raffle-task-card[data-task-id="onboarding"]');
  }

  function syncOnboardingTrainingTask() {
    const cardEl = getOnboardingTrainingCardEl();
    const li = cardEl?.closest("li");
    if (!li) return;
    const visible =
      !isOnboardingTrainingTaskClaimed &&
      Boolean(
        document.querySelector(".app")?.classList.contains("scenario-onboarding-result")
      );
    li.hidden = !visible;
    syncRafflePageOverflow();
  }

  function getTask2CardEl() {
    return document.querySelector('.raffle-task-card[data-task-id="2"]');
  }

  function restoreRaffleTasksListOrder() {
    const list = document.querySelector(".raffle-tasks-list");
    if (!list) return;

    [...list.children]
      .sort((a, b) => {
        const aRank = Number(a.querySelector("[data-task-id]")?.dataset.taskId ?? 100);
        const bRank = Number(b.querySelector("[data-task-id]")?.dataset.taskId ?? 100);
        return aRank - bRank;
      })
      .forEach((item) => {
        list.appendChild(item);
      });
  }

  function getTaskListItem(taskId) {
    return document
      .querySelector('.raffle-task-card[data-task-id="' + taskId + '"]')
      ?.closest("li");
  }

  async function animateTaskCardsSwap(mutator) {
    const list = document.querySelector(".raffle-tasks-list");
    const item1 = getTaskListItem("1");
    const item2 = getTaskListItem("2");
    if (!list || !item1 || !item2) return;

    const items = [item1, item2];
    const firstRects = new Map(
      items.map((item) => [item, item.getBoundingClientRect()])
    );

    mutator(list, item1, item2);

    items.forEach((item) => {
      const first = firstRects.get(item);
      const last = item.getBoundingClientRect();
      const deltaY = first.top - last.top;
      if (Math.abs(deltaY) < 0.5) return;
      item.classList.add("is-reordering");
      item.style.transform = "translateY(" + deltaY + "px)";
    });

    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    items.forEach((item) => {
      if (!item.classList.contains("is-reordering")) return;
      item.style.transform = "";
    });

    await waitRaffleDelay(TASK_SWAP_MS + 30);

    items.forEach((item) => {
      item.classList.remove("is-reordering");
      item.style.transform = "";
    });
  }

  function animateTaskCardsSwapToRewardOrder() {
    return animateTaskCardsSwap((list, item1, item2) => {
      list.insertBefore(item2, item1);
    });
  }

  function animateTaskCardsSwapToDefaultOrder() {
    return animateTaskCardsSwap((list, item1, item2) => {
      if (item1.compareDocumentPosition(item2) & Node.DOCUMENT_POSITION_FOLLOWING) {
        return;
      }
      list.insertBefore(item1, item2);
    });
  }

  async function animateTaskSheetBadgeToRewardReady() {
    if (!taskSheetBadgeEl || !taskSheetBadgeDateEl) return;

    taskSheetBadgeEl.classList.add("is-badge-animating");

    if (taskSheetBadgeIconEl) {
      taskSheetBadgeIconEl.style.opacity = "0";
    }
    taskSheetBadgeDateEl.style.opacity = "0";

    await waitRaffleDelay(TASK_BADGE_MS);

    taskSheetBadgeEl.classList.add("is-reward-ready");
    if (taskSheetBadgeIconEl) {
      taskSheetBadgeIconEl.hidden = true;
      taskSheetBadgeIconEl.style.opacity = "";
    }
    taskSheetBadgeDateEl.textContent = TASK_REWARD_READY_TEXT;

    await new Promise((resolve) => requestAnimationFrame(resolve));
    taskSheetBadgeDateEl.style.opacity = "1";

    if (taskSheetActionEl) {
      taskSheetActionEl.textContent = TASK_CLAIM_BUTTON_TEXT;
      taskSheetActionEl.hidden = false;
    }

    await waitRaffleDelay(TASK_BADGE_MS);
    taskSheetBadgeEl.classList.remove("is-badge-animating");
  }

  function resetTaskSheetBadgeFromRewardReady(fallbackDate) {
    if (!taskSheetBadgeEl || !taskSheetBadgeDateEl) return;

    taskSheetBadgeEl.classList.remove("is-reward-ready", "is-badge-animating");
    if (taskSheetBadgeIconEl) {
      taskSheetBadgeIconEl.hidden = false;
      taskSheetBadgeIconEl.style.opacity = "";
    }
    taskSheetBadgeDateEl.textContent = fallbackDate;
    taskSheetBadgeDateEl.style.opacity = "1";
    if (taskSheetActionEl) {
      taskSheetActionEl.textContent = "Выполнить";
      taskSheetActionEl.hidden = false;
    }
  }

  function applyTask2RewardReadyContent(cardEl) {
    if (!cardEl) return;

    cardEl.classList.add("is-reward-ready");

    const claimUntil = cardEl.querySelector(".raffle-task-card__claim-until");
    if (claimUntil) {
      claimUntil.textContent = TASK_REWARD_READY_TEXT;
      claimUntil.hidden = false;
    }

    const partnerLabel = cardEl.querySelector(".raffle-task-card__partner-label");
    if (partnerLabel) {
      partnerLabel.textContent =
        cardEl.dataset.taskPartnerReadyLabel ?? "Награда от Магнита";
    }

    const claimBtn = cardEl.querySelector(".raffle-task-card__claim");
    if (claimBtn) {
      claimBtn.hidden = false;
    }
  }

  function restoreTask2RewardReadyContent(cardEl) {
    if (!cardEl) return;

    cardEl.classList.remove("is-reward-ready");

    const claimUntil = cardEl.querySelector(".raffle-task-card__claim-until");
    if (claimUntil) {
      claimUntil.hidden = true;
    }

    const partnerLabel = cardEl.querySelector(".raffle-task-card__partner-label");
    if (partnerLabel) {
      partnerLabel.textContent =
        cardEl.dataset.taskPartnerLabel ?? "Задание от Магнита";
    }

    const date = cardEl.querySelector(".raffle-task-card__date");
    if (date) {
      date.textContent = cardEl.dataset.taskDeadline ?? "До 25 ноя";
    }

    const claimBtn = cardEl.querySelector(".raffle-task-card__claim");
    if (claimBtn) {
      claimBtn.hidden = true;
    }

    resetRewardIconStyles(getTaskCardRewardIcon(cardEl));
  }

  function resetTask2RewardReady() {
    resetTask2RewardClaimed();

    if (!isTask2RewardReady) {
      restoreRaffleTasksListOrder();
      return;
    }

    const cardEl = getTask2CardEl();
    const sheetOpenOnTask2 = activeTaskSheetCard?.dataset.taskId === "2";
    const fallbackDate = cardEl?.dataset.taskDeadline ?? "До 25 ноя";
    isTask2RewardReady = false;

    void (async () => {
      await animateTaskCardsSwapToDefaultOrder();
      restoreTask2RewardReadyContent(cardEl);
      if (sheetOpenOnTask2) {
        resetTaskSheetBadgeFromRewardReady(fallbackDate);
      }
    })();
  }

  function getRaffleCardButtonCost(cardIndex) {
    return RAFFLE_CARDS[cardIndex]?.buttonCost ?? 0;
  }

  function syncCoinBadgeValue() {
    if (coinBadgeValueEl) {
      coinBadgeValueEl.textContent = String(coinBalance);
    }
    if (winSplashTasksCoinValueEl) {
      winSplashTasksCoinValueEl.textContent = String(coinBalance);
    }
  }

  function setCoinBalance(value) {
    coinBalance = value;
    syncCoinBadgeValue();
    updateRaffleParticipateButtonsState();
  }

  function updateRaffleParticipateButtonsState(displayBalance) {
    const balance = displayBalance ?? coinBalance;

    document.querySelectorAll(".raffle-event-card__btn").forEach((btn) => {
      if (btn.classList.contains("is-participated")) return;

      const wrap = btn.closest(".raffle-event-card-wrap");
      if (wrap?.dataset.participating === "true") return;

      const card = btn.closest(".raffle-event-card");
      const cardIndex = Number(card?.dataset.cardIndex);
      if (Number.isNaN(cardIndex)) return;

      const cost =
        Number(btn.dataset.participateCost) || getRaffleCardButtonCost(cardIndex);
      const canAfford = balance >= cost;
      const icon = btn.querySelector(".raffle-event-card__btn-icon");
      const nextSrc = canAfford ? RAFFLE_TOKEN_SRC : RAFFLE_TOKEN_INACTIVE_SRC;

      btn.disabled = !canAfford;
      btn.classList.toggle("is-insufficient", !canAfford);

      if (icon && icon.dataset.stateSrc !== nextSrc) {
        if (icon.dataset.stateSrc) {
          icon.style.opacity = "0";
          window.setTimeout(() => {
            icon.src = nextSrc;
            icon.dataset.stateSrc = nextSrc;
            icon.style.opacity = "1";
          }, RAFFLE_BTN_TRANSITION_MS / 2);
        } else {
          icon.src = nextSrc;
          icon.dataset.stateSrc = nextSrc;
        }
      }
    });
  }

  function animateCoinBadgeValue(start, end) {
    return new Promise((resolve) => {
      const valueEl = coinBadgeValueEl ?? coinBadgeEl?.querySelector(".energy-badge__value");
      const splashValueEl = winSplashTasksCoinValueEl;
      if (!valueEl && !splashValueEl) {
        updateRaffleParticipateButtonsState(end);
        resolve();
        return;
      }

      const duration = 800;
      const startTime = performance.now();
      let lastHapticValue = start;

      function tick(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(start + (end - start) * eased);
        if (valueEl) valueEl.textContent = String(current);
        if (splashValueEl) splashValueEl.textContent = String(current);
        updateRaffleParticipateButtonsState(current);
        if (current !== lastHapticValue) {
          lastHapticValue = current;
          triggerHaptic(HAPTIC_TICK_MS);
        }

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          if (valueEl) valueEl.textContent = String(end);
          if (splashValueEl) splashValueEl.textContent = String(end);
          updateRaffleParticipateButtonsState(end);
          resolve();
        }
      }

      requestAnimationFrame(tick);
    });
  }

  function scrollRafflePageToTop() {
    if (!rafflePageEl) return;
    rafflePageEl.scrollTop = 0;
    updateRaffleScrollFade();
  }

  function hideTaskExecuteStub() {
    if (!taskExecuteStubEl) return;

    taskExecuteStubEl.classList.remove("is-visible", "is-image-visible");
    taskExecuteStubEl.hidden = true;
    taskExecuteStubEl.setAttribute("aria-hidden", "true");
  }

  async function runTaskExecuteStubFlow() {
    if (
      !taskExecuteStubEl ||
      taskExecuteStubRunning ||
      isTask2RewardReady ||
      isTask2ClaimAnimating
    ) {
      return;
    }

    taskExecuteStubRunning = true;
    if (taskSheetActionEl) {
      taskSheetActionEl.disabled = true;
    }

    taskExecuteStubEl.classList.remove("is-visible", "is-image-visible");
    taskExecuteStubEl.hidden = false;
    taskExecuteStubEl.setAttribute("aria-hidden", "false");

    await new Promise((resolve) => requestAnimationFrame(resolve));
    taskExecuteStubEl.classList.add("is-visible");

    const actionsPromise = waitRaffleDelay(TASK_STUB_ACTION_DELAY_MS).then(async () => {
      closeTaskSheet({ animateClose: false });
      scrollRafflePageToTop();
      await activateTask2RewardReady();
    });

    await waitRaffleDelay(TASK_STUB_FADE_MS);
    taskExecuteStubEl.classList.add("is-image-visible");

    await waitRaffleDelay(TASK_STUB_HOLD_MS);

    taskExecuteStubEl.classList.remove("is-visible", "is-image-visible");
    await waitRaffleDelay(TASK_STUB_FADE_MS);

    hideTaskExecuteStub();
    await actionsPromise;

    taskExecuteStubRunning = false;
    if (taskSheetActionEl) {
      taskSheetActionEl.disabled = false;
    }
  }

  async function activateTask2RewardReady() {
    if (isTask2RewardReady) return;

    isTask2RewardReady = true;
    const cardEl = getTask2CardEl();
    applyTask2RewardReadyContent(cardEl);

    if (taskSheetActionEl) {
      taskSheetActionEl.disabled = true;
    }

    const animations = [animateTaskCardsSwapToRewardOrder()];
    if (activeTaskSheetCard?.dataset.taskId === "2") {
      animations.push(animateTaskSheetBadgeToRewardReady());
    }

    await Promise.all(animations);

    if (taskSheetActionEl) {
      taskSheetActionEl.disabled = false;
    }
  }

  function resetRewardIconStyles(rewardIcon) {
    if (!rewardIcon) return;
    rewardIcon.style.visibility = "";
    rewardIcon.style.opacity = "";
  }

  function createCoinFlyGhost(coinSize, src = COIN_FLY_SRC) {
    const ghost = document.createElement("img");
    ghost.src = src;
    ghost.alt = "";
    ghost.draggable = false;
    ghost.classList.add("task-reward-coin-fly-ghost");
    ghost.style.width = `${coinSize}px`;
    ghost.style.height = `${coinSize}px`;
    ghost.style.pointerEvents = "none";
    ghost.style.userSelect = "none";
    ghost.style.webkitUserDrag = "none";
    return ghost;
  }

  function runCoinsToBadgeAnimation(sourceEl, hooks = {}) {
    const { onTick, targetIcon: customTarget, src = COIN_FLY_SRC, size = COIN_FLY_SIZE, count } =
      hooks;
    const flyTotalMs = TASK_COIN_BURST_MS + PRIZE_TO_TAB_MS;
    const flyHalfwayMs = flyTotalMs * 0.5;
    const animationStart = performance.now();
    let firstArrivalResolved = false;
    let halfwayResolved = false;

    let resolveFirstArrival = () => {};
    let resolveHalfway = () => {};
    const firstArrival = new Promise((resolve) => {
      resolveFirstArrival = resolve;
    });
    const halfway = new Promise((resolve) => {
      resolveHalfway = resolve;
    });

    const finishFirstArrival = () => {
      if (firstArrivalResolved) return;
      firstArrivalResolved = true;
      resolveFirstArrival();
    };

    const finishHalfway = () => {
      if (halfwayResolved) return;
      halfwayResolved = true;
      resolveHalfway();
    };

    const handleTick = (now) => {
      onTick?.(now);
      if (!halfwayResolved && now - animationStart >= flyHalfwayMs) {
        finishHalfway();
      }
    };

    const targetIcon =
      customTarget ??
      (coinBadgeEl && !coinBadgeEl.hidden
        ? coinBadgeEl.querySelector(".energy-badge__icon")
        : null);
    if (!sourceEl || !targetIcon) {
      finishFirstArrival();
      finishHalfway();
      return { firstArrival, halfway };
    }

    const startRect = sourceEl.getBoundingClientRect();
    if (!startRect.width && !startRect.height) {
      finishFirstArrival();
      finishHalfway();
      return { firstArrival, halfway };
    }

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const coinSize = size;
    const endRect = targetIcon.getBoundingClientRect();
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const coinCount =
      count ??
      TASK_COIN_COUNT_MIN +
        Math.floor(Math.random() * (TASK_COIN_COUNT_MAX - TASK_COIN_COUNT_MIN + 1));

    const coins = Array.from({ length: coinCount }, (_, index) => {
      const baseAngle = (index / coinCount) * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * 0.55;
      const angle = baseAngle + jitter;
      const distance = TASK_COIN_BURST_DISTANCE * (0.85 + Math.random() * 0.35);
      const burstX = startX + Math.cos(angle) * distance;
      const burstY = startY + Math.sin(angle) * distance;
      const ghost = createCoinFlyGhost(coinSize, src);

      ghost.style.left = `${startX}px`;
      ghost.style.top = `${startY}px`;
      ghost.style.transform = "translate(-50%, -50%) scale(1)";
      ghost.style.opacity = "1";
      document.body.appendChild(ghost);

      return { ghost, burstX, burstY };
    });

    const burstStartTime = performance.now();

    function animateBurst(now) {
      handleTick(now);

      const rawT = Math.min(1, (now - burstStartTime) / TASK_COIN_BURST_MS);
      const t = 1 - Math.pow(1 - rawT, 3);

      coins.forEach((coin) => {
        const x = startX + (coin.burstX - startX) * t;
        const y = startY + (coin.burstY - startY) * t;
        coin.ghost.style.left = `${x}px`;
        coin.ghost.style.top = `${y}px`;
      });

      if (rawT < 1) {
        requestAnimationFrame(animateBurst);
      } else {
        startFlyToBadge();
      }
    }

    function startFlyToBadge() {
      coins.forEach((coin, index) => {
        const flyStartX = coin.burstX;
        const flyStartY = coin.burstY;
        const controlX = (flyStartX + endX) / 2;
        const controlY =
          Math.min(flyStartY, endY) - Math.max(48, Math.abs(endX - flyStartX) * 0.22);
        const flyStartTime = performance.now() + index * 24;
        const startScale = 1;
        const endScale = 0.5;

        function tickFly(now) {
          handleTick(now);

          const elapsed = now - flyStartTime;
          if (elapsed < 0) {
            requestAnimationFrame(tickFly);
            return;
          }

          const rawT = Math.min(1, elapsed / PRIZE_TO_TAB_MS);
          const t = 1 - Math.pow(1 - rawT, 3);
          const pos = quadraticBezierPoint(
            { x: flyStartX, y: flyStartY },
            { x: controlX, y: controlY },
            { x: endX, y: endY },
            t
          );
          const scale = startScale + (endScale - startScale) * t;
          const opacity = flyOpacity(rawT);

          coin.ghost.style.left = `${pos.x}px`;
          coin.ghost.style.top = `${pos.y}px`;
          coin.ghost.style.transform = `translate(-50%, -50%) scale(${scale})`;
          coin.ghost.style.opacity = String(opacity);

          if (index === 0 && rawT >= COIN_COUNTER_START_PROGRESS) {
            finishFirstArrival();
          }

          if (rawT < 1) {
            requestAnimationFrame(tickFly);
          } else {
            coin.ghost.remove();
          }
        }

        requestAnimationFrame(tickFly);
      });
    }

    requestAnimationFrame(animateBurst);
    return { firstArrival, halfway };
  }

  function flyCoinsToBadge(sourceEl) {
    return runCoinsToBadgeAnimation(sourceEl).firstArrival;
  }

  function flyTaskCoinsToBadge(sourceIcon) {
    if (!sourceIcon) {
      return Promise.resolve();
    }
    return runCoinsToBadgeAnimation(sourceIcon).halfway;
  }

  function animateCoinBadgeCounter(amount) {
    const start = coinBalance;
    const end = start + amount;

    return animateCoinBadgeValue(start, end).then(() => {
      coinBalance = end;
      syncCoinBadgeValue();
      updateRaffleParticipateButtonsState();
    });
  }

  async function animateTaskCardRemove(cardEl) {
    const li = cardEl.closest("li");
    const list = li?.parentElement;
    if (!li || !list) return;

    cardEl.classList.add("is-claim-removing");
    await waitRaffleDelay(TASK_CLAIM_MS);

    const startHeight = li.getBoundingClientRect().height;
    const listGap = Number.parseFloat(window.getComputedStyle(list).rowGap) || 20;

    li.style.height = `${startHeight}px`;
    li.style.overflow = "hidden";
    li.style.marginBottom = "0";
    li.classList.add("is-claim-collapsing-out");

    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    li.style.height = "0";
    li.style.marginBottom = `-${listGap}px`;

    await waitRaffleDelay(TASK_CLAIM_REORDER_MS);

    if (cardEl.dataset.taskId === "onboarding") {
      removedOnboardingTaskListItem = { el: li, nextSibling: li.nextElementSibling };
    } else if (cardEl.dataset.taskId === "2") {
      removedTask2ListItem = { el: li, nextSibling: li.nextElementSibling };
    }
    li.classList.remove("is-claim-collapsing-out");
    li.style.height = "";
    li.style.overflow = "";
    li.style.marginBottom = "";
    li.remove();

    cardEl.classList.remove("is-reward-ready", "is-claim-removing");
    cardEl.style.pointerEvents = "";
    if (rafflePageEl) {
      rafflePageEl.style.webkitOverflowScrolling = "auto";
      void rafflePageEl.offsetHeight;
      rafflePageEl.style.webkitOverflowScrolling = "";
    }
    syncRafflePageOverflow();
  }

  function resetTask2RewardClaimed() {
    const cardEl = getTask2CardEl();

    if (removedTask2ListItem) {
      const list = document.querySelector(".raffle-tasks-list");
      if (list) {
        list.insertBefore(removedTask2ListItem.el, removedTask2ListItem.nextSibling);
      }
      removedTask2ListItem = null;
    }

    isTask2RewardClaimed = false;

    if (cardEl) {
      cardEl.style.pointerEvents = "";
      cardEl.classList.remove("is-claiming", "is-claim-removing");
      resetRewardIconStyles(getTaskCardRewardIcon(cardEl));
      const li = cardEl.closest("li");
      if (li) {
        li.style.height = "";
        li.style.overflow = "";
        li.style.marginBottom = "";
        li.classList.remove("is-claim-collapsing-out");
      }
    }
  }

  async function claimTask2Reward(source) {
    if (isTask2ClaimAnimating || isTask2RewardClaimed || !isTask2RewardReady) return;

    const cardEl = getTask2CardEl();
    if (!cardEl) return;

    isTask2ClaimAnimating = true;
    cardEl.style.pointerEvents = "none";

    if (source === "sheet" && isTaskSheetOpen()) {
      await closeTaskSheet({ animateClose: true });
    }

    const rewardIcon = getTaskCardRewardIcon(cardEl);
    const coinFly = rewardIcon ? runCoinsToBadgeAnimation(rewardIcon) : null;

    await (coinFly?.halfway ?? Promise.resolve());

    isTask2RewardClaimed = true;

    await Promise.all([
      animateTaskCardRemove(cardEl),
      (coinFly?.firstArrival ?? Promise.resolve()).then(() =>
        animateCoinBadgeCounter(TASK_REWARD_COIN_AMOUNT)
      ),
    ]);

    isTask2ClaimAnimating = false;
  }

  function setPrizesTabDot(visible) {
    const prizesTab = document.querySelector('.tab[data-tab="prizes"]');
    prizesTab?.classList.toggle("has-prize-dot", Boolean(visible));
  }

  function animateEnergyBadgeTo(end) {
    return new Promise((resolve) => {
      const valueEl = energyBadgeValueEl;
      if (!valueEl) {
        resolve();
        return;
      }

      const start = Number.parseInt(valueEl.textContent, 10) || 0;
      const duration = 800;
      const startTime = performance.now();

      function tick(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(start + (end - start) * eased);
        valueEl.textContent = String(current);

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          valueEl.textContent = String(end);
          resolve();
        }
      }

      requestAnimationFrame(tick);
    });
  }

  function resetOnboardingTrainingTask() {
    const cardEl = getOnboardingTrainingCardEl();

    if (removedOnboardingTaskListItem) {
      const list = document.querySelector(".raffle-tasks-list");
      if (list) {
        list.insertBefore(
          removedOnboardingTaskListItem.el,
          list.firstElementChild
        );
      }
      removedOnboardingTaskListItem = null;
    }

    isOnboardingTrainingTaskClaimed = false;
    isOnboardingTrainingTaskClaiming = false;
    setPrizesTabDot(false);

    if (cardEl) {
      cardEl.style.pointerEvents = "";
      cardEl.classList.remove("is-claiming", "is-claim-removing");
      cardEl.classList.add("is-reward-ready");
      const claimBtn = cardEl.querySelector(".raffle-task-card__claim");
      if (claimBtn) claimBtn.hidden = false;
      const li = cardEl.closest("li");
      if (li) {
        li.style.height = "";
        li.style.overflow = "";
        li.style.marginBottom = "";
        li.classList.remove("is-claim-collapsing-out");
      }
    }

    hideOnboardingEnergyHint({ animate: false });
    document.querySelector(".app")?.classList.remove("is-onboarding-play-again");
    syncOnboardingTrainingTask();
  }

  function isOnboardingEnergyHintActive() {
    return Boolean(
      document.querySelector(".app")?.classList.contains("is-onboarding-energy-hint")
    );
  }

  function isOnboardingEnergyHintBlocking() {
    const app = document.querySelector(".app");
    return Boolean(
      app?.classList.contains("is-onboarding-energy-hint") ||
        app?.classList.contains("is-onboarding-energy-hint-out")
    );
  }

  function enableOnboardingPlayAgainButton() {
    const app = document.querySelector(".app");
    app?.classList.add("is-onboarding-play-again");
    const yellowText = document.querySelector(".win-block--yellow__text");
    const yellowEnergy = document.querySelector(".win-block--yellow__energy");
    if (yellowText) yellowText.textContent = DEFAULT_YELLOW_BUTTON_TEXT;
    if (yellowEnergy) yellowEnergy.hidden = false;
  }

  function layoutOnboardingEnergyTooltip() {
    const tooltip = onboardingEnergyTooltipEl;
    const tail = tooltip?.querySelector(".onboarding-energy-tooltip__tail");
    const body = tooltip?.querySelector(".onboarding-energy-tooltip__body");
    if (!tooltip || !tail || !body || tooltip.hidden || !energyBadgeEl || !frameEl) {
      return;
    }

    const frameRect = frameEl.getBoundingClientRect();
    const badgeRect = energyBadgeEl.getBoundingClientRect();
    const tailWidth = tail.offsetWidth || 24;
    const tailHeight = tail.offsetHeight || 8;

    tooltip.style.top = `${badgeRect.bottom - frameRect.top + 8}px`;
    tail.style.left = `${
      badgeRect.left + badgeRect.width / 2 - frameRect.left - tailWidth / 2
    }px`;

    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;
    const tailLeft = parseFloat(tail.style.left) || 0;
    const bodyLeft = frameRect.width - 16 - bodyWidth;
    const minX = Math.min(bodyLeft, tailLeft);
    const maxX = Math.max(bodyLeft + bodyWidth, tailLeft + tailWidth);
    tooltip.style.transformOrigin = `${(minX + maxX) / 2}px ${
      (bodyHeight + tailHeight) / 2
    }px`;
  }

  function revealOnboardingEnergyTooltip() {
    if (!isOnboardingEnergyHintActive() || !onboardingEnergyTooltipEl) return;
    onboardingEnergyTooltipEl.classList.remove("is-visible");
    onboardingEnergyTooltipEl.hidden = false;
    onboardingEnergyTooltipEl.setAttribute("aria-hidden", "false");
    layoutOnboardingEnergyTooltip();
    requestAnimationFrame(() => {
      layoutOnboardingEnergyTooltip();
      requestAnimationFrame(() => {
        if (!isOnboardingEnergyHintActive() || !onboardingEnergyTooltipEl) return;
        onboardingEnergyTooltipEl.classList.add("is-visible");
      });
    });
  }

  function startOnboardingEnergyHint() {
    const app = document.querySelector(".app");
    if (!app) return;

    enableOnboardingPlayAgainButton();
    app.classList.remove("is-onboarding-energy-hint-out");
    app.classList.add("is-onboarding-energy-hint");
    window.clearTimeout(onboardingEnergyHintTimer);
    onboardingEnergyHintTimer = window.setTimeout(() => {
      onboardingEnergyHintTimer = null;
      if (!isOnboardingEnergyHintActive()) return;
      revealOnboardingEnergyTooltip();
    }, ONBOARDING_ENERGY_HINT_DIM_MS);
  }

  async function hideOnboardingEnergyHint(options = {}) {
    const animate = options.animate !== false;
    const app = document.querySelector(".app");
    const tooltip = onboardingEnergyTooltipEl;
    const hintActive = Boolean(
      app?.classList.contains("is-onboarding-energy-hint") ||
        app?.classList.contains("is-onboarding-energy-hint-out")
    );
    const tooltipVisible = Boolean(tooltip && !tooltip.hidden);

    window.clearTimeout(onboardingEnergyHintTimer);
    onboardingEnergyHintTimer = null;

    if (!hintActive && !tooltipVisible) return;
    if (onboardingEnergyHintHiding && animate) return;

    if (!animate) {
      onboardingEnergyHintHiding = false;
      app?.classList.remove(
        "is-onboarding-energy-hint",
        "is-onboarding-energy-hint-out"
      );
      if (tooltip) {
        tooltip.classList.remove("is-visible");
        tooltip.hidden = true;
        tooltip.setAttribute("aria-hidden", "true");
      }
      return;
    }

    onboardingEnergyHintHiding = true;
    tooltip?.classList.remove("is-visible");
    app?.classList.add("is-onboarding-energy-hint-out");
    app?.classList.remove("is-onboarding-energy-hint");
    await waitRaffleDelay(ONBOARDING_ENERGY_TOOLTIP_MS);
    app?.classList.remove("is-onboarding-energy-hint-out");
    if (tooltip) {
      tooltip.hidden = true;
      tooltip.setAttribute("aria-hidden", "true");
    }
    onboardingEnergyHintHiding = false;
  }

  function handleEnergyHintPointerDown(event) {
    if (!isOnboardingEnergyHintBlocking()) return;
    if (event.target.closest(".app > .header .close-btn")) return;
    event.preventDefault();
    event.stopPropagation();
    void hideOnboardingEnergyHint();
  }

  async function claimOnboardingTrainingReward(source) {
    if (isOnboardingTrainingTaskClaiming || isOnboardingTrainingTaskClaimed) return;

    const cardEl = getOnboardingTrainingCardEl();
    if (!cardEl) return;

    isOnboardingTrainingTaskClaiming = true;
    cardEl.style.pointerEvents = "none";

    if (source === "sheet" && isTaskSheetOpen()) {
      await closeTaskSheet({ animateClose: true });
    }

    const giftIcon = cardEl.querySelector(
      '.raffle-task-card__reward-item[data-reward="gift"] .raffle-task-card__reward-icon'
    );
    const energyIcon = cardEl.querySelector(
      '.raffle-task-card__reward-item[data-reward="energy"] .raffle-task-card__reward-icon'
    );
    const prizesIcon = getGiftIconEl();
    const energyTarget = energyBadgeEl?.querySelector(".energy-badge__icon");

    const giftFly = giftIcon
      ? runCoinsToBadgeAnimation(giftIcon, {
          targetIcon: prizesIcon,
          src: ONBOARDING_TASK_GIFT_SRC,
          count: 1,
        })
      : null;
    const energyFly = energyIcon
      ? runCoinsToBadgeAnimation(energyIcon, {
          targetIcon: energyTarget,
          src: ENERGY_FLY_SRC,
          count: ONBOARDING_TASK_ENERGY_AMOUNT,
        })
      : null;

    await Promise.all([
      giftFly?.halfway ?? Promise.resolve(),
      energyFly?.halfway ?? Promise.resolve(),
    ]);

    isOnboardingTrainingTaskClaimed = true;

    await Promise.all([
      animateTaskCardRemove(cardEl),
      (energyFly?.firstArrival ?? Promise.resolve()).then(() =>
        animateEnergyBadgeTo(ONBOARDING_TASK_ENERGY_AMOUNT)
      ),
      (giftFly?.firstArrival ?? Promise.resolve()).then(() => {
        setPrizesTabDot(true);
      }),
    ]);

    isOnboardingTrainingTaskClaiming = false;
    syncOnboardingTrainingTask();
    startOnboardingEnergyHint();
  }

  function updateTaskSheetContent(cardEl, options = {}) {
    const title = cardEl.querySelector(".raffle-task-card__title")?.textContent?.trim() ?? "";
    const date = cardEl.querySelector(".raffle-task-card__date")?.textContent?.trim() ?? "";
    const sheetSubtitle = cardEl.dataset.taskSheetSubtitle?.trim() ?? "";
    const showAction = cardEl.dataset.taskSheetAction === "true";
    const rewardReady = isTaskRewardReady(cardEl);
    const rewardType = getTaskRewardType(cardEl);
    const rewardAmount = getTaskRewardAmount(cardEl);
    const rewardIconSrc = getTaskCardRewardIcon(cardEl)?.getAttribute("src") ?? "";

    if (!options.skipBadge) {
      if (taskSheetBadgeEl) {
        taskSheetBadgeEl.classList.toggle("is-reward-ready", rewardReady);
      }
      if (taskSheetBadgeIconEl) {
        taskSheetBadgeIconEl.hidden = rewardReady;
        taskSheetBadgeIconEl.style.opacity = "";
      }
      if (taskSheetBadgeDateEl) {
        if (cardEl.dataset.taskId === "onboarding") {
          const claimUntil = cardEl
            .querySelector(".raffle-task-card__claim-until")
            ?.textContent?.trim();
          taskSheetBadgeDateEl.textContent = claimUntil || "Заберите до 30 ноября";
        } else {
          taskSheetBadgeDateEl.textContent = rewardReady ? TASK_REWARD_READY_TEXT : date;
        }
        taskSheetBadgeDateEl.style.opacity = "1";
      }
    }
    if (taskSheetTitleEl) {
      taskSheetTitleEl.textContent = title;
    }
    if (taskSheetSubtitleEl) {
      if (sheetSubtitle) {
        taskSheetSubtitleEl.textContent = sheetSubtitle;
        taskSheetSubtitleEl.hidden = false;
      } else {
        taskSheetSubtitleEl.textContent = "";
        taskSheetSubtitleEl.hidden = true;
      }
    }
    if (taskSheetRewardTicketEl) {
      const showTicket = cardEl.dataset.taskId === "2";
      taskSheetRewardTicketEl.hidden = !showTicket;
    }
    if (taskSheetRewardOnboardingPrizeEl) {
      taskSheetRewardOnboardingPrizeEl.hidden = cardEl.dataset.taskId !== "onboarding";
    }
    if (taskSheetRewardIconEl && rewardIconSrc) {
      taskSheetRewardIconEl.src = rewardIconSrc;
    }
    if (cardEl.dataset.taskId === "onboarding") {
      const energyIcon = cardEl.querySelector(
        '.raffle-task-card__reward-item[data-reward="energy"] .raffle-task-card__reward-icon'
      );
      if (taskSheetRewardIconEl) {
        taskSheetRewardIconEl.src = energyIcon?.getAttribute("src") || ENERGY_FLY_SRC;
      }
      if (taskSheetRewardLabelEl) {
        taskSheetRewardLabelEl.textContent = ONBOARDING_TASK_ENERGY_AMOUNT + " энергий";
      }
      if (taskSheetRewardNoteEl) {
        taskSheetRewardNoteEl.textContent = "Выдадим сразу";
      }
    } else {
      if (taskSheetRewardLabelEl) {
        taskSheetRewardLabelEl.textContent = formatTaskRewardLabel(rewardAmount, rewardType);
      }
      if (taskSheetRewardNoteEl) {
        taskSheetRewardNoteEl.textContent = "Зачислим сразу";
      }
    }
    if (taskSheetActionEl) {
      if (rewardReady) {
        taskSheetActionEl.hidden = false;
        taskSheetActionEl.textContent =
          cardEl.dataset.taskSheetClaim || TASK_CLAIM_BUTTON_TEXT;
      } else {
        taskSheetActionEl.textContent = "Выполнить";
        taskSheetActionEl.hidden = !showAction;
      }
    }
  }

  function openTaskSheet(cardEl) {
    if (!taskSheetEl || !taskSheetBackdropEl || !taskSheetPanelEl || !cardEl || isTaskSheetOpen()) {
      return;
    }

    activeTaskSheetCard = cardEl;
    updateTaskSheetContent(cardEl);

    taskSheetEl.hidden = false;
    taskSheetBackdropEl.hidden = false;
    taskSheetEl.classList.remove("is-closing");
    taskSheetBackdropEl.classList.remove("is-closing");
    taskSheetPanelEl.classList.remove("is-dragging");
    taskSheetPanelEl.style.transform = "";
    taskSheetEl.setAttribute("aria-hidden", "false");
    taskSheetBackdropEl.setAttribute("aria-hidden", "false");
    rafflePageEl?.classList.add("task-sheet-open");
    setAppSheetChrome(true);

    requestAnimationFrame(() => {
      taskSheetEl.classList.add("is-open");
      taskSheetBackdropEl.classList.add("is-visible");
    });
  }

  function closeTaskSheet(options = {}) {
    if (!taskSheetEl || !taskSheetBackdropEl) {
      return Promise.resolve();
    }
    if (!taskSheetEl.classList.contains("is-open") && !taskSheetEl.classList.contains("is-closing")) {
      return Promise.resolve();
    }

    const animateClose = options.animateClose !== false;

    rafflePageEl?.classList.remove("task-sheet-open");
    taskSheetBackdropEl.classList.remove("is-visible");
    setAppSheetChrome(false, animateClose);

    if (animateClose) {
      taskSheetEl.classList.add("is-closing");
      taskSheetEl.classList.remove("is-open");
      taskSheetBackdropEl.classList.add("is-closing");
      taskSheetPanelEl?.classList.remove("is-dragging");
      if (taskSheetPanelEl) {
        taskSheetPanelEl.style.transform = "";
      }
      return new Promise((resolve) => {
        window.setTimeout(() => {
          finishTaskSheetClose();
          resolve();
        }, RESULT_SHEET_CLOSE_MS);
      });
    }

    taskSheetEl.classList.remove("is-open", "is-closing");
    taskSheetBackdropEl.classList.remove("is-visible", "is-closing");
    finishTaskSheetClose();
    return Promise.resolve();
  }

  function initTaskSheet() {
    let dragStartY = 0;
    let isDragging = false;
    let activePointerId = null;

    const finishDrag = (clientY) => {
      if (!isDragging || !taskSheetPanelEl) return;
      isDragging = false;
      activePointerId = null;
      taskSheetPanelEl.classList.remove("is-dragging");

      const delta = Math.max(0, clientY - dragStartY);
      if (delta > taskSheetPanelEl.offsetHeight * 0.25) {
        taskSheetPanelEl.style.transform = "";
        closeTaskSheet({ animateClose: true });
        return;
      }

      taskSheetPanelEl.style.transform = "";
    };

    document.querySelectorAll(".raffle-task-card[data-task-sheet]").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        openTaskSheet(cardEl);
      });

      cardEl.querySelector(".raffle-task-card__claim")?.addEventListener("click", (event) => {
        event.stopPropagation();
        if (cardEl.dataset.taskId === "onboarding") {
          if (isOnboardingTrainingTaskClaimed || isOnboardingTrainingTaskClaiming) return;
          void claimOnboardingTrainingReward("card");
          return;
        }
        if (
          !isTask2RewardReady ||
          isTask2RewardClaimed ||
          isTask2ClaimAnimating ||
          cardEl.dataset.taskId !== "2"
        ) {
          return;
        }
        void claimTask2Reward("card");
      });
    });

    taskSheetCloseEl?.addEventListener("click", () => {
      closeTaskSheet({ animateClose: true });
    });

    taskSheetActionEl?.addEventListener("click", () => {
      if (!activeTaskSheetCard || taskSheetActionEl.disabled) {
        return;
      }

      if (activeTaskSheetCard.dataset.taskId === "onboarding") {
        if (!isOnboardingTrainingTaskClaimed && !isOnboardingTrainingTaskClaiming) {
          void claimOnboardingTrainingReward("sheet");
        }
        return;
      }

      if (activeTaskSheetCard.dataset.taskId !== "2") {
        return;
      }

      if (isTask2RewardReady && !isTask2RewardClaimed && !isTask2ClaimAnimating) {
        void claimTask2Reward("sheet");
        return;
      }

      if (!isTask2RewardReady) {
        void runTaskExecuteStubFlow();
      }
    });

    taskSheetBackdropEl?.addEventListener("click", () => {
      closeTaskSheet({ animateClose: true });
    });

    taskSheetBarEl?.addEventListener("pointerdown", (event) => {
      if (!isTaskSheetOpen() || !taskSheetPanelEl) return;
      isDragging = true;
      activePointerId = event.pointerId;
      dragStartY = event.clientY;
      taskSheetPanelEl.classList.add("is-dragging");
      taskSheetBarEl.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    taskSheetBarEl?.addEventListener("pointermove", (event) => {
      if (!isDragging || event.pointerId !== activePointerId || !taskSheetPanelEl) return;
      const offset = Math.max(0, event.clientY - dragStartY);
      taskSheetPanelEl.style.transform = "translateY(" + offset + "px)";
    });

    taskSheetBarEl?.addEventListener("pointerup", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });

    taskSheetBarEl?.addEventListener("pointercancel", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });
  }

  function isOnboardingNotifySheetOpen() {
    return (
      onboardingNotifySheetEl?.classList.contains("is-open") ||
      onboardingNotifySheetEl?.classList.contains("is-closing") ||
      false
    );
  }

  function finishOnboardingNotifySheetClose() {
    const app = document.querySelector(".app");
    app?.classList.remove("onboarding-notify-sheet-open");
    onboardingNotifySheetEl?.classList.remove("is-closing");
    onboardingNotifyPanelEl?.classList.remove("is-dragging");
    if (onboardingNotifyPanelEl) {
      onboardingNotifyPanelEl.style.transform = "";
    }
    if (onboardingNotifySheetEl) {
      onboardingNotifySheetEl.hidden = true;
      onboardingNotifySheetEl.setAttribute("aria-hidden", "true");
    }
  }

  function openOnboardingNotifySheet() {
    if (!onboardingNotifySheetEl || !onboardingNotifyPanelEl || isOnboardingNotifySheetOpen()) {
      return;
    }

    const app = document.querySelector(".app");
    onboardingNotifySheetEl.hidden = false;
    onboardingNotifySheetEl.classList.remove("is-closing");
    onboardingNotifyPanelEl.classList.remove("is-dragging");
    onboardingNotifyPanelEl.style.transform = "";
    onboardingNotifySheetEl.setAttribute("aria-hidden", "false");
    app?.classList.add("onboarding-notify-sheet-open");

    void onboardingNotifyPanelEl.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        prepareOnboardingNotifyDim();
        onboardingNotifySheetEl.classList.add("is-open");
      });
    });
  }

  function closeOnboardingNotifySheet(options = {}) {
    if (!onboardingNotifySheetEl) {
      return Promise.resolve();
    }
    if (
      !onboardingNotifySheetEl.classList.contains("is-open") &&
      !onboardingNotifySheetEl.classList.contains("is-closing")
    ) {
      finishOnboardingNotifySheetClose();
      return Promise.resolve();
    }

    const animateClose = options.animateClose !== false;
    const revealTaskHint = options.revealTaskHint === true && !onboardingClosing;
    const app = document.querySelector(".app");
    app?.classList.remove("onboarding-notify-sheet-open");
    if (revealTaskHint) {
      prepareOnboardingTaskHint();
    }

    if (animateClose) {
      onboardingNotifySheetEl.classList.add("is-closing");
      onboardingNotifySheetEl.classList.remove("is-open");
      onboardingNotifyPanelEl?.classList.remove("is-dragging");
      if (onboardingNotifyPanelEl) {
        onboardingNotifyPanelEl.style.transform = "";
      }
      return new Promise((resolve) => {
        window.setTimeout(() => {
          finishOnboardingNotifySheetClose();
          if (revealTaskHint) revealOnboardingTaskTooltip();
          resolve();
        }, RESULT_SHEET_CLOSE_MS);
      });
    }

    onboardingNotifySheetEl.classList.remove("is-open", "is-closing");
    finishOnboardingNotifySheetClose();
    if (revealTaskHint) revealOnboardingTaskTooltip();
    return Promise.resolve();
  }

  function initOnboardingNotifySheet() {
    let dragStartY = 0;
    let isDragging = false;
    let activePointerId = null;

    const finishDrag = (clientY) => {
      if (!isDragging || !onboardingNotifyPanelEl) return;
      isDragging = false;
      activePointerId = null;
      onboardingNotifyPanelEl.classList.remove("is-dragging");

      const delta = Math.max(0, clientY - dragStartY);
      if (delta > onboardingNotifyPanelEl.offsetHeight * 0.25) {
        onboardingNotifyPanelEl.style.transform = "";
        closeOnboardingNotifySheet({ animateClose: true, revealTaskHint: true });
        return;
      }

      onboardingNotifyPanelEl.style.transform = "";
    };

    const closeAnimated = () => {
      closeOnboardingNotifySheet({ animateClose: true, revealTaskHint: true });
    };

    onboardingNotifyCloseEl?.addEventListener("click", closeAnimated);
    onboardingNotifyEnableEl?.addEventListener("click", closeAnimated);
    onboardingNotifyLaterEl?.addEventListener("click", closeAnimated);
    onboardingNotifyBackdropEl?.addEventListener("click", closeAnimated);

    onboardingNotifyBarEl?.addEventListener("pointerdown", (event) => {
      if (!isOnboardingNotifySheetOpen() || !onboardingNotifyPanelEl) return;
      isDragging = true;
      activePointerId = event.pointerId;
      dragStartY = event.clientY;
      onboardingNotifyPanelEl.classList.add("is-dragging");
      onboardingNotifyBarEl.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    onboardingNotifyBarEl?.addEventListener("pointermove", (event) => {
      if (
        !isDragging ||
        event.pointerId !== activePointerId ||
        !onboardingNotifyPanelEl
      ) {
        return;
      }
      const offset = Math.max(0, event.clientY - dragStartY);
      onboardingNotifyPanelEl.style.transform = "translateY(" + offset + "px)";
    });

    onboardingNotifyBarEl?.addEventListener("pointerup", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });

    onboardingNotifyBarEl?.addEventListener("pointercancel", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });
  }

  function isOnboardingRulesSheetOpen() {
    return (
      onboardingRulesSheetEl?.classList.contains("is-open") ||
      onboardingRulesSheetEl?.classList.contains("is-closing") ||
      false
    );
  }

  function finishOnboardingRulesSheetClose() {
    onboardingRulesSheetEl?.classList.remove("is-closing");
    onboardingRulesBackdropEl?.classList.remove("is-closing");
    onboardingRulesPanelEl?.classList.remove("is-dragging");
    if (onboardingRulesPanelEl) {
      onboardingRulesPanelEl.style.transform = "";
    }
    if (onboardingRulesSheetEl) {
      onboardingRulesSheetEl.hidden = true;
      onboardingRulesSheetEl.setAttribute("aria-hidden", "true");
    }
    if (onboardingRulesBackdropEl) {
      onboardingRulesBackdropEl.hidden = true;
      onboardingRulesBackdropEl.setAttribute("aria-hidden", "true");
    }
  }

  function openOnboardingRulesSheet() {
    if (
      !onboardingRulesSheetEl ||
      !onboardingRulesBackdropEl ||
      !onboardingRulesPanelEl ||
      isOnboardingRulesSheetOpen()
    ) {
      return;
    }

    if (onboardingRulesBodyEl) {
      onboardingRulesBodyEl.scrollTop = 0;
    }

    onboardingRulesSheetEl.hidden = false;
    onboardingRulesBackdropEl.hidden = false;
    onboardingRulesSheetEl.classList.remove("is-closing");
    onboardingRulesBackdropEl.classList.remove("is-closing");
    onboardingRulesPanelEl.classList.remove("is-dragging");
    onboardingRulesPanelEl.style.transform = "";
    onboardingRulesSheetEl.setAttribute("aria-hidden", "false");
    onboardingRulesBackdropEl.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      onboardingRulesSheetEl.classList.add("is-open");
      onboardingRulesBackdropEl.classList.add("is-visible");
    });
  }

  function closeOnboardingRulesSheet(options = {}) {
    if (!onboardingRulesSheetEl || !onboardingRulesBackdropEl) {
      return;
    }
    if (
      !onboardingRulesSheetEl.classList.contains("is-open") &&
      !onboardingRulesSheetEl.classList.contains("is-closing")
    ) {
      return;
    }

    const animateClose = options.animateClose !== false;

    onboardingRulesBackdropEl.classList.remove("is-visible");

    if (animateClose) {
      onboardingRulesSheetEl.classList.add("is-closing");
      onboardingRulesSheetEl.classList.remove("is-open");
      onboardingRulesBackdropEl.classList.add("is-closing");
      onboardingRulesPanelEl?.classList.remove("is-dragging");
      if (onboardingRulesPanelEl) {
        onboardingRulesPanelEl.style.transform = "";
      }
      window.setTimeout(finishOnboardingRulesSheetClose, RESULT_SHEET_CLOSE_MS);
      return;
    }

    onboardingRulesSheetEl.classList.remove("is-open", "is-closing");
    onboardingRulesBackdropEl.classList.remove("is-visible", "is-closing");
    finishOnboardingRulesSheetClose();
  }

  function initOnboardingRulesSheet() {
    let dragStartY = 0;
    let isDragging = false;
    let activePointerId = null;

    const finishDrag = (clientY) => {
      if (!isDragging || !onboardingRulesPanelEl) return;
      isDragging = false;
      activePointerId = null;
      onboardingRulesPanelEl.classList.remove("is-dragging");

      const delta = Math.max(0, clientY - dragStartY);
      if (delta > onboardingRulesPanelEl.offsetHeight * 0.25) {
        onboardingRulesPanelEl.style.transform = "";
        closeOnboardingRulesSheet({ animateClose: true });
        return;
      }

      onboardingRulesPanelEl.style.transform = "";
    };

    onboardingRulesCloseEl?.addEventListener("click", () => {
      closeOnboardingRulesSheet({ animateClose: true });
    });

    onboardingRulesBackdropEl?.addEventListener("click", () => {
      closeOnboardingRulesSheet({ animateClose: true });
    });

    onboardingRulesBarEl?.addEventListener("pointerdown", (event) => {
      if (!isOnboardingRulesSheetOpen() || !onboardingRulesPanelEl) return;
      isDragging = true;
      activePointerId = event.pointerId;
      dragStartY = event.clientY;
      onboardingRulesPanelEl.classList.add("is-dragging");
      onboardingRulesBarEl.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    onboardingRulesBarEl?.addEventListener("pointermove", (event) => {
      if (
        !isDragging ||
        event.pointerId !== activePointerId ||
        !onboardingRulesPanelEl
      ) {
        return;
      }
      const offset = Math.max(0, event.clientY - dragStartY);
      onboardingRulesPanelEl.style.transform = "translateY(" + offset + "px)";
    });

    onboardingRulesBarEl?.addEventListener("pointerup", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });

    onboardingRulesBarEl?.addEventListener("pointercancel", (event) => {
      if (event.pointerId !== activePointerId) return;
      finishDrag(event.clientY);
    });
  }

  let onboardingTaskTooltipTimer = null;

  function prepareOnboardingNotifyDim() {
    document.querySelector(".app")?.classList.add("is-onboarding-notify-dim");
  }

  function isOnboardingTaskHintActive() {
    return Boolean(
      document.querySelector(".app")?.classList.contains("is-onboarding-task-hint")
    );
  }

  function layoutOnboardingTaskTooltip() {
    const tooltip = onboardingTaskTooltipEl;
    const tail = tooltip?.querySelector(".onboarding-task-tooltip__tail");
    const body = tooltip?.querySelector(".onboarding-task-tooltip__body");
    if (!tooltip || !tail || tooltip.hidden || !raffleTabEl || !frameEl) return;

    const frameRect = frameEl.getBoundingClientRect();
    const tabRect = raffleTabEl.getBoundingClientRect();
    const tailWidth = tail.offsetWidth || 30;
    const tailHeight = tail.offsetHeight || 12;
    tooltip.style.bottom = `${frameRect.bottom - tabRect.top + 8}px`;
    tail.style.left = `${
      tabRect.left + tabRect.width / 2 - frameRect.left - tailWidth / 2
    }px`;

    if (body) {
      const bodyLeft = 16;
      const bodyWidth = body.offsetWidth;
      const bodyHeight = body.offsetHeight;
      const tailLeft = parseFloat(tail.style.left) || 0;
      const minX = Math.min(bodyLeft, tailLeft);
      const maxX = Math.max(bodyLeft + bodyWidth, tailLeft + tailWidth);
      tooltip.style.transformOrigin = `${(minX + maxX) / 2}px ${
        -(bodyHeight + tailHeight) / 2
      }px`;
    }
  }

  function prepareOnboardingTaskHint() {
    prepareOnboardingNotifyDim();
    const app = document.querySelector(".app");
    app?.classList.add("is-onboarding-task-hint");
    window.clearTimeout(onboardingTaskTooltipTimer);
    onboardingTaskTooltipTimer = null;
    if (onboardingTaskTooltipEl) {
      onboardingTaskTooltipEl.classList.remove("is-visible");
      onboardingTaskTooltipEl.hidden = true;
      onboardingTaskTooltipEl.setAttribute("aria-hidden", "true");
    }
  }

  function revealOnboardingTaskTooltip() {
    if (!isOnboardingTaskHintActive() || !onboardingTaskTooltipEl) return;
    window.clearTimeout(onboardingTaskTooltipTimer);
    onboardingTaskTooltipTimer = window.setTimeout(() => {
      onboardingTaskTooltipTimer = null;
      if (!isOnboardingTaskHintActive() || !onboardingTaskTooltipEl) return;
      onboardingTaskTooltipEl.classList.remove("is-visible");
      onboardingTaskTooltipEl.hidden = false;
      onboardingTaskTooltipEl.setAttribute("aria-hidden", "false");
      layoutOnboardingTaskTooltip();
      requestAnimationFrame(() => {
        layoutOnboardingTaskTooltip();
        requestAnimationFrame(() => {
          if (!isOnboardingTaskHintActive() || !onboardingTaskTooltipEl) return;
          onboardingTaskTooltipEl.classList.add("is-visible");
        });
      });
    }, ONBOARDING_TASK_TOOLTIP_DELAY_MS);
  }

  function hideOnboardingTaskHint() {
    window.clearTimeout(onboardingTaskTooltipTimer);
    onboardingTaskTooltipTimer = null;
    const app = document.querySelector(".app");
    app?.classList.remove("is-onboarding-task-hint", "is-onboarding-notify-dim");
    if (onboardingTaskTooltipEl) {
      onboardingTaskTooltipEl.classList.remove("is-visible");
      onboardingTaskTooltipEl.hidden = true;
      onboardingTaskTooltipEl.setAttribute("aria-hidden", "true");
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

  function initPrizesSegment() {
    const segmentEl = document.getElementById("prizes-segment");
    if (!segmentEl) return;

    const buttons = [
      ...segmentEl.querySelectorAll("[data-prizes-segment]"),
    ];
    const panels = [
      ...document.querySelectorAll("[data-prizes-panel]"),
    ];

    const setActive = (segmentId) => {
      segmentEl.dataset.active = segmentId;

      buttons.forEach((btn) => {
        const isActive = btn.dataset.prizesSegment === segmentId;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.prizesPanel !== segmentId;
      });
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const segmentId = btn.dataset.prizesSegment;
        if (!segmentId || segmentEl.dataset.active === segmentId) return;
        setActive(segmentId);
      });
    });

    setActive(segmentEl.dataset.active || "available");
  }

  function initTabBar() {
    const navigableTabs = new Set(["game", "raffle", "prizes", "profile"]);

    document.querySelectorAll(".tab-bar .tab[data-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabId = tab.dataset.tab;
        if (!navigableTabs.has(tabId)) return;
        if (isOnboardingTaskHintActive() && tabId !== "raffle") return;
        if (isOnboardingEnergyHintBlocking()) return;
        if (tabId === "raffle" && raffleTabEl?.hidden) return;

        if (tabId === "raffle") {
          hideOnboardingTaskHint();
        }

        activateTab(tabId);
        showAppScreen(tabId);

        if (tabId === "game") {
          updateLayout();
        }
      });
    });
  }

  function layoutMiniGrid() {
    const app = document.querySelector(".app");
    const gridArea = document.querySelector(".grid-area");
    const inner = document.querySelector(".main__inner");
    if (!gridArea) return;

    const sideMargin =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--side-margin")) ||
      16;
    const inResult = Boolean(app?.classList.contains("scenario-normal-word"));

    let availW = 0;
    let availH = 0;

    if (inResult && gridArea.clientWidth > 0 && gridArea.clientHeight > 0) {
      availW = gridArea.clientWidth;
      availH = gridArea.clientHeight;
    } else if (inner && winPanelEl && !winPanelEl.hidden) {
      availW = inner.clientWidth - sideMargin * 2;
      availH =
        inner.clientHeight - winPanelEl.offsetHeight - MINI_GRID_MARGIN_TOP_PX;
    }

    if (availW <= 0 || availH <= 0) return;

    let cellH = (availH - (ROWS - 1) * MINI_GRID_GAP_PX) / ROWS;
    let cellW = (cellH * MINI_CELL_RATIO_W) / MINI_CELL_RATIO_H;
    const totalW = cellW * COLS + MINI_GRID_GAP_PX * (COLS - 1);

    if (totalW > availW) {
      cellW = (availW - MINI_GRID_GAP_PX * (COLS - 1)) / COLS;
      cellH = (cellW * MINI_CELL_RATIO_H) / MINI_CELL_RATIO_W;
    }

    cellW = Math.max(1, Math.floor(cellW));
    cellH = Math.max(1, Math.floor(cellH));

    gridArea.style.setProperty("--mini-cell-width", `${cellW}px`);
    gridArea.style.setProperty("--mini-cell-height", `${cellH}px`);
  }

  function updateLayout(options = {}) {
    if (onboardingActive) {
      updateOnboardingLayout();
      return;
    }

    const app = document.querySelector(".app");
    if (!options.force && !options.gameMode && app?.classList.contains("scenario-normal-word")) {
      layoutMiniGrid();
      return;
    }

    const gridArea = document.querySelector("#game-main .grid-area") ?? document.querySelector(".grid-area");
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

  function preventMobileZoomGestures() {
    if (!frameEl) return;

    let lastTouchEnd = 0;

    frameEl.addEventListener(
      "touchend",
      (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      { passive: false }
    );

    frameEl.addEventListener(
      "gesturestart",
      (event) => {
        event.preventDefault();
      },
      { passive: false }
    );

    frameEl.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  }

  function handleViewportChange() {
    syncFrameViewportHeight();
    updateLayout();
    syncActivePrizePosition();
    layoutResultSheetGrid();
    layoutOnboardingTaskTooltip();
    layoutOnboardingEnergyTooltip();
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

  function getProgressBadgeFlySource(slot) {
    const progressEl = getActiveWinProgress();
    if (!progressEl) return null;

    const cols = progressEl.querySelectorAll(".win-progress__col:not(.win-progress__col--prize)");
    return cols[slot]?.querySelector(".win-progress__badge") ?? null;
  }

  function triggerWinProgressCoinReward(sourceEl) {
    if (!sourceEl) return;
    if (
      document
        .querySelector(".app")
        ?.classList.contains("scenario-onboarding-result")
    ) {
      return;
    }

    void runCoinsToBadgeAnimation(sourceEl).firstArrival.then(() => {
      const start = coinBalance;
      const end = start + WORD_GUESS_COIN_REWARD;
      void animateCoinBadgeValue(start, end).then(() => {
        coinBalance = end;
        syncCoinBadgeValue();
        updateRaffleParticipateButtonsState();
      });
    });
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
      triggerWinProgressCoinReward(getProgressBadgeFlySource(slot));
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
    return document.querySelector('.tab[data-tab="prizes"] .tab__icon-svg');
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

      progressAnimTimers.push(window.setTimeout(finish, 460));
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

          waitTransition(anchorFillEl, "transform").then(() => {
            triggerWinProgressCoinReward(getPrizeAnchor());
            runAfterAnchorFilled();
          });
        });
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(runPrizeLine);
    });
  }

  function raffleCardMarkup(cardIndex) {
    const card = RAFFLE_CARDS[cardIndex];
    if (!card) return "";

    const baseMarkup =
      '<img class="raffle-event-card__base" src="' +
      RAFFLE_CARD_SRC +
      '" width="270" height="388" alt="" draggable="false" />';

    const frontFaceMarkup =
      '<div class="raffle-event-card__face raffle-event-card__face--front">' +
      baseMarkup +
      '<div class="raffle-event-card__content">' +
      '<span class="raffle-event-card__badge">' +
      card.badge +
      "</span>" +
      '<h3 class="raffle-event-card__title">' +
      card.title +
      "</h3>" +
      '<p class="raffle-event-card__subtitle">' +
      card.subtitle +
      "</p>" +
      '<button class="raffle-event-card__btn is-insufficient" type="button" disabled data-participate-cost="' +
      card.buttonCost +
      '">' +
      '<span class="raffle-event-card__btn-text">Участвовать за ' +
      card.buttonCost +
      "</span>" +
      '<img class="raffle-event-card__btn-icon" src="' +
      RAFFLE_TOKEN_INACTIVE_SRC +
      '" data-state-src="' +
      RAFFLE_TOKEN_INACTIVE_SRC +
      '" width="24" height="24" alt="" draggable="false" />' +
      "</button></div>" +
      '<img class="raffle-event-card__visual" src="' +
      card.visualSrc +
      '" width="286" height="222" alt="" draggable="false" />' +
      "</div>";

    const backFaceMarkup =
      '<div class="raffle-event-card__face raffle-event-card__face--back">' +
      baseMarkup +
      '<img class="raffle-event-card__turnover" src="' +
      RAFFLE_TURNOVER_SRC +
      '" width="270" height="388" alt="" draggable="false" />' +
      '<img class="raffle-event-card__turnover-entry" src="' +
      RAFFLE_TURNOVER_ENTRY_SRC +
      '" width="270" height="388" alt="" draggable="false" />' +
      '<div class="raffle-event-card__back-content">' +
      '<h3 class="raffle-event-card__back-title">' +
      card.backTitle +
      "</h3>" +
      '<p class="raffle-event-card__back-subtitle">' +
      card.backSubtitle +
      "</p></div></div>";

    return (
      '<article class="raffle-event-card" data-card-index="' +
      cardIndex +
      '">' +
      '<div class="raffle-event-card__flip">' +
      frontFaceMarkup +
      backFaceMarkup +
      "</div></article>"
    );
  }

  function getRaffleWrapProgress(wrap, carousel) {
    const carouselRect = carousel.getBoundingClientRect();
    const centerX = carouselRect.left + carouselRect.width / 2;
    const cardRect = wrap.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    return Math.min(1, Math.abs(cardCenterX - centerX) / RAFFLE_SLIDE_STEP);
  }

  function isRaffleButtonSafeZone(event, card) {
    const btn = card.querySelector(".raffle-event-card__btn");
    if (!btn) return false;

    const rect = btn.getBoundingClientRect();
    const safe = 16;
    const point = event.changedTouches?.[0] ?? event;
    const x = point.clientX;
    const y = point.clientY;

    if (x == null || y == null) return false;

    return (
      x >= rect.left - safe &&
      x <= rect.right + safe &&
      y >= rect.top - safe &&
      y <= rect.bottom + safe
    );
  }

  const raffleFlipMidTimers = new WeakMap();

  function clearRaffleFlipMid(flip) {
    delete flip.dataset.flipMid;
    const midTimer = raffleFlipMidTimers.get(flip);
    if (midTimer != null) {
      window.clearTimeout(midTimer);
      raffleFlipMidTimers.delete(flip);
    }
  }

  function armRaffleFlipMid(flip, durationMs, toBack) {
    clearRaffleFlipMid(flip);
    const half = Math.round(durationMs / 2);

    if (toBack) {
      const midTimer = window.setTimeout(() => {
        flip.dataset.flipMid = "true";
        raffleFlipMidTimers.delete(flip);
      }, half);
      raffleFlipMidTimers.set(flip, midTimer);
      return;
    }

    flip.dataset.flipMid = "true";
    const midTimer = window.setTimeout(() => {
      delete flip.dataset.flipMid;
      raffleFlipMidTimers.delete(flip);
    }, half);
    raffleFlipMidTimers.set(flip, midTimer);
  }

  function resetRaffleFlip(flip) {
    flip.style.transition = "none";
    flip.classList.remove("is-flipped");
    flip.style.transform = "";
    delete flip.dataset.rotation;
    clearRaffleFlipMid(flip);
    delete flip.dataset.flipAnimating;
    void flip.offsetWidth;
    flip.style.transition = "";
  }

  function animateRaffleCardToFront(flip) {
    if (!flip.classList.contains("is-flipped")) return;
    if (flip.dataset.flipAnimating === "true") return;
    toggleRaffleCardFlip(flip);
  }

  function unflipRaffleCardsOnScroll(carousel, wraps) {
    wraps.forEach((wrap) => {
      const flip = wrap.querySelector(".raffle-event-card__flip");
      if (!flip?.classList.contains("is-flipped")) return;
      if (getRaffleWrapProgress(wrap, carousel) <= 0.08) return;
      animateRaffleCardToFront(flip);
    });
  }

  function waitRaffleDelay(durationMs) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, durationMs);
    });
  }

  function buildOnboardingGrid() {
    if (!onboardingGridEl || onboardingGridEl.children.length > 0) return;

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

      onboardingGridEl.appendChild(rowEl);
    }
  }

  function buildOnboardingKeyboard() {
    if (!onboardingKbEl || onboardingKbEl.children.length > 0) return;

    KB_ROWS.forEach((row, index) => {
      const rowEl = document.createElement("div");
      rowEl.className = "kb-row" + (index === 1 ? " kb-row--middle" : "");

      if (index === 2) {
        rowEl.appendChild(createOnboardingActionKey("enter", "✓"));
      }

      for (const ch of row) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "key";
        btn.textContent = ch;
        btn.dataset.key = ch;
        btn.addEventListener("click", () => onboardingOnKey(ch));
        rowEl.appendChild(btn);
      }

      if (index === 2) {
        rowEl.appendChild(createOnboardingActionKey("backspace", "⌫"));
      }

      onboardingKbEl.appendChild(rowEl);
    });
  }

  function createOnboardingActionKey(type, dataKey) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `key key--action key--${type} is-disabled`;
    btn.dataset.key = dataKey;
    btn.innerHTML = `<img src="${ACTION_ICONS[type]}" alt="" width="24" height="24" />`;
    btn.addEventListener("click", () => onboardingOnKey(dataKey));
    return btn;
  }

  function getOnboardingCell(row, col) {
    return (
      onboardingGridEl?.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      ) ?? null
    );
  }

  function getOnboardingRowEl(row) {
    return (
      onboardingGridEl?.querySelector(`.grid-row[data-row="${row}"]`) ?? null
    );
  }

  function evaluateOnboardingGuess(guess) {
    const answerArr = ONBOARDING_ANSWER.split("");
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

  function updateOnboardingKeyboardKey(letter, state) {
    const key = onboardingKbEl?.querySelector(`[data-key="${letter}"]`);
    if (!key || key.classList.contains("key--action")) return;

    const rank = { absent: 0, present: 1, correct: 2 };
    const current = key.classList.contains("correct")
      ? "correct"
      : key.classList.contains("present")
        ? "present"
        : key.classList.contains("absent")
          ? "absent"
          : null;

    if (!current || rank[state] > rank[current]) {
      key.classList.remove("absent", "present", "correct");
      key.classList.add(state);
    }
  }

  function updateOnboardingActionKeys() {
    const enterKey = onboardingKbEl?.querySelector(".key--enter");
    const backspaceKey = onboardingKbEl?.querySelector(".key--backspace");
    const locked =
      onboardingDone ||
      onboardingAnimating ||
      onboardingClosing ||
      onboardingSpotlightActive;
    const rowFull = !locked && onboardingCurCol >= COLS;
    const hasLetters = !locked && onboardingCurCol > 0;

    enterKey?.classList.toggle("is-disabled", !rowFull);
    enterKey?.classList.toggle("is-enabled", rowFull);
    backspaceKey?.classList.toggle("is-disabled", !hasLetters);
    backspaceKey?.classList.toggle("is-enabled", hasLetters);
  }

  function shakeOnboardingRow(row) {
    const rowEl = getOnboardingRowEl(row);
    if (!rowEl) return;
    rowEl.classList.remove("shake");
    void rowEl.offsetWidth;
    rowEl.classList.add("shake");
    rowEl.addEventListener(
      "animationend",
      () => rowEl.classList.remove("shake"),
      { once: true }
    );
  }

  function showOnboardingRowError(row) {
    for (let c = 0; c < COLS; c++) {
      getOnboardingCell(row, c)?.classList.add("error");
    }
  }

  function clearOnboardingRowError(row) {
    for (let c = 0; c < COLS; c++) {
      getOnboardingCell(row, c)?.classList.remove("error");
    }
  }

  async function setOnboardingPlaqueText(text) {
    if (!onboardingDialogTextEl) return;
    if (
      onboardingDialogTextEl.textContent === text &&
      onboardingDialogTextEl.style.opacity !== "0"
    ) {
      return;
    }

    onboardingDialogTextEl.style.opacity = "0";
    await waitRaffleDelay(ONBOARDING_PLAQUE_FADE_MS);
    onboardingDialogTextEl.textContent = text;
    fitOnboardingPlaqueText();
    void onboardingDialogTextEl.offsetWidth;
    onboardingDialogTextEl.style.opacity = "1";
    await waitRaffleDelay(ONBOARDING_PLAQUE_FADE_MS);
  }

  function fitOnboardingPlaqueText() {
    if (!onboardingDialogTextEl) return;

    const plaque = onboardingDialogTextEl.closest(".onboarding-dialog__plaque");
    if (!plaque) return;

    const compact = window.matchMedia("(max-width: 359px)").matches;
    const baseSize = compact ? 13 : 15;
    const baseLine = compact ? 16 : 20;

    onboardingDialogTextEl.style.fontSize = `${baseSize}px`;
    onboardingDialogTextEl.style.lineHeight = `${baseLine}px`;

    void onboardingDialogTextEl.offsetHeight;

    const plaqueStyle = getComputedStyle(plaque);
    const padY =
      parseFloat(plaqueStyle.paddingTop) + parseFloat(plaqueStyle.paddingBottom);
    const maxHeight = plaque.clientHeight - padY;
    const overflowsHeight = onboardingDialogTextEl.scrollHeight > maxHeight + 0.5;
    const overflowsWidth =
      onboardingDialogTextEl.scrollWidth > onboardingDialogTextEl.clientWidth + 0.5;

    if (overflowsHeight || overflowsWidth) {
      onboardingDialogTextEl.style.fontSize = `${baseSize - 1}px`;
    }
  }

  function clearOnboardingSpotlightTargets() {
    onboardingGridEl
      ?.querySelectorAll(".cell.is-spotlight-target")
      .forEach((cell) => cell.classList.remove("is-spotlight-target"));
  }

  function clearOnboardingSpotlightTimers() {
    if (onboardingSpotlightTimer) {
      window.clearTimeout(onboardingSpotlightTimer);
      onboardingSpotlightTimer = null;
    }
    if (onboardingSpotlightArmed) {
      onboardingEl?.removeEventListener(
        "pointerdown",
        handleOnboardingSpotlightDismiss,
        true
      );
      document.removeEventListener(
        "keydown",
        handleOnboardingSpotlightDismiss,
        true
      );
      onboardingSpotlightArmed = false;
    }
  }

  function handleOnboardingSpotlightDismiss(event) {
    if (!onboardingSpotlightArmed) return;
    if (
      event?.type === "keydown" &&
      (event.ctrlKey || event.metaKey || event.altKey)
    ) {
      return;
    }
    void hideOnboardingCellSpotlight({
      restorePlaqueText: onboardingSpotlightBaseText,
    });
  }

  function resolveOnboardingSpotlight() {
    if (!onboardingSpotlightResolve) return;
    const resolve = onboardingSpotlightResolve;
    onboardingSpotlightResolve = null;
    resolve();
  }

  async function hideOnboardingCellSpotlight(options = {}) {
    const { restorePlaqueText = null } = options;
    clearOnboardingSpotlightTimers();

    if (!onboardingSpotlightActive) {
      resolveOnboardingSpotlight();
      return;
    }

    const plaqueText = restorePlaqueText ?? onboardingSpotlightBaseText;
    onboardingSpotlightBaseText = null;

    onboardingEl?.classList.remove("is-spotlight");
    clearOnboardingSpotlightTargets();
    onboardingSpotlightActive = false;
    updateOnboardingActionKeys();

    if (plaqueText != null) {
      await setOnboardingPlaqueText(plaqueText);
    }

    resolveOnboardingSpotlight();
  }

  async function showOnboardingCellSpotlight({
    text,
    row,
    cols,
    basePlaqueText,
  }) {
    if (!onboardingEl) return;

    await hideOnboardingTooltip();
    if (onboardingSpotlightActive) {
      await hideOnboardingCellSpotlight();
    }

    onboardingSpotlightBaseText = basePlaqueText ?? null;

    const targetCols = Array.isArray(cols) ? cols : [];
    targetCols.forEach((col) => {
      getOnboardingCell(row, col)?.classList.add("is-spotlight-target");
    });

    onboardingSpotlightActive = true;
    updateOnboardingActionKeys();
    onboardingEl.classList.add("is-spotlight");
    await setOnboardingPlaqueText(text);

    return new Promise((resolve) => {
      onboardingSpotlightResolve = resolve;
      onboardingSpotlightTimer = window.setTimeout(() => {
        void hideOnboardingCellSpotlight({
          restorePlaqueText: onboardingSpotlightBaseText,
        });
      }, ONBOARDING_SPOTLIGHT_MS);

      window.setTimeout(() => {
        if (!onboardingSpotlightActive) return;
        onboardingSpotlightArmed = true;
        onboardingEl?.addEventListener(
          "pointerdown",
          handleOnboardingSpotlightDismiss,
          true
        );
        document.addEventListener(
          "keydown",
          handleOnboardingSpotlightDismiss,
          true
        );
      }, 40);
    });
  }

  function clearOnboardingTooltipTimers() {
    if (onboardingTooltipTimer) {
      window.clearTimeout(onboardingTooltipTimer);
      onboardingTooltipTimer = null;
    }
    if (onboardingTooltipArmed) {
      onboardingEl?.removeEventListener(
        "pointerdown",
        handleOnboardingTooltipDismiss,
        true
      );
      document.removeEventListener(
        "keydown",
        handleOnboardingTooltipDismiss,
        true
      );
      onboardingTooltipArmed = false;
    }
  }

  function handleOnboardingTooltipDismiss(event) {
    if (!onboardingTooltipArmed) return;
    if (event?.type === "keydown" && (event.ctrlKey || event.metaKey || event.altKey)) {
      return;
    }
    void hideOnboardingTooltip();
  }

  function resolveOnboardingTooltip() {
    if (!onboardingTooltipResolve) return;
    const resolve = onboardingTooltipResolve;
    onboardingTooltipResolve = null;
    resolve();
  }

  async function hideOnboardingTooltip() {
    clearOnboardingTooltipTimers();
    if (!onboardingTooltipEl || onboardingTooltipEl.hidden) {
      resolveOnboardingTooltip();
      return;
    }

    onboardingTooltipEl.classList.remove("is-visible");
    onboardingTooltipEl.classList.add("is-hiding");
    await waitRaffleDelay(ONBOARDING_TOOLTIP_OUT_MS);
    onboardingTooltipEl.classList.remove("is-hiding", "is-anchored");
    onboardingTooltipEl.hidden = true;
    onboardingTooltipEl.setAttribute("aria-hidden", "true");
    onboardingTooltipEl.style.left = "";
    onboardingTooltipEl.style.top = "";
    onboardingTooltipEl.style.width = "";
    if (onboardingTooltipTailEl) {
      onboardingTooltipTailEl.style.left = "";
      onboardingTooltipTailEl.style.top = "";
    }
    if (onboardingTooltipBodyEl) {
      onboardingTooltipBodyEl.style.left = "";
      onboardingTooltipBodyEl.style.top = "";
    }
    resolveOnboardingTooltip();
  }

  function getOnboardingFrameRect() {
    return onboardingEl?.getBoundingClientRect() ?? null;
  }

  function getOnboardingTooltipOriginRect() {
    const origin = onboardingTooltipEl?.offsetParent;
    if (origin) return origin.getBoundingClientRect();
    return (
      onboardingEl?.querySelector(".onboarding__body")?.getBoundingClientRect() ??
      getOnboardingFrameRect()
    );
  }

  function clampTooltipBodyLeft(idealLeft, bodyWidth, frameWidth) {
    const minLeft = ONBOARDING_TOOLTIP_EDGE_PX;
    const maxLeft = Math.max(
      minLeft,
      frameWidth - ONBOARDING_TOOLTIP_EDGE_PX - bodyWidth
    );
    return Math.min(Math.max(idealLeft, minLeft), maxLeft);
  }

  function fitTooltipBodyToTail(anchorX, bodyWidth, frameWidth) {
    let bodyLeft = anchorX - bodyWidth / 2;
    bodyLeft = clampTooltipBodyLeft(bodyLeft, bodyWidth, frameWidth);

    if (anchorX < bodyLeft) {
      bodyLeft = anchorX;
    } else if (anchorX > bodyLeft + bodyWidth) {
      bodyLeft = anchorX - bodyWidth;
    }

    return bodyLeft;
  }

  function getOnboardingRowCellsBottom(row) {
    const rowEl = getOnboardingRowEl(row);
    if (!rowEl) return 0;
    const cells = rowEl.querySelectorAll(".cell");
    let bottom = 0;
    cells.forEach((cell) => {
      bottom = Math.max(bottom, cell.getBoundingClientRect().bottom);
    });
    return bottom;
  }

  async function showOnboardingTooltip({ text, row, mode, anchorX }) {
    if (!onboardingEl || !onboardingTooltipEl || !onboardingTooltipTextEl) {
      return;
    }

    await hideOnboardingTooltip();

    const rowEl = getOnboardingRowEl(row);
    if (!rowEl) return;

    onboardingTooltipTextEl.textContent = text;
    onboardingTooltipEl.hidden = false;
    onboardingTooltipEl.setAttribute("aria-hidden", "false");
    onboardingTooltipEl.classList.remove("is-hiding", "is-visible", "is-anchored");

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const originRect = getOnboardingTooltipOriginRect();
    if (!originRect) return;

    // 8px от нижнего края ячеек строки до кончика хвостика (верх тултипа)
    const rowCellsBottom = getOnboardingRowCellsBottom(row);
    const bodyWidth = onboardingTooltipBodyEl?.offsetWidth ?? onboardingTooltipEl.offsetWidth;
    const top = rowCellsBottom - originRect.top + ONBOARDING_TOOLTIP_GAP_PX;
    const rowRect = rowEl.getBoundingClientRect();
    const rowCenter = rowRect.left + rowRect.width / 2 - originRect.left;

    if (mode === "unit-center") {
      const tipWidth = onboardingTooltipEl.offsetWidth;
      const left = clampTooltipBodyLeft(
        rowCenter - tipWidth / 2,
        tipWidth,
        originRect.width
      );
      onboardingTooltipEl.style.left = `${left}px`;
      onboardingTooltipEl.style.top = `${top}px`;
    } else {
      const localAnchorX = (anchorX ?? 0) - originRect.left;
      let bodyLeft;

      if (mode === "edge-left") {
        bodyLeft = ONBOARDING_TOOLTIP_EDGE_PX;
        if (localAnchorX > bodyLeft + bodyWidth) {
          bodyLeft = fitTooltipBodyToTail(
            localAnchorX,
            bodyWidth,
            originRect.width
          );
        }
      } else {
        bodyLeft = fitTooltipBodyToTail(
          localAnchorX,
          bodyWidth,
          originRect.width
        );
      }

      onboardingTooltipEl.classList.add("is-anchored");
      onboardingTooltipEl.style.left = "0";
      onboardingTooltipEl.style.top = `${top}px`;
      onboardingTooltipEl.style.width = "100%";
      if (onboardingTooltipTailEl) {
        onboardingTooltipTailEl.style.left = `${localAnchorX - 12}px`;
        onboardingTooltipTailEl.style.top = "0";
      }
      if (onboardingTooltipBodyEl) {
        onboardingTooltipBodyEl.style.left = `${bodyLeft}px`;
        onboardingTooltipBodyEl.style.top = "8px";
      }
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
    onboardingTooltipEl.classList.add("is-visible");

    return new Promise((resolve) => {
      onboardingTooltipResolve = resolve;
      onboardingTooltipTimer = window.setTimeout(() => {
        void hideOnboardingTooltip();
      }, ONBOARDING_TOOLTIP_MS);

      window.setTimeout(() => {
        if (!onboardingTooltipEl || onboardingTooltipEl.hidden) return;
        onboardingTooltipArmed = true;
        onboardingEl?.addEventListener(
          "pointerdown",
          handleOnboardingTooltipDismiss,
          true
        );
        document.addEventListener(
          "keydown",
          handleOnboardingTooltipDismiss,
          true
        );
      }, 40);
    });
  }

  function resetOnboardingIntroModal() {
    onboardingIntroStep = 0;
    onboardingIntroAnimating = false;
    onboardingIntroOpen = false;
    if (!onboardingIntroEl) return;

    onboardingIntroEl.classList.remove("is-open", "is-closing", "is-step-2");
    onboardingIntroEl.hidden = true;
    onboardingIntroEl.setAttribute("aria-hidden", "true");
    if (onboardingIntroBackEl) onboardingIntroBackEl.hidden = true;
    onboardingIntroActionLabels.forEach((label) => {
      label.classList.toggle("is-active", label.dataset.step === "0");
    });
  }

  function applyOnboardingIntroStep(step, { animate = true } = {}) {
    onboardingIntroStep = step;
    const isStep2 = step === 1;

    if (!animate && onboardingIntroEl) {
      onboardingIntroEl.classList.add("is-swap-instant");
    }

    onboardingIntroEl?.classList.toggle("is-step-2", isStep2);
    if (onboardingIntroBackEl) onboardingIntroBackEl.hidden = !isStep2;
    onboardingIntroActionLabels.forEach((label) => {
      label.classList.toggle(
        "is-active",
        label.dataset.step === String(step)
      );
    });

    if (!animate && onboardingIntroEl) {
      void onboardingIntroEl.offsetWidth;
      onboardingIntroEl.classList.remove("is-swap-instant");
    }
  }

  function openOnboardingIntroModal() {
    if (!onboardingIntroEl) return;
    applyOnboardingIntroStep(0, { animate: false });
    onboardingIntroEl.hidden = false;
    onboardingIntroEl.setAttribute("aria-hidden", "false");
    onboardingIntroEl.classList.remove("is-closing");
    onboardingIntroEl.classList.add("is-open");
    onboardingIntroOpen = true;
    onboardingIntroAnimating = false;
  }

  async function closeOnboardingIntroModal() {
    if (!onboardingIntroEl || !onboardingIntroOpen) {
      resetOnboardingIntroModal();
      return;
    }

    onboardingIntroAnimating = true;
    onboardingIntroEl.classList.add("is-closing");
    await waitRaffleDelay(ONBOARDING_INTRO_CLOSE_MS);
    resetOnboardingIntroModal();
  }

  async function goOnboardingIntroStep(nextStep) {
    if (
      !onboardingIntroOpen ||
      onboardingIntroAnimating ||
      onboardingClosing ||
      nextStep === onboardingIntroStep
    ) {
      return;
    }

    onboardingIntroAnimating = true;
    applyOnboardingIntroStep(nextStep, { animate: true });
    await waitRaffleDelay(ONBOARDING_INTRO_MS);
    onboardingIntroAnimating = false;
  }

  async function handleOnboardingIntroAction() {
    if (!onboardingIntroOpen || onboardingIntroAnimating || onboardingClosing) {
      return;
    }

    if (onboardingIntroStep === 0) {
      await goOnboardingIntroStep(1);
      return;
    }

    await closeOnboardingIntroModal();
  }

  function resetOnboardingPlayfield() {
    void hideOnboardingTooltip();
    clearOnboardingSpotlightTimers();
    onboardingEl?.classList.remove(
      "is-spotlight",
      "is-help-reveal",
      "is-dialog-exiting",
      "is-chrome-result",
      "is-result-handoff",
      "is-tab-handoff",
      "is-tab-handoff-in"
    );
    onboardingGridEl
      ?.querySelectorAll(".grid-row.is-help-focus")
      .forEach((rowEl) => rowEl.classList.remove("is-help-focus"));
    clearOnboardingSpotlightTargets();
    onboardingSpotlightActive = false;
    onboardingSpotlightBaseText = null;
    resolveOnboardingSpotlight();
    resetOnboardingIntroModal();
    onboardingCurRow = 0;
    onboardingCurCol = 0;
    onboardingAnimating = false;
    onboardingDone = false;
    onboardingStep = "sahar";
    onboardingWrongCount = 0;
    onboardingAbsentTipShown = false;
    onboardingSubmitted = [];
    onboardingBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
    onboardingSpotlightBaseText = null;

    if (onboardingDialogTextEl) {
      onboardingDialogTextEl.style.opacity = "1";
      onboardingDialogTextEl.textContent = "Для начала введите слово «САХАР»";
      fitOnboardingPlaqueText();
    }

    onboardingGridEl?.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove(
        "filled",
        "error",
        "correct",
        "present",
        "absent"
      );
      const front = cell.querySelector(".cell-front");
      const back = cell.querySelector(".cell-back");
      if (front) front.textContent = "";
      if (back) {
        back.textContent = "";
        back.className = "cell-back";
      }
      cell.querySelector(".cell-inner")?.classList.remove("flipped");
    });

    onboardingKbEl?.querySelectorAll(".key").forEach((key) => {
      key.classList.remove("correct", "present", "absent");
    });

    updateOnboardingActionKeys();
  }

  function revealOnboardingRow(row) {
    const guess = onboardingBoard[row].join("");
    const status = evaluateOnboardingGuess(guess);
    onboardingAnimating = true;
    updateOnboardingActionKeys();

    return new Promise((resolve) => {
      let completed = 0;

      status.forEach((state, col) => {
        const cell = getOnboardingCell(row, col);
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
                updateOnboardingKeyboardKey(guess[c], status[c]);
              }
              window.setTimeout(() => {
                onboardingAnimating = false;
                updateOnboardingActionKeys();
                resolve({ won: guess === ONBOARDING_ANSWER, status });
              }, 120);
            }
          }, FLIP_DURATION_MS);
        }, col * FLIP_STAGGER_MS);
      });
    });
  }

  function revealOnboardingAnswerRow(row) {
    const answer = ONBOARDING_ANSWER;
    onboardingAnimating = true;
    updateOnboardingActionKeys();

    const flipWave = (onColStart) =>
      new Promise((resolve) => {
        let completed = 0;

        for (let col = 0; col < COLS; col++) {
          const cell = getOnboardingCell(row, col);
          if (!cell) {
            completed += 1;
            if (completed === COLS) resolve();
            continue;
          }

          window.setTimeout(() => {
            onColStart(col, cell);
            window.setTimeout(() => {
              completed += 1;
              if (completed === COLS) resolve();
            }, FLIP_DURATION_MS);
          }, col * FLIP_STAGGER_MS);
        }
      });

    return (async () => {
      // 1) Flip to empty face (unflip onto cleared front).
      await flipWave((col, cell) => {
        const front = cell.querySelector(".cell-front");
        const inner = cell.querySelector(".cell-inner");
        if (front) front.textContent = "";
        cell.classList.remove("filled", "error");
        onboardingBoard[row][col] = "";
        inner?.classList.remove("flipped");
      });

      // Clear old backs while empty front is showing.
      for (let col = 0; col < COLS; col++) {
        const back = getOnboardingCell(row, col)?.querySelector(".cell-back");
        if (back) {
          back.textContent = "";
          back.className = "cell-back";
        }
      }

      // 2) Flip again onto correct answer (letters only on the back).
      await flipWave((col, cell) => {
        const front = cell.querySelector(".cell-front");
        const back = cell.querySelector(".cell-back");
        const inner = cell.querySelector(".cell-inner");
        onboardingBoard[row][col] = answer[col];
        if (front) front.textContent = "";
        if (back) {
          back.textContent = answer[col];
          back.className = "cell-back correct";
        }
        cell.classList.remove("filled", "error");
        inner?.classList.add("flipped");
      });

      for (let c = 0; c < COLS; c++) {
        updateOnboardingKeyboardKey(answer[c], "correct");
      }
      await waitRaffleDelay(120);
      onboardingAnimating = false;
      updateOnboardingActionKeys();
    })();
  }

  async function playOnboardingLastRowHelp(row) {
    await hideOnboardingTooltip();
    if (onboardingSpotlightActive) {
      await hideOnboardingCellSpotlight({ restorePlaqueText: null });
    }

    const rowEl = getOnboardingRowEl(row);
    onboardingGridEl
      ?.querySelectorAll(".grid-row.is-help-focus")
      .forEach((el) => el.classList.remove("is-help-focus"));
    rowEl?.classList.add("is-help-focus");

    const plaquePromise = setOnboardingPlaqueText(
      "Поможем вам, но только в этот раз"
    );
    onboardingEl?.classList.add("is-help-reveal");
    await plaquePromise;

    await waitRaffleDelay(ONBOARDING_HELP_PAUSE_MS);
    await revealOnboardingAnswerRow(row);
    await waitRaffleDelay(ONBOARDING_HELP_PAUSE_MS);

    onboardingEl?.classList.remove("is-help-reveal");
    await waitRaffleDelay(ONBOARDING_PLAQUE_FADE_MS);
    rowEl?.classList.remove("is-help-focus");
  }

  function playOnboardingWinScaleAnimation(row) {
    return new Promise((resolve) => {
      onboardingAnimating = true;
      updateOnboardingActionKeys();

      for (let col = 0; col < COLS; col++) {
        const cell = getOnboardingCell(row, col);
        if (!cell) continue;
        cell.style.setProperty("--win-col", String(col));
        cell.classList.add("win-scale");
      }

      const totalMs = (COLS - 1) * 100 + 1000;
      window.setTimeout(() => {
        onboardingGridEl
          ?.querySelectorAll(".cell.win-scale")
          .forEach((cell) => {
            cell.classList.remove("win-scale");
            cell.style.removeProperty("--win-col");
          });
        onboardingAnimating = false;
        updateOnboardingActionKeys();
        resolve();
      }, totalMs);
    });
  }

  function syncOnboardingBoardToGame() {
    board = onboardingBoard.map((row) => row.slice());
    submittedWords.length = 0;
    onboardingSubmitted.forEach((word) => submittedWords.push(word));
    curRow = Math.min(onboardingCurRow, ROWS - 1);
    curCol = 0;
    gameOver = true;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const src = getOnboardingCell(r, c);
        const dst = getCell(r, c);
        if (!src || !dst) continue;

        const srcFront = src.querySelector(".cell-front");
        const srcBack = src.querySelector(".cell-back");
        const srcInner = src.querySelector(".cell-inner");
        const dstFront = dst.querySelector(".cell-front");
        const dstBack = dst.querySelector(".cell-back");
        const dstInner = dst.querySelector(".cell-inner");

        dst.className = src.className;
        dst.classList.remove("win-scale", "is-spotlight-target", "error");
        if (dstFront) dstFront.textContent = srcFront?.textContent ?? "";
        if (dstBack) {
          dstBack.textContent = srcBack?.textContent ?? "";
          dstBack.className = srcBack?.className || "cell-back";
        }
        dstInner?.classList.toggle(
          "flipped",
          Boolean(srcInner?.classList.contains("flipped"))
        );
      }
    }

    kbEl?.querySelectorAll(".key").forEach((key) => {
      if (key.classList.contains("key--action")) return;
      key.classList.remove("absent", "present", "correct");
      const ch = key.dataset.key;
      const src = onboardingKbEl?.querySelector(
        `.key[data-key="${ch}"]:not(.key--action)`
      );
      if (!src) return;
      ["absent", "present", "correct"].forEach((state) => {
        if (src.classList.contains(state)) key.classList.add(state);
      });
    });
  }

  function prepareOnboardingResultContent() {
    const app = document.querySelector(".app");
    isWordNotGuessedActive = false;
    lastResultAttempts = 1;

    for (let i = 0; i < WIN_PROGRESS_WORDS.length; i += 1) {
      WIN_PROGRESS_WORDS[i] = null;
    }

    fifthWordPanelIndex = 0;
    resetProgressStageToDefault();
    clearProgressAnimTimers();

    const progressEl = document.getElementById("win-progress");
    if (progressEl) {
      progressEl.innerHTML = buildProgressHtml(ONBOARDING_PROGRESS_BADGES);
    }
    clearPrizeOverlay();
    mountPrizeForPanel(winProgressPanelEl, { hidden: false });
    renderWinProgress();
    resetProgressStickers();

    if (winWordEl) winWordEl.textContent = ONBOARDING_ANSWER;
    if (winMessageEl) winMessageEl.textContent = ONBOARDING_RESULT_MESSAGE;

    const yellowText = document.querySelector(".win-block--yellow__text");
    const yellowEnergy = document.querySelector(".win-block--yellow__energy");
    if (yellowText) yellowText.textContent = ONBOARDING_RESULT_YELLOW_TEXT;
    if (yellowEnergy) yellowEnergy.hidden = true;

    onboardingEl
      ?.querySelectorAll(".energy-badge__value")
      .forEach((el) => {
        el.textContent = "0";
      });
    document
      .querySelectorAll(".app > .header .energy-badge__value")
      .forEach((el) => {
        el.textContent = "0";
      });

    app?.classList.remove(
      "scenario-thematic-word",
      "scenario-word-not-guessed",
      "scenario-fifth-word"
    );
    app?.classList.add("scenario-onboarding-result");
    syncOnboardingTrainingTask();
  }

  function clearOnboardingResultChrome() {
    const app = document.querySelector(".app");
    app?.classList.remove(
      "scenario-onboarding-result",
      "is-onboarding-tab-slide",
      "is-onboarding-tab-ready",
      "is-onboarding-tab-in",
      "is-onboarding-play-again",
      "is-onboarding-energy-hint",
      "is-onboarding-energy-hint-out"
    );
    app?.style.removeProperty("--onboarding-result-slide");
    const dialog = onboardingEl?.querySelector(".onboarding-dialog");
    dialog?.style.removeProperty("height");
    onboardingEl?.classList.remove(
      "is-dialog-exiting",
      "is-result-handoff",
      "is-tab-handoff",
      "is-tab-handoff-in",
      "is-chrome-result"
    );
    const yellowText = document.querySelector(".win-block--yellow__text");
    const yellowEnergy = document.querySelector(".win-block--yellow__energy");
    if (yellowText) yellowText.textContent = DEFAULT_YELLOW_BUTTON_TEXT;
    if (yellowEnergy) yellowEnergy.hidden = false;
    document.querySelector(".tab-bar")?.classList.remove("is-entering", "is-visible");
  }

  function snapshotMainGameChrome() {
    mainGameChromeSnapshot = {
      coinBalance,
      badgeValues: Array.from(
        document.querySelectorAll(".app > .header .energy-badge__value")
      ).map((el) => el.textContent),
      winWord: winWordEl?.textContent ?? ANSWER,
      winMessage: winMessageEl?.innerHTML ?? "",
    };
  }

  function restoreMainGameChrome() {
    const snap = mainGameChromeSnapshot;
    mainGameChromeSnapshot = null;
    if (!snap) return;

    setCoinBalance(snap.coinBalance);
    document
      .querySelectorAll(".app > .header .energy-badge__value")
      .forEach((el, index) => {
        if (snap.badgeValues[index] != null) {
          el.textContent = snap.badgeValues[index];
        }
      });
    if (winWordEl) winWordEl.textContent = snap.winWord || ANSWER;
    if (winMessageEl) winMessageEl.innerHTML = snap.winMessage;
  }

  function isOnboardingSession() {
    if (onboardingActive) return true;
    return Boolean(
      document
        .querySelector(".app")
        ?.classList.contains("scenario-onboarding-result")
    );
  }

  async function finishOnboardingToResult(row) {
    if (!onboardingEl || onboardingClosing) return;

    onboardingDone = true;
    updateOnboardingActionKeys();

    await waitRaffleDelay(ONBOARDING_FLIP_TO_SCALE_MS);
    if (onboardingClosing) return;

    const app = document.querySelector(".app");
    const dialog = onboardingEl.querySelector(".onboarding-dialog");
    const tabBar = document.querySelector(".tab-bar");
    const gameGridArea = document.querySelector("#game-main .grid-area");

    syncOnboardingBoardToGame();
    prepareOnboardingResultContent();
    showAppScreen("game");
    activateTab("game");

    // Игра была opacity:0 — без этого выезд тапбара идёт в невидимом слое.
    app?.classList.remove("is-onboarding-leave", "is-onboarding-transition");
    app?.removeAttribute("aria-hidden");

    const cellW = onboardingGridAreaEl?.style.getPropertyValue("--cell-width");
    const cellH = onboardingGridAreaEl?.style.getPropertyValue("--cell-height");
    if (gameGridArea) {
      if (cellW) gameGridArea.style.setProperty("--cell-width", cellW);
      if (cellH) gameGridArea.style.setProperty("--cell-height", cellH);
    }

    app?.classList.add("is-onboarding-tab-slide");
    app?.classList.remove("is-onboarding-tab-ready", "is-onboarding-tab-in");
    onboardingEl.classList.add("is-result-handoff", "is-tab-handoff");
    onboardingEl.classList.remove("is-tab-handoff-in");
    if (dialog) dialog.style.height = `${dialog.offsetHeight}px`;

    void tabBar?.offsetHeight;
    void onboardingEl.offsetHeight;
    void dialog?.offsetHeight;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (onboardingClosing) return;

    app?.classList.add("is-onboarding-tab-ready");
    void tabBar?.offsetHeight;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const scalePromise = playOnboardingWinScaleAnimation(row);

    onboardingEl.classList.add("is-dialog-exiting", "is-tab-handoff-in");
    if (dialog) dialog.style.height = "0px";
    app?.classList.add("is-onboarding-tab-in");

    await Promise.all([
      scalePromise,
      waitRaffleDelay(ONBOARDING_TAB_BAR_MS),
    ]);
    if (onboardingClosing) return;
    if (dialog) dialog.style.removeProperty("height");

    onboardingEl.classList.remove(
      "is-open",
      "is-settled",
      "is-dialog-exiting",
      "is-chrome-result",
      "is-help-reveal",
      "is-result-handoff",
      "is-tab-handoff",
      "is-tab-handoff-in"
    );
    onboardingEl.hidden = true;
    onboardingEl.setAttribute("aria-hidden", "true");
    resetOnboardingIntroModal();

    app?.classList.remove(
      "is-onboarding-tab-slide",
      "is-onboarding-tab-ready",
      "is-onboarding-tab-in"
    );

    onboardingActive = false;
    if (startOnboardingBtnEl) startOnboardingBtnEl.disabled = false;

    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (onboardingClosing) return;

    await playNormalWordAnimation();
    if (onboardingClosing) return;
    playOnboardingResultConfetti();
    await playWinHeroAnimation(ONBOARDING_ANSWER);
    updateActionKeys();
    await waitRaffleDelay(ONBOARDING_NOTIFY_SHEET_DELAY_MS);
    if (onboardingClosing) return;
    openOnboardingNotifySheet();
  }

  async function onboardingSubmitRow() {
    if (
      !onboardingActive ||
      onboardingClosing ||
      onboardingDone ||
      onboardingAnimating ||
      onboardingCurCol < COLS
    ) {
      return;
    }

    const guess = onboardingBoard[onboardingCurRow].join("");
    const row = onboardingCurRow;

    if (onboardingStep === "sahar") {
      if (guess !== ONBOARDING_WORD_SAHAR) {
        onboardingWrongCount += 1;
        shakeOnboardingRow(row);
        const tipText =
          onboardingWrongCount === 1
            ? "Введите слово из подсказки"
            : onboardingWrongCount === 2
              ? "Проверяете, что будет дальше? 🤓"
              : "И снова не то слово 🤔";
        void showOnboardingTooltip({
          text: tipText,
          row,
          mode: "unit-center",
        });
        return;
      }

      await revealOnboardingRow(row);
      onboardingSubmitted.push(guess);
      onboardingStep = "sovet";
      onboardingWrongCount = 0;
      onboardingCurRow += 1;
      onboardingCurCol = 0;
      updateOnboardingActionKeys();
      await showOnboardingCellSpotlight({
        text: "Буква на своем месте",
        row,
        cols: [0],
        basePlaqueText: "Теперь попробуйте слово «СОВЕТ»",
      });
      return;
    }

    if (onboardingStep === "sovet") {
      if (guess !== ONBOARDING_WORD_SOVET) {
        onboardingWrongCount += 1;
        shakeOnboardingRow(row);
        const tipText =
          onboardingWrongCount === 1
            ? "Почти!\nНо мы загадали другое слово"
            : "А вам нравится\nисследовать границы 👀";
        void showOnboardingTooltip({
          text: tipText,
          row,
          mode: "unit-center",
        });
        return;
      }

      await revealOnboardingRow(row);
      onboardingSubmitted.push(guess);
      onboardingStep = "free";
      onboardingWrongCount = 0;
      onboardingCurRow += 1;
      onboardingCurCol = 0;
      updateOnboardingActionKeys();
      await showOnboardingCellSpotlight({
        text: "Эти буквы есть в слове, но стоят не здесь",
        row,
        cols: [1, 2],
        basePlaqueText: "Теперь попробуйте сами угадать слово",
      });
      return;
    }

    if (onboardingStep === "free") {
      if (onboardingSubmitted.includes(guess)) {
        shakeOnboardingRow(row);
        showOnboardingRowError(row);
        window.setTimeout(() => clearOnboardingRowError(row), 600);
        if (row >= 2) {
          await waitRaffleDelay(600);
          void showOnboardingTooltip({
            text: "Это слово уже было 🤔",
            row,
            mode: "unit-center",
          });
        }
        return;
      }

      onboardingSubmitted.push(guess);

      const { won, status } = await revealOnboardingRow(row);

      const attemptPlaqueText =
        row === 2
          ? "Что же это за слово?"
          : row === 4
            ? "Ну не могли же мы загадать «СЛОВО»"
            : null;

      if (won) {
        onboardingDone = true;
        updateOnboardingActionKeys();
        await setOnboardingPlaqueText("Правильно!");
        await finishOnboardingToResult(row);
        return;
      }

      if (row === ROWS - 1) {
        onboardingDone = true;
        updateOnboardingActionKeys();
        await playOnboardingLastRowHelp(row);
        await finishOnboardingToResult(row);
        return;
      }

      onboardingCurRow += 1;
      onboardingCurCol = 0;
      updateOnboardingActionKeys();

      let showedAbsentTip = false;
      if (row >= 2 && !onboardingAbsentTipShown) {
        const absentCols = status
          .map((state, col) => (state === "absent" ? col : -1))
          .filter((col) => col >= 0);

        if (absentCols.length > 0) {
          onboardingAbsentTipShown = true;
          showedAbsentTip = true;
          const basePlaqueText =
            attemptPlaqueText ||
            onboardingDialogTextEl?.textContent ||
            "Теперь попробуйте сами угадать слово";
          await showOnboardingCellSpotlight({
            text:
              absentCols.length === 1
                ? "Этой буквы нет в слове"
                : "Этих букв нет в слове",
            row,
            cols: absentCols,
            basePlaqueText,
          });
        }
      }

      if (attemptPlaqueText && !showedAbsentTip) {
        await setOnboardingPlaqueText(attemptPlaqueText);
      }
    }
  }

  function onboardingOnKey(ch) {
    if (
      !onboardingActive ||
      onboardingClosing ||
      onboardingIntroOpen ||
      onboardingDone ||
      onboardingAnimating ||
      onboardingSpotlightActive ||
      isOnboardingRulesSheetOpen() ||
      onboardingCurRow >= ROWS
    ) {
      return;
    }

    triggerHaptic(HAPTIC_KEY_MS);

    if (ch === "⌫") {
      if (onboardingCurCol > 0) {
        onboardingCurCol -= 1;
        onboardingBoard[onboardingCurRow][onboardingCurCol] = "";
        const cell = getOnboardingCell(onboardingCurRow, onboardingCurCol);
        const front = cell?.querySelector(".cell-front");
        if (front) front.textContent = "";
        cell?.classList.remove("filled", "error");
      }
      updateOnboardingActionKeys();
      return;
    }

    if (ch === "✓") {
      void onboardingSubmitRow();
      return;
    }

    if (onboardingCurCol < COLS && /^[А-ЯЁ]$/.test(ch)) {
      onboardingBoard[onboardingCurRow][onboardingCurCol] = ch;
      const cell = getOnboardingCell(onboardingCurRow, onboardingCurCol);
      const front = cell?.querySelector(".cell-front");
      if (front) front.textContent = ch;
      cell?.classList.add("filled");
      cell?.classList.remove("error");
      onboardingCurCol += 1;
      updateOnboardingActionKeys();
    }
  }

  function updateOnboardingLayout() {
    if (!onboardingGridAreaEl || !onboardingGridEl) return;

    const gap =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--grid-gap")) || 6;
    const gridTopMargin = 8;
    const gridKbMargin = 24;

    let availW = onboardingGridAreaEl.clientWidth;
    let availH = onboardingGridAreaEl.clientHeight;

    if ((availW <= 0 || availH <= 0) && onboardingEl && onboardingKbEl) {
      const styles = getComputedStyle(document.documentElement);
      const sideMargin = parseFloat(styles.getPropertyValue("--side-margin")) || 20;
      const playEl = onboardingEl.querySelector(".onboarding__play");

      if (playEl) {
        availW = playEl.clientWidth - sideMargin * 2;
        availH =
          playEl.clientHeight -
          onboardingKbEl.offsetHeight -
          gridTopMargin -
          gridKbMargin -
          parseFloat(getComputedStyle(onboardingKbEl).paddingBottom || "0");
      }
    }

    let cellW = (availW - (COLS - 1) * gap) / COLS;
    let cellH = (availH - (ROWS - 1) * gap) / ROWS;

    if (cellW > cellH * 1.2) cellW = cellH * 1.2;
    if (cellH > cellW * 1.1) cellH = cellW * 1.1;
    if (cellW > cellH * 1.2) cellW = cellH * 1.2;

    cellW = Math.floor(cellW);
    cellH = Math.floor(cellH);

    onboardingGridAreaEl.style.setProperty("--cell-width", `${cellW}px`);
    onboardingGridAreaEl.style.setProperty("--cell-height", `${cellH}px`);

    const row1 = onboardingKbEl?.querySelector(".kb-row");
    if (row1 && onboardingKbEl) {
      const keyW = (row1.clientWidth - 11 * 3) / 12;
      onboardingKbEl.style.setProperty("--kb-mid-pad", `${(keyW + 3) / 2}px`);
    }
  }

  async function startOnboarding() {
    if (onboardingActive || onboardingClosing || !onboardingEl) return;

    const app = document.querySelector(".app");
    if (!app) return;

    onboardingActive = true;
    if (startOnboardingBtnEl) startOnboardingBtnEl.disabled = true;
    snapshotMainGameChrome();

    app.classList.add("is-onboarding-transition", "is-onboarding-leave");
    await waitRaffleDelay(ONBOARDING_LEAVE_MS);

    app.setAttribute("aria-hidden", "true");
    resetOnboardingPlayfield();

    onboardingEl.hidden = false;
    onboardingEl.setAttribute("aria-hidden", "false");
    await new Promise((resolve) => requestAnimationFrame(resolve));
    onboardingEl.classList.add("is-open");
    openOnboardingIntroModal();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    updateOnboardingLayout();
    fitOnboardingPlaqueText();
    await waitRaffleDelay(ONBOARDING_LEAVE_MS);
    // iOS keeps a low-res bitmap after opacity fade — force a crisp re-composite.
    onboardingEl.classList.add("is-settled");
  }

  async function closeOnboarding() {
    if (onboardingClosing || !onboardingEl) return;
    if (!isOnboardingSession() && onboardingEl.hidden) return;

    const app = document.querySelector(".app");
    if (!app) return;

    onboardingClosing = true;
    hideOnboardingTaskHint();
    hideOnboardingEnergyHint({ animate: false });
    closeOnboardingNotifySheet({ animateClose: false });
    closeOnboardingRulesSheet({ animateClose: false });

    const leavingResult = app.classList.contains("scenario-onboarding-result");
    if (leavingResult) {
      stopConfetti();
      if (winPanelEl) winPanelEl.hidden = true;
      app.classList.remove(
        "is-animating-normal-word",
        "is-animating-win-hero",
        "keyboard-detached"
      );
      resetGameState();
    } else {
      clearOnboardingResultChrome();
    }

    await closeOnboardingIntroModal();
    await hideOnboardingTooltip();
    await hideOnboardingCellSpotlight();

    onboardingEl.classList.remove("is-settled", "is-open");
    if (!onboardingEl.hidden) {
      await waitRaffleDelay(ONBOARDING_LEAVE_MS);
    }

    resetOnboardingPlayfield();
    onboardingEl.hidden = true;
    onboardingEl.setAttribute("aria-hidden", "true");

    activateTab("profile");
    showAppScreen("profile");
    app.removeAttribute("aria-hidden");
    app.classList.remove("is-onboarding-leave");
    await waitRaffleDelay(ONBOARDING_LEAVE_MS);
    app.classList.remove("is-onboarding-transition");

    onboardingActive = false;
    onboardingClosing = false;
    onboardingDone = false;
    restoreMainGameChrome();
    resetOnboardingTrainingTask();
    if (startOnboardingBtnEl) startOnboardingBtnEl.disabled = false;
    updateLayout({ force: true });
  }

  function waitRaffleTransition(element, propertyName, durationMs) {
    return new Promise((resolve) => {
      let done = false;
      const finish = (event) => {
        if (done) return;
        if (event && (event.target !== element || event.propertyName !== propertyName)) {
          return;
        }
        done = true;
        element.removeEventListener("transitionend", finish);
        resolve();
      };

      element.addEventListener("transitionend", finish);
      window.setTimeout(finish, durationMs + 60);
    });
  }

  function setRaffleScrollLocked(locked) {
    const track = raffleCarouselRefs?.track;
    if (!track) return;
    track.classList.toggle("raffle-cards-track--locked", locked);
  }

  function setRafflePageScrollLocked(locked) {
    rafflePageEl?.classList.toggle("raffle-page--scroll-locked", locked);
  }

  function setRaffleEntryTurnoverBack(cardEl, visible) {
    const back = cardEl.querySelector(".raffle-event-card__face--back");
    if (!back) return;
    back.classList.toggle("is-entry-turnover", visible);
  }

  function setRaffleTurnoverBack(cardEl, visible) {
    const back = cardEl.querySelector(".raffle-event-card__face--back");
    if (!back) return;
    back.classList.toggle("is-turnover", visible);
  }

  function setRaffleTurnoverBackToAll(cardIndex, visible) {
    document
      .querySelectorAll('.raffle-event-card[data-card-index="' + cardIndex + '"]')
      .forEach((cardEl) => {
        setRaffleTurnoverBack(cardEl, visible);
      });
  }

  function clearRaffleIntroSeen() {
    try {
      localStorage.removeItem(RAFFLE_INTRO_SEEN_KEY);
    } catch {
      /* ignore */
    }
  }

  function restoreRaffleCardDefaultContent(cardEl, cardIndex) {
    const data = RAFFLE_CARDS[cardIndex];
    if (!data || !cardEl) return;

    const front = cardEl.querySelector(".raffle-event-card__face--front");
    const back = cardEl.querySelector(".raffle-event-card__face--back");
    const flip = cardEl.querySelector(".raffle-event-card__flip");

    if (front) {
      const base = front.querySelector(".raffle-event-card__base");
      const subtitle = front.querySelector(".raffle-event-card__subtitle");
      const btn = front.querySelector(".raffle-event-card__btn");

      if (base) base.src = RAFFLE_CARD_SRC;
      if (subtitle) {
        subtitle.textContent = data.subtitle;
        subtitle.classList.remove("is-participated");
      }
      if (btn) {
        btn.classList.remove("is-participated");
        btn.classList.add("is-insufficient");
        btn.disabled = true;
        btn.dataset.participateCost = String(data.buttonCost);
        btn.innerHTML =
          '<span class="raffle-event-card__btn-text">Участвовать за ' +
          data.buttonCost +
          "</span>" +
          '<img class="raffle-event-card__btn-icon" src="' +
          RAFFLE_TOKEN_INACTIVE_SRC +
          '" data-state-src="' +
          RAFFLE_TOKEN_INACTIVE_SRC +
          '" width="24" height="24" alt="" draggable="false" />';
      }
    }

    if (back) {
      const base = back.querySelector(".raffle-event-card__base");
      if (base) base.src = RAFFLE_CARD_SRC;
      back.classList.remove("is-entry-turnover", "is-turnover");
    }

    cardEl.classList.remove("is-participated");
    cardEl.querySelector(".raffle-participate-particles")?.remove();

    if (flip) {
      resetRaffleFlip(flip);
    }
  }

  function resetRaffleProgress() {
    skipRaffleParticipateAnimation();
    cancelRaffleIntro(false);
    taskExecuteStubRunning = false;
    hideTaskExecuteStub();
    resetTask2RewardReady();

    raffleParticipatedIndices.clear();
    clearRaffleIntroSeen();

    if (raffleIntroLayerEl) {
      raffleIntroLayerEl.remove();
      raffleIntroLayerEl = null;
    }

    document.querySelectorAll(".raffle-event-card").forEach((cardEl) => {
      const cardIndex = Number(cardEl.dataset.cardIndex);
      if (Number.isNaN(cardIndex)) return;
      restoreRaffleCardDefaultContent(cardEl, cardIndex);
    });

    raffleCarouselRefs?.wraps?.forEach((wrap) => {
      delete wrap.dataset.participating;
      wrap.style.transition = "";
      wrap.style.transform = "";
      wrap.style.filter = "";
      wrap.style.zIndex = "";
    });

    document
      .querySelector(".raffle-cards-block")
      ?.classList.remove("is-participate-active", "is-intro-active");
    document.getElementById("raffle-cards-carousel")?.classList.remove("is-intro-hidden");
    clearRaffleIntroPaginationStyles();
    setRaffleScrollLocked(false);
    setRafflePageScrollLocked(false);
    raffleParticipateSession = null;
    raffleIntroRunning = false;

    raffleCarouselRefs?.scrollToSlide?.(0);
    raffleCarouselRefs?.updateCardTransforms?.();
    setCoinBalance(INITIAL_COIN_BALANCE);
  }

  function applyRaffleParticipatedContent(cardEl, cardIndex) {
    const data = RAFFLE_CARDS[cardIndex];
    if (!data || !cardEl) return;

    const front = cardEl.querySelector(".raffle-event-card__face--front");
    if (!front) return;

    const base = front.querySelector(".raffle-event-card__base");
    const subtitle = front.querySelector(".raffle-event-card__subtitle");
    const btn = front.querySelector(".raffle-event-card__btn");

    if (base) base.src = data.activeBaseSrc;
    if (subtitle) {
      subtitle.textContent = data.participatedSubtitle;
      subtitle.classList.add("is-participated");
    }
    if (btn) {
      btn.disabled = true;
      btn.classList.remove("is-insufficient");
      btn.classList.add("is-participated");
      btn.innerHTML =
        '<img class="raffle-event-card__btn-icon raffle-event-card__btn-icon--check" src="' +
        RAFFLE_CHECK_SRC +
        '" width="24" height="24" alt="" draggable="false" />' +
        '<span class="raffle-event-card__btn-text">Вы участвуете</span>';
    }

    cardEl.classList.add("is-participated");
  }

  function applyRaffleParticipatedBackBase(cardEl, cardIndex) {
    const data = RAFFLE_CARDS[cardIndex];
    if (!data || !cardEl) return;

    const back = cardEl.querySelector(".raffle-event-card__face--back");
    const base = back?.querySelector(".raffle-event-card__base");
    if (base) base.src = data.activeBaseSrc;
  }

  function applyRaffleParticipatedContentToAll(cardIndex) {
    document
      .querySelectorAll('.raffle-event-card[data-card-index="' + cardIndex + '"]')
      .forEach((cardEl) => {
        applyRaffleParticipatedContent(cardEl, cardIndex);
      });
  }

  function applyRaffleParticipatedBackBaseToAll(cardIndex) {
    document
      .querySelectorAll('.raffle-event-card[data-card-index="' + cardIndex + '"]')
      .forEach((cardEl) => {
        applyRaffleParticipatedBackBase(cardEl, cardIndex);
      });
  }

  function normalizeRaffleFlipRotation(flip) {
    const total = Number(flip.dataset.rotation || 0);
    const frontRotation = Math.round(total / 360) * 360;
    flip.style.transition = "none";
    flip.style.transform = "rotateY(" + frontRotation + "deg)";
    flip.dataset.rotation = String(frontRotation);
    flip.classList.remove("is-flipped");
    void flip.offsetWidth;
    flip.style.transition = "";
  }

  function spawnRaffleImpactSparks(wrap) {
    const card = wrap.querySelector(".raffle-event-card");
    if (!card) return;

    let stage = card.querySelector(".raffle-participate-particles");
    if (!stage) {
      stage = document.createElement("div");
      stage.className = "raffle-participate-particles";
      stage.setAttribute("aria-hidden", "true");
      card.appendChild(stage);
    }

    stage.replaceChildren();
    spawnPrizeParticles(stage, {
      particleScale: 4.05,
      sparkOnly: true,
      randomOrigin: true,
      originInsetX: 2,
      originSpanX: 118,
      originInsetY: 4,
      originSpanY: 116,
      distanceMin: 42,
      distanceRange: 120,
      angleSpread: Math.PI * 1.85,
    });
  }

  function skipRaffleParticipateAnimation() {
    if (!raffleParticipateSession) return;

    const { wrap, cardIndex, flip, centerRotate, flipStart = 0 } =
      raffleParticipateSession;

    applyRaffleParticipatedContentToAll(cardIndex);
    applyRaffleParticipatedBackBaseToAll(cardIndex);
    setRaffleTurnoverBackToAll(cardIndex, false);
    raffleParticipatedIndices.add(cardIndex);

    flip.dataset.rotation = String(flipStart + 360);
    normalizeRaffleFlipRotation(flip);
    wrap.style.transition = "";
    wrap.style.transform =
      "translateY(0px) rotate(" + centerRotate + "deg) scale(1)";
    wrap.style.filter = "none";
    delete wrap.dataset.participating;

    document.querySelector(".raffle-cards-block")?.classList.remove("is-participate-active");
    setRaffleScrollLocked(false);
    raffleParticipateSession = null;
    raffleCarouselRefs?.updateCardTransforms();
  }

  async function runRaffleParticipate(wrap, cardIndex) {
    const card = wrap.querySelector(".raffle-event-card");
    const flip = wrap.querySelector(".raffle-event-card__flip");
    const carousel = raffleCarouselRefs?.carousel;
    const participateCost = getRaffleCardButtonCost(cardIndex);

    if (
      !card ||
      !flip ||
      !carousel ||
      coinBalance < participateCost ||
      raffleParticipatedIndices.has(cardIndex) ||
      wrap.dataset.participating === "true" ||
      getRaffleWrapProgress(wrap, carousel) > 0.08
    ) {
      return;
    }

    const startBalance = coinBalance;
    const endBalance = startBalance - participateCost;

    wrap.dataset.participating = "true";

    const participateBtn = card.querySelector(".raffle-event-card__btn");
    if (participateBtn) {
      participateBtn.classList.remove("is-insufficient");
      participateBtn.disabled = true;
    }

    coinBalance = endBalance;
    void animateCoinBadgeValue(startBalance, endBalance);

    const centerRotate = RAFFLE_CENTER_ROTATIONS[cardIndex] ?? 0;
    const flipStart = Number(flip.dataset.rotation || 0);

    raffleParticipateSession = { wrap, card, flip, cardIndex, centerRotate, flipStart };
    setRaffleScrollLocked(true);
    document.querySelector(".raffle-cards-block")?.classList.add("is-participate-active");
    setRaffleTurnoverBackToAll(cardIndex, true);

    flip.style.transition = "none";
    flip.style.transform = "rotateY(" + flipStart + "deg)";
    void flip.offsetWidth;
    flip.style.transition = "";

    try {
      await waitRaffleDelay(RAFFLE_PARTICIPATE_SCALE_DELAY_MS);

      wrap.style.transition =
        "transform " +
        RAFFLE_PARTICIPATE_SCALE_MS +
        "ms cubic-bezier(0, 0, 0.4, 0.9), filter " +
        RAFFLE_PARTICIPATE_SCALE_MS +
        "ms ease";
      wrap.style.filter = "none";
      wrap.style.transform =
        "translateY(0px) rotate(0deg) scale(" + RAFFLE_PARTICIPATE_SCALE + ")";
      await waitRaffleTransition(wrap, "transform", RAFFLE_PARTICIPATE_SCALE_MS);

      flip.style.transition =
        "transform " +
        RAFFLE_PARTICIPATE_FLIP_SLOW_MS +
        "ms cubic-bezier(0.4, 0, 1, 1)";
      flip.dataset.flipAnimating = "true";
      armRaffleFlipMid(flip, RAFFLE_PARTICIPATE_FLIP_SLOW_MS, true);
      flip.style.transform = "rotateY(" + (flipStart + 180) + "deg)";
      await waitRaffleTransition(flip, "transform", RAFFLE_PARTICIPATE_FLIP_SLOW_MS);
      clearRaffleFlipMid(flip);
      delete flip.dataset.flipAnimating;

      applyRaffleParticipatedContentToAll(cardIndex);
      raffleParticipatedIndices.add(cardIndex);

      flip.style.transition =
        "transform " +
        RAFFLE_PARTICIPATE_FLIP_FAST_MS +
        "ms cubic-bezier(0.4, 0.1, 0.2, 1)";
      flip.dataset.flipAnimating = "true";
      armRaffleFlipMid(flip, RAFFLE_PARTICIPATE_FLIP_FAST_MS, false);
      flip.style.transform = "rotateY(" + (flipStart + 360) + "deg)";
      await waitRaffleTransition(flip, "transform", RAFFLE_PARTICIPATE_FLIP_FAST_MS);
      clearRaffleFlipMid(flip);
      delete flip.dataset.flipAnimating;

      flip.dataset.rotation = String(flipStart + 360);
      normalizeRaffleFlipRotation(flip);

      await waitRaffleDelay(RAFFLE_PARTICIPATE_PAUSE_MS);

      wrap.style.transition =
        "transform " +
        RAFFLE_PARTICIPATE_RETURN_MS +
        "ms cubic-bezier(0.45, 1.45, 0.48, 1)";
      wrap.style.transform =
        "translateY(0px) rotate(" + centerRotate + "deg) scale(1)";

      window.setTimeout(() => {
        spawnRaffleImpactSparks(wrap);
      }, RAFFLE_PARTICIPATE_SPARKS_AT_MS);

      await waitRaffleTransition(wrap, "transform", RAFFLE_PARTICIPATE_RETURN_MS);
      applyRaffleParticipatedBackBaseToAll(cardIndex);
      setRaffleTurnoverBackToAll(cardIndex, false);
    } finally {
      setRaffleTurnoverBackToAll(cardIndex, false);
      clearRaffleFlipMid(flip);
      delete flip.dataset.flipAnimating;
      wrap.style.transition = "";
      flip.style.transition = "";
      delete wrap.dataset.participating;
      document.querySelector(".raffle-cards-block")?.classList.remove("is-participate-active");
      setRaffleScrollLocked(false);
      raffleParticipateSession = null;
      raffleCarouselRefs?.updateCardTransforms();
    }
  }

  function toggleRaffleCardFlip(flip) {
    if (flip.dataset.flipAnimating === "true") return;

    const current = Number(flip.dataset.rotation || 0);
    const next = current + 180;

    const toBack = !flip.classList.contains("is-flipped");

    flip.dataset.flipAnimating = "true";
    armRaffleFlipMid(flip, FLIP_DURATION_MS, toBack);
    flip.style.transform = "rotateY(" + next + "deg)";
    flip.dataset.rotation = String(next);
    flip.classList.toggle("is-flipped", (next / 180) % 2 === 1);

    let done = false;
    const finish = (event) => {
      if (done) return;
      if (event && (event.target !== flip || event.propertyName !== "transform")) {
        return;
      }
      done = true;
      flip.removeEventListener("transitionend", finish);
      clearRaffleFlipMid(flip);
      delete flip.dataset.flipAnimating;
    };

    flip.addEventListener("transitionend", finish);
    window.setTimeout(() => finish(), FLIP_DURATION_MS + 60);
  }

  function initRaffleCardFlip(carousel, wraps) {
    wraps.forEach((wrap) => {
      const card = wrap.querySelector(".raffle-event-card");
      const flip = wrap.querySelector(".raffle-event-card__flip");
      if (!card || !flip) return;

      const faces = flip.querySelectorAll(".raffle-event-card__face");
      const buttons = flip.querySelectorAll(".raffle-event-card__btn");

      buttons.forEach((button) => {
        ["pointerdown", "pointerup", "touchstart", "touchend"].forEach((eventName) => {
          button.addEventListener(
            eventName,
            (event) => {
              event.stopPropagation();
            },
            { passive: eventName === "touchstart" }
          );
        });

        button.addEventListener("click", (event) => {
          event.stopPropagation();
          if (
            button.disabled ||
            button.classList.contains("is-participated") ||
            button.classList.contains("is-insufficient")
          ) {
            return;
          }
          const cardIndex = Number(card.dataset.cardIndex);
          runRaffleParticipate(wrap, cardIndex);
        });
      });

      faces.forEach((face) => {
        face.addEventListener("click", (event) => {
          if (wrap.dataset.participating === "true") return;
          if (getRaffleWrapProgress(wrap, carousel) > 0.08) return;
          if (face.classList.contains("raffle-event-card__face--front")) {
            if (isRaffleButtonSafeZone(event, card)) return;
            if (event.target.closest(".raffle-event-card__btn")) return;
          }

          toggleRaffleCardFlip(flip);
        });
      });
    });
  }

  function getTabBarTop() {
    const tabBar = document.querySelector(".tab-bar");
    return tabBar?.getBoundingClientRect().top ?? window.innerHeight - 84;
  }

  function hasSeenRaffleIntro() {
    try {
      return localStorage.getItem(RAFFLE_INTRO_SEEN_KEY) === "1";
    } catch {
      return true;
    }
  }

  function markRaffleIntroSeen() {
    try {
      localStorage.setItem(RAFFLE_INTRO_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  function clearRaffleIntroPaginationStyles() {
    const pagination = document.getElementById("raffle-cards-pagination");
    const label = raffleCardsPaginationLabelEl ?? document.getElementById("raffle-cards-pagination-label");

    [pagination, label].forEach((el) => {
      if (!el) return;
      el.style.transition = "";
      el.style.opacity = "";
      el.style.pointerEvents = "";
    });
  }

  function setRaffleIntroPaginationHidden(hidden) {
    const pagination = document.getElementById("raffle-cards-pagination");
    const label = raffleCardsPaginationLabelEl ?? document.getElementById("raffle-cards-pagination-label");

    [pagination, label].forEach((el) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.opacity = hidden ? "0" : "1";
      el.style.pointerEvents = hidden ? "none" : "";
    });
  }

  function revealRaffleIntroPagination(stage2Ease) {
    const pagination = document.getElementById("raffle-cards-pagination");
    const label = raffleCardsPaginationLabelEl ?? document.getElementById("raffle-cards-pagination-label");
    const transition = "opacity " + RAFFLE_INTRO_STAGE2_MS + "ms " + stage2Ease;

    [pagination, label].forEach((el) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      void el.offsetWidth;
      el.style.transition = transition;
      el.style.opacity = "1";
    });
  }

  function setRaffleIntroVisualScale(slot, scale, transition) {
    const visual = slot.querySelector(".raffle-event-card__visual");
    if (!visual) return;
    visual.style.transition = transition || "none";
    visual.style.transform = "scale(" + scale + ")";
    if (!transition) {
      void visual.offsetWidth;
    }
  }

  function prepareRaffleIntroPresentation() {
    if (hasSeenRaffleIntro() || raffleIntroRunning) return;

    const block = document.querySelector(".raffle-cards-block");
    const carouselEl = document.getElementById("raffle-cards-carousel");
    const layer = ensureRaffleIntroLayer();
    if (!block || !carouselEl || !layer) return;

    block.classList.add("is-intro-active");
    carouselEl.classList.add("is-intro-hidden");
    setRaffleScrollLocked(true);
    setRafflePageScrollLocked(true);
    layer.hidden = false;

    setRaffleIntroPaginationHidden(true);

    const initial = getRaffleIntroInitialState();
    getRaffleIntroSlots(layer).forEach((slot, index) => {
      const card = slot.querySelector(".raffle-event-card");
      const flip = slot.querySelector(".raffle-event-card__flip");

      slot.style.transition = "none";
      slot.style.zIndex = String(RAFFLE_CARD_COUNT - index);
      setRaffleEntryTurnoverBack(card, index === 0);

      if (flip) {
        applyRaffleIntroFlip(flip, index === 0 ? 180 : 0, false);
      }

      applyRaffleIntroSlotStyle(slot, initial);
      setRaffleIntroVisualScale(slot, initial.visualScale, "");
    });

    updateRaffleParticipateButtonsState();
  }

  function cancelRaffleIntroPresentation() {
    if (raffleIntroRunning || hasSeenRaffleIntro()) return;

    const block = document.querySelector(".raffle-cards-block");
    const carouselEl = document.getElementById("raffle-cards-carousel");

    block?.classList.remove("is-intro-active");
    carouselEl?.classList.remove("is-intro-hidden");
    if (raffleIntroLayerEl) {
      raffleIntroLayerEl.hidden = true;
    }
    clearRaffleIntroPaginationStyles();
    setRaffleScrollLocked(false);
    setRafflePageScrollLocked(false);
  }

  function ensureRaffleIntroLayer() {
    if (raffleIntroLayerEl) return raffleIntroLayerEl;

    const block = document.querySelector(".raffle-cards-block");
    if (!block) return null;

    const layer = document.createElement("div");
    layer.id = "raffle-intro";
    layer.className = "raffle-intro";
    layer.hidden = true;
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = Array.from({ length: RAFFLE_CARD_COUNT }, (_, cardIndex) => {
      return (
        '<div class="raffle-intro__slot" data-intro-card="' +
        cardIndex +
        '">' +
        '<div class="raffle-event-card-wrap raffle-intro__wrap">' +
        raffleCardMarkup(cardIndex) +
        "</div></div>"
      );
    }).join("");
    block.appendChild(layer);
    raffleIntroLayerEl = layer;
    updateRaffleParticipateButtonsState();
    return layer;
  }

  function getRaffleIntroSlots(layer) {
    return [...layer.querySelectorAll(".raffle-intro__slot")].sort(
      (a, b) => Number(a.dataset.introCard) - Number(b.dataset.introCard)
    );
  }

  function buildIntroSlotState(anchor, transform, opacity) {
    const scale = transform.scale ?? 1;
    return {
      centerX: anchor.centerX,
      centerY: anchor.centerY,
      translateY: transform.translateY ?? 0,
      rotate: transform.rotate ?? 0,
      scale,
      visualScale: scale,
      wrapOpacity: transform.opacity ?? 1,
      opacity: opacity ?? 1,
    };
  }

  function getSlideWrapAnchor(slide) {
    if (!slide) return null;
    const slideRect = slide.getBoundingClientRect();
    return {
      centerX: slideRect.left + slideRect.width / 2,
      centerY: slideRect.top + RAFFLE_CARD_HEIGHT / 2,
    };
  }

  function applyRaffleIntroSlotStyle(slot, state) {
    slot.style.left = state.centerX + "px";
    slot.style.top = state.centerY + "px";
    slot.style.transform = "translate(-50%, -50%)";
    slot.style.opacity = String(state.opacity);
    slot.style.filter = "none";

    const wrap = slot.querySelector(".raffle-intro__wrap");
    if (!wrap) return;

    wrap.style.transform =
      "translateY(" +
      (state.translateY || 0) +
      "px) rotate(" +
      state.rotate +
      "deg) scale(" +
      state.scale +
      ")";
    wrap.style.opacity = String(state.wrapOpacity ?? 1);
    wrap.style.filter = "none";
  }

  function setRaffleIntroSlotTransitions(slot, durationMs, easing, includePosition) {
    const wrap = slot.querySelector(".raffle-intro__wrap");
    const positionPart = includePosition ? "left " + durationMs + "ms " + easing + ", top " + durationMs + "ms " + easing + ", " : "";
    slot.style.transition =
      positionPart +
      "opacity " +
      durationMs +
      "ms " +
      easing;

    if (wrap) {
      wrap.style.transition =
        "transform " + durationMs + "ms " + easing + ", filter " + durationMs + "ms ease";
    }
  }

  function applyRaffleIntroFlip(flip, degrees, withTransition) {
    if (!withTransition) {
      flip.style.transition = "none";
    }
    flip.style.transform = "rotateY(" + degrees + "deg)";
    flip.classList.toggle("is-flipped", (degrees / 180) % 2 === 1);
    if (!withTransition) {
      void flip.offsetWidth;
    }
  }

  function getRaffleCarouselWrapTransform(cardIndex, offsetFromCenter) {
    const progress = Math.min(1, Math.abs(offsetFromCenter) / RAFFLE_SLIDE_STEP);
    const centerRotate = RAFFLE_CENTER_ROTATIONS[cardIndex] ?? 0;
    return {
      scale: 1 - progress * 0.1,
      rotate: centerRotate * (1 - progress) + (offsetFromCenter / RAFFLE_SLIDE_STEP) * 4,
      translateY: progress * 48,
      opacity: 1 - progress * 0.25,
    };
  }

  function measureRaffleIntroTargets() {
    const { carousel, slides, scrollToSlide, updateCardTransforms } =
      raffleCarouselRefs ?? {};
    if (!carousel || !slides?.length) return null;

    scrollToSlide(0);
    updateCardTransforms();

    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenterX = carouselRect.left + carouselRect.width / 2;
    const centerAnchor = getSlideWrapAnchor(slides[0]);
    if (!centerAnchor) return null;

    const stage1Center = buildIntroSlotState(
      centerAnchor,
      { translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      1
    );

    const stage2 = {};
    slides.forEach((slide, slideIndex) => {
      const anchor = getSlideWrapAnchor(slide);
      if (!anchor) return;

      const offset = anchor.centerX - carouselCenterX;
      const transform = getRaffleCarouselWrapTransform(slideIndex, offset);
      stage2[slideIndex] = buildIntroSlotState(anchor, transform);
    });

    return { stage1Center, stage2 };
  }

  function getRaffleIntroInitialState() {
    return {
      centerX: window.innerWidth / 2,
      centerY: getTabBarTop() + RAFFLE_CARD_HEIGHT / 2,
      translateY: 0,
      rotate: 0,
      scale: 0.8,
      visualScale: 0.8,
      blur: 0,
      opacity: 0,
    };
  }

  function getRaffleIntroStage2Start(cardIndex, stage1Center) {
    const base = {
      centerX: stage1Center.centerX,
      centerY: stage1Center.centerY,
      translateY: 0,
      rotate: 0,
      scale: 1,
      visualScale: 1,
      blur: 0,
    };

    if (cardIndex === 0) {
      return { ...base, opacity: 1 };
    }

    return { ...base, opacity: 0 };
  }

  function finishRaffleIntro(layer, block, carouselEl) {
    raffleCarouselRefs?.updateCardTransforms();
    layer.hidden = true;
    block?.classList.remove("is-intro-active");
    carouselEl?.classList.remove("is-intro-hidden");
    clearRaffleIntroPaginationStyles();
    setRaffleScrollLocked(false);
    setRafflePageScrollLocked(false);
    raffleIntroRunning = false;
  }

  function cancelRaffleIntro(markSeen = true) {
    if (!raffleIntroRunning) return;

    const layer = raffleIntroLayerEl;
    const block = document.querySelector(".raffle-cards-block");
    const carouselEl = document.getElementById("raffle-cards-carousel");

    if (layer) {
      getRaffleIntroSlots(layer).forEach((slot) => {
        const card = slot.querySelector(".raffle-event-card");
        const flip = slot.querySelector(".raffle-event-card__flip");
        setRaffleEntryTurnoverBack(card, false);
        if (flip) {
          applyRaffleIntroFlip(flip, 0, false);
        }
      });
    }

    if (markSeen) {
      markRaffleIntroSeen();
    }
    if (layer) {
      finishRaffleIntro(layer, block, carouselEl);
    } else {
      block?.classList.remove("is-intro-active");
      carouselEl?.classList.remove("is-intro-hidden");
      clearRaffleIntroPaginationStyles();
      setRaffleScrollLocked(false);
      setRafflePageScrollLocked(false);
      raffleIntroRunning = false;
    }
  }

  async function runRaffleIntroAnimation() {
    const layer = raffleIntroLayerEl ?? ensureRaffleIntroLayer();
    const block = document.querySelector(".raffle-cards-block");
    const carouselEl = document.getElementById("raffle-cards-carousel");
    const pagination = document.getElementById("raffle-cards-pagination");
    if (!layer || !block || !carouselEl || !raffleCarouselRefs) return;

    prepareRaffleIntroPresentation();
    raffleIntroRunning = true;

    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    const targets = measureRaffleIntroTargets();
    if (!targets?.stage1Center || !targets.stage2) {
      finishRaffleIntro(layer, block, carouselEl);
      markRaffleIntroSeen();
      return;
    }

    const slots = getRaffleIntroSlots(layer);
    const stage1Ease = "cubic-bezier(0, 0, 0.4, 0.9)";
    const stage2Ease = "cubic-bezier(0.35, 1.3, 0.25, 1)";

    const stage1Promises = slots.map((slot, index) => {
      const endState =
        index === 0
          ? { ...targets.stage1Center, opacity: 1 }
          : { ...targets.stage1Center, opacity: 0 };

      setRaffleIntroSlotTransitions(slot, RAFFLE_INTRO_STAGE1_MS, stage1Ease, true);
      applyRaffleIntroSlotStyle(slot, endState);
      setRaffleIntroVisualScale(
        slot,
        1,
        "transform " + RAFFLE_INTRO_STAGE1_MS + "ms " + stage1Ease
      );

      if (index === 0) {
        const flip = slot.querySelector(".raffle-event-card__flip");
        if (flip) {
          flip.style.transition =
            "transform " + RAFFLE_INTRO_STAGE1_MS + "ms " + stage1Ease;
          applyRaffleIntroFlip(flip, 0, true);
        }
      }

      const wrap = slot.querySelector(".raffle-intro__wrap");
      return waitRaffleTransition(wrap, "transform", RAFFLE_INTRO_STAGE1_MS);
    });

    await Promise.all(stage1Promises);

    await waitRaffleDelay(RAFFLE_INTRO_PAUSE_MS);

    slots.forEach((slot) => {
      const card = slot.querySelector(".raffle-event-card");
      setRaffleEntryTurnoverBack(card, false);
    });

    slots.forEach((slot, index) => {
      const startState = getRaffleIntroStage2Start(index, targets.stage1Center);
      slot.style.transition = "none";
      applyRaffleIntroSlotStyle(slot, startState);
      setRaffleIntroVisualScale(slot, 1, "");
      void slot.offsetWidth;
    });

    revealRaffleIntroPagination(stage2Ease);

    const stage2Promises = slots.map((slot, index) => {
      const endState = targets.stage2[index];
      if (!endState) return Promise.resolve();

      setRaffleIntroSlotTransitions(slot, RAFFLE_INTRO_STAGE2_MS, stage2Ease, true);
      applyRaffleIntroSlotStyle(slot, endState);
      setRaffleIntroVisualScale(
        slot,
        endState.visualScale,
        "transform " + RAFFLE_INTRO_STAGE2_MS + "ms " + stage2Ease
      );

      const wrap = slot.querySelector(".raffle-intro__wrap");
      return waitRaffleTransition(wrap, "transform", RAFFLE_INTRO_STAGE2_MS);
    });

    await Promise.all(stage2Promises);

    if (pagination) {
      pagination.style.pointerEvents = "";
    }
    const label = raffleCardsPaginationLabelEl ?? document.getElementById("raffle-cards-pagination-label");
    if (label) {
      label.style.pointerEvents = "";
    }

    markRaffleIntroSeen();
    finishRaffleIntro(layer, block, carouselEl);
  }

  async function maybePlayRaffleIntro() {
    if (hasSeenRaffleIntro() || raffleIntroRunning || !raffleCarouselRefs) return;

    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    if (hasSeenRaffleIntro() || raffleIntroRunning) return;

    await waitRaffleDelay(RAFFLE_INTRO_ENTRY_DELAY_MS);

    if (hasSeenRaffleIntro() || raffleIntroRunning) return;

    try {
      await runRaffleIntroAnimation();
    } catch {
      cancelRaffleIntro();
    }
  }

  function raffleSlideMarkup(slideIndex, cardIndex) {
    return (
      '<div class="raffle-cards-slide" data-slide-index="' +
      slideIndex +
      '">' +
      '<div class="raffle-event-card-wrap">' +
      raffleCardMarkup(cardIndex) +
      "</div></div>"
    );
  }

  function initRaffleCarousel() {
    const track = document.getElementById("raffle-cards-track");
    const carousel = document.getElementById("raffle-cards-carousel");
    const pagination = document.getElementById("raffle-cards-pagination");
    if (!track || !carousel || !pagination) return;

    track.innerHTML = RAFFLE_SLIDE_INDICES.map((cardIndex, slideIndex) =>
      raffleSlideMarkup(slideIndex, cardIndex)
    ).join("");

    pagination.innerHTML = Array.from({ length: RAFFLE_CARD_COUNT }, (_, index) => {
      const activeClass = index === 0 ? " is-active" : "";
      return (
        '<span class="raffle-cards-dot' +
        activeClass +
        '" data-dot-index="' +
        index +
        '"></span>'
      );
    }).join("");

    const slides = [...track.querySelectorAll(".raffle-cards-slide")];
    const wraps = [...track.querySelectorAll(".raffle-event-card-wrap")];
    const dots = [...pagination.querySelectorAll(".raffle-cards-dot")];
    let rafId = null;
    let scrollEndTimer = null;
    let lastHapticSlideIndex = null;

    function scrollToSlide(slideIndex, behavior = "auto") {
      const maxIndex = Math.max(0, slides.length - 1);
      const clamped = Math.max(0, Math.min(maxIndex, slideIndex));
      track.scrollTo({ left: clamped * RAFFLE_SLIDE_STEP, behavior });
    }

    function getNearestSlideIndex() {
      return Math.round(track.scrollLeft / RAFFLE_SLIDE_STEP);
    }

    function updateDots(realIndex) {
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === realIndex);
      });
    }

    function updateCardTransforms() {
      const carouselRect = carousel.getBoundingClientRect();
      const centerX = carouselRect.left + carouselRect.width / 2;
      const slideStep = RAFFLE_SLIDE_STEP;

      wraps.forEach((wrap) => {
        if (wrap.dataset.participating === "true") return;

        const cardRect = wrap.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const offset = cardCenterX - centerX;
        const progress = Math.min(1, Math.abs(offset) / slideStep);
        const cardIndex = Number(
          wrap.querySelector(".raffle-event-card")?.dataset.cardIndex ?? 2
        );
        const centerRotate = RAFFLE_CENTER_ROTATIONS[cardIndex] ?? 0;
        const scale = 1 - progress * 0.1;
        const rotateDeg =
          centerRotate * (1 - progress) + (offset / slideStep) * 4;
        const translateY = progress * 48;
        const opacity = 1 - progress * 0.25;

        wrap.style.transform =
          "translateY(" +
          translateY +
          "px) rotate(" +
          rotateDeg +
          "deg) scale(" +
          scale +
          ")";
        wrap.style.opacity = String(opacity);
        wrap.style.filter = "none";
        wrap.style.zIndex = String(10 - Math.round(progress * 10));

        const visual = wrap.querySelector(".raffle-event-card__visual");
        if (visual) {
          const visualScale = 1 - progress * 0.1;
          visual.style.transform = "scale(" + visualScale + ")";
        }
      });

      const nearest = Math.max(0, Math.min(slides.length - 1, getNearestSlideIndex()));
      if (
        lastHapticSlideIndex !== null &&
        nearest !== lastHapticSlideIndex &&
        !raffleIntroRunning &&
        !raffleParticipateSession
      ) {
        triggerHaptic(HAPTIC_SELECTION_MS);
      }
      lastHapticSlideIndex = nearest;
      updateDots(nearest);
      updateRafflePaginationLabelOpacity();
    }

    function updateRafflePaginationLabelOpacity() {
      const label =
        raffleCardsPaginationLabelEl ?? document.getElementById("raffle-cards-pagination-label");
      if (!label) return;

      const block = document.querySelector(".raffle-cards-block");
      if (raffleIntroRunning || block?.classList.contains("is-intro-active")) {
        return;
      }

      const scrollProgress = track.scrollLeft / RAFFLE_SLIDE_STEP;
      const distanceFromSnap = Math.abs(scrollProgress - Math.round(scrollProgress));
      const opacity = 1 - Math.min(1, distanceFromSnap * 2);

      label.style.opacity = String(opacity);
    }

    function scheduleTransformUpdate() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateCardTransforms();
      });
    }

    function handleScrollEnd() {
      updateCardTransforms();
    }

    function layoutRaffleCarousel() {
      slides.forEach((slide) => {
        slide.style.flexBasis = RAFFLE_SLIDE_STEP + "px";
        slide.style.width = RAFFLE_SLIDE_STEP + "px";
      });

      const currentSlide = getNearestSlideIndex();
      const targetSlide = Math.max(0, Math.min(slides.length - 1, currentSlide));
      scrollToSlide(targetSlide);
      updateCardTransforms();
    }

    track.addEventListener(
      "scroll",
      () => {
        if (raffleParticipateSession) return;
        unflipRaffleCardsOnScroll(carousel, wraps);
        scheduleTransformUpdate();
        clearTimeout(scrollEndTimer);
        scrollEndTimer = window.setTimeout(handleScrollEnd, 120);
      },
      { passive: true }
    );
    track.addEventListener("scrollend", handleScrollEnd);

    initRaffleCardFlip(carousel, wraps);

    raffleCarouselRefs = {
      carousel,
      track,
      slides,
      wraps,
      scrollToSlide,
      updateCardTransforms,
    };

    requestAnimationFrame(() => {
      layoutRaffleCarousel();
      scrollToSlide(0);
      updateCardTransforms();
    });
    window.addEventListener("resize", layoutRaffleCarousel);
  }

  function spawnPrizeParticles(stage, options = {}) {
    const opts = typeof options === "number" ? { particleScale: options } : options;
    const particleScale = opts.particleScale ?? 1;
    const sparkOnly = opts.sparkOnly ?? false;
    const randomOrigin = opts.randomOrigin ?? false;
    const originInsetX = opts.originInsetX ?? 12;
    const originSpanX = opts.originSpanX ?? 76;
    const originInsetY = opts.originInsetY ?? 18;
    const originSpanY = opts.originSpanY ?? 64;
    const distanceMin = opts.distanceMin ?? 28;
    const distanceRange = opts.distanceRange ?? 34;
    const angleSpread = opts.angleSpread ?? Math.PI * 1.25;
    const count = Math.floor((12 + Math.floor(Math.random() * 6)) * particleScale);

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      const isSpark = sparkOnly || Math.random() > 0.55;
      particle.className = isSpark
        ? "win-progress__prize-particle win-progress__prize-particle--spark"
        : "win-progress__prize-particle";
      particle.setAttribute("aria-hidden", "true");

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * angleSpread;
      const distance = distanceMin + Math.random() * distanceRange;
      const size = isSpark ? 4 + Math.random() * 4 : 6 + Math.random() * 5;

      if (randomOrigin) {
        particle.style.left = originInsetX + Math.random() * originSpanX + "%";
        particle.style.top = originInsetY + Math.random() * originSpanY + "%";
      }

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

    if (gridEl) {
      gridEl.style.setProperty("--mini-unflip-ms", MINI_UNFLIP_FLIP_MS + "ms");
    }

    for (let d = 0; d < MINI_UNFLIP_WAVE_COUNT; d += 1) {
      const delay = Math.round(d * MINI_UNFLIP_WAVE_STAGGER_MS);

      for (let row = 0; row < ROWS; row += 1) {
        const col = d - row;
        if (col < 0 || col >= COLS) continue;

        const cell = getCell(row, col);
        const inner = cell?.querySelector(".cell-inner");
        if (!inner?.classList.contains("flipped")) continue;

        window.setTimeout(() => {
          const front = cell.querySelector(".cell-front");
          const back = cell.querySelector(".cell-back");

          if (front) front.textContent = "";
          if (back) back.textContent = "";

          inner.classList.remove("flipped");

          window.setTimeout(() => {
            if (back) back.className = "cell-back";
            cell.classList.remove("filled", "error", "win-scale");
            cell.style.removeProperty("--win-col");
          }, MINI_UNFLIP_FLIP_MS);
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

  function stopSplashConfetti() {
    if (splashConfettiRafId !== null) {
      cancelAnimationFrame(splashConfettiRafId);
      splashConfettiRafId = null;
    }
    if (winSplashConfettiEl) {
      winSplashConfettiEl.innerHTML = "";
    }
  }

  function playConfettiInContainer(containerEl, options = {}) {
    if (!containerEl) return;

    const width = containerEl.clientWidth;
    const height = containerEl.clientHeight;
    if (!width || !height) return;

    const containerRect = containerEl.getBoundingClientRect();
    const topRect = options.topEl?.getBoundingClientRect();
    const bottomRect = options.bottomEl?.getBoundingClientRect();
    const radialBurst = options.mode === "radial";

    let spawnYMin = height * 0.12;
    let spawnYMax = height * 0.42;

    if (topRect && bottomRect) {
      spawnYMin = Math.max(0, topRect.bottom - containerRect.top - 16);
      spawnYMax = Math.min(
        height,
        bottomRect.top - containerRect.top + bottomRect.height * 0.6
      );
      if (spawnYMax <= spawnYMin) {
        spawnYMax = spawnYMin + 80;
      }
    }

    if (options.spawnYShiftRatio) {
      const shift = height * options.spawnYShiftRatio;
      spawnYMin = Math.min(height, spawnYMin + shift);
      spawnYMax = Math.min(height, spawnYMax + shift);
      if (spawnYMax <= spawnYMin) {
        spawnYMax = Math.min(height, spawnYMin + 80);
      }
    }

    let burstX = width / 2;
    let burstY = height * 0.35;
    if (radialBurst && options.originEl) {
      const originRect = options.originEl.getBoundingClientRect();
      burstX = originRect.left + originRect.width / 2 - containerRect.left;
      burstY = originRect.top + originRect.height / 2 - containerRect.top;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    containerEl.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const particles = [];
    let lastFrameTime = performance.now();
    let localRafId = null;

    function setRaf(id) {
      localRafId = id;
      if (options.onRaf) options.onRaf(id);
    }

    function spawnParticle(side) {
      if (radialBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (11 + Math.random() * 9) / 1.5;
        particles.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.08 + Math.random() * 0.05,
          drag: 0.94 + Math.random() * 0.03,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.5,
          w: 3 + Math.random() * 5,
          h: 5 + Math.random() * 9,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          life: 1,
          decay: 0.003 + Math.random() * 0.0025,
        });
        return;
      }

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
        drag: 1,
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
        if (p.drag < 1) {
          const dragFactor = Math.pow(p.drag, dt);
          p.vx *= dragFactor;
          p.vy *= dragFactor;
        }
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
        setRaf(requestAnimationFrame(tick));
      } else if (options.onDone) {
        options.onDone();
      }
    }

    setRaf(requestAnimationFrame(tick));
  }

  function playConfetti() {
    const main = document.querySelector(".main");
    const gridArea = document.querySelector(".grid-area");
    const heroSlot = document.querySelector(".win-hero-slot");
    if (!confettiEl || !main) return;

    stopConfetti();
    confettiEl.classList.add("is-playing");
    playConfettiInContainer(confettiEl, {
      topEl: gridArea,
      bottomEl: heroSlot,
      onRaf(id) {
        confettiRafId = id;
      },
      onDone() {
        stopConfetti();
      },
    });
  }

  function playSplashConfetti() {
    stopSplashConfetti();
    playConfettiInContainer(winSplashConfettiEl, {
      mode: "radial",
      originEl: winSplashImageEl || winSplashImageAreaEl,
      onRaf(id) {
        splashConfettiRafId = id;
      },
      onDone() {
        stopSplashConfetti();
      },
    });
  }

  function playOnboardingResultConfetti() {
    if (!confettiEl) return;
    const gridArea = document.querySelector("#game-main .grid-area");
    const heroSlot = document.querySelector(".win-hero-slot");
    stopConfetti();
    confettiEl.classList.add("is-playing");
    playConfettiInContainer(confettiEl, {
      topEl: gridArea,
      bottomEl: heroSlot,
      spawnYShiftRatio: 0.2,
      onRaf(id) {
        confettiRafId = id;
      },
      onDone() {
        stopConfetti();
      },
    });
  }

  function waitMs(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function createSkipGate() {
    let resolveFn = null;
    let skipped = false;
    const promise = new Promise((resolve) => {
      resolveFn = resolve;
    });
    return {
      promise,
      get skipped() {
        return skipped;
      },
      trigger() {
        if (skipped) return;
        skipped = true;
        resolveFn("skip");
      },
    };
  }

  function getSplashTitleHtml(attempts) {
    const line2 = {
      1: "с 1 попытки",
      2: "со 2 попытки",
      3: "с 3 попытки",
      4: "с 4 попытки",
      5: "с 5 попытки",
      6: "с 6 попытки",
    }[attempts];

    return `Отгадали<br />${line2 || "с 1 попытки"}`;
  }

  function getSplashSubtitleText(attempts) {
    const ranges = {
      1: [85, 99],
      2: [75, 84],
      3: [60, 74],
      4: [40, 59],
      5: [25, 39],
      6: [40, 60],
    };
    const range = ranges[attempts] || ranges[4];
    const value = range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));

    if (attempts === 6) {
      return `Всего ${value}% игроков смогли отгадать это слово`;
    }

    return `Быстрее ${value}% игроков`;
  }

  function positionWinSplash() {
    if (!winSplashEl) return;
    const app = document.querySelector(".app");
    const navRow = document.querySelector(".nav-row");
    if (!app || !navRow) return;

    const appRect = app.getBoundingClientRect();
    const navRect = navRow.getBoundingClientRect();
    const top = Math.max(0, Math.round(navRect.top - appRect.top));
    winSplashEl.style.setProperty("--win-splash-top", `${top}px`);
  }

  function resetWinSplashClasses() {
    if (!winSplashEl) return;
    winSplashEl.classList.remove(
      "is-open",
      "is-fading-in",
      "is-fading-out",
      "is-content-in",
      "is-content-out",
      "is-title-in",
      "win-splash--win",
      "win-splash--lose",
      "win-splash--thematic",
      "win-splash--notify",
      "win-splash--tasks",
      "is-progress-tick",
      "is-claim-in"
    );
    winSplashEl.style.removeProperty("--win-splash-title-gap");
    winSplashEl.style.removeProperty("--win-splash-subtitle-gap");
  }

  function setWinSplashMode(mode) {
    if (!winSplashEl) return;
    winSplashEl.classList.toggle("win-splash--win", mode === "win");
    winSplashEl.classList.toggle("win-splash--lose", mode === "lose");
    winSplashEl.classList.toggle("win-splash--thematic", mode === "thematic");
    winSplashEl.classList.toggle("win-splash--notify", mode === "notify");
    winSplashEl.classList.toggle("win-splash--tasks", mode === "tasks");
    if (winSplashBodyWinEl) winSplashBodyWinEl.hidden = mode !== "win";
    if (winSplashBodyLoseEl) winSplashBodyLoseEl.hidden = mode !== "lose";
    if (winSplashBodyThematicEl) {
      winSplashBodyThematicEl.hidden = mode !== "thematic";
    }
    if (winSplashBodyNotifyEl) {
      winSplashBodyNotifyEl.hidden = mode !== "notify";
    }
    if (winSplashBodyTasksEl) {
      winSplashBodyTasksEl.hidden = mode !== "tasks";
    }
  }

  function buildLoseAnswerCells() {
    if (!winSplashAnswerRowEl) return;

    winSplashAnswerRowEl.innerHTML = "";
    for (let col = 0; col < COLS; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerHTML =
        '<div class="cell-inner"><div class="cell-front"></div><div class="cell-back correct">' +
        (ANSWER[col] || "") +
        "</div></div>";
      winSplashAnswerRowEl.appendChild(cell);
    }
  }

  function layoutLoseAnswerRow() {
    if (!winSplashAnswerRowEl) return;

    const gap = 6;
    const availW = winSplashAnswerRowEl.clientWidth;
    if (availW <= 0) return;

    const cellSize = Math.max(
      1,
      Math.floor((availW - gap * (COLS - 1)) / COLS)
    );
    winSplashAnswerRowEl.style.setProperty("--cell-width", `${cellSize}px`);
    winSplashAnswerRowEl.style.setProperty("--cell-height", `${cellSize}px`);
  }

  function flipLoseAnswerCells() {
    if (!winSplashAnswerRowEl) {
      return Promise.resolve();
    }

    const inners = [
      ...winSplashAnswerRowEl.querySelectorAll(".cell-inner"),
    ];
    if (inners.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let completed = 0;
      inners.forEach((inner, col) => {
        window.setTimeout(() => {
          inner.classList.add("flipped");
          window.setTimeout(() => {
            completed += 1;
            if (completed === inners.length) {
              resolve();
            }
          }, FLIP_DURATION_MS);
        }, col * FLIP_STAGGER_MS);
      });
    });
  }

  function hideWinSplash() {
    stopSplashConfetti();
    resetWinSplashClasses();
    if (winSplashEl) {
      winSplashEl.hidden = true;
      winSplashEl.setAttribute("aria-hidden", "true");
    }
    if (winSplashAnswerRowEl) {
      winSplashAnswerRowEl.innerHTML = "";
      winSplashAnswerRowEl.style.removeProperty("--cell-width");
      winSplashAnswerRowEl.style.removeProperty("--cell-height");
    }
    if (winSplashBodyWinEl) winSplashBodyWinEl.hidden = false;
    if (winSplashBodyLoseEl) winSplashBodyLoseEl.hidden = true;
    if (winSplashBodyThematicEl) winSplashBodyThematicEl.hidden = true;
    if (winSplashBodyNotifyEl) winSplashBodyNotifyEl.hidden = true;
    if (winSplashBodyTasksEl) winSplashBodyTasksEl.hidden = true;
  }

  function fadeWinSplashIn() {
    return new Promise((resolve) => {
      if (!winSplashEl) {
        resolve();
        return;
      }

      winSplashEl.classList.remove("is-fading-out");
      winSplashEl.classList.add("is-open");
      void winSplashEl.offsetWidth;
      winSplashEl.classList.add("is-fading-in");

      window.setTimeout(resolve, WIN_SPLASH_FADE_MS);
    });
  }

  function fadeWinSplashOut() {
    return new Promise((resolve) => {
      if (!winSplashEl) {
        resolve();
        return;
      }

      winSplashEl.classList.remove("is-fading-in");
      winSplashEl.classList.add("is-fading-out");
      winSplashEl.classList.remove("is-open");

      const resultAtMs = Math.round(WIN_SPLASH_FADE_MS * WIN_SPLASH_RESULT_AT);
      window.setTimeout(resolve, resultAtMs);
      window.setTimeout(() => {
        hideWinSplash();
      }, WIN_SPLASH_FADE_MS);
    });
  }

  async function playThematicSplashAnimation(options = {}) {
    if (!winSplashEl) return;

    const { towardNext = false } = options;
    const skipGate = createSkipGate();
    const onSkip = (event) => {
      event.preventDefault();
      event.stopPropagation();
      skipGate.trigger();
    };

    setWinSplashMode("thematic");
    winSplashEl.classList.remove(
      "is-content-in",
      "is-content-out",
      "is-title-in",
      "is-progress-tick",
      "is-claim-in"
    );

    winSplashThematicSkipEl?.addEventListener("click", onSkip);

    try {
      requestAnimationFrame(() => {
        winSplashEl.classList.add("is-content-in");
      });

      await skipGate.promise;

      winSplashEl.classList.add("is-content-out");
      await waitMs(getSplashContentOutWaitMs(towardNext));
    } finally {
      winSplashThematicSkipEl?.removeEventListener("click", onSkip);
    }
  }

  async function playNotifySplashAnimation(options = {}) {
    if (!winSplashEl) return;

    const { towardNext = false } = options;
    const skipGate = createSkipGate();
    const onContinue = (event) => {
      event.preventDefault();
      event.stopPropagation();
      skipGate.trigger();
    };

    setWinSplashMode("notify");
    winSplashEl.classList.remove(
      "is-content-in",
      "is-content-out",
      "is-title-in",
      "is-progress-tick",
      "is-claim-in"
    );

    winSplashNotifyCtaEl?.addEventListener("click", onContinue);

    try {
      requestAnimationFrame(() => {
        winSplashEl.classList.add("is-content-in");
      });

      await skipGate.promise;

      winSplashEl.classList.add("is-content-out");
      await waitMs(getSplashContentOutWaitMs(towardNext));
    } finally {
      winSplashNotifyCtaEl?.removeEventListener("click", onContinue);
    }
  }

  function cubicBezierEase(t, x1, y1, x2, y2) {
    const epsilon = 1e-6;

    function sampleCurveX(aT) {
      return (
        3 * x1 * (1 - aT) * (1 - aT) * aT +
        3 * x2 * (1 - aT) * aT * aT +
        aT * aT * aT
      );
    }

    function sampleCurveY(aT) {
      return (
        3 * y1 * (1 - aT) * (1 - aT) * aT +
        3 * y2 * (1 - aT) * aT * aT +
        aT * aT * aT
      );
    }

    function sampleCurveDerivativeX(aT) {
      return (
        3 * x1 * (1 - aT) * (1 - aT) +
        6 * (x2 - x1) * (1 - aT) * aT +
        3 * (1 - x2) * aT * aT
      );
    }

    let aT = t;
    for (let i = 0; i < 8; i += 1) {
      const x = sampleCurveX(aT) - t;
      if (Math.abs(x) < epsilon) break;
      const d = sampleCurveDerivativeX(aT);
      if (Math.abs(d) < epsilon) break;
      aT -= x / d;
    }

    return sampleCurveY(Math.min(1, Math.max(0, aT)));
  }

  function resetTasksSplashCards() {
    if (!winSplashTasksListEl) return;

    winSplashTasksListEl.querySelectorAll(".tasks-splash-card").forEach((card) => {
      card.classList.remove("is-complete", "is-shimmer-ready");
      card.style.removeProperty("--tasks-shimmer-every");
      if (card._tasksShimmerTimer) {
        window.clearTimeout(card._tasksShimmerTimer);
        card._tasksShimmerTimer = 0;
      }
      const fill = card.querySelector(".tasks-splash-card__progress-fill");
      const left = card.querySelector(".tasks-splash-card__progress-left");
      const right = card.querySelector(".tasks-splash-card__progress-right");

      if (fill?.dataset.progressFrom) {
        fill.style.width = `${fill.dataset.progressFrom}%`;
      }

      if (left) {
        left.textContent = left.dataset.leftFrom || left.textContent;
        delete left.dataset.rollReady;
      }

      if (right) {
        if (right.dataset.countFrom && right.dataset.countTotal) {
          right.textContent = `${right.dataset.countFrom} / ${right.dataset.countTotal}`;
        }
        delete right.dataset.rollReady;
      }
    });
  }

  function ensureTasksRollHost(el, initialText) {
    if (!el) return null;
    if (el.dataset.rollReady === "1") {
      return el.querySelector(".tasks-splash-card__roll-track");
    }

    el.textContent = "";
    el.dataset.rollReady = "1";
    const track = document.createElement("span");
    track.className = "tasks-splash-card__roll-track";
    const item = document.createElement("span");
    item.className = "tasks-splash-card__roll-item";
    item.textContent = initialText;
    track.appendChild(item);
    el.appendChild(track);
    return track;
  }

  function rollTasksSplashText(el, nextText) {
    return new Promise((resolve) => {
      if (!el) {
        resolve();
        return;
      }

      const track = ensureTasksRollHost(el, el.textContent.trim() || nextText);
      if (!track) {
        resolve();
        return;
      }

      let current = track.querySelector(".tasks-splash-card__roll-item:last-child");
      if (!current) {
        current = document.createElement("span");
        current.className = "tasks-splash-card__roll-item";
        current.textContent = nextText;
        track.appendChild(current);
      }

      if (current.textContent === nextText) {
        resolve();
        return;
      }

      if (track.children.length > 1) {
        track.style.transition = "none";
        track.classList.remove("is-rolling");
        track.replaceChildren(current);
        void track.offsetWidth;
        track.style.transition = "";
      }

      const next = document.createElement("span");
      next.className = "tasks-splash-card__roll-item";
      next.textContent = nextText;
      track.appendChild(next);

      requestAnimationFrame(() => {
        track.classList.add("is-rolling");
      });

      const onEnd = (event) => {
        if (event.target !== track || event.propertyName !== "transform") return;
        track.removeEventListener("transitionend", onEnd);
        track.style.transition = "none";
        track.classList.remove("is-rolling");
        track.replaceChildren(next);
        void track.offsetWidth;
        track.style.transition = "";
        resolve();
      };

      track.addEventListener("transitionend", onEnd);
    });
  }

  function syncTasksSplashCoinBadge() {
    if (winSplashTasksCoinValueEl) {
      winSplashTasksCoinValueEl.textContent = String(coinBalance);
    }
  }

  function spawnTasksProgressTipSparks(fill) {
    const progress = fill?.closest(".tasks-splash-card__progress");
    if (!progress || !fill) return;

    const fillRect = fill.getBoundingClientRect();
    const hostRect = progress.getBoundingClientRect();
    if (!fillRect.width || !hostRect.width) return;

    const tipX = fillRect.right - hostRect.left;
    const tipY = fillRect.top + fillRect.height / 2 - hostRect.top;
    spawnTasksProgressOutwardSparks(progress, tipX, tipY, {
      count: 1 + Math.floor(Math.random() * 2),
      distanceMin: 6,
      distanceMax: 16,
    });
  }

  function spawnTasksProgressOutwardSparks(progress, x, y, opts = {}) {
    if (!progress) return;

    const count = opts.count ?? 2;
    const distanceMin = opts.distanceMin ?? 8;
    const distanceMax = opts.distanceMax ?? 18;

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.className =
        "win-progress__prize-particle win-progress__prize-particle--spark";
      particle.setAttribute("aria-hidden", "true");

      const side = Math.random() < 0.5 ? -1 : 1;
      const angle =
        side * (Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * 0.7);
      const distance = distanceMin + Math.random() * (distanceMax - distanceMin);
      const size = 2 + Math.random() * 2.5;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
      particle.style.background =
        PRIZE_PARTICLE_COLORS[Math.floor(Math.random() * PRIZE_PARTICLE_COLORS.length)];
      particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
      particle.style.animationDuration = `${0.4 + Math.random() * 0.3}s`;

      progress.appendChild(particle);
      particle.addEventListener(
        "animationend",
        () => {
          particle.remove();
        },
        { once: true }
      );
    }
  }

  function runTasksSplashProgressSweep() {
    return new Promise((resolve) => {
      if (!winSplashTasksListEl) {
        resolve();
        return;
      }

      const progresses = [
        ...winSplashTasksListEl.querySelectorAll(".tasks-splash-card__progress"),
      ];
      if (!progresses.length) {
        resolve();
        return;
      }

      let remaining = progresses.length;
      const doneOne = () => {
        remaining -= 1;
        if (remaining <= 0) resolve();
      };

      progresses.forEach((progress) => {
        const fill = progress.querySelector(".tasks-splash-card__progress-fill");
        if (!fill) {
          doneOne();
          return;
        }

        const travelX = fill.offsetWidth;
        if (travelX <= 0) {
          doneOne();
          return;
        }

        progress
          .querySelectorAll(".tasks-splash-card__progress-sweep")
          .forEach((node) => node.remove());
        fill
          .querySelectorAll(".tasks-splash-card__progress-sweep")
          .forEach((node) => node.remove());

        const startX = fill.offsetLeft;
        const endX = startX + travelX;
        const sparkY = fill.offsetTop + fill.offsetHeight / 2;

        const spark = document.createElement("span");
        spark.className = "tasks-splash-card__progress-sweep is-running";
        spark.setAttribute("aria-hidden", "true");
        spark.style.left = `${startX}px`;
        spark.style.top = `${sparkY}px`;
        progress.appendChild(spark);

        const start = performance.now();
        let lastBurstAt = 0;
        let finished = false;

        const finish = () => {
          if (finished) return;
          finished = true;
          spark.remove();
          doneOne();
        };

        const tick = (now) => {
          if (finished) return;

          const t = Math.min(1, (now - start) / WIN_SPLASH_TASKS_SWEEP_MS);
          const x = startX + (endX - startX) * t;
          spark.style.left = `${x}px`;

          if (now - lastBurstAt >= 40) {
            lastBurstAt = now;
            spawnTasksProgressOutwardSparks(progress, x, sparkY, {
              count: 2 + Math.floor(Math.random() * 2),
              distanceMin: 8,
              distanceMax: 20,
            });
          }

          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            spawnTasksProgressOutwardSparks(progress, endX, sparkY, {
              count: 3,
              distanceMin: 10,
              distanceMax: 22,
            });
            finish();
          }
        };

        requestAnimationFrame(tick);
      });
    });
  }

  function runTasksSplashProgressTick() {
    return new Promise((resolve) => {
      if (!winSplashEl || !winSplashTasksListEl) {
        resolve();
        return;
      }

      const cards = [
        ...winSplashTasksListEl.querySelectorAll(".tasks-splash-card"),
      ];
      const animating = cards
        .map((card) => {
          const fill = card.querySelector(".tasks-splash-card__progress-fill");
          const left = card.querySelector(".tasks-splash-card__progress-left");
          const right = card.querySelector(".tasks-splash-card__progress-right");
          if (!fill?.dataset.progressTo) return null;
          return {
            card,
            fill,
            left,
            right,
            from: Number(fill.dataset.progressFrom) || 0,
            to: Number(fill.dataset.progressTo) || 0,
            countFrom: Number(right?.dataset.countFrom),
            countTo: Number(right?.dataset.countTo),
            countTotal: right?.dataset.countTotal || "",
            leftFrom: left?.dataset.leftFrom || "",
            leftTo: left?.dataset.leftTo || "",
            complete: card.dataset.tasksCard === "2",
          };
        })
        .filter(Boolean);

      winSplashEl.classList.add("is-progress-tick");

      animating.forEach((item) => {
        const rightStart =
          Number.isFinite(item.countFrom) && item.countTotal
            ? `${item.countFrom} / ${item.countTotal}`
            : item.right?.textContent?.trim() || "";
        const leftStart = item.leftFrom || item.left?.textContent?.trim() || "";

        if (item.right) {
          ensureTasksRollHost(item.right, rightStart);
          item.lastCount = item.countFrom;
        }
        if (item.left) {
          ensureTasksRollHost(item.left, leftStart);
          item.leftRolled = false;
        }

        item.fill.style.width = `${item.to}%`;
        if (item.complete) {
          item.rewardReady = false;
        }
      });

      const start = performance.now();
      const x1 = 0.45;
      const y1 = 1.45;
      const x2 = 0.8;
      const y2 = 1;
      let lastTipSparkAt = 0;

      function markRewardReady(item) {
        if (!item.complete || item.rewardReady) return;
        item.rewardReady = true;
        item.card.classList.add("is-complete");
        const sparksHost = item.card.querySelector("[data-tasks-sparks]");
        if (sparksHost) {
          spawnPrizeParticles(sparksHost, {
            sparkOnly: true,
            particleScale: 1,
            randomOrigin: true,
            originInsetX: 10,
            originSpanX: 80,
            originInsetY: 15,
            originSpanY: 70,
          });
        }

        if (item.card._tasksShimmerTimer) {
          window.clearTimeout(item.card._tasksShimmerTimer);
        }
        item.card.style.setProperty(
          "--tasks-shimmer-every",
          `${WIN_SPLASH_TASKS_SHIMMER_EVERY_MS}ms`
        );
        item.card._tasksShimmerTimer = window.setTimeout(() => {
          item.card.classList.add("is-shimmer-ready");
          item.card._tasksShimmerTimer = 0;
        }, WIN_SPLASH_TASKS_SHIMMER_DELAY_MS);
      }

      function tick(now) {
        const t = Math.min(1, (now - start) / WIN_SPLASH_TASKS_PROGRESS_MS);
        const eased = cubicBezierEase(t, x1, y1, x2, y2);

        if (now - lastTipSparkAt >= 55) {
          lastTipSparkAt = now;
          animating.forEach((item) => {
            spawnTasksProgressTipSparks(item.fill);
          });
        }

        animating.forEach((item) => {
          const progressPct = item.from + (item.to - item.from) * eased;

          if (
            item.right &&
            Number.isFinite(item.countFrom) &&
            Number.isFinite(item.countTo)
          ) {
            const value = Math.round(
              item.countFrom + (item.countTo - item.countFrom) * eased
            );
            if (value !== item.lastCount) {
              item.lastCount = value;
              void rollTasksSplashText(
                item.right,
                `${value} / ${item.countTotal}`
              );
            }
          }

          if (
            item.complete &&
            item.left &&
            item.leftTo &&
            !item.leftRolled &&
            eased >= 0.45
          ) {
            item.leftRolled = true;
            void rollTasksSplashText(item.left, item.leftTo);
          }

          if (item.complete && progressPct >= item.to) {
            markRewardReady(item);
          }
        });

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          animating.forEach((item) => {
            markRewardReady(item);
          });
          Promise.all(
            animating.map(async (item) => {
              if (
                item.right &&
                Number.isFinite(item.countTo) &&
                item.countTotal
              ) {
                await rollTasksSplashText(
                  item.right,
                  `${item.countTo} / ${item.countTotal}`
                );
              }
              if (item.complete && item.left && item.leftTo && !item.leftRolled) {
                item.leftRolled = true;
                await rollTasksSplashText(item.left, item.leftTo);
              }
            })
          ).then(resolve);
        }
      }

      requestAnimationFrame(tick);
    });
  }

  async function playTasksProgressSplashAnimation() {
    if (!winSplashEl) return;

    const skipGate = createSkipGate();
    let claiming = false;

    const onClaim = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (claiming || skipGate.skipped) return;
      claiming = true;

      const splashCoinIcon = document.querySelector(
        "#win-splash-tasks-coin-badge .energy-badge__icon"
      );
      const coinFly = winSplashTasksClaimIconEl
        ? runCoinsToBadgeAnimation(winSplashTasksClaimIconEl, {
            targetIcon: splashCoinIcon,
          })
        : null;

      await (coinFly?.halfway ?? Promise.resolve());
      await (coinFly?.firstArrival ?? Promise.resolve()).then(() =>
        animateCoinBadgeCounter(TASK_REWARD_COIN_AMOUNT)
      );
      skipGate.trigger();
    };

    setWinSplashMode("tasks");
    winSplashEl.classList.remove(
      "is-content-in",
      "is-content-out",
      "is-title-in",
      "is-progress-tick",
      "is-claim-in"
    );
    resetTasksSplashCards();
    syncTasksSplashCoinBadge();

    winSplashTasksCtaEl?.addEventListener("click", onClaim);

    try {
      requestAnimationFrame(() => {
        winSplashEl.classList.add("is-content-in");
      });

      const progressAtMs = Math.round(
        WIN_SPLASH_TASKS_CONTENT_MS * WIN_SPLASH_TASKS_PROGRESS_AT
      );
      const buttonAtMs =
        WIN_SPLASH_TASKS_CONTENT_MS + WIN_SPLASH_TASKS_PROGRESS_DELAY_MS;

      await waitMs(progressAtMs);
      await runTasksSplashProgressSweep();
      const progressPromise = runTasksSplashProgressTick();

      await waitMs(
        Math.max(0, buttonAtMs - progressAtMs - WIN_SPLASH_TASKS_SWEEP_MS)
      );
      winSplashEl.classList.add("is-claim-in");

      await Promise.all([
        progressPromise,
        waitMs(WIN_SPLASH_TASKS_PROGRESS_MS),
      ]);

      await skipGate.promise;

      winSplashEl.classList.add("is-content-out");
      await waitMs(getSplashContentOutWaitMs(false));
    } finally {
      winSplashTasksCtaEl?.removeEventListener("click", onClaim);
    }
  }

  function willShowSecondarySplash() {
    return (
      isThematicWordEnabled() ||
      (isNotifySplashEnabled() &&
        Boolean(winSplashEl?.classList.contains("win-splash--win")))
    );
  }

  function willShowTasksProgressSplash() {
    return isTasksProgressSplashEnabled();
  }

  function willShowFollowUpSplash() {
    return willShowSecondarySplash() || willShowTasksProgressSplash();
  }

  function getSplashContentOutWaitMs(towardSecondary) {
    if (towardSecondary) {
      return Math.round(WIN_SPLASH_CONTENT_OUT_MS * WIN_SPLASH_SECONDARY_AT);
    }
    return Math.round(WIN_SPLASH_CONTENT_OUT_MS * WIN_SPLASH_RESULT_AT);
  }

  async function finishSplashTowardResult(normalWordPromise, options = {}) {
    const { contentAlreadyOut = false } = options;

    stopSplashConfetti();

    const showSecondarySplash = willShowSecondarySplash();
    const showTasksSplash = willShowTasksProgressSplash();
    const showFollowUp = showSecondarySplash || showTasksSplash;

    if (showFollowUp) {
      if (
        !contentAlreadyOut &&
        winSplashEl?.classList.contains("is-content-in") &&
        !winSplashEl.classList.contains("is-content-out")
      ) {
        winSplashEl.classList.add("is-content-out");
        await waitMs(getSplashContentOutWaitMs(true));
      }

      if (isThematicWordEnabled()) {
        await playThematicSplashAnimation({ towardNext: showTasksSplash });
      } else if (showSecondarySplash) {
        await playNotifySplashAnimation({ towardNext: showTasksSplash });
      }

      if (showTasksSplash) {
        await playTasksProgressSplashAnimation();
      }
    }

    await fadeWinSplashOut();

    if (normalWordPromise) {
      await normalWordPromise;
    } else {
      await playNormalWordAnimation();
    }
  }

  async function playWinSplashAnimation() {
    if (!winSplashEl) return;

    const attempts = lastResultAttempts || 1;
    const skipGate = createSkipGate();
    const onSkip = () => skipGate.trigger();
    const detachSkip = () => {
      winSplashSkipEl?.removeEventListener("click", onSkip);
    };

    isAnimating = true;
    updateActionKeys();

    positionWinSplash();
    if (winSplashTitleEl) {
      winSplashTitleEl.innerHTML = getSplashTitleHtml(attempts);
    }
    if (winSplashSubtitleEl) {
      winSplashSubtitleEl.textContent = getSplashSubtitleText(attempts);
    }

    resetWinSplashClasses();
    setWinSplashMode("win");
    winSplashEl.hidden = false;
    winSplashEl.setAttribute("aria-hidden", "false");

    winSplashSkipEl?.addEventListener("click", onSkip);

    const raceSkip = async (ms) => {
      const result = await Promise.race([
        waitMs(ms).then(() => "done"),
        skipGate.promise,
      ]);
      return result === "skip";
    };

    const finishEarly = async (normalWordPromise) => {
      detachSkip();
      await finishSplashTowardResult(normalWordPromise);
    };

    try {
      const fadeInPromise = fadeWinSplashIn();
      if (
        (await Promise.race([
          fadeInPromise.then(() => "done"),
          skipGate.promise,
        ])) === "skip"
      ) {
        await finishEarly(null);
        return;
      }

      if (await raceSkip(WIN_SPLASH_CONTENT_DELAY_MS)) {
        await finishEarly(null);
        return;
      }

      const normalWordPromise = playNormalWordAnimation();

      requestAnimationFrame(() => {
        winSplashEl.classList.add("is-content-in");
      });

      const titleAtMs = Math.round(WIN_SPLASH_CONTENT_MS * WIN_SPLASH_TITLE_AT);
      const confettiAtMs = Math.round(
        WIN_SPLASH_CONTENT_MS * WIN_SPLASH_CONFETTI_AT
      );

      if (await raceSkip(confettiAtMs)) {
        await finishEarly(normalWordPromise);
        return;
      }

      playSplashConfetti();

      if (await raceSkip(Math.max(0, titleAtMs - confettiAtMs))) {
        await finishEarly(normalWordPromise);
        return;
      }

      winSplashEl.classList.add("is-title-in");

      if (await raceSkip(WIN_SPLASH_TITLE_MS)) {
        await finishEarly(normalWordPromise);
        return;
      }

      await skipGate.promise;
      detachSkip();

      winSplashEl.classList.add("is-content-out");
      stopSplashConfetti();
      await waitMs(getSplashContentOutWaitMs(willShowFollowUpSplash()));

      await finishSplashTowardResult(normalWordPromise, {
        contentAlreadyOut: true,
      });
    } finally {
      detachSkip();
    }
  }

  async function playLoseSplashAnimation() {
    if (!winSplashEl) return;

    const skipGate = createSkipGate();
    const onSkip = () => skipGate.trigger();
    const detachSkip = () => {
      winSplashEl.removeEventListener("click", onSkip);
    };
    const flipTotalMs =
      (COLS - 1) * FLIP_STAGGER_MS + FLIP_DURATION_MS;

    isAnimating = true;
    updateActionKeys();

    positionWinSplash();
    resetWinSplashClasses();
    setWinSplashMode("lose");
    buildLoseAnswerCells();

    winSplashEl.hidden = false;
    winSplashEl.setAttribute("aria-hidden", "false");
    layoutLoseAnswerRow();

    winSplashEl.addEventListener("click", onSkip);

    const raceSkip = async (ms) => {
      const result = await Promise.race([
        waitMs(ms).then(() => "done"),
        skipGate.promise,
      ]);
      return result === "skip";
    };

    const finishEarly = async (normalWordPromise) => {
      detachSkip();
      await finishSplashTowardResult(normalWordPromise);
    };

    try {
      const fadeInPromise = fadeWinSplashIn();
      if (
        (await Promise.race([
          fadeInPromise.then(() => "done"),
          skipGate.promise,
        ])) === "skip"
      ) {
        await finishEarly(null);
        return;
      }

      if (await raceSkip(WIN_SPLASH_CONTENT_DELAY_MS)) {
        await finishEarly(null);
        return;
      }

      const normalWordPromise = playNormalWordAnimation();

      requestAnimationFrame(() => {
        layoutLoseAnswerRow();
        winSplashEl.classList.add("is-content-in");
      });

      if (await raceSkip(WIN_SPLASH_CONTENT_MS)) {
        await finishEarly(normalWordPromise);
        return;
      }

      if (await raceSkip(LOSE_SPLASH_FLIP_DELAY_MS)) {
        await finishEarly(normalWordPromise);
        return;
      }

      flipLoseAnswerCells();

      if (await raceSkip(flipTotalMs)) {
        await finishEarly(normalWordPromise);
        return;
      }

      await skipGate.promise;
      detachSkip();

      winSplashEl.classList.add("is-content-out");
      await waitMs(getSplashContentOutWaitMs(willShowFollowUpSplash()));

      await finishSplashTowardResult(normalWordPromise, {
        contentAlreadyOut: true,
      });
    } finally {
      detachSkip();
    }
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

  function getGridVisualRect() {
    if (!gridEl) return null;
    const firstCell = gridEl.querySelector(".cell");
    const lastCell = gridEl.querySelector(".grid-row:last-child .cell:last-child");
    if (!firstCell || !lastCell) return null;
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    return {
      top: firstRect.top,
      left: firstRect.left,
      width: lastRect.right - firstRect.left,
      height: lastRect.bottom - firstRect.top,
    };
  }

  function clearGridFlipTransform() {
    if (!gridEl) return;
    gridEl.style.removeProperty("transition");
    gridEl.style.removeProperty("transform");
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

      const gridArea =
        document.querySelector("#game-main .grid-area") ??
        document.querySelector(".grid-area");
      if (gridArea) {
        savedGameCellWidth = gridArea.style.getPropertyValue("--cell-width");
        savedGameCellHeight = gridArea.style.getPropertyValue("--cell-height");
      }

      const mainRect = main.getBoundingClientRect();
      const kbRect = kbEl.getBoundingClientRect();
      const frameRect = frameEl?.getBoundingClientRect();
      const firstGridRect = getGridVisualRect();
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
          syncActivePrizePosition();
        });
        const panelOffset = winPanelEl.offsetHeight;
        app.style.setProperty("--win-panel-offset", `${panelOffset}px`);
      }

      void kbEl.offsetHeight;
      layoutMiniGrid();

      const lastGridRect = getGridVisualRect();
      if (gridEl && firstGridRect && lastGridRect) {
        const dx = firstGridRect.left - lastGridRect.left;
        const dy = firstGridRect.top - lastGridRect.top;
        gridEl.style.transition = "none";
        gridEl.style.transform = `translate(${dx}px, ${dy}px)`;
        void gridEl.offsetWidth;
      }

      app.classList.add("is-animating-normal-word");

      requestAnimationFrame(() => {
        if (gridEl) {
          gridEl.style.removeProperty("transition");
          gridEl.style.transform = "none";
        }
        app.classList.add("scenario-normal-word");
      });

      window.setTimeout(() => {
        app.classList.remove("is-animating-normal-word");
        clearGridFlipTransform();
        isAnimating = false;
        updateActionKeys();
        layoutMiniGrid();
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
        isAnimating = false;
        updateActionKeys();
        resolve();
      }, WIN_HERO_MS);
    });
  }

  function playReverseNormalWordAnimation() {
    return new Promise((resolve) => {
      closeResultSheet({ animateClose: false });
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

      const firstGridRect = getGridVisualRect();

      app.style.setProperty("--reverse-kb-reserve", `${kbEl.offsetHeight}px`);
      if (gridEl) {
        gridEl.style.transition = "none";
      }
      app.classList.add("is-animating-reverse-normal-word");

      const lastGridRect = getGridVisualRect();
      if (gridEl && firstGridRect && lastGridRect) {
        const dx = firstGridRect.left - lastGridRect.left;
        const dy = firstGridRect.top - lastGridRect.top;
        gridEl.style.transform = `translate(${dx}px, ${dy}px)`;
        void gridEl.offsetWidth;
      }

      requestAnimationFrame(() => {
        if (gridEl) {
          gridEl.style.removeProperty("transition");
          gridEl.style.transform = "none";
        }
        app.classList.add("is-returning-to-game");
      });

      window.setTimeout(() => {
        app.classList.remove(
          "is-animating-reverse-normal-word",
          "is-returning-to-game",
          "scenario-normal-word"
        );
        app.style.removeProperty("--reverse-kb-reserve");
        clearGridFlipTransform();

        if (winPanelEl) {
          winPanelEl.hidden = true;
        }

        setMainScrollable(false);
        resolve();
      }, REVERSE_NORMAL_WORD_MS);
    });
  }

  function resetGameState() {
    closeResultSheet({ animateClose: false });
    const app = document.querySelector(".app");
    app?.classList.remove(
      "scenario-normal-word",
      "scenario-win-hero",
      "scenario-thematic-word",
      "scenario-word-not-guessed",
      "scenario-onboarding-result",
      "keyboard-detached",
      "is-animating-reverse-win-hero",
      "is-animating-reverse-normal-word",
      "is-returning-to-game"
    );
    app?.style.removeProperty("--kb-bottom");
    app?.style.removeProperty("--kb-hide-y");
    app?.style.removeProperty("--win-panel-offset");
    app?.style.removeProperty("--reverse-kb-reserve");

    curRow = 0;
    curCol = 0;
    gameOver = false;
    isWordNotGuessedActive = false;
    lastResultAttempts = null;
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
    clearOnboardingResultChrome();
    resetWinProgress();
    applyWinResultContent();
    isAnimating = false;
    updateLayout();
    updateActionKeys();
    updateMainScrollFade();
  }

  async function playAgain() {
    const app = document.querySelector(".app");
    if (app?.classList.contains("scenario-onboarding-result")) {
      void closeOnboarding();
      return;
    }
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
      lastResultAttempts = curRow + 1;
      applyWinResultContent();
      await playWinScaleAnimation(curRow);
      await playWinSplashAnimation();
      await playWinHeroAnimation(guess);
      updateActionKeys();
      return;
    }

    curRow += 1;
    curCol = 0;

    if (curRow >= ROWS) {
      gameOver = true;
      isWordNotGuessedActive = true;
      lastResultAttempts = null;
      prepareWordNotGuessedProgress();
      applyWinResultContent();
      await playLoseSplashAnimation();
      await playWinHeroAnimation(null);
      updateActionKeys();
      return;
    }

    updateActionKeys();
  }

  function onKey(ch) {
    if (onboardingActive) return;
    if (gameOver || isAnimating || curRow >= ROWS) return;

    triggerHaptic(HAPTIC_KEY_MS);

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
    if (onboardingActive) {
      if (key === "ENTER") onboardingOnKey("✓");
      else if (key === "BACKSPACE") onboardingOnKey("⌫");
      else if (/^[А-ЯЁ]$/.test(key)) onboardingOnKey(key);
      return;
    }

    if (key === "ENTER") onKey("✓");
    else if (key === "BACKSPACE") onKey("⌫");
    else if (/^[А-ЯЁ]$/.test(key)) onKey(key);
  });

  scenarioSelectEl?.addEventListener("change", markProfileSettingsDirty);
  thematicWordSwitchEl?.addEventListener("change", () => {
    if (thematicWordSwitchEl.checked && notifySplashSwitchEl?.checked) {
      notifySplashSwitchEl.checked = false;
    }
    markProfileSettingsDirty();
  });
  notifySplashSwitchEl?.addEventListener("change", () => {
    if (notifySplashSwitchEl.checked && thematicWordSwitchEl?.checked) {
      thematicWordSwitchEl.checked = false;
    }
    markProfileSettingsDirty();
  });
  tasksProgressSplashSwitchEl?.addEventListener(
    "change",
    markProfileSettingsDirty
  );
  raffleSectionSwitchEl?.addEventListener("change", () => {
    const preservedCoins = coinBalance;
    resetRaffleProgress();
    setCoinBalance(preservedCoins);
    applyRaffleSectionVisibility();
  });
  raffleResetProgressBtnEl?.addEventListener("click", resetRaffleProgress);
  startOnboardingBtnEl?.addEventListener("click", () => {
    void startOnboarding();
  });
  onboardingCloseBtnEl?.addEventListener("click", () => {
    void closeOnboarding();
  });
  document.querySelector(".app > .header .close-btn")?.addEventListener("click", () => {
    if (!isOnboardingSession()) return;
    void closeOnboarding();
  });
  onboardingIntroActionEl?.addEventListener("click", () => {
    void handleOnboardingIntroAction();
  });
  onboardingIntroBackEl?.addEventListener("click", () => {
    void goOnboardingIntroStep(0);
  });
  onboardingInfoBtnEl?.addEventListener("click", (event) => {
    event.preventDefault();
    openOnboardingRulesSheet();
  });
  winSplashShareEl?.addEventListener("click", (event) => {
    event.preventDefault();
  });
  winSplashThematicCtaEl?.addEventListener("click", (event) => {
    event.preventDefault();
  });

  buildGrid();
  buildKeyboard();
  buildOnboardingGrid();
  buildOnboardingKeyboard();
  updateOnboardingActionKeys();
  initTabBar();
  initPrizesSegment();
  applyRaffleSectionVisibility();
  preventMobileZoomGestures();
  applyWinResultContent();
  syncFrameViewportHeight();
  updateLayout();
  updateActionKeys();
  renderWinProgress();
  mountPrizeForPanel(winProgressPanelEl, { hidden: false });
  syncActivePrizePosition();
  initRaffleCarousel();
  initResultSheet();
  initTaskSheet();
  initOnboardingNotifySheet();
  initOnboardingRulesSheet();
  frameEl?.addEventListener("pointerdown", handleEnergyHintPointerDown, true);
  resetRaffleProgress();
  updateMainScrollFade();
  updateRaffleScrollFade();

  mainEl?.addEventListener("scroll", updateMainScrollFade, { passive: true });
  rafflePageEl?.addEventListener("scroll", updateRaffleScrollFade, { passive: true });
  prizesPageEl?.addEventListener("scroll", updatePrizesScrollFade, {
    passive: true,
  });
  updatePrizesScrollFade();
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
