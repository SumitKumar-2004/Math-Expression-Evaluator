import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Calculator, Check, ChevronDown, CircleHelp, Clock3,
  Copy, FlaskConical, GraduationCap, History, Lightbulb, ListChecks, Moon, RotateCcw,
  Search, Sparkles, Sun, Trash2, X, BookOpen, Play, Menu, House, Brain
} from "lucide-react";
import { evaluateSafe, formatNumber, getSteps } from "./math.js";

const examples = [
  { title: "Order of operations", expression: "2 + 3 * 4", result: "14", category: "Basics" },
  { title: "Powers", expression: "2^3", result: "8", category: "Algebra" },
  { title: "Square root", expression: "sqrt(144)", result: "12", category: "Functions" },
  { title: "Trigonometry", expression: "sin(30)", result: "0.5", category: "Trigonometry", degrees: true },
  { title: "Constants", expression: "pi * 2", result: "6.28318530718", category: "Constants" },
  { title: "Parentheses", expression: "(8 + 4) / 3", result: "4", category: "Basics" }
];

const formulas = [
  { name: "Quadratic formula", category: "Algebra", formula: "x = (-b ± √(b² - 4ac)) / 2a", note: "Solves ax² + bx + c = 0." },
  { name: "Slope of a line", category: "Algebra", formula: "m = (y₂ - y₁) / (x₂ - x₁)", note: "Measures the steepness of a line." },
  { name: "Pythagorean theorem", category: "Geometry", formula: "a² + b² = c²", note: "For a right-angled triangle." },
  { name: "Area of a circle", category: "Geometry", formula: "A = πr²", note: "r is the circle's radius." },
  { name: "Circumference", category: "Geometry", formula: "C = 2πr", note: "Distance around a circle." },
  { name: "Sine ratio", category: "Trigonometry", formula: "sin θ = opposite / hypotenuse", note: "For a right-angled triangle." },
  { name: "Cosine ratio", category: "Trigonometry", formula: "cos θ = adjacent / hypotenuse", note: "For a right-angled triangle." },
  { name: "Tangent ratio", category: "Trigonometry", formula: "tan θ = opposite / adjacent", note: "For a right-angled triangle." },
  { name: "Mean", category: "Statistics", formula: "mean = sum of values / number of values", note: "The arithmetic average." },
  { name: "Probability", category: "Statistics", formula: "P(A) = favourable outcomes / total outcomes", note: "For equally likely outcomes." },
  { name: "Simple interest", category: "Everyday maths", formula: "SI = (P × R × T) / 100", note: "P = principal, R = annual rate, T = time in years." },
  { name: "Percentage", category: "Everyday maths", formula: "percentage = (part / whole) × 100", note: "Expresses a value out of 100." }
];

const questions = [
  { q: "What is 12 × 8?", options: ["84", "96", "108", "88"], answer: 1, topic: "Basics", explanation: "12 groups of 8 equals 96." },
  { q: "What is √169?", options: ["11", "12", "13", "14"], answer: 2, topic: "Basics", explanation: "13 × 13 = 169, so √169 = 13." },
  { q: "Evaluate 2 + 4 × 3.", options: ["18", "14", "20", "24"], answer: 1, topic: "Order of operations", explanation: "Multiply first: 4 × 3 = 12, then add 2 to get 14." },
  { q: "What is 25% of 200?", options: ["25", "40", "50", "75"], answer: 2, topic: "Percentages", explanation: "25% = 0.25, and 0.25 × 200 = 50." },
  { q: "What is 5²?", options: ["10", "15", "20", "25"], answer: 3, topic: "Powers", explanation: "5² means 5 × 5 = 25." },
  { q: "If a right triangle has sides 3 and 4, what is its hypotenuse?", options: ["5", "6", "7", "8"], answer: 0, topic: "Geometry", explanation: "By Pythagoras, √(3² + 4²) = √25 = 5." },
  { q: "What is the average of 4, 6 and 8?", options: ["5", "6", "7", "18"], answer: 1, topic: "Statistics", explanation: "(4 + 6 + 8) / 3 = 6." },
  { q: "In degree mode, what is sin(30°)?", options: ["0", "0.5", "1", "√3/2"], answer: 1, topic: "Trigonometry", explanation: "sin(30°) = 1/2 = 0.5." },
  { q: "What is 3⁴?", options: ["12", "27", "64", "81"], answer: 3, topic: "Powers", explanation: "3 × 3 × 3 × 3 = 81." },
  { q: "What is the probability of heads on a fair coin?", options: ["1/4", "1/3", "1/2", "1"], answer: 2, topic: "Probability", explanation: "One of two equally likely outcomes is heads: 1/2." }
];

