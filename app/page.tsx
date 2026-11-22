
"use client";

import Image from "next/image";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { olistCaseStudy } from "./content/olist-case-study";
import { ThemeToggle } from "./theme-toggle";

import type { Turn as ChatMessage } from "./content/assistant";
import { ModelControl } from "./model-control";
import { record } from "./analytics-events";

const PUBLIC_EMAIL = "sheikesuhelahmed@gmail.com";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/sheike-suhel-ahmed-17b195364";

const CERTIFICATE_PATH =
  "/sheikh-suhel-ahmed-google-data-analytics-certificate.pdf";
const CERTIFICATE_VERIFY_URL =
  "https://coursera.org/verify/professional-cert/FTD860N9SA70";

const IBM_PYTHON_CERTIFICATE_PATH =
  "/ibm-data-analysis-with-python.pdf";
const IBM_PYTHON_CERTIFICATE_VERIFY_URL =
  "https://coursera.org/verify/T8U7BENJRMUJ";

const ASPIRE_CERTIFICATE_PATH =
  "/aspire-institute-leadership-certificate.pdf";

const SQL_FILE = "/product_analysis.sql";
const CSV_FILE = "/product_analysis.csv";

const skills = [
  { name: "Excel", group: "Data tools", evidence: "Featured project" },
  { name: "SQL", group: "Data tools", evidence: "Project queries" },
  { name: "Power BI", group: "Data tools", evidence: "Developing" },
  { name: "Python", group: "Data tools", evidence: "IBM coursework" },
  { name: "Business Analysis", group: "Business", evidence: "Developing" },
  { name: "Case Competitions", group: "Business", evidence: "Developing" },
];

const suggestedQuestions = [
  "Tell me about Sheikh Suhel Ahmed.",
  "Explain the Olist project.",
  "What SQL skills does he demonstrate?",
  "What business insights did he discover?",
  "Which certificates has he completed?",
];

