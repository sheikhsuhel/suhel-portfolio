import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { olistCaseStudy } from "../../content/olist-case-study";
import { ThemeToggle } from "../../theme-toggle";

export const metadata: Metadata = {
  title: "Olist Excel Analytics Case Study | Sheikh Suhel Ahmed",
  description: "A verified Excel case study covering 99,441 Olist orders, delivery KPIs, pivot tables, formulas, charts, findings, and recommendations.",
};

const maxStatus = Math.max(...olistCaseStudy.statusDistribution.map((item) => item.value));
const maxYear = Math.max(...olistCaseStudy.yearlyVolume.map((item) => item.value));

function ChartBar({ value, max }: { value: number; max: number }) {
  return <i style={{ "--chart-bar": `${Math.max((value / max) * 100, 0.45)}%` } as CSSProperties} />;
}

export default function OlistCaseStudyPage() {
  return (
    <div className="case-study-shell">
      <header className="case-study-nav section-wrap">
        <Link className="brand" href="/#home" aria-label="Return to Sheikh Suhel Ahmed portfolio">
          <span className="brand-mark">SA</span>
          <span className="brand-copy"><strong>Sheikh Suhel Ahmed</strong><small>Portfolio</small></span>
        </Link>
        <div className="case-study-nav-actions">
          <ThemeToggle />
          <Link className="button button-secondary" href="/#projects">← Back to portfolio</Link>
        </div>
      </header>

      <main>
        <section className="case-hero section-wrap" id="top">
          <div className="case-hero-copy">
            <p className="eyebrow">Featured Excel Case Study</p>
            <div className="project-badges">
              <span className="status-badge status-known">Verified workbook</span>
              <span>Excel · Order operations</span>
              <span>{olistCaseStudy.completionDate}</span>
            </div>
            <h1>{olistCaseStudy.title}</h1>
            <p>{olistCaseStudy.subtitle}</p>
            <div className="case-hero-actions">
              <a className="button button-primary" href="#findings">View Findings</a>
              <a className="button button-secondary" href="#workflow">See Excel Workflow</a>
            </div>
          </div>
          <div className="case-metric-grid" aria-label="Project KPI summary">
            {olistCaseStudy.metrics.map((metric) => (
              <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>
            ))}
          </div>
        </section>

        <section className="case-section section-wrap two-column-story">
          <article className="case-story-card">
            <p className="eyebrow">Project summary</p>
            <h2>Turning order records into an operations view.</h2>
            <p>
              This Excel workbook organizes Olist order records into a structured analysis of order status, purchase-year volume, delivery speed, and delivery reliability. It combines row-level formulas, pivot tables, charts, and a compact KPI summary.
            </p>
            <dl className="project-context">
              <div><dt>Role</dt><dd>{olistCaseStudy.role}</dd></div>
              <div><dt>Completed</dt><dd>{olistCaseStudy.completionDate}<small>{olistCaseStudy.completionDateEvidence}</small></dd></div>
            </dl>
          </article>
          <article className="case-story-card">
            <p className="eyebrow">Business problem</p>
            <h2>How reliably are orders being completed?</h2>
            <p>
              The workbook evaluates how many orders reach delivery, how long delivery takes, how often delivery meets the estimate, and how order volume changes across the purchase years represented in the data.
            </p>
          </article>
        </section>

        <section className="case-section section-wrap" id="dataset">
          <div className="case-section-heading">
            <p className="eyebrow">Dataset overview</p>
            <h2>Order-level data with a clear delivery timeline.</h2>
          </div>
          <div className="dataset-grid">
            <div><span>Worksheet</span><strong>{olistCaseStudy.datasetLabel}</strong></div>
            <div><span>Unique orders</span><strong>99,441</strong></div>
            <div><span>Fields</span><strong>10</strong></div>
            <div><span>Purchase period</span><strong>{olistCaseStudy.period}</strong></div>
          </div>
          <div className="field-list" aria-label="Dataset fields">
            {[
              "order_id",
              "customer_id",
              "order_status",
              "order_purchase_timestamp",
              "order_approved_at",
              "order_delivered_carrier_date",
              "order_delivered_customer_date",
              "order_estimated_delivery_date",
              "delivery_days",
              "is_late",
            ].map((field) => <code key={field}>{field}</code>)}
          </div>
          <aside className="dataset-source" aria-label="Dataset attribution">
            <div className="dataset-source-grid">
              <div><span>Dataset name</span><strong>{olistCaseStudy.dataset.name}</strong></div>
              <div><span>Original publisher</span><strong>{olistCaseStudy.dataset.publisher}</strong></div>
              <div><span>Source</span><strong>{olistCaseStudy.dataset.source}</strong></div>
              <div><span>Accessed</span><strong>{olistCaseStudy.dataset.accessedDate}</strong></div>
            </div>
            <a href={olistCaseStudy.dataset.url} target="_blank" rel="noreferrer">View original dataset source ↗</a>
            <p>{olistCaseStudy.dataset.attribution}</p>
          </aside>
        </section>

        <section className="case-section section-wrap" id="workflow">
          <div className="case-section-heading">
            <p className="eyebrow">Excel techniques used</p>
            <h2>A formula-to-pivot workflow.</h2>
          </div>
          <div className="workflow-grid">
            {olistCaseStudy.techniques.map((technique, index) => (
              <article key={technique}><span>0{index + 1}</span><p>{technique}</p></article>
            ))}
          </div>
          <div className="formula-grid">
            <article>
              <span>Calculated field</span>
              <h3>Delivery days</h3>
              <code>=IF(AND(G2&lt;&gt;&quot;&quot;,D2&lt;&gt;&quot;&quot;),DAYS(G2,D2),&quot;&quot;)</code>
              <p>Calculates elapsed days only when purchase and delivered-customer timestamps are available.</p>
            </article>
            <article>
              <span>Classification field</span>
              <h3>Delivery status</h3>
              <code>=IF(OR(G2=&quot;&quot;,H2=&quot;&quot;),&quot;Unknown&quot;,IF(G2&gt;H2,&quot;Late&quot;,&quot;On Time&quot;))</code>
              <p>Classifies delivery against the estimated date while preserving missing-date cases as Unknown.</p>
            </article>
          </div>
        </section>

        <section className="case-section section-wrap">
          <div className="case-section-heading">
            <p className="eyebrow">Pivot tables</p>
            <h2>Three compact views of operating performance.</h2>
          </div>
          <div className="pivot-grid">
            {olistCaseStudy.pivots.map((pivot, index) => (
              <article key={pivot.title}>
                <span>Pivot 0{index + 1}</span>
                <h3>{pivot.title}</h3>
                <p>{pivot.purpose}</p>
                <code>{pivot.range}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="case-section section-wrap" id="charts">
          <div className="case-section-heading">
            <p className="eyebrow">Workbook charts</p>
            <h2>Actual chart values, presented accessibly.</h2>
          </div>
          <div className="verified-chart-grid">
            <figure className="verified-chart">
              <figcaption><span>Bar chart</span><strong>Order Distribution by Status</strong></figcaption>
              <div className="horizontal-chart">
                {olistCaseStudy.statusDistribution.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <div><ChartBar value={item.value} max={maxStatus} /></div>
                    <strong>{item.value.toLocaleString("en-US")}</strong>
                  </div>
                ))}
              </div>
            </figure>
            <figure className="verified-chart">
              <figcaption><span>Line-chart source values</span><strong>Order Volume by Purchase Year</strong></figcaption>
              <div className="year-chart">
                {olistCaseStudy.yearlyVolume.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value.toLocaleString("en-US")}</strong>
                    <div><ChartBar value={item.value} max={maxYear} /></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="chart-audit-note">The source workbook calls this chart “Monthly Order Volume,” but its categories are annual totals. This page labels the values accurately.</p>
            </figure>
          </div>
        </section>

        <section className="case-section section-wrap" id="findings">
          <div className="case-section-heading">
            <p className="eyebrow">Key findings</p>
            <h2>What the workbook actually reports.</h2>
          </div>
          <ol className="findings-list">
            {olistCaseStudy.findings.map((finding, index) => (
              <li key={finding}><span>{String(index + 1).padStart(2, "0")}</span><p>{finding}</p></li>
            ))}
          </ol>
        </section>

        <section className="case-section section-wrap recommendation-section">
          <div className="case-section-heading">
            <p className="eyebrow">Business recommendations</p>
            <h2>Practical next steps grounded in the workbook.</h2>
          </div>
          <div className="recommendation-grid">
            {olistCaseStudy.recommendations.map((recommendation, index) => (
              <article key={recommendation}><span>R{index + 1}</span><p>{recommendation}</p></article>
            ))}
          </div>
        </section>

        <section className="case-section section-wrap skills-demonstrated">
          <div>
            <p className="eyebrow">Skills demonstrated</p>
            <h2>Evidence from one complete Excel workflow.</h2>
          </div>
          <div className="skill-chip-list">
            {olistCaseStudy.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </section>

        <section className="case-cta section-wrap">
          <p className="eyebrow">Continue exploring</p>
          <h2>Return to the portfolio or ask a verified recruiter question.</h2>
          <div>
            <Link className="button button-primary" href="/#ask-suhel-ai">Ask Suhel AI</Link>
            <Link className="button button-secondary" href="/#contact">Contact Suhel</Link>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <div><span className="brand-mark">SA</span><p><strong>Sheikh Suhel Ahmed</strong><small>Olist Excel Analytics Case Study</small></p></div>
        <p>Verified workbook values · Evidence-backed case study</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