function readStorage(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
function useStoredState(key, initial) {
  const [value, setValue] = useState(() => readStorage(key, initial));
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}
function App() {
  const [theme, setTheme] = useStoredState("mee-theme", "light");
  const [history, setHistory] = useStoredState("mee-history", []);
  const [favorites, setFavorites] = useStoredState("mee-favorites", []);
  const [progress, setProgress] = useStoredState("mee-progress", { attempted: 0, correct: 0, streak: 0, lastDay: "" });
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); setMobileMenu(false); }, [location.pathname]);
  const addHistory = item => setHistory(old => [item, ...old].slice(0, 100));
  const clearHistory = () => setHistory([]);
  const common = { theme, setTheme, history, addHistory, clearHistory, favorites, setFavorites, progress, setProgress };
  return <div className="app-shell">
    <header className="topbar">
      <Link to="/" className="brand"><span className="brand-icon"><Calculator size={20}/></span><span>Math Expression Evaluator</span></Link>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X/> : <Menu/>}</button>
      <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/calculator">Calculator</NavLink>
        <NavLink to="/formulas">Formula library</NavLink>
        <NavLink to="/practice">Practice quiz</NavLink>
      </nav>
      <div className="top-actions">
        <button className="theme-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">{theme === "light" ? <Moon size={17}/> : <Sun size={17}/>}</button>
        <Link to="/calculator" className="top-cta">Open evaluator <ArrowUpRight size={15}/></Link>
      </div>
    </header>
    <Routes>
      <Route path="/" element={<Home {...common}/>}/>
      <Route path="/calculator" element={<CalculatorPage {...common}/>}/>
      <Route path="/formulas" element={<FormulaPage {...common}/>}/>
      <Route path="/practice" element={<PracticePage {...common}/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    <footer className="footer">
      <Link to="/" className="brand footer-brand"><span className="brand-icon"><Calculator size={18}/></span><span>Math Expression Evaluator</span></Link>
      <p>A student-friendly mathematics workspace, built with React.</p>
      <div className="footer-links"><Link to="/calculator">Calculator</Link><Link to="/formulas">Formulas</Link><Link to="/practice">Practice</Link></div>
      <span className="footer-note">Your history and progress stay in this browser.</span>
    </footer>
  </div>;
}