const navLinks = [
  ["Home", "home"],
  ["Projects", "projects"],
  ["About", "about"],
  ["Skills", "skills"],
  ["Education", "education"],
  ["Credentials", "certificates"],
  ["Ask AI", "ask-suhel-ai"],
  ["Contact", "contact"],
];

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function StatusBadge({
  children,
  tone = "pending",
}: {
  children: React.ReactNode;
  tone?: "known" | "pending" | "soon";
}) {
  return (
    <span className={`status-badge status-${tone}`}>
      {children}
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hello. I can answer recruiter questions using information presented in this portfolio.",
    },
  ]);

  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatLogRef.current?.scrollTo({
      top: chatLogRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [messages]);

  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [deviceReady, setDeviceReady] = useState(false);
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  async function copyAnswer(text: string) {
    try { await navigator.clipboard.writeText(text); setFeedback("Answer copied."); }
    catch { setFeedback("Copy unavailable. Select the answer text to copy it."); }
  }
  function clearChat() {
    if (pending.current) return;
    setMessages([]); setChatInput(""); setFeedback("Conversation cleared."); inputRef.current?.focus();
  }
  async function askQuestion(question: string, retry = false, useDevice = false) {
    const cleaned = question.trim().slice(0, 600);
    if (!cleaned || pending.current) return;
    pending.current = true;
    setBusy(true);
    setFeedback("");
    const history = (retry ? messages.slice(0,-2) : messages).slice(-10);
    if (!retry) { setChatInput(""); record("question"); }
    setMessages([...history, {role:"user",text:cleaned}]);
    try {
      const response = useDevice
        ? await (await import("./content/assistant")).answer(cleaned, history, true)
        : await (await import("./content/chat-client")).askPortfolio(cleaned, history);
      if (useDevice && response.mode !== "On-device AI") setFeedback("Local generation is unavailable. Showing portfolio evidence.");
      setMessages(current => [...current, response]);
    } catch {
      setMessages(current => [...current, {role: "assistant", text: "I couldn’t load the portfolio evidence. Please try again."}]);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askQuestion(chatInput);
  };

  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      askQuestion(chatInput);
    }
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Sheikh Suhel Ahmed, home">
          <span className="brand-mark">SA</span>
          <span className="brand-copy">
            <strong>Sheikh Suhel Ahmed</strong>
            <small>Data &amp; business portfolio</small>
          </span>
        </a>

        <div className="header-actions">
          <ThemeToggle />
          <button
            className="icon-button menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label="Toggle navigation"
          >
            <span aria-hidden="true">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>

        <nav
          className={menuOpen ? "main-nav nav-open" : "main-nav"}
          id="primary-nav" aria-label="Primary navigation"
        >
          {navLinks.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main-content">
        <section className="hero section-wrap" id="home">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />

          <div className="hero-copy">
            <div className="hero-kicker">
              <span /> Data &amp; Business Portfolio
            </div>

            <h1>
              Sheikh Suhel Ahmed
              <span>Data &amp; business analysis</span>
            </h1>

            <p className="hero-lead">
              I study business at North South University and use Excel and SQL to investigate delivery reliability, product sales and the decisions behind them.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View Projects <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-secondary" href="#ask-suhel-ai">
                Ask Suhel AI
              </a>
              <a className="button button-quiet" href="#contact">
                Contact
              </a>
            </div>

            <div className="hero-notes" aria-label="Profile snapshot">
              <div>
                <span>Academic base</span>
                <strong>BBA · North South University</strong>
              </div>
              <div>
                <span>Intended major</span>
                <strong>Management Information Systems</strong>
              </div>
              <div>
                <span>Expected graduation</span>
                <strong>2029</strong>
              </div>
            </div>
          </div>

          <aside className="profile-panel" aria-label="Profile">


            <div className="headshot-frame">
              <Image
                src="/sheikh-suhel-ahmed-headshot.jpg"
                alt="Sheikh Suhel Ahmed"
                fill
                sizes="(max-width: 860px) 82vw, 420px"
                priority
              />
            </div>

            <div className="profile-title">
              <p>Career direction</p>
              <h2>Data analysis + business thinking</h2>
            </div>

            <div className="signal-list">
              <div>
                <span className="signal-dot" />
                <span>Excel analytics evidence</span>
                <small>Project</small>
              </div>
              <div>
                <span className="signal-dot" />
                <span>Google Data Analytics</span>
                <small>Certificate</small>
              </div>
              <div>
                <span className="signal-dot" />
                <span>Business foundation</span>
                <small>BBA</small>
              </div>
            </div>
          </aside>
        </section>

        {/* PROJECTS: EXCEL + SQL + CSV */}
        <section className="projects section-wrap content-section" id="projects">
          <SectionHeading
            eyebrow="Projects"
            title="Selected projects"
            body="Explore the featured Excel case study and download the SQL query file and CSV dataset for the product-analysis project."
          />

          <article className="featured-project">
            <div className="featured-project-copy">
              <div className="project-badges">
                <StatusBadge tone="known">Featured project</StatusBadge>
                <span>Excel analytics</span>
              </div>

              
              <h3>{olistCaseStudy.title}</h3>
              <p>{olistCaseStudy.subtitle}</p>

              <div className="project-techniques">
                <span>Formulas</span>
                <span>Pivot tables</span>
                <span>KPI summary</span>
                <span>Charts</span>
              </div>

              <a className="button button-primary" href={`/projects/${olistCaseStudy.slug}`}>
                Read the Case Study <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="project-kpi-grid" aria-label="Olist project metrics">
              {olistCaseStudy.metrics.slice(0, 4).map((metric) => (
                <div key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="featured-project">
            <div className="featured-project-copy">
              <div className="project-badges">
                <StatusBadge tone="known">Downloadable files</StatusBadge>
                <span>SQL · CSV</span>
              </div>

              
              <h3>Product Analysis Using SQL</h3>
              <p>
                Which territories sold the selected black ML and MO products? Two queries filter product records and trace sales through order details, order headers and territories.
              </p>

              <div className="project-techniques">
                <span>SELECT</span>
                <span>WHERE</span>
                <span>ORDER BY</span>
                <span>INNER JOIN</span>
              </div>

              <div className="hero-actions">
                <a className="button button-primary" href={SQL_FILE} download>
                  Download SQL <span aria-hidden="true">↓</span>
                </a>
                <a className="button button-secondary" href={CSV_FILE} download>
                  Download CSV <span aria-hidden="true">↓</span>
                </a>
              </div>

              <p>
                Each CSV row is a matched sales detail. A product can appear in multiple rows and territories.
              </p>
            </div>

            <div className="project-kpi-grid">
              <div>
                <span>Sales detail rows</span>
                <strong>7,591</strong>
              </div>
              <div>
                <span>Products</span>
                <strong>25</strong>
              </div>
              <div>
                <span>Territories</span>
                <strong>10</strong>
              </div>
              <div>
                <span>Joined tables</span>
                <strong>4</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="about section-wrap content-section" id="about">
          <SectionHeading
            eyebrow="About Me"
            title="A business foundation, growing through data."
            body="A concise profile based on education, career direction, and current learning areas."
          />

          <div className="about-grid">
            <div className="about-statement">
              <span className="statement-mark">“</span>
              <p>
                I am a BBA student at North South University and an aspiring
                Data Analyst and Business Analyst. I am developing practical
                skills that connect structured data with clearer business
                decisions.
              </p>
            </div>

            <div className="principles-card">
              <p className="card-label">Current direction</p>
              <ul>
                <li><span>01</span> Build evidence through practical analysis</li>
                <li><span>02</span> Connect data findings to business questions</li>
                <li><span>03</span> Present work clearly for recruiter review</li>
              </ul>
              <div className="verified-summary">
                <StatusBadge tone="known">Current focus</StatusBadge>
                <p>Excel, SQL, Power BI, Python, business analysis, and case competitions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="skills section-wrap content-section" id="skills">
          <SectionHeading
            eyebrow="Skills"
            title="Skills in practice"
            body="Explore the project and course evidence behind each skill."
          />

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <article className="skill-card" key={skill.name}>
                <div className="skill-index">0{index + 1}</div>
                <div>
                  <p>{skill.group}</p>
                  <h3>{skill.name}</h3>
                </div>
                <StatusBadge tone={skill.evidence === "Developing" ? "soon" : "known"}>
                  {skill.evidence}
                </StatusBadge>
              </article>
            ))}
          </div>
        </section>

        <section className="education section-wrap content-section" id="education">
          <SectionHeading
            eyebrow="Education"
            title="Academic background."
            body="Current university studies and intended academic direction."
          />

          <article className="education-card">
            <div className="education-year">
              <span>2029</span>
              <small>Expected graduation</small>
            </div>

            <div className="education-main">
              <div className="education-title-row">
                <div>
                  <p>Bachelor of Business Administration</p>
                  <h3>North South University</h3>
                </div>
                <StatusBadge tone="known">Current student</StatusBadge>
              </div>

              <div className="education-details education-details-approved">
                <div>
                  <span>Degree</span>
                  <strong>Bachelor of Business Administration</strong>
                </div>
                <div>
                  <span>Intended major</span>
                  <strong>Management Information Systems</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>Current student</strong>
                </div>
                <div>
                  <span>Expected graduation</span>
                  <strong>2029</strong>
                </div>
              </div>
            </div>
          </article>
        </section>


        <section className="credentials section-wrap content-section" id="certificates">
          <SectionHeading
            eyebrow="Certificates"
            title="Learning credentials."
            body="View, verify, or download the available certificate documents."
          />

          <article className="certificate-card">
            <div className="certificate-mark" aria-hidden="true">G</div>
            <div className="certificate-copy">
              <StatusBadge tone="known">Certificate</StatusBadge>
              <p>Google · Coursera</p>
              <h3>Google Data Analytics Professional Certificate</h3>
              <div className="certificate-meta">
                <span>Completed</span>
                <strong>March 24, 2026</strong>
                <span>Program</span>
                <strong>9 courses</strong>
              </div>
            </div>
            <div className="certificate-actions">
              <a className="button button-primary" href={CERTIFICATE_PATH} target="_blank" rel="noreferrer">View Certificate</a>
              <a className="button button-secondary" href={CERTIFICATE_VERIFY_URL} target="_blank" rel="noreferrer">Verify</a>
              <a className="button button-quiet" href={CERTIFICATE_PATH} download>Download PDF</a>
            </div>
          </article>

          <article className="certificate-card">
            <div className="certificate-mark" aria-hidden="true">IBM</div>
            <div className="certificate-copy">
              <StatusBadge tone="known">Certificate</StatusBadge>
              <p>IBM · Coursera</p>
              <h3>Data Analysis with Python</h3>
              <div className="certificate-meta">
                <span>Completed</span>
                <strong>September 26, 2026</strong>
              </div>
            </div>
            <div className="certificate-actions">
              <a className="button button-primary" href={IBM_PYTHON_CERTIFICATE_PATH} target="_blank" rel="noreferrer">View Certificate</a>
              <a className="button button-secondary" href={IBM_PYTHON_CERTIFICATE_VERIFY_URL} target="_blank" rel="noreferrer">Verify</a>
              <a className="button button-quiet" href={IBM_PYTHON_CERTIFICATE_PATH} download>Download PDF</a>
            </div>
          </article>

          <article className="certificate-card">
            <div className="certificate-mark" aria-hidden="true">AI</div>
            <div className="certificate-copy">
              <StatusBadge tone="known">Certificate</StatusBadge>
              <p>Aspire Institute</p>
              <h3>Leadership Program</h3>
              <div className="certificate-meta">
                <span>Program</span>
                <strong>Aspire Institute Leadership Program</strong>
              </div>
            </div>
            <div className="certificate-actions">
              <a className="button button-primary" href={ASPIRE_CERTIFICATE_PATH} target="_blank" rel="noreferrer">View Certificate</a>
              <a className="button button-quiet" href={ASPIRE_CERTIFICATE_PATH} download>Download PDF</a>
            </div>
          </article>
          <details className="course-documents">
            <summary>Additional course certificates</summary>
            <ul>
              <li><a href="/certificate-data-foundations-with-ai.pdf">Data Foundations with AI</a> · August 17, 2026</li>
              <li><a href="/certificate-ai-powered-analytics.pdf">AI-Powered Analytics</a> · August 25, 2026</li>
              <li><a href="/certificate-from-insights-to-influence.pdf">From Insights to Influence</a> · August 31, 2026</li>
            </ul>
          </details>
        </section>

        <section className="ai-section section-wrap content-section" id="ask-suhel-ai">
          <SectionHeading
            eyebrow="Ask Suhel AI"
            title="Ask about my work"
            body="Ask a question, then follow up about a method, result or credential. Answers link back to the evidence."
          />

          <div className="ai-grid">
            <div className="ai-context">
              <div className="ai-badge">
                <span>AI</span>
                <i />
              </div>

              <h3>Suggested recruiter questions</h3>
              <p>Choose a topic or type a question and press Enter.</p>

              <div className="question-list">
                {suggestedQuestions.map((question) => (
                  <button key={question} disabled={busy} type="button" onClick={() => askQuestion(question)}>
                    <span>{question}</span>
                    <b aria-hidden="true">→</b>
                  </button>
                ))}
              </div>

              <div className="local-note">
                <span>How answers work</span>
                <p>When cloud AI is enabled, your question, recent questions and relevant public portfolio passages may be sent to Groq. Please keep questions professional and omit private information.</p>
                <ModelControl onReady={setDeviceReady} />
              </div>
            </div>

            <div className="chat-window">
              <div className="chat-header">
                <div>
                  <span className="chat-avatar">SA</span>
                  <p>
                    <strong>Ask Suhel AI</strong>
                    <small><i /> Portfolio evidence</small>
                  </p>
                </div>
                <button className="chat-action" disabled={busy || !messages.length} onClick={clearChat}>Clear conversation</button>
              </div>

              <div className="chat-log" ref={chatLogRef} aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    className={`chat-message message-${message.role}`}
                    key={`${message.role}-${index}`}
                  >
                    {message.role === "assistant" && (
                      <span className="message-avatar">AI</span>
                    )}
                    <div className="answer-body">
                      {message.mode && <small className="response-mode">{message.mode}</small>}{message.mode === "Cloud AI" && message.model && <small>{message.model}</small>}
                      <p>{message.text}</p>
                      {(message.references ?? (message.source ? [message.source] : [])).map(source => <a className="source-link" key={source.title} href={source.href}>{source.title} ↗</a>)}
                      {message.notice && <small>{message.notice}</small>}
                      {message.role === "assistant" && index > 0 && <div className="answer-actions">
                        <button className="chat-action" onClick={() => copyAnswer(message.text)}>Copy answer</button>
                        {index === messages.length-1 && messages[index-1]?.role === "user" && <>
                          <button className="chat-action" disabled={busy} onClick={() => askQuestion(messages[index-1].text,true)}>Retry</button>
                          {deviceReady && message.mode === "Portfolio sources" && message.source && <button className="chat-action" disabled={busy} onClick={() => askQuestion(messages[index-1].text,true,true)}>Expand on device</button>}
                        </>}
                      </div>}
                    </div>
                  </div>
                ))}
              </div>

              <small role="status" className="chat-feedback">{busy ? "Reading portfolio evidence…" : feedback}</small>
              <form className="chat-form" onSubmit={submitQuestion}>
                <label className="sr-only" htmlFor="recruiter-question">
                  Ask a recruiter question
                </label>
                <textarea
                  ref={inputRef}
                  rows={2}
                  aria-describedby="chat-keys"
                  id="recruiter-question"
                  maxLength={600}
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={submitOnEnter}
                  placeholder="Ask about education, skills, projects..."
                  autoComplete="off"
                />
                <button disabled={busy || !chatInput.trim()} type="submit" aria-label="Send question">↑</button>
              </form>

              <p className="chat-disclaimer">
                <span id="chat-keys">Enter to send · Shift+Enter for a new line</span>
              </p>
            </div>
          </div>
        </section>

        <section className="contact section-wrap content-section" id="contact">
          <div className="contact-panel">
            <div className="contact-copy">
              <p className="eyebrow">Contact</p>
              <h2>Start a professional conversation.</h2>
              <p>Use the public email or LinkedIn profile for professional enquiries.</p>
              <StatusBadge tone="known">Public contact</StatusBadge>
            </div>

            <div className="contact-list">
              <a href={`mailto:${PUBLIC_EMAIL}`}>
                <span>Email</span>
                <strong>{PUBLIC_EMAIL}</strong>
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                <span>LinkedIn</span>
                <strong>View profile ↗</strong>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <div>
          <span className="brand-mark">SA</span>
          <p>
            <strong>Sheikh Suhel Ahmed</strong>
            <small>Aspiring Data Analyst &amp; BBA Student</small>
          </p>
        </div>
        <p>Evidence-backed portfolio</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}
