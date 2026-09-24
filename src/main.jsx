import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Globe, CalendarBlank, MapPin, User, ArrowRight, GridFour, BookOpen,
  Trophy, Lock, DownloadSimple, Trash, ChartBar, UsersThree, House,
  SignOut, Star, ArrowLeft,
} from '@phosphor-icons/react';
import './styles.css';
import { questionBank, localizeQuestion } from '../question-bank.js';

/* ─────────────── HELPERS ─────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getMeaning(item, lang) {
  return lang === 'ar' ? item.clues.en : (item.clues[lang] || item.clues.en);
}

function makeSpeedQuestion(item, lang, pool) {
  const sameType = pool.filter(x => x.type === item.type && x.id !== item.id);
  const distractors = shuffle(sameType).slice(0, 2).map(x => x.answer);
  const correct = item.answer;
  const options = shuffle([correct, ...distractors]);
  const clue = lang === 'ar' ? item.clues.en : (item.clues[lang] || item.clues.en);
  const numPool = item.type === 'number' ? pool.filter(x => x.type === 'number') : null;
  const word = item.type === 'number'
    ? String(numPool.findIndex(x => x.id === item.id) + 1)
    : clue;
  return { id: item.id, type: item.type, emoji: item.emoji, word, options, correct };
}

/* ─────────────── TRANSLATIONS ─────────────── */
const copy = {
  en: {
    welcome:'Welcome!', intro:"Glad you're here. Let's learn Arabic together — one word, one conversation, a more open world.",
    level:'Level 1 Challenge', desc:'A fun, friendly challenge for beginners.',
    name:'Your name', join:"Join today's challenge", code:'I have an event code',
    sample:'Sample question', samplePrompt:'What is this called in Arabic?',
    next:'Next question', finish:'See my result', score:'Your result', again:'Try again',
    loading:'Preparing your questions…', loadError:'We could not prepare the quiz.', retry:'Try again',
    excellent:'Excellent! ممتاز 🌟', great:'Great progress! أحسنت 💪',
    good:'Good effort! جيد 👍', keep:'Keep learning! استمر 📚',
    words:'Words', phrases:'Phrases', numbers:'Numbers', home:'Home',
    tier_a:'Master', tier_b:'Advanced', tier_c:'Intermediate', tier_d:'Beginner',
    games:'Practice Games',
    match_title:'Word Match', match_desc:'Connect Arabic words to their meanings',
    match_hint:'Tap a word, then tap its meaning', match_win:'All matched! 🎉',
    flash_title:'Flash Cards', flash_desc:'Flip cards to reveal Arabic words',
    flash_tap:'Tap to flip', flash_got:'Got it!', flash_done:'All done! 🌟',
    speed_title:'Speed Quiz', speed_desc:'30 seconds — how many can you get right?',
    speed_go:'Start!', speed_done:"Time's up!", speed_correct:'Correct',
    cat_word:'Word', cat_phrase:'Phrase', cat_number:'Number',
    match_new_round:'New Round', match_round:'Round',
  },
  tr: {
    welcome:'Hoş geldiniz!', intro:'Burada olmanıza sevindik. Haydi birlikte Arapça öğrenelim.',
    level:'1. Seviye Yarışması', desc:'Yeni başlayanlar için eğlenceli ve samimi bir yarışma.',
    name:'Adınız', join:'Bugünkü yarışmaya katıl', code:'Etkinlik kodum var',
    sample:'Örnek soru', samplePrompt:'Bunun Arapça adı nedir?',
    next:'Sonraki soru', finish:'Sonucumu göster', score:'Sonucunuz', again:'Tekrar dene',
    loading:'Sorularınız hazırlanıyor…', loadError:'Sınav hazırlanamadı.', retry:'Tekrar dene',
    excellent:'Mükemmel! ممتاز 🌟', great:'Harika ilerleme! أحسنت 💪',
    good:'İyi çaba! جيد 👍', keep:'Öğrenmeye devam! استمر 📚',
    words:'Kelimeler', phrases:'İfadeler', numbers:'Sayılar', home:'Ana sayfa',
    tier_a:'Usta', tier_b:'İleri', tier_c:'Orta', tier_d:'Başlangıç',
    games:'Alıştırma Oyunları',
    match_title:'Kelime Eşleştirme', match_desc:'Arapça kelimeleri anlamlarıyla eşleştir',
    match_hint:'Bir kelimeye, sonra anlamına dokun', match_win:'Hepsi eşleşti! 🎉',
    flash_title:'Öğrenme Kartları', flash_desc:'Arapça kelimeleri keşfetmek için çevirin',
    flash_tap:'Çevirmek için dokun', flash_got:'Anladım!', flash_done:'Hepsi tamam! 🌟',
    speed_title:'Hız Testi', speed_desc:'30 saniye — kaç tane yapabilirsin?',
    speed_go:'Başla!', speed_done:'Süre doldu!', speed_correct:'Doğru',
    cat_word:'Kelime', cat_phrase:'İfade', cat_number:'Sayı',
    match_new_round:'Yeni Tur', match_round:'Tur',
  },
  uz: {
    welcome:"Xush kelibsiz!", intro:"Sizni koʻrganimizdan xursandmiz. Keling, arab tilini birgalikda oʻrganamiz.",
    level:"1-daraja sinovi", desc:"Boshlovchilar uchun qiziqarli va doʻstona sinov.",
    name:"Ismingiz", join:"Bugungi sinovda qatnashing", code:"Menda tadbir kodi bor",
    sample:"Namuna savol", samplePrompt:"Bu arab tilida nima deb ataladi?",
    next:"Keyingi savol", finish:"Natijamni koʻrish", score:"Natijangiz", again:"Qayta urinib koʻring",
    loading:"Savollaringiz tayyorlanmoqda…", loadError:"Sinovni tayyorlab boʻlmadi.", retry:"Qayta urinish",
    excellent:"Aʻlo! ممتاز 🌟", great:"Zoʻr natija! أحسنت 💪",
    good:"Yaxshi harakat! جيد 👍", keep:"Oʻrganishni davom eting! استمر 📚",
    words:"Soʻzlar", phrases:"Iboralar", numbers:"Raqamlar", home:"Bosh sahifa",
    tier_a:"Usta", tier_b:"Ilgʻor", tier_c:"Oʻrta", tier_d:"Boshlangʻich",
    games:"Mashq o'yinlari",
    match_title:"So'z moslashtirish", match_desc:"Arab so'zlarini ma'nolari bilan moslashtiring",
    match_hint:"So'zni, keyin ma'nosini bosing", match_win:"Hammasi moslashdi! 🎉",
    flash_title:"Kartochkalar", flash_desc:"Arab so'zlarini o'rganish uchun ag'daring",
    flash_tap:"Ag'darish uchun bosing", flash_got:"O'rgandim!", flash_done:"Hammasi tugadi! 🌟",
    speed_title:"Tezlik testi", speed_desc:"30 soniya — nechta to'g'ri javob bera olasiz?",
    speed_go:"Boshlash!", speed_done:"Vaqt tugadi!", speed_correct:"To'g'ri",
    cat_word:"So'z", cat_phrase:"Ibora", cat_number:"Raqam",
    match_new_round:"Yangi tur", match_round:"Tur",
  },
  ar: {
    welcome:'مرحبًا!', intro:'سعداء بحضورك. لنتعلم العربية معًا، كلمةً ومحادثةً في كل مرة.',
    level:'تحدي المستوى الأول', desc:'مسابقة ممتعة وودية للمبتدئين.',
    name:'اكتب اسمك', join:'ابدأ تحدي اليوم', code:'لدي رمز للفعالية',
    sample:'سؤال تجريبي', samplePrompt:'ماذا يُسمّى هذا باللغة العربية؟',
    next:'السؤال التالي', finish:'اعرض نتيجتي', score:'نتيجتك', again:'حاول مرة أخرى',
    loading:'جارٍ تجهيز أسئلتك…', loadError:'تعذر تجهيز الاختبار.', retry:'إعادة المحاولة',
    excellent:'ممتاز! 🌟', great:'أحسنت! 💪',
    good:'جيد! 👍', keep:'واصل التعلم! 📚',
    words:'المفردات', phrases:'العبارات', numbers:'الأرقام', home:'الرئيسية',
    tier_a:'محترف', tier_b:'متقدم', tier_c:'متوسط', tier_d:'مبتدئ',
    games:'ألعاب تدريبية',
    match_title:'مطابقة الكلمات', match_desc:'صِل الكلمات العربية بمعانيها',
    match_hint:'اضغط كلمة ثم اضغط معناها', match_win:'أحسنت! طابقت الكل 🎉',
    flash_title:'بطاقات تعليمية', flash_desc:'اقلب البطاقات لتعلم الكلمات العربية',
    flash_tap:'اضغط للقلب', flash_got:'حفظت!', flash_done:'أنهيت الكل! 🌟',
    speed_title:'تحدي السرعة', speed_desc:'30 ثانية — كم سؤالاً تستطيع الإجابة؟',
    speed_go:'ابدأ!', speed_done:'انتهى الوقت!', speed_correct:'صحيح',
    cat_word:'مفردة', cat_phrase:'عبارة', cat_number:'رقم',
    match_new_round:'جولة جديدة', match_round:'الجولة',
  },
};