function Home({ progress, history, favorites }) {
  return <main>
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"/> YOUR EVERYDAY MATH COMPANION</div>
        <h1>Understand the math.<br/><span>Not just the answer.</span></h1>
        <p className="hero-lead">Calculate expressions, explore useful formulas, and practise step by step. A clear, student-friendly workspace for learning mathematics with confidence.</p>
        <div className="hero-actions"><Link to="/calculator" className="button primary">Open Expression Evaluator <ArrowRight size={17}/></Link><Link to="/practice" className="button secondary">Try a practice quiz <Play size={15}/></Link></div>
        <div className="hero-note"><span className="avatar-stack"><i>+</i><i>√</i><i>π</i></span><span><strong>Learn at your own pace</strong><small>No account needed · Works in your browser</small></span></div>
      </div>
      <div className="hero-art">
        <div className="art-glow"/>
        <div className="formula-float float-one">x² + y²</div><div className="formula-float float-two">√x</div><div className="formula-float float-three">π</div>
        <div className="hero-preview">
          <div className="preview-head"><div className="preview-brand"><span className="brand-icon small"><Calculator size={14}/></span><b>Expression evaluator</b></div><span className="ready-tag"><i/> Ready</span></div>
          <div className="preview-label">TRY AN EXPRESSION</div><div className="preview-expression">2 + 3 × 4</div>
          <div className="preview-rule"/>
          <div className="preview-label">RESULT</div><div className="preview-answer">14<span>.00</span></div>
          <div className="preview-bottom"><span><Check size={13}/> Correct precedence</span><span>↗</span></div>
        </div>
        <div className="learning-float"><span className="float-icon"><Lightbulb size={18}/></span><span><b>Learn as you calculate</b><small>Steps, formulas and practice</small></span></div>
        <div className="art-caption">A little clarity goes a long way.</div>
      </div>
    </section>

    <section className="benefit-strip container">
      <div><span className="benefit-icon purple"><Calculator size={18}/></span><span><b>Calculate</b><small>Evaluate expressions</small></span></div>
      <div><span className="benefit-icon green"><Lightbulb size={18}/></span><span><b>Understand</b><small>Follow supported steps</small></span></div>
      <div><span className="benefit-icon orange"><BookOpen size={18}/></span><span><b>Learn</b><small>Explore formulas</small></span></div>
      <div><span className="benefit-icon blue"><Brain size={18}/></span><span><b>Practise</b><small>Check your knowledge</small></span></div>
    </section>

    <section className="section container" id="features">
      <div className="section-heading center-heading"><div className="eyebrow">BUILT FOR STUDENTS</div><h2>More than a calculator.</h2><p>Practical tools that help you calculate, revise, and practise in one place.</p></div>
      <div className="feature-grid">
        <Feature icon={<Calculator/>} color="purple" title="Expression evaluator" desc="Solve arithmetic and scientific expressions with standard operator precedence and helpful input validation." link="/calculator" action="Open calculator"/>
        <Feature icon={<Lightbulb/>} color="orange" title="Step-by-step help" desc="See clear intermediate steps for supported operations so you can understand how an answer is reached." link="/calculator" action="Try an expression"/>
        <Feature icon={<BookOpen/>} color="green" title="Formula library" desc="Browse algebra, geometry, trigonometry, statistics and everyday maths formulas." link="/formulas" action="Explore formulas"/>
        <Feature icon={<ListChecks/>} color="blue" title="Practice quizzes" desc="Test your understanding with topic-based multiple-choice questions and immediate feedback." link="/practice" action="Start practising"/>
        <Feature icon={<History/>} color="pink" title="Saved history" desc="Revisit calculations and save favorite formulas. Your data stays in this browser using localStorage." link="/calculator" action="View history"/>
        <Feature icon={<GraduationCap/>} color="yellow" title="Study-friendly design" desc="Use keyboard shortcuts, dark mode, and a responsive layout on your laptop, tablet or phone." link="/calculator" action="Get started"/>
      </div>
    </section>

    <section className="section container getting-started">
      <div className="section-heading"><div><div className="eyebrow">GET STARTED IN SECONDS</div><h2>Three simple steps.</h2><p>No sign-up or complicated setup. Just open a tool and start learning.</p></div></div>
      <div className="steps-grid">
        <div className="step-card"><span>01</span><h3>Choose a tool</h3><p>Open the evaluator, look up a formula, or choose a practice quiz.</p></div>
        <div className="step-card"><span>02</span><h3>Work through it</h3><p>Enter your expression, read the supported steps, or answer a question.</p></div>
        <div className="step-card"><span>03</span><h3>Review and improve</h3><p>Reuse history, save formulas, and review your quiz performance.</p></div>
      </div>
    </section>

    <section className="section container home-example">
      <div className="example-band"><div><div className="eyebrow">A QUICK EXAMPLE</div><h2>See the steps, not just the result.</h2><p>Try an expression and explore how the order of operations works.</p><Link to="/calculator" className="button primary">Try it yourself <ArrowRight size={16}/></Link></div>
        <div className="mini-worked"><div className="mini-worked-label">EXPRESSION</div><div className="worked-line">2 + 3 × 4</div><div className="worked-step"><span>1</span><span>Multiply first: 3 × 4 = 12</span></div><div className="worked-step"><span>2</span><span>Add: 2 + 12 = 14</span></div><div className="worked-answer"><span>FINAL ANSWER</span><b>14</b></div></div>
      </div>
    </section>

    <section className="container cta-section"><div className="cta-band"><div><div className="eyebrow light-eyebrow">READY TO BEGIN?</div><h2>Make your next math session count.</h2><p>Calculate, understand, and practise — all in one simple workspace.</p></div><Link to="/calculator" className="button white-button">Open evaluator <ArrowRight size={17}/></Link><span className="cta-watermark">∑</span></div></section>
  </main>;
}

