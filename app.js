const DAYS = [
  {
    title: 'Day 1: Put Basics + Direction',
    time: '8 min',
    points: ['Call vs Put payoff', 'Why puts gain when price falls', 'IV can help or hurt your put premium'],
    recap: ['Long put = bearish + paid premium only', 'Need move + timing', 'IV crush can hurt even if direction was right'],
    quiz: [
      { q: 'A long put profits most when:', a: 'under', opts: ['Stock goes up sharply', 'Stock stays flat', 'Stock moves under your strike and keeps falling'] },
      { q: 'Big risk with buying puts:', a: 'time', opts: ['Unlimited loss', 'Time decay if move is slow', 'No liquidity ever'] }
    ]
  },
  {
    title: 'Day 2: Risk-Defined Bear Put Spread',
    time: '10 min',
    points: ['Buy higher-strike put, sell lower-strike put', 'Lower cost and lower max profit', 'Best when expecting moderate downside'],
    recap: ['Spread caps both risk and reward', 'Good when bearish, not crash-expectation', 'Cheaper than naked long put'],
    quiz: [
      { q: 'Bear put spread lowers:', a: 'cost', opts: ['Cost and vega exposure', 'Need for any analysis', 'Directional exposure completely'] },
      { q: 'Max loss is usually:', a: 'debit', opts: ['Unlimited', 'Initial debit paid', 'Twice the stock price'] }
    ]
  },
  {
    title: 'Day 3: Entry Framework for AMD Short Bias',
    time: '10 min',
    points: ['Map key support/resistance', 'Wait for breakdown + failed retest', 'Pair with market weakness (QQQ/SOX)'],
    recap: ['Don’t front-run breakdowns', 'Need confirmation from market context', 'Define invalidation before entry'],
    quiz: [
      { q: 'Best confirmation for short bias:', a: 'break', opts: ['Green candle above resistance', 'Support break with weak retest', 'Any random red candle'] },
      { q: 'Invalidation should be:', a: 'defined', opts: ['Skipped', 'Defined before entry', 'Decided after losses'] }
    ]
  },
  {
    title: 'Day 4: Position Size + Exits',
    time: '9 min',
    points: ['Risk small per trade', 'Take partials at planned levels', 'Exit if thesis invalidates, not by hope'],
    recap: ['Keep risk fixed and small', 'Trim into weakness instead of guessing bottoms', 'Invalidation beats emotion'],
    quiz: [
      { q: 'Good risk habit:', a: 'small', opts: ['All-in conviction', 'Small fixed risk per idea', 'Doubling after losses'] },
      { q: 'If invalidation hits:', a: 'exit', opts: ['Hold and pray', 'Add more instantly', 'Exit according to plan'] }
    ]
  },
  {
    title: 'Day 5: Pre-Trade Checklist for Next Week',
    time: '10 min',
    points: ['Catalyst calendar checked', 'Liquidity + spreads acceptable', 'Plan written before order'],
    recap: ['No checklist = no trade', 'Execution quality matters', 'Protect capital first'],
    quiz: [
      { q: 'Before placing AMD trade:', a: 'checklist', opts: ['Enter quickly', 'Run checklist and define exits', 'Ignore spread quality'] },
      { q: 'Primary goal next week:', a: 'process', opts: ['Maximum PnL', 'Process quality + risk control', 'Trade every day no matter what'] }
    ]
  }
];

const daySelect = document.getElementById('daySelect');
const lessonEl = document.getElementById('lesson');
const quizEl = document.getElementById('quiz');
const streakText = document.getElementById('streakText');
const quizResult = document.getElementById('quizResult');
const journal = document.getElementById('journal');
const unlockInfo = document.getElementById('unlockInfo');
const recapText = document.getElementById('recapText');

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getStartDay() {
  const existing = localStorage.getItem('options_start_day');
  if (existing) return existing;
  const now = todayKey();
  localStorage.setItem('options_start_day', now);
  return now;
}

