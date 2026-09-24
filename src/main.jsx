import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Globe, CalendarBlank, MapPin, User, ArrowRight, GridFour, BookOpen,
  Trophy, Lock, DownloadSimple, Trash, ChartBar, UsersThree, House,
  SignOut, Star, ArrowLeft,
} from '@phosphor-icons/react';
import './styles.css';

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

/* Floating Arabic letters background */
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

/* Question visual — animated emoji bubble */
function QuestionVisual({ emoji, type }) {
  const typeLabel = { word: 'Vocabulary', phrase: 'Phrase', number: 'Number' };
  return (
    <div className="q-visual">
      <div className="q-emoji">{emoji || '📝'}</div>
      {type && <span className="q-type-badge">{typeLabel[type] || ''}</span>}
    </div>
  );
}

/* Animated progress bar with dots */
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

/* SVG score ring */
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

/* Animated stars */
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

/* Confetti particles */
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

/* ─────────────── HOME PAGE ─────────────── */
function HomePage({ lang, setLang, onJoin }) {
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

      {/* Mini infographic */}
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
  const [lang,   setLang]   = useState(copy[saved] ? saved : 'en');
  const [name,   setName]   = useState('');
  const [stage,  setStage]  = useState('home');
  const [result, setResult] = useState(null);

  useEffect(() => { localStorage.lang = lang; }, [lang]);

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
  return <HomePage lang={lang} setLang={l => { setLang(l); }} onJoin={n => { setName(n); setStage('quiz'); }} />;
}


createRoot(document.getElementById('root')).render(<App />);