const tierAr = { a:'محترف ⭐', b:'متقدم 🎯', c:'متوسط 📈', d:'مبتدئ 🌱' };
const langs  = [['en','English'],['tr','Türkçe'],['uz',"Oʻzbekcha"],['ar','العربية']];
const isRtl  = lang => lang === 'ar';

/* ─────────────── SMALL COMPONENTS ─────────────── */
function Lang({ lang, setLang }) {
  return (
    <label className="lang">
      <Globe size={20} />
      <select aria-label="Language" value={lang} onChange={e => setLang(e.target.value)}>
        {langs.map(x => <option key={x[0]} value={x[0]}>{x[1]}</option>)}
      </select>
    </label>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="rosette">✦</span>
      <span>Arabic Learners<br />Meetup</span>
    </div>
  );
}

function NationalDayMark() {
  return (
    <div className="national-mark" aria-label="Saudi National Day 96">
      <span className="flag" aria-hidden="true">🇸🇦</span>
      <span className="ninety-six">96</span>
      <span>
        <b>اليوم الوطني السعودي</b>
        <small>Saudi National Day</small>
      </span>
    </div>
  );
}

function LetterBg() {
  const letters = ['م','ر','ح','ب','ا','ع'];
  return (
    <div className="letter-bg" aria-hidden="true">
      {letters.map((l, i) => (
        <span key={i} style={{ bottom: `${10 + i * 12}%` }}>{l}</span>
      ))}
    </div>
  );
}

