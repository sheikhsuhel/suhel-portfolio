
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

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

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
  { name: "SQL", group: "Data tools", evidence: "Developing" },
  { name: "Power BI", group: "Data tools", evidence: "Developing" },
  { name: "Python", group: "Data tools", evidence: "Developing" },
  { name: "Business Analysis", group: "Business", evidence: "Developing" },
  { name: "Case Competitions", group: "Business", evidence: "Developing" },
];

const suggestedQuestions = [
  "What is Suhel studying?",
  "Tell me about Suhel's Olist project.",
  "Which Excel techniques did Suhel use?",
  "What certificates has Suhel completed?",
  "Tell me about the Aspire certificate.",
  "Tell me about IBM Data Analysis with Python.",
  "What skills does Suhel have?",
  "How can I contact Suhel?",
];

const navLinks = [
  ["Home", "home"],
  ["About", "about"],
  ["Skills", "skills"],
  ["Education", "education"],
  ["Projects", "projects"],
  ["Certificate", "certificates"],
  ["Ask AI", "ask-suhel-ai"],
  ["Contact", "contact"],
];

function getVerifiedAnswer(question: string) {
  const query = question.toLowerCase().trim();

  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query.includes("good morning") ||
    query.includes("good afternoon") ||
    query.includes("good evening")
  ) {
    return "Hello! I'm Ask Suhel AI. I can answer questions about Suhel's education, skills, projects, certificates, and professional contact information using information presented in this portfolio.";
  }

  if (
    query.includes("who is suhel") ||
    query.includes("who is sheikh") ||
    query.includes("tell me about suhel") ||
    query.includes("about suhel") ||
    query.includes("introduce suhel") ||
    query === "suhel"
  ) {
    return "Sheikh Suhel Ahmed is a BBA student at North South University and an aspiring Data Analyst and Business Analyst. He is developing practical data-analysis skills alongside his business education.";
  }

  if (
    query.includes("study") ||
    query.includes("studying") ||
    query.includes("education") ||
    query.includes("university") ||
    query.includes("degree") ||
    query.includes("bba") ||
    query.includes("major") ||
    query.includes("graduation")
  ) {
    return "Suhel is studying for a Bachelor of Business Administration at North South University. His intended major is Management Information Systems, and his expected graduation year is 2029.";
  }

  if (
    query.includes("career") ||
    query.includes("future") ||
    query.includes("job") ||
    query.includes("aspiration")
  ) {
    return "Suhel's career direction focuses on data analysis and business analysis. He is developing Excel, SQL, Power BI, Python, business-analysis, and case-solving skills.";
  }

  if (
    query.includes("olist") ||
    query.includes("e-commerce project") ||
    query.includes("ecommerce project") ||
    query.includes("featured project") ||
    query.includes("project finding") ||
    query.includes("project findings")
  ) {
    return "Suhel's featured Excel project analyzes 99,441 Olist orders. The workbook reports 96,478 delivered orders, an average delivery time of 12.5 days, a 91.9% on-time rate, and 7,827 late orders. The case study documents formulas, pivot tables, charts, findings, and recommendations.";
  }

  if (
    query.includes("99441") ||
    query.includes("99,441") ||
    query.includes("96478") ||
    query.includes("96,478") ||
    query.includes("7827") ||
    query.includes("7,827") ||
    query.includes("12.5") ||
    query.includes("91.9")
  ) {
    return "The Olist workbook contains 99,441 orders. It reports 96,478 delivered orders, an average delivery time of 12.5 days, a 91.9% on-time rate, and 7,827 late orders.";
  }

  if (
    query.includes("excel") ||
    query.includes("spreadsheet") ||
    query.includes("formula") ||
    query.includes("pivot") ||
    query.includes("chart") ||
    query.includes("kpi")
  ) {
    return "Suhel's Olist Excel project uses a structured Excel table, IF/AND/OR/DAYS formulas, pivot tables, charts, and a KPI summary.";
  }

  if (
    query.includes("skill") ||
    query.includes("technology") ||
    query.includes("tools") ||
    query.includes("technical")
  ) {
    return "The portfolio lists Excel, SQL, Power BI, Python, Business Analysis, and Case Competitions. Excel is supported by a featured project; the other areas are presented as developing skills.";
  }

  if (query.includes("sql") || query.includes("database") || query.includes("queries")) {
    return "SQL is one of Suhel's developing data-tool skills. His product-analysis project includes a downloadable SQL query file and CSV dataset.";
  }

  if (query.includes("power bi") || query.includes("powerbi") || query.includes("dashboard")) {
    return "Power BI is one of Suhel's developing data-tool skills.";
  }

  if (query.includes("python") && !query.includes("ibm")) {
    return "Python is one of Suhel's developing data-tool skills.";
  }

  if (
    query.includes("certificates") ||
    query.includes("certifications") ||
    query.includes("credentials")
  ) {
    return "The portfolio includes the Google Data Analytics Professional Certificate, IBM Data Analysis with Python certificate, and Aspire Institute Leadership Program certificate.";
  }

  if (query.includes("google")) {
    return "Suhel completed the Google Data Analytics Professional Certificate through Google and Coursera on March 24, 2026. The portfolio provides certificate and verification links.";
  }

  if (query.includes("ibm")) {
    return "Suhel completed IBM Data Analysis with Python through IBM and Coursera. The portfolio provides certificate and verification links.";
  }

  if (query.includes("aspire") || query.includes("leadership")) {
    return "The Aspire Institute Leadership Program certificate is included in the portfolio's Certificate section.";
  }

  if (
    query.includes("contact") ||
    query.includes("email") ||
    query.includes("reach") ||
    query.includes("linkedin") ||
    query.includes("recruiter")
  ) {
    return `You can contact Suhel at ${PUBLIC_EMAIL} or connect through the LinkedIn profile linked in the Contact section.`;
  }

  if (query.includes("cv") || query.includes("resume")) {
    return "A public CV is not currently included in this portfolio.";
  }

  if (query.includes("portfolio") || query.includes("website") || query.includes("github")) {
    return "This portfolio presents Suhel's education, skills, certificates, projects, and contact information. Ask Suhel AI uses pre-written answers rather than an external AI API.";
  }

  if (query.includes("thank") || query.includes("thanks")) {
    return "You're welcome! Feel free to ask another question about Suhel's portfolio.";
  }

  return `I do not have a verified answer to that question yet. You can ask about education, skills, the Olist project, SQL, certificates, or contact information. For other questions, email ${PUBLIC_EMAIL}.`;
}

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
      behavior: "smooth",
    });
  }, [messages]);

  const askQuestion = (question: string) => {
    const cleaned = question.trim();
    if (!cleaned) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: cleaned },
      { role: "assistant", text: getVerifiedAnswer(cleaned) },
    ]);

    setChatInput("");
  };

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askQuestion(chatInput);
  };

  const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
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
            aria-label="Toggle navigation"
          >
            <span aria-hidden="true">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>

        <nav
          className={menuOpen ? "main-nav nav-open" : "main-nav"}
          aria-label="Primary navigation"
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
              <span /> Verification-first portfolio
            </div>

            <h1>
              Sheikh Suhel Ahmed
              <span>Aspiring Data Analyst &amp; BBA Student</span>
            </h1>

            <p className="hero-lead">
              Developing data and business-analysis skills through structured
              learning and evidence-backed work at North South University.
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
            <div className="panel-topline">
              <span>PROFILE / VERIFIED</span>
              <StatusBadge tone="known">Approved photo</StatusBadge>
            </div>

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

        <section className="about section-wrap content-section" id="about">
          <SectionHeading
            eyebrow="01 / About Me"
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
            eyebrow="02 / Skills"
            title="Skills supported by honest evidence."
            body="Excel is demonstrated through the featured case study. Other areas are active learning priorities."
          />

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <article className="skill-card" key={skill.name}>
                <div className="skill-index">0{index + 1}</div>
                <div>
                  <p>{skill.group}</p>
                  <h3>{skill.name}</h3>
                </div>
                <StatusBadge tone={skill.evidence === "Featured project" ? "known" : "soon"}>
                  {skill.evidence}
                </StatusBadge>
              </article>
            ))}
          </div>
        </section>

        <section className="education section-wrap content-section" id="education">
          <SectionHeading
            eyebrow="03 / Education"
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

        {/* PROJECTS: EXCEL + SQL + CSV */}
        <section className="projects section-wrap content-section" id="projects">
          <SectionHeading
            eyebrow="04 / Projects"
            title="Practical data analysis projects."
            body="Explore the featured Excel case study and download the SQL query file and CSV dataset for the product-analysis project."
          />

          <article className="featured-project">
            <div className="featured-project-copy">
              <div className="project-badges">
                <StatusBadge tone="known">Featured project</StatusBadge>
                <span>Excel analytics</span>
              </div>

              <p className="project-overline">Project 01</p>
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

              <p className="project-overline">Project 02</p>
              <h3>Product Analysis Using SQL</h3>
              <p>
                A beginner SQL project exploring product IDs, product names,
                list prices, sizes, and regional sales data. Download the
                SQL query file and CSV dataset to inspect the analysis.
              </p>

              <div className="project-techniques">
                <span>SELECT</span>
                <span>WHERE</span>
                <span>ORDER BY</span>
                <span>Aggregate functions</span>
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
                These links work when both files are stored in the project's
                <code> public </code> folder with the matching filenames.
              </p>
            </div>

            <div className="project-kpi-grid">
              <div>
                <span>Analysis tool</span>
                <strong>SQL</strong>
              </div>
              <div>
                <span>Data format</span>
                <strong>CSV</strong>
              </div>
              <div>
                <span>Focus</span>
                <strong>Products</strong>
              </div>
              <div>
                <span>Goal</span>
                <strong>Data analysis</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="credentials section-wrap content-section" id="certificates">
          <SectionHeading
            eyebrow="05 / Certificates"
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
        </section>

        <section className="ai-section section-wrap content-section" id="ask-suhel-ai">
          <SectionHeading
            eyebrow="06 / Ask Suhel AI"
            title="A recruiter assistant grounded in portfolio information."
            body="This local interface uses pre-written answers. No external AI service or paid API is connected."
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
                  <button key={question} type="button" onClick={() => askQuestion(question)}>
                    <span>{question}</span>
                    <b aria-hidden="true">→</b>
                  </button>
                ))}
              </div>

              <div className="local-note">
                <span>LOCAL VERIFIED MODE</span>
                <p>Answers are limited to information presented on this website.</p>
              </div>
            </div>

            <div className="chat-window">
              <div className="chat-header">
                <div>
                  <span className="chat-avatar">SA</span>
                  <p>
                    <strong>Ask Suhel AI</strong>
                    <small><i /> Verified-data mode</small>
                  </p>
                </div>
                <span className="offline-label">No API connected</span>
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
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>

              <form className="chat-form" onSubmit={submitQuestion}>
                <label className="sr-only" htmlFor="recruiter-question">
                  Ask a recruiter question
                </label>
                <input
                  id="recruiter-question"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={submitOnEnter}
                  placeholder="Ask about education, skills, projects..."
                  autoComplete="off"
                />
                <button type="submit" aria-label="Send question">↑</button>
              </form>

              <p className="chat-disclaimer">
                For other questions, email Suhel at {PUBLIC_EMAIL}.
              </p>
            </div>
          </div>
        </section>

        <section className="contact section-wrap content-section" id="contact">
          <div className="contact-panel">
            <div className="contact-copy">
              <p className="eyebrow">07 / Contact</p>
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