function Feature({ icon, color, title, desc, link, action }) {
  return <article className="feature-card"><span className={`feature-icon ${color}`}>{icon}</span><h3>{title}</h3><p>{desc}</p><Link to={link} className="feature-link">{action} <ArrowRight size={14}/></Link></article>;
}

function PageHeader({ eyebrow, title, description, icon }) {
  return <div className="page-heading"><span className="page-heading-icon">{icon}</span><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>;
}

function CalculatorPage({ history, addHistory, clearHistory }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [degrees, setDegrees] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [steps, setSteps] = useState([]);
  const [ans, setAns] = useState(undefined);
  const [tab, setTab] = useState("history");
  const [copied, setCopied] = useState(false);

  const calculate = (value = expression) => {
    try {
      const number = evaluateSafe(value, { degrees, ans });
      const formatted = formatNumber(number);
      setResult(formatted); setError(""); setAns(number);
      try {
        setSteps(getSteps(value, { degrees, ans }).map(s => ({...s})));
      } catch { setSteps([]); }
      addHistory({ id: `${Date.now()}-${Math.random()}`, expression: value, result: formatted, degrees, createdAt: new Date().toISOString() });
    } catch (e) { setResult(null); setSteps([]); setError(e.message || "Please check the expression."); }
  };
  const insert = value => setExpression(old => old + value);
  const keydown = e => {
    if (e.key === "Enter") { e.preventDefault(); calculate(); }
    if (e.key === "Escape") { setExpression(""); setResult(null); setError(""); setSteps([]); }
  };
  const copyResult = async () => {
    if (result === null) return;
    try { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { setError("Clipboard access is unavailable in this browser."); }
  };
  const keys = ["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","(",")","+","^","%","π"];
  const mapped = {"÷":"/","×":"*","−":"-","π":"pi"};
  return <main className="page-main container">
    <PageHeader eyebrow="YOUR MATH WORKSPACE" title="Expression Evaluator" description="Enter an expression, calculate the answer, and explore the steps for supported operations." icon={<Calculator/>}/>
    <div className="calc-layout">
      <section className="panel calculator-panel">
        <div className="panel-title-row"><div><h2>Calculator</h2><p>Scientific expressions made simple.</p></div><div className="angle-toggle"><button className={degrees?"active":""} onClick={()=>setDegrees(true)}>DEG</button><button className={!degrees?"active":""} onClick={()=>setDegrees(false)}>RAD</button></div></div>
        <form onSubmit={e=>{e.preventDefault();calculate();}}>
          <label className="input-label" htmlFor="expression-input">MATH EXPRESSION</label>
          <div className="expression-input-wrap"><input id="expression-input" autoFocus value={expression} onChange={e=>{setExpression(e.target.value);setError("");}} onKeyDown={keydown} placeholder="e.g. sqrt(144) + 3 * 2" autoComplete="off" spellCheck="false"/><button className="button primary calculate-submit" type="submit">Calculate <ArrowUpRight size={16}/></button></div>
        </form>
        <div className="function-chips"><span>FUNCTIONS</span>{["sqrt(","abs(","sin(","cos(","tan(","log(","ln(","round(","min(","max("].map(fn=><button key={fn} onClick={()=>insert(fn)}>{fn}</button>)}</div>
        <div className="keypad">{keys.map(key=><button key={key} className={["÷","×","−","+","^","%"].includes(key)?"operator-key":""} onClick={()=>insert(mapped[key]||key)}>{key}</button>)}<button className="key-clear" onClick={()=>{setExpression("");setResult(null);setError("");setSteps([]);}}>AC</button><button onClick={()=>setExpression(old=>old.slice(0,-1))}>⌫</button><button className="key-equals" onClick={()=>calculate()}>=</button></div>
        <div className={`result-box ${error?"has-error":""}`}><div className="result-heading"><span>RESULT</span><div className="result-actions"><button onClick={copyResult} disabled={result===null}><Copy size={14}/>{copied?"Copied":"Copy"}</button><button onClick={()=>{setExpression(result??expression);if(result!==null)setError("");}} disabled={result===null}>Use answer</button></div></div><div className="result-value">{error ? "Check expression" : result ?? "—"}</div><p>{error || (result!==null?"Calculated successfully.":"Your answer will appear here.")}</p></div>
        <div className="syntax-help"><CircleHelp size={15}/><span>Try <code>2 + 3 * 4</code>, <code>sqrt(81)</code>, <code>sin(30)</code> or <code>ans * 2</code>. Trigonometry follows the selected angle mode.</span></div>
        {result!==null && steps.length>0 && <section className="steps-panel"><div className="steps-head"><div><span className="section-kicker">LEARN WHILE YOU CALCULATE</span><h3>Solution steps</h3></div><button onClick={()=>setShowSteps(!showSteps)}>{showSteps?"Hide":"Show"} <ChevronDown size={15}/></button></div>{showSteps&&<ol className="solution-steps">{steps.map((step,i)=><li key={i}><span className="step-count">{i+1}</span><div><b>{step.title}</b><p>{step.detail}</p></div></li>)}</ol>}<p className="step-disclaimer">Steps are explanatory for supported patterns; complex expressions may show a general precedence explanation.</p></section>}
      </section>
      <aside className="side-panel">
        <section className="panel side-tabs-panel"><div className="tab-buttons"><button className={tab==="history"?"active":""} onClick={()=>setTab("history")}><History size={15}/> History</button><button className={tab==="help"?"active":""} onClick={()=>setTab("help")}><Lightbulb size={15}/> Syntax help</button></div>
          {tab==="history" ? <><div className="side-title"><div><h3>Recent calculations</h3><p>Stored in this browser</p></div><button className="text-button" onClick={clearHistory} disabled={!history.length}><Trash2 size={14}/></button></div>{history.length ? <ul className="history-list">{history.slice(0,10).map(item=><li key={item.id}><button onClick={()=>{setExpression(item.expression);setDegrees(item.degrees);setError("");setResult(item.result);}}><span><b>{item.expression}</b><small>{new Date(item.createdAt).toLocaleString([], {month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</small></span><strong>{item.result}</strong></button></li>)}</ul>:<div className="empty-state"><History size={25}/><b>No calculations yet</b><p>Your recent answers will appear here.</p></div>}</> :
          <div className="syntax-list"><h3>Supported syntax</h3><p><code>+ - * / % ^</code><span>Arithmetic operators</span></p><p><code>( )</code><span>Group calculations</span></p><p><code>pi, e, ans</code><span>Constants and previous answer</span></p><p><code>sqrt(x), abs(x)</code><span>Roots and absolute values</span></p><p><code>sin(x), cos(x), tan(x)</code><span>Trigonometry</span></p><p><code>log(x), ln(x)</code><span>Logarithms</span></p><p><code>min(a,b), max(a,b)</code><span>Compare values</span></p></div>}
        </section>
        <section className="panel quick-examples"><div className="side-title"><div><h3>Try an example</h3><p>Load one with a click</p></div><Sparkles size={17}/></div>{examples.slice(0,4).map(item=><button key={item.expression} className="quick-example" onClick={()=>{setExpression(item.expression);setDegrees(item.degrees??true);}}><span><b>{item.title}</b><small>{item.expression}</small></span><ArrowUpRight size={15}/></button>)}</section>
      </aside>
    </div>
  </main>;
}

function FormulaPage({ favorites, setFavorites }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [copied, setCopied] = useState("");
  const categories = ["All", ...new Set(formulas.map(f=>f.category))];
  const filtered = formulas.filter(f=>(category==="All"||f.category===category)&&(!savedOnly||favorites.includes(f.name))&&(f.name+" "+f.formula+" "+f.category+" "+f.note).toLowerCase().includes(query.toLowerCase()));
  const toggleFavorite = name => setFavorites(old=>old.includes(name)?old.filter(n=>n!==name):[...old,name]);
  const copyFormula = async formula => { try { await navigator.clipboard.writeText(formula); setCopied(formula); setTimeout(()=>setCopied(""),1200); } catch {} };
  return <main className="page-main container">
    <PageHeader eyebrow="YOUR QUICK REFERENCE" title="Formula Library" description="Find useful formulas by topic, save favorites, and copy formulas into your notes." icon={<BookOpen/>}/>
    <div className="library-toolbar"><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search formulas, topics or keywords…"/></label><button className={savedOnly?"filter-button active":"filter-button"} onClick={()=>setSavedOnly(!savedOnly)}>★ Saved ({favorites.length})</button></div>
    <div className="category-pills">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="formula-grid">{filtered.map(f=><article className="formula-card" key={f.name}><div className="formula-card-top"><span>{f.category}</span><button aria-label={favorites.includes(f.name)?"Remove favorite":"Save formula"} className={favorites.includes(f.name)?"favorite-button saved":"favorite-button"} onClick={()=>toggleFavorite(f.name)}>{favorites.includes(f.name)?"★":"☆"}</button></div><h3>{f.name}</h3><div className="formula-expression">{f.formula}</div><p>{f.note}</p><button className="copy-formula" onClick={()=>copyFormula(f.formula)}><Copy size={14}/>{copied===f.formula?"Copied":"Copy formula"}</button></article>)}</div>
    {!filtered.length&&<div className="empty-library"><Search size={26}/><h3>No formulas found</h3><p>Try a different search or category.</p><button className="button secondary" onClick={()=>{setQuery("");setCategory("All");setSavedOnly(false);}}>Clear filters</button></div>}
    <div className="note-banner"><Lightbulb size={20}/><div><b>Study tip</b><p>Save formulas you find difficult, then revisit them before a quiz or exam.</p></div></div>
  </main>;
}

function PracticePage({ progress, setProgress }) {
  const [topic, setTopic] = useState("All topics");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [session, setSession] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const available = useMemo(()=>questions.filter(q=>topic==="All topics"||q.topic===topic),[topic]);
  const current = session[index];
  const topics = ["All topics",...new Set(questions.map(q=>q.topic))];
  const startQuiz = () => {
    const pool = questions.filter(q=>topic==="All topics"||q.topic===topic);
    const shuffled = [...pool].sort(()=>Math.random()-.5);
    setSession(difficulty==="Quick" ? shuffled.slice(0,5) : shuffled);
    setIndex(0);setSelected(null);setChecked(false);setAnswers([]);setFinished(false);
  };
  const submitAnswer = () => {
    if(selected===null||!current)return;
    const correct=selected===current.answer;
    const nextAnswers=[...answers,{question:current.q,correct,selected,answer:current.answer}];
    setAnswers(nextAnswers);setChecked(true);
    setProgress(old=>({...old,attempted:old.attempted+1,correct:old.correct+(correct?1:0)}));
  };
  const nextQuestion = () => {
    if(index+1>=session.length){setFinished(true);return;}
    setIndex(index+1);setSelected(null);setChecked(false);
  };
  const score=answers.filter(a=>a.correct).length;
  const accuracy=progress.attempted?Math.round(progress.correct/progress.attempted*100):0;
  return <main className="page-main container">
    <PageHeader eyebrow="PRACTISE AND IMPROVE" title="Practice Quiz" description="Test your knowledge with short maths questions, instant feedback, and explanations." icon={<Brain/>}/>
    <div className="practice-layout">
      <section className="panel quiz-panel">
        {!session.length ? <div className="quiz-start"><span className="quiz-hero-icon"><ListChecks size={28}/></span><div className="eyebrow">YOUR NEXT STUDY SESSION</div><h2>Ready to test yourself?</h2><p>Choose a topic and a quiz length. You will see an explanation after each answer.</p><div className="quiz-options"><label>Topic<select value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(t=><option key={t}>{t}</option>)}</select></label><label>Quiz length<select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>Mixed</option><option>Quick</option></select></label></div><div className="quiz-facts"><span><Clock3 size={15}/> About {difficulty==="Quick"?"3–5":"5–10"} minutes</span><span><Check size={15}/> Instant feedback</span></div><button className="button primary full-button" onClick={startQuiz}>Start quiz <ArrowRight size={17}/></button></div> :
        finished ? <div className="quiz-finish"><span className="finish-icon"><GraduationCap size={30}/></span><div className="eyebrow">SESSION COMPLETE</div><h2>Nice work showing up.</h2><div className="score-circle"><strong>{score}/{session.length}</strong><span>correct</span></div><p>You answered {score} out of {session.length} questions correctly. Review any missed questions below, then try again to improve.</p><div className="review-list">{answers.map((a,i)=><div key={i} className={a.correct?"review-row correct":"review-row wrong"}><span>{a.correct?<Check size={15}/>:<X size={15}/>}</span><div><b>{a.question}</b><small>{a.correct?"Correct answer":"Correct answer: "+questions.find(q=>q.q===a.question)?.options[a.answer]}</small></div></div>)}</div><button className="button primary full-button" onClick={startQuiz}><RotateCcw size={16}/> Try another quiz</button><button className="button secondary full-button" onClick={()=>{setSession([]);setFinished(false);}}>Change topic</button></div> :
        current && <div className="question-area"><div className="quiz-progress"><span>QUESTION {index+1} OF {session.length}</span><span>{Math.round((index+(checked?1:0))/session.length*100)}% complete</span></div><div className="progress-track"><span style={{width:`${((index+(checked?1:0))/session.length)*100}%`}}/></div><span className="topic-tag">{current.topic}</span><h2>{current.q}</h2><div className="answer-options">{current.options.map((opt,i)=><button key={opt} disabled={checked} className={`answer-option ${selected===i?"chosen":""} ${checked&&i===current.answer?"right":""} ${checked&&selected===i&&i!==current.answer?"wrong":""}`} onClick={()=>setSelected(i)}><span className="option-letter">{String.fromCharCode(65+i)}</span>{opt}{checked&&i===current.answer&&<Check size={17}/>}</button>)}</div>{checked&&<div className={selected===current.answer?"feedback correct-feedback":"feedback wrong-feedback"}><b>{selected===current.answer?"Correct!":"Not quite — keep learning."}</b><p>{current.explanation}</p></div>}{!checked?<button className="button primary full-button" disabled={selected===null} onClick={submitAnswer}>Check answer <ArrowRight size={16}/></button>:<button className="button primary full-button" onClick={nextQuestion}>{index+1===session.length?"See results":"Next question"} <ArrowRight size={16}/></button>}<button className="quit-quiz" onClick={()=>{setSession([]);setFinished(false);}}>Exit quiz</button></div>}
      </section>
      <aside className="practice-sidebar"><section className="panel progress-panel"><div className="side-title"><div><h3>Your progress</h3><p>Saved on this device</p></div><GraduationCap size={20}/></div><div className="progress-stats"><div><b>{progress.attempted}</b><span>Attempted</span></div><div><b>{progress.correct}</b><span>Correct</span></div></div><div className="accuracy-label"><span>Overall accuracy</span><b>{accuracy}%</b></div><div className="progress-track"><span style={{width:`${accuracy}%`}}/></div><p className="progress-note">Your progress is stored locally in this browser.</p><button className="text-button reset-progress" onClick={()=>setProgress({attempted:0,correct:0,streak:0,lastDay:""})}>Reset progress</button></section><section className="panel study-tip"><span className="tip-icon"><Lightbulb size={19}/></span><h3>Small study tip</h3><p>Read the explanation even when you get an answer right. Understanding why makes it easier to solve a different question later.</p></section><section className="panel quiz-topics"><h3>Topics covered</h3>{topics.slice(1).map(t=><button key={t} onClick={()=>{setTopic(t);setSession([]);setFinished(false);}}><span>{t}</span><ArrowRight size={14}/></button>)}</section></aside>
    </div>
  </main>;
}

function NotFound(){return <main className="not-found container"><span>404</span><h1>Page not found</h1><p>The page you are looking for does not exist.</p><Link className="button primary" to="/">Back to home <ArrowRight size={16}/></Link></main>}
export default App;