function QuestionVisual({ emoji, type }) {
  const typeLabel = { word: 'Vocabulary', phrase: 'Phrase', number: 'Number' };
  return (
    <div className="q-visual">
      <div className="q-emoji">{emoji || '📝'}</div>
      {type && <span className="q-type-badge">{typeLabel[type] || ''}</span>}
    </div>
  );
}

function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-dots">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`dot ${i < current ? 'done' : i === current - 1 ? 'active' : ''}`} />
        ))}
      </div>
      <div className="progress-label">{current} / {total}</div>
    </div>
  );
}

function ScoreRing({ score, total }) {
  const r    = 72;
  const circ = 2 * Math.PI * r;
  const pct  = score / total;
  const dash = circ * pct;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="score-ring-wrap">
      <svg viewBox="0 0 160 160" width="180" height="180">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#d4eadc" strokeWidth="14" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="14"
          strokeDasharray={`${animated ? dash : 0} ${circ}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#006c35" />
            <stop offset="100%" stopColor="#00a651" />
          </linearGradient>
        </defs>
      </svg>
      <div className="score-ring-center">
        <div className="score-big">{score}</div>
        <div className="score-of">/{total}</div>
      </div>
    </div>
  );
}

function Stars({ count }) {
  return (
    <div className="stars" aria-label={`${count} stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="star"
          style={{ animationDelay: `${.4 + i * .12}s`, filter: i < count ? 'none' : 'grayscale(1) opacity(.3)' }}
        >⭐</span>
      ))}
    </div>
  );
}