function getUnlockedCount() {
  const start = new Date(`${getStartDay()}T00:00:00Z`);
  const now = new Date(`${todayKey()}T00:00:00Z`);
  const elapsed = Math.floor((now - start) / 86400000);
  return Math.max(1, Math.min(DAYS.length, elapsed + 1));
}

function getCurrentDayIndex() {
  const saved = Number(localStorage.getItem('options_current_day') || 0);
  return Math.min(saved, getUnlockedCount() - 1);
}

function populateDaySelect() {
  const unlocked = getUnlockedCount();
  daySelect.innerHTML = '';
  DAYS.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i < unlocked ? d.title : `${d.title} (locked)`;
    opt.disabled = i >= unlocked;
    daySelect.appendChild(opt);
  });
  unlockInfo.textContent = `Unlocked today: Day 1 to Day ${unlocked}. New day unlocks every 24h.`;
}

function renderDay(i) {
  const d = DAYS[i];
  lessonEl.innerHTML = `<h3>${d.title}</h3><p>${d.time}</p><ul>${d.points.map(p => `<li>${p}</li>`).join('')}</ul>`;
  quizEl.innerHTML = d.quiz.map((item, idx) => `
    <div>
      <p><strong>Q${idx + 1}.</strong> ${item.q}</p>
      ${item.opts.map((o, oi) => `<label><input type="radio" name="q${idx}" value="${oi}"> ${o}</label>`).join('<br>')}
    </div>
  `).join('<hr>');
  recapText.textContent = '';
  quizResult.textContent = '';
  localStorage.setItem('options_current_day', String(i));
}

function getStreak() {
  return Number(localStorage.getItem('options_streak') || 0);
}

function setStreak(n) {
  localStorage.setItem('options_streak', String(n));
  streakText.textContent = `Completion count: ${n}`;
}

function isCorrect(answerKey, picked) {
  return (
    (answerKey === 'under' && picked.includes('under your strike')) ||
    (answerKey === 'time' && picked.includes('Time decay')) ||
    (answerKey === 'cost' && picked.includes('Cost and vega')) ||
    (answerKey === 'debit' && picked.includes('Initial debit')) ||
    (answerKey === 'break' && picked.includes('Support break')) ||
    (answerKey === 'defined' && picked.includes('Defined before entry')) ||
    (answerKey === 'small' && picked.includes('Small fixed risk')) ||
    (answerKey === 'exit' && picked.includes('Exit according to plan')) ||
    (answerKey === 'checklist' && picked.includes('Run checklist')) ||
    (answerKey === 'process' && picked.includes('Process quality'))
  );
}

daySelect.addEventListener('change', e => renderDay(Number(e.target.value)));

document.getElementById('completeBtn').addEventListener('click', () => {
  setStreak(getStreak() + 1);
});

document.getElementById('recapBtn').addEventListener('click', () => {
  const d = DAYS[Number(daySelect.value)];
  recapText.textContent = `2-min recap: ${d.recap.join(' • ')}`;
});

document.getElementById('checkQuiz').addEventListener('click', () => {
  const d = DAYS[Number(daySelect.value)];
  let correct = 0;
  d.quiz.forEach((item, idx) => {
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    const picked = selected ? item.opts[Number(selected.value)] : '';
    if (isCorrect(item.a, picked)) correct++;
  });

  quizResult.textContent = `Score: ${correct}/${d.quiz.length}`;
  quizResult.className = correct === d.quiz.length ? 'correct' : 'wrong';
});

document.getElementById('saveJournal').addEventListener('click', () => {
  localStorage.setItem('amd_journal', journal.value);
  document.getElementById('saveState').textContent = 'Saved.';
});

journal.value = localStorage.getItem('amd_journal') || '';
populateDaySelect();
setStreak(getStreak());
const startingDay = getCurrentDayIndex();
daySelect.value = String(startingDay);
renderDay(startingDay);
