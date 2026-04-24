const DAYS = [
  {
    title: 'Day 1: Put Basics + Direction',
    time: '10 min',
    points: ['Call vs Put payoff', 'Why puts gain when price falls', 'IV can help or hurt your put premium'],
    lesson: [
      'A long put is a bearish bet with defined risk: the most you can lose is the premium you pay.',
      'You need both direction and timing. If AMD drifts sideways, time decay can slowly eat your option value.',
      'Implied volatility (IV) matters. If IV drops hard after entry, put price can fall even when AMD moves slightly down.'
    ],
    example: 'If AMD is at 170 and you buy a 165 put, you usually need a clear move below 165 (and enough time left) for strong gains.',
    action: 'Open a chart and mark: current price, nearest support, nearest resistance. Write one sentence: “I am bearish only if support breaks and fails to reclaim.”',
    mistake: 'Common mistake: buying puts only because “it feels high” without a trigger level.',
    recap: ['Long put = bearish + premium risk only', 'Need move + timing', 'IV crush can hurt even if direction was right'],
    quiz: [
      { q: 'A long put profits most when:', a: 'under', opts: ['Stock goes up sharply', 'Stock stays flat', 'Stock moves under your strike and keeps falling'] },
      { q: 'Big risk with buying puts:', a: 'time', opts: ['Unlimited loss', 'Time decay if move is slow', 'No liquidity ever'] }
    ]
  },
  {
    title: 'Day 2: Risk-Defined Bear Put Spread',
    time: '10 min',
    points: ['Buy higher-strike put, sell lower-strike put', 'Lower cost and lower max profit', 'Best when expecting moderate downside'],
    lesson: [
      'A bear put spread reduces cost versus a naked long put by selling a lower-strike put against your long put.',
      'You cap profit, but you also reduce premium paid and reduce sensitivity to volatility crush.',
      'This is often cleaner for first bearish trades because risk and reward are both clear before entry.'
    ],
    example: 'Buy AMD 170 put and sell AMD 160 put. Max loss is debit paid. Max gain is strike width (10) minus debit.',
    action: 'For your planned AMD idea, decide now: naked put or bear put spread. If spread, choose tentative long and short strikes.',
    mistake: 'Common mistake: choosing strikes too far apart and overpaying relative to expected move.',
    recap: ['Spread caps both risk and reward', 'Good when bearish, not crash-expectation', 'Cheaper than naked long put'],
    quiz: [
      { q: 'Bear put spread lowers:', a: 'cost', opts: ['Cost and vega exposure', 'Need for any analysis', 'Directional exposure completely'] },
      { q: 'Max loss is usually:', a: 'debit', opts: ['Unlimited', 'Initial debit paid', 'Twice the stock price'] }
    ]
  },
  {
    title: 'Day 3: Entry Framework for AMD Short Bias',
    time: '12 min',
    points: ['Map key support/resistance', 'Wait for breakdown + failed retest', 'Pair with market weakness (QQQ/SOX)'],
    lesson: [
      'Your edge is in waiting. A clean short setup is usually: support break, weak bounce, rejection at/under broken support.',
      'Context matters. AMD short setups tend to work better when QQQ/SOX are also weak rather than ripping upward.',
      'Set invalidation before entry. If price reclaims your trigger level with strength, your thesis is likely wrong.'
    ],
    example: 'If AMD breaks 168 support, bounces back to 168, then rejects and rolls over, that failed retest can be your trigger.',
    action: 'Write your exact entry rule for next week in one line: trigger, invalidation level, and “no trade” condition.',
    mistake: 'Common mistake: entering on first red candle before support actually breaks.',
    recap: ['Don’t front-run breakdowns', 'Need confirmation from market context', 'Define invalidation before entry'],
    quiz: [
      { q: 'Best confirmation for short bias:', a: 'break', opts: ['Green candle above resistance', 'Support break with weak retest', 'Any random red candle'] },
      { q: 'Invalidation should be:', a: 'defined', opts: ['Skipped', 'Defined before entry', 'Decided after losses'] }
    ]
  },
  {
    title: 'Day 4: Position Size + Exits',
    time: '10 min',
    points: ['Risk small per trade', 'Take partials at planned levels', 'Exit if thesis invalidates, not by hope'],
    lesson: [
      'Risk management is your survival tool. Keep idea-level risk small enough that one loss does not affect next decisions.',
      'Plan exits before entry: where you trim partials, where you fully exit in profit, and where you cut loss.',
      'If invalidation hits, exit. Do not turn a short-term setup into a long-term baghold.'
    ],
    example: 'If max planned loss is $150, size spread/put count so the worst-case loss is near that number, not 3x that number.',
    action: 'Set your max loss per AMD trade now (fixed dollar amount) and type it in the journal.',
    mistake: 'Common mistake: increasing size after one winning trade.',
    recap: ['Keep risk fixed and small', 'Trim into weakness instead of guessing bottoms', 'Invalidation beats emotion'],
    quiz: [
      { q: 'Good risk habit:', a: 'small', opts: ['All-in conviction', 'Small fixed risk per idea', 'Doubling after losses'] },
      { q: 'If invalidation hits:', a: 'exit', opts: ['Hold and pray', 'Add more instantly', 'Exit according to plan'] }
    ]
  },
  {
    title: 'Day 5: Pre-Trade Checklist for Next Week',
    time: '12 min',
    points: ['Catalyst calendar checked', 'Liquidity + spreads acceptable', 'Plan written before order'],
    lesson: [
      'Your checklist prevents impulsive trades. If any core item fails, skip the trade and preserve capital.',
      'Check catalyst risk (earnings, macro events), option liquidity, and spread width before pressing buy/sell.',
      'The goal next week is not “max PnL.” It is high-quality execution of one clean setup.'
    ],
    example: 'If options spread is too wide or volume is weak, switch strikes/expiry or skip the day.',
    action: 'Finalize your checklist in the journal with 5 yes/no items. Promise yourself: no checklist, no trade.',
    mistake: 'Common mistake: forcing a trade because “I prepared all week so I must trade.”',
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
  lessonEl.innerHTML = `
    <h3>${d.title}</h3>
    <p><strong>Time:</strong> ${d.time}</p>
    <ul>${d.points.map(p => `<li>${p}</li>`).join('')}</ul>
    <div class="lesson-block">
      ${d.lesson.map(p => `<p>${p}</p>`).join('')}
    </div>
    <p><strong>Example:</strong> ${d.example}</p>
    <p><strong>Today’s Action:</strong> ${d.action}</p>
    <p><strong>Avoid This:</strong> ${d.mistake}</p>
  `;

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