function Confetti() {
  const colors = ['#006c35','#00a651','#58c786','#ffd700','#fff','#c8f0d8'];
  return (
    <div className="confetti-wrap" aria-hidden="true">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            animationDuration: `${1.2 + Math.random() * 1.5}s`,
            animationDelay: `${Math.random() * 2}s`,
            borderRadius: Math.random() > .5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────── GAME CARD (homepage) ─────────────── */
function GameCard({ emoji, title, desc, onClick }) {
  return (
    <button className="game-card" onClick={onClick}>
      <div className="game-card-icon">{emoji}</div>
      <div className="game-card-text">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <ArrowRight size={22} className="game-card-arrow" />
    </button>
  );
}

/* ─────────────── MATCH GAME ─────────────── */
function MatchGame({ lang, onBack, onReplay }) {
  const t   = copy[lang];
  const rtl = isRtl(lang);

  const [round, setRound] = useState(1);

  const wordPool = useMemo(() => questionBank.filter(x => x.type === 'word'), []);
  const gameItems = useMemo(() => shuffle([...wordPool]).slice(0, 6), [round]);
  const rightOrder = useMemo(() => shuffle([0,1,2,3,4,5]), [round]);

  const [leftSel,  setLeftSel]  = useState(null);
  const [rightSel, setRightSel] = useState(null);
  const [matched,  setMatched]  = useState(new Set());
  const [wrongPair,setWrongPair]= useState(null);

  useEffect(() => {
    setLeftSel(null); setRightSel(null);
    setMatched(new Set()); setWrongPair(null);
  }, [round]);

  function checkMatch(leftIdx, rightPos) {
    if (rightOrder[rightPos] === leftIdx) {
      setMatched(prev => { const s = new Set(prev); s.add(leftIdx); return s; });
      setLeftSel(null); setRightSel(null);
    } else {
      setWrongPair({ left: leftIdx, right: rightPos });
      setTimeout(() => { setWrongPair(null); setLeftSel(null); setRightSel(null); }, 700);
    }
  }

  function selectLeft(i) {
    if (matched.has(i) || wrongPair) return;
    const nxt = leftSel === i ? null : i;
    setLeftSel(nxt);
    if (nxt !== null && rightSel !== null) checkMatch(nxt, rightSel);
  }

  function selectRight(pos) {
    if (matched.has(rightOrder[pos]) || wrongPair) return;
    const nxt = rightSel === pos ? null : pos;
    setRightSel(nxt);
    if (leftSel !== null && nxt !== null) checkMatch(leftSel, nxt);
  }

  const won = matched.size === 6;

  return (
    <main className="game-page" dir={rtl ? 'rtl' : 'ltr'}>
      <nav className="game-nav">
        <button onClick={onBack}>
          {rtl ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>} {t.home}
        </button>
        <span className="game-page-title">🎯 {t.match_title} <small className="round-badge">{t.match_round} {round}</small></span>
        <span className="match-score-badge">{matched.size}/6</span>
      </nav>

      {won ? (
        <div className="game-win">
          <Confetti />
          <div className="win-emoji">🎉</div>
          <h2>{t.match_win}</h2>
          <Stars count={5} />
          <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:280, margin:'24px auto 0' }}>
            <button className="primary" onClick={() => setRound(r => r + 1)}>{t.match_new_round} 🎯</button>
            <button className="secondary" onClick={onBack}>{t.home}</button>
          </div>
        </div>
      ) : (
        <>
          <p className="game-hint">{t.match_hint}</p>
          <div className="match-grid">
            <div className="match-col">
              {gameItems.map((item, i) => (
                <button
                  key={i}
                  className={`match-item arabic-item${matched.has(i) ? ' matched' : leftSel === i ? ' selected' : wrongPair?.left === i ? ' wrong' : ''}`}
                  onClick={() => selectLeft(i)}
                  disabled={matched.has(i)}
                >
                  {item.answer}
                </button>
              ))}
            </div>
            <div className="match-col">
              {rightOrder.map((realIdx, pos) => (
                <button
                  key={pos}
                  className={`match-item${matched.has(realIdx) ? ' matched' : rightSel === pos ? ' selected' : wrongPair?.right === pos ? ' wrong' : ''}`}
                  onClick={() => selectRight(pos)}
                  disabled={matched.has(realIdx)}
                >
                  <span className="match-emoji">{gameItems[realIdx].emoji}</span>
                  <span>{getMeaning(gameItems[realIdx], lang)}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

/* ─────────────── FLASH CARDS ─────────────── */
function FlashCards({ lang, onBack, onReplay }) {
  const t   = copy[lang];
  const rtl = isRtl(lang);

  const [round,   setRound]   = useState(1);
  const cards = useMemo(() => shuffle([...questionBank]).slice(0, 15), [round]);
  const [idx,     setIdx]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learned, setLearned] = useState(new Set());
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    setIdx(0); setFlipped(false); setLearned(new Set()); setDone(false);
  }, [round]);

  const card = cards[idx];

  const catLabel = { word: t.cat_word, phrase: t.cat_phrase, number: t.cat_number };

  function flip() { setFlipped(f => !f); }

  function gotIt() {
    const nxt = new Set(learned); nxt.add(idx);
    setLearned(nxt);
    if (nxt.size === cards.length) { setDone(true); return; }
    goNext();
  }

  function goNext() {
    setFlipped(false);
    if (idx < cards.length - 1) setTimeout(() => setIdx(i => i + 1), 150);
  }

  function goPrev() {
    setFlipped(false);
    if (idx > 0) setTimeout(() => setIdx(i => i - 1), 150);
  }

  if (done) return (
    <main className="game-page" dir={rtl ? 'rtl' : 'ltr'}>
      <nav className="game-nav">
        <button onClick={onBack}>{rtl ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>} {t.home}</button>
        <span className="game-page-title">🃏 {t.flash_title}</span>
        <span />
      </nav>
      <div className="game-win">
        <Confetti />
        <div className="win-emoji">🌟</div>
        <h2>{t.flash_done}</h2>
        <Stars count={5} />
        <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:280, margin:'24px auto 0' }}>
          <button className="primary" onClick={() => setRound(r => r + 1)}>{t.match_new_round} 🃏</button>
          <button className="secondary" onClick={onBack}>{t.home}</button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="game-page" dir={rtl ? 'rtl' : 'ltr'}>
      <nav className="game-nav">
        <button onClick={onBack}>{rtl ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>} {t.home}</button>
        <span className="game-page-title">🃏 {t.flash_title}</span>
        <span className="flash-learned-badge">{learned.size}/{cards.length}</span>
      </nav>

      <div className="flash-wrap">
        <div className="flash-card-outer" onClick={flip} role="button" aria-label={t.flash_tap}>
          <div className={`flash-card${flipped ? ' flipped' : ''}`}>
            <div className="flash-front">
              <div className="flash-category">{catLabel[card.type] || card.type}</div>
              <div className="flash-emoji-big">{card.emoji}</div>
              <div className="flash-arabic">{card.answer}</div>
              <div className="flash-tap-hint">{t.flash_tap} ↻</div>
            </div>
            <div className="flash-back">
              <div className="flash-category" style={{ background:'rgba(255,255,255,.2)' }}>{catLabel[card.type] || card.type}</div>
              <div className="flash-emoji-big">{card.emoji}</div>
              <div className="flash-meaning">{getMeaning(card, lang)}</div>
              <div className="flash-arabic-small">{card.answer}</div>
            </div>
          </div>
        </div>

        <div className="flash-nav">
          <button className="flash-nav-btn" onClick={goPrev} disabled={idx === 0}>
            {rtl ? '→' : '←'}
          </button>
          <span className="flash-counter">{idx + 1} / {cards.length}</span>
          <button className="flash-nav-btn" onClick={goNext} disabled={idx === cards.length - 1}>
            {rtl ? '←' : '→'}
          </button>
        </div>

        <button
          className={`flash-got-btn${flipped ? '' : ' dim'}`}
          onClick={gotIt}
          disabled={!flipped || learned.has(idx)}
        >
          {learned.has(idx) ? '✓ ' + t.flash_got : t.flash_got}
        </button>
      </div>
    </main>
  );
}

/* ─────────────── SPEED CHALLENGE ─────────────── */
function SpeedChallenge({ lang, onBack, onReplay }) {
  const t   = copy[lang];
  const rtl = isRtl(lang);

  const pool = useMemo(() => shuffle([...questionBank]).slice(0, 40), []);
  const questions = useMemo(
    () => pool.map(item => makeSpeedQuestion(item, lang, questionBank)),
    [pool, lang]
  );

  const [started,  setStarted]  = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [qIdx,     setQIdx]     = useState(0);
  const [score,    setScore]    = useState(0);
  const [attempted,setAttempted]= useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) { setFinished(true); return; }
    const timer = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  function answer(opt) {
    if (feedback || finished) return;
    const correct = opt === questions[qIdx].correct;
    setFeedback(correct ? 'ok' : 'err');
    if (correct) setScore(s => s + 1);
    setAttempted(a => a + 1);
    setTimeout(() => {
      setFeedback(null);
      if (qIdx < questions.length - 1) setQIdx(i => i + 1);
      else setFinished(true);
    }, 600);
  }

  const stars = score >= 15 ? 5 : score >= 10 ? 4 : score >= 6 ? 3 : score >= 3 ? 2 : 1;
  const timerPct = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 15 ? 'var(--green)' : timeLeft > 7 ? '#f0a500' : '#e53e3e';

  if (finished) return (
    <main className="game-page" dir={rtl ? 'rtl' : 'ltr'}>
      <nav className="game-nav">
        <button onClick={onBack}>{rtl ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>} {t.home}</button>
        <span className="game-page-title">⚡ {t.speed_title}</span>
        <span />
      </nav>
      <div className="game-win">
        {score >= 10 && <Confetti />}
        <div className="win-emoji">{score >= 10 ? '🏆' : score >= 5 ? '🌟' : '📚'}</div>
        <h2>{t.speed_done}</h2>
        <div className="speed-final-score">
          <span className="speed-big-num">{score}</span>
          <span className="speed-denom">/{attempted}</span>
        </div>
        <Stars count={stars} />
        <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:280, margin:'20px auto 0' }}>
          <button className="primary" onClick={onReplay}>{t.again} ⚡</button>
          <button className="secondary" onClick={onBack}>{t.home}</button>
        </div>
      </div>
    </main>
  );

  if (!started) return (
    <main className="game-page" dir={rtl ? 'rtl' : 'ltr'}>
      <nav className="game-nav">
        <button onClick={onBack}>{rtl ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>} {t.home}</button>
        <span className="game-page-title">⚡ {t.speed_title}</span>
        <span />
      </nav>
      <div className="speed-start-screen">
        <div className="speed-start-icon">⚡</div>
        <h2>{t.speed_title}</h2>
        <p>{t.speed_desc}</p>
        <div className="speed-rules">
          <span>🕐 30s</span>
          <span>📝 {questions.length}</span>
          <span>⭐ 5★</span>
        </div>
        <button className="primary speed-go-btn" onClick={() => setStarted(true)}>
          {t.speed_go} <ArrowRight size={20}/>
        </button>
      </div>
    </main>
  );

  const q = questions[qIdx];

  return (
    <main className="game-page" dir={rtl ? 'rtl' : 'ltr'}>
      <nav className="game-nav">
        <button onClick={onBack}>{rtl ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>} {t.home}</button>
        <span className="game-page-title">⚡ {t.speed_title}</span>
        <span className="speed-score-badge">✓ {score}</span>
      </nav>

      <div className="speed-timer-row">
        <span className="speed-time-num" style={{ color: timerColor }}>{timeLeft}s</span>
        <div className="speed-timer-track">
          <div className="speed-timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
      </div>

      <div className="speed-q-area">
        <div className="speed-emoji-big">{q.emoji}</div>
        <div className="speed-clue-word">{q.word}</div>

        <div className="speed-options">
          {q.options.map((opt, i) => (
            <button
              key={`${qIdx}-${i}`}
              className={`speed-option${feedback && opt === q.correct ? ' ok' : feedback === 'err' && opt !== q.correct ? ' err-maybe' : ''}`}
              onClick={() => answer(opt)}
              disabled={!!feedback}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ─────────────── HOME PAGE ─────────────── */
function HomePage({ lang, setLang, onJoin, onGame }) {
  const t = copy[lang];
  const [name, setName] = useState('');

  return (
    <main dir={isRtl(lang) ? 'rtl' : 'ltr'}>
      <header>
        <NationalDayMark />
        <Lang lang={lang} setLang={setLang} />
      </header>

      <section className="hero">
        <LetterBg />
        <div className="hero-copy">
          <Brand />
          <p className="tagline">Arabic brings us together.<br />العربية تجمعنا</p>
          <div className="welcome-ar">مرحبًا</div>
          <h1>{t.welcome}</h1>
          <p className="intro">{t.intro}</p>
          <div className="event-meta">
            <span><CalendarBlank size={18} /> 23 September 2026</span>
            <span><MapPin size={18} /> Saudi National Day Meetup</span>
          </div>
        </div>
        <img src="/assets/hero.png" alt="Warm Arabic-inspired gathering space" />
      </section>

      <section className="join-panel">
        <div className="join-title">
          <span className="leaf">✦</span>
          <div>
            <h2>{t.level} <small>المستوى الأول · 15 سؤالًا</small></h2>
            <p>{t.desc}</p>
          </div>
        </div>
        <label className="input">
          <User size={20} />
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t.name}
            maxLength="60"
            onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && onJoin(name.trim())}
          />
        </label>
        <button className="primary" disabled={name.trim().length < 2} onClick={() => onJoin(name.trim())}>
          {t.join} <ArrowRight size={20} />
        </button>
        <button className="secondary"><GridFour size={18} /> {t.code}</button>
      </section>

      {/* ── Games Section ── */}
      <section className="games-section">
        <div className="section-label games-label">
          <span>🎮</span> {t.games}
        </div>
        <div className="game-cards-grid">
          <GameCard
            emoji="🎯"
            title={t.match_title}
            desc={t.match_desc}
            onClick={() => onGame('match')}
          />
          <GameCard
            emoji="🃏"
            title={t.flash_title}
            desc={t.flash_desc}
            onClick={() => onGame('flashcard')}
          />
          <GameCard
            emoji="⚡"
            title={t.speed_title}
            desc={t.speed_desc}
            onClick={() => onGame('speed')}
          />
        </div>
      </section>

      <section className="sample">
        <div className="section-label"><BookOpen size={18} /> {t.sample}</div>
        <div className="sample-grid">
          <img src="/assets/coffee.png" alt="Traditional Arabic coffee pot" />
          <div>
            <h3>{t.samplePrompt}</h3>
            {['كِتَاب', 'قَهْوَة', 'بَاب'].map((x, i) => (
              <button key={x} className={`choice${i === 1 ? ' correct' : ''}`}>{x}</button>
            ))}
          </div>
        </div>
      </section>

      <footer><span>🇸🇦</span> العربية تجمعنا · Saudi National Day 96</footer>
    </main>
  );
}

/* ─────────────── QUIZ ─────────────── */
function Quiz({ lang, name, onDone, onBack }) {
  const t = copy[lang];
  const [quiz,    setQuiz]    = useState(null);
  const [idx,     setIdx]     = useState(0);
  const [answers, setAnswers] = useState([]);
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState('');
  const cardKey = useRef(0);

  async function load() {
    setQuiz(null); setError(''); setIdx(0); setAnswers([]);
    try {
      const r = await fetch(`/api/quiz?language=${lang}`);
      if (!r.ok) throw new Error();
      setQuiz(await r.json());
    } catch {
      setError(t.loadError);
    }
  }

  useEffect(() => { load(); }, [lang]);

  if (error) return (
    <main className="quiz-page" dir={isRtl(lang) ? 'rtl' : 'ltr'}>
      <nav>
        <button onClick={onBack}><House size={18} /> {t.home}</button>
        <NationalDayMark />
        <span>{name}</span>
      </nav>
      <div className="center">
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <p className="error" style={{ fontSize: 18 }}>{error}</p>
          <button className="primary" style={{ maxWidth: 240, margin: '20px auto 0' }} onClick={load}>
            {t.retry}
          </button>
        </div>
      </div>
    </main>
  );

  if (!quiz) return (
    <div className="center" dir={isRtl(lang) ? 'rtl' : 'ltr'}>
      <div style={{ textAlign: 'center', color: 'var(--teal)', fontSize: 18 }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>⟳</div>
        <p>{t.loading}</p>
      </div>
    </div>
  );

  const q        = quiz.questions[idx];
  const selected = answers[idx];
  const total    = quiz.questions.length;

  function selectAnswer(i) {
    const a = [...answers];
    a[idx] = i;
    setAnswers(a);
  }

  async function next() {
    if (idx < total - 1) {
      cardKey.current++;
      setIdx(idx + 1);
      return;
    }
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, language: lang, quizId: quiz.quizId, answers }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || t.loadError);
      onDone(data);
    } catch (e) {
      setError(e.message || t.loadError);
      setBusy(false);
    }
  }

  function goBack() {
    if (idx > 0) { cardKey.current++; setIdx(idx - 1); }
    else onBack();
  }

  return (
    <main className="quiz-page" dir={isRtl(lang) ? 'rtl' : 'ltr'}>
      <nav>
        <button onClick={goBack}>
          {isRtl(lang) ? <ArrowRight size={18} /> : <ArrowLeft size={18} />} {t.home}
        </button>
        <NationalDayMark />
        <span style={{ fontWeight: 600, fontSize: 14 }}>{name}</span>
      </nav>

      <ProgressBar current={idx + 1} total={total} />

      <div key={cardKey.current} className="quiz-card" style={{ display: 'block' }}>
        <div className="q-count">{idx + 1} / {total}</div>

        <QuestionVisual emoji={q.emoji} type={q.type} />

        <h1>{q.prompt}</h1>
        <div className="word">{q.word}</div>

        <div className="choices">
          {q.options.map((x, i) => (
            <button
              key={`${q.id}-${i}`}
              className={selected === i ? 'selected' : ''}
              onClick={() => selectAnswer(i)}
            >
              <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
              {x}
            </button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="primary"
          disabled={selected === undefined || busy}
          onClick={next}
        >
          {idx === total - 1 ? t.finish : t.next}
          <ArrowRight size={20} />
        </button>
      </div>
    </main>
  );
}

/* ─────────────── RESULT SCREEN ─────────────── */
function Result({ lang, result, onAgain }) {
  const t       = copy[lang];
  const { score, total, percent } = result;
  const stars   = percent >= 93 ? 5 : percent >= 80 ? 4 : percent >= 67 ? 3 : percent >= 50 ? 2 : 1;
  const isGreat = percent >= 93;

  const tier = percent >= 93 ? { key: 'a', en: t.tier_a }
             : percent >= 73 ? { key: 'b', en: t.tier_b }
             : percent >= 53 ? { key: 'c', en: t.tier_c }
             :                 { key: 'd', en: t.tier_d };

  const msg = percent >= 93 ? t.excellent
            : percent >= 73 ? t.great
            : percent >= 50 ? t.good
            :                 t.keep;

  return (
    <div className="result-page" dir={isRtl(lang) ? 'rtl' : 'ltr'}>
      {isGreat && <Confetti />}

      <Trophy size={48} color="var(--teal)" style={{ marginBottom: 8, animation: 'bounce .6s ease' }} />
      <h2 style={{ margin: '0 0 20px', fontFamily: "'Playfair Display',serif", fontSize: 28, textAlign: 'center' }}>
        {t.score}
      </h2>

      <ScoreRing score={score} total={total} />
      <Stars count={stars} />

      <div className="perf-card" style={{ marginTop: 20 }}>
        <p className="perf-tier-ar">{tierAr[tier.key]}</p>
        <p className="perf-tier-en">{tier.en}</p>
        <p className="perf-msg">{msg}</p>
      </div>

      <div className="infographic">
        <div className="info-bar">
          <div className="info-bar-label">Score</div>
          <div className="info-bar-track">
            <div className="info-bar-fill" style={{ '--fill': `${percent}%` }} />
          </div>
          <div className="info-bar-val">{score}/{total}</div>
        </div>
        <div className="info-bar">
          <div className="info-bar-label">Progress</div>
          <div className="info-bar-track">
            <div className="info-bar-fill"
              style={{ '--fill': `${percent}%`, background: 'linear-gradient(90deg,#006c35,#58c786)' }}
            />
          </div>
          <div className="info-bar-val">{Math.round(percent)}%</div>
        </div>
      </div>

      <div className="result-actions">
        <button className="primary" onClick={onAgain}>{t.again}</button>
      </div>
    </div>
  );
}

/* ─────────────── ADMIN ─────────────── */
function Admin() {
  const [token,  setToken] = useState(sessionStorage.token || '');
  const [pass,   setPass]  = useState('');
  const [rows,   setRows]  = useState([]);
  const [error,  setError] = useState('');

  async function load(tk = token) {
    const r = await fetch('/api/admin/results', { headers: { Authorization: `Bearer ${tk}` } });
    if (r.ok) setRows(await r.json());
    else { setToken(''); delete sessionStorage.token; }
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function login(e) {
    e.preventDefault();
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    });
    const d = await r.json();
    if (!r.ok) return setError(d.error);
    sessionStorage.token = d.token;
    setToken(d.token);
  }

  const avg = rows.length
    ? Math.round(rows.reduce((s, x) => s + x.score / x.total * 100, 0) / rows.length)
    : 0;

  function csv() {
    const data = ['Name,Language,Score,Total,Date',
      ...rows.map(x => `"${x.name}",${x.language},${x.score},${x.total},${x.created_at}`)
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
    a.download = 'meetup-results.csv';
    a.click();
  }

  if (!token) return (
    <main className="admin-login">
      <Brand />
      <form onSubmit={login}>
        <Lock size={32} color="var(--teal)" />
        <h1>Admin access</h1>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Admin password" />
        <button className="primary">Sign in</button>
        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );

  return (
    <main className="admin">
      <aside>
        <Brand />
        <a href="/"><House size={18} /> Event home</a>
        <button onClick={() => { delete sessionStorage.token; setToken(''); }}>
          <SignOut size={18} /> Sign out
        </button>
      </aside>
      <section>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p>Event control</p>
            <h1>Results dashboard</h1>
          </div>
          <div className="actions">
            <button onClick={csv}><DownloadSimple size={16} /> Export CSV</button>
            <button className="danger" onClick={async () => {
              if (confirm('Delete every result?')) {
                await fetch('/api/admin/results', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                load();
              }
            }}><Trash size={16} /> Clear results</button>
          </div>
        </header>
        <div className="stats">
          <article><UsersThree size={28} /><div><b>{rows.length}</b><span>Participants</span></div></article>
          <article><ChartBar size={28} /><div><b>{avg}%</b><span>Average score</span></div></article>
          <article><Trophy size={28} /><div><b>{rows[0]?.score ?? 0}/{rows[0]?.total ?? 15}</b><span>Top score</span></div></article>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Rank</th><th>Participant</th><th>Language</th><th>Score</th><th>%</th><th>Time</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.name}</td>
                  <td>{langs.find(x => x[0] === r.language)?.[1] || r.language}</td>
                  <td><b>{r.score}/{r.total}</b></td>
                  <td>{Math.round(r.score / r.total * 100)}%</td>
                  <td>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan="6" className="empty">Results will appear here as guests finish the challenge.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* ─────────────── ROOT APP ─────────────── */
function App() {
  const saved = localStorage.lang;
  const [lang,    setLang]    = useState(copy[saved] ? saved : 'en');
  const [name,    setName]    = useState('');
  const [stage,   setStage]   = useState('home');
  const [result,  setResult]  = useState(null);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => { localStorage.lang = lang; }, [lang]);

  function goGame(s) { setGameKey(k => k + 1); setStage(s); }
  function replay(s) { setGameKey(k => k + 1); setStage(s); }

  if (location.pathname === '/admin') return <Admin />;
  if (stage === 'quiz') return (
    <Quiz
      key={lang}
      lang={lang}
      name={name}
      onDone={r => { setResult(r); setStage('result'); }}
      onBack={() => setStage('home')}
    />
  );
  if (stage === 'result') return (
    <Result lang={lang} result={result} onAgain={() => setStage('home')} />
  );
  if (stage === 'match')     return <MatchGame      key={gameKey} lang={lang} onBack={() => setStage('home')} onReplay={() => replay('match')} />;
  if (stage === 'flashcard') return <FlashCards     key={gameKey} lang={lang} onBack={() => setStage('home')} onReplay={() => replay('flashcard')} />;
  if (stage === 'speed')     return <SpeedChallenge key={gameKey} lang={lang} onBack={() => setStage('home')} onReplay={() => replay('speed')} />;

  return (
    <HomePage
      lang={lang}
      setLang={l => setLang(l)}
      onJoin={n => { setName(n); setStage('quiz'); }}
      onGame={s => goGame(s)}
    />
  );
}

createRoot(document.getElementById('root')).render(<App />);
