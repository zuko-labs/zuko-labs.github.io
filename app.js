const DAYS = [
  {
    title: 'Day 1: Put Basics + Direction',
    time: '8 min',
    points: ['Call vs Put payoff', 'Why puts gain when price falls', 'IV can help or hurt your put premium'],
    quiz: [
      { q: 'A long put profits most when:', a: 'under', opts: ['Stock goes up sharply', 'Stock stays flat', 'Stock moves under your strike and keeps falling'] },
      { q: 'Big risk with buying puts:', a: 'time', opts: ['Unlimited loss', 'Time decay if move is slow', 'No liquidity ever'] }
    ]
  },
  {
    title: 'Day 2: Risk-Defined Bear Put Spread',
    time: '10 min',
    points: ['Buy higher-strike put, sell lower-strike put', 'Lower cost and lower max profit', 'Best when expecting moderate downside'],
    quiz: [
      { q: 'Bear put spread lowers:', a: 'cost', opts: ['Cost and vega exposure', 'Need for any analysis', 'Directional exposure completely'] },
      { q: 'Max loss is usually:', a: 'debit', opts: ['Unlimited', 'Initial debit paid', 'Twice the stock price'] }
    ]
  },
  {
    title: 'Day 3: Entry Framework for AMD Short Bias',
    time: '10 min',
    points: ['Map key support/resistance', 'Wait for breakdown + failed retest', 'Pair with market weakness (QQQ/SOX)'],
    quiz: [
      { q: 'Best confirmation for short bias:', a: 'break', opts: ['Green candle above resistance', 'Support break with weak retest', 'Any random red candle'] },
      { q: 'Invalidation should be:', a: 'defined', opts: ['Skipped', 'Defined before entry', 'Decided after losses'] }
    ]
  },
  {
    title: 'Day 4: Position Size + Exits',
    time: '9 min',
    points: ['Risk small per trade', 'Take partials at planned levels', 'Exit if thesis invalidates, not by hope'],
    quiz: [
      { q: 'Good risk habit:', a: 'small', opts: ['All-in conviction', 'Small fixed risk per idea', 'Doubling after losses'] },
      { q: 'If invalidation hits:', a: 'exit', opts: ['Hold and pray', 'Add more instantly', 'Exit according to plan'] }
    ]
  },
  {
    title: 'Day 5: Pre-Trade Checklist for Next Week',
    time: '10 min',
    points: ['Catalyst calendar checked', 'Liquidity + spreads acceptable', 'Plan written before order'],
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

DAYS.forEach((d, i) => {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = d.title;
  daySelect.appendChild(opt);
});

function renderDay(i) {
  const d = DAYS[i];
  lessonEl.innerHTML = `<h3>${d.title}</h3><p>${d.time}</p><ul>${d.points.map(p => `<li>${p}</li>`).join('')}</ul>`;
  quizEl.innerHTML = d.quiz.map((item, idx) => `
    <div>
      <p><strong>Q${idx + 1}.</strong> ${item.q}</p>
      ${item.opts.map((o, oi) => `<label><input type="radio" name="q${idx}" value="${oi}"> ${o}</label>`).join('<br>')}
    </div>
  `).join('<hr>');
  quizResult.textContent = '';
}

function getStreak() {
  return Number(localStorage.getItem('options_streak') || 0);
}

function setStreak(n) {
  localStorage.setItem('options_streak', String(n));
  streakText.textContent = `Completion count: ${n}`;
}

daySelect.addEventListener('change', e => renderDay(Number(e.target.value)));

document.getElementById('completeBtn').addEventListener('click', () => {
  setStreak(getStreak() + 1);
});

document.getElementById('checkQuiz').addEventListener('click', () => {
  const d = DAYS[Number(daySelect.value)];
  let correct = 0;
  d.quiz.forEach((item, idx) => {
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    const picked = selected ? item.opts[Number(selected.value)] : '';
    if (
      (item.a === 'under' && picked.includes('under your strike')) ||
      (item.a === 'time' && picked.includes('Time decay')) ||
      (item.a === 'cost' && picked.includes('Cost and vega')) ||
      (item.a === 'debit' && picked.includes('Initial debit')) ||
      (item.a === 'break' && picked.includes('Support break')) ||
      (item.a === 'defined' && picked.includes('Defined before entry')) ||
      (item.a === 'small' && picked.includes('Small fixed risk')) ||
      (item.a === 'exit' && picked.includes('Exit according to plan')) ||
      (item.a === 'checklist' && picked.includes('Run checklist')) ||
      (item.a === 'process' && picked.includes('Process quality'))
    ) correct++;
  });

  quizResult.textContent = `Score: ${correct}/${d.quiz.length}`;
  quizResult.className = correct === d.quiz.length ? 'correct' : 'wrong';
});

document.getElementById('saveJournal').addEventListener('click', () => {
  localStorage.setItem('amd_journal', journal.value);
  document.getElementById('saveState').textContent = 'Saved.';
});

journal.value = localStorage.getItem('amd_journal') || '';
setStreak(getStreak());
renderDay(0);
