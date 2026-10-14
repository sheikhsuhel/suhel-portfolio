                  id="recruiter-question"
                  value={chatInput}
                  onChange={(event) =>
                    setChatInput(
                      event.target.value
                    )
                  }
                  onKeyDown={submitOnEnter}
                  placeholder="Ask about education, skills, projects..."
                  autoComplete="off"
                />

                <button
                  type="submit"
                  aria-label="Send question"
                >
                  ↑
                </button>
              </form>

              <p className="chat-disclaimer">
                For unanswered verified questions,
                email Suhel at{" "}
                {PUBLIC_EMAIL}.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          className="contact section-wrap content-section"
          id="contact"
        >
          <div className="contact-panel">
            <div className="contact-copy">
              <p className="eyebrow">
                07 / Contact
              </p>

              <h2>
                Start a professional
                conversation.
              </h2>

              <p>
                Use the approved public email or
                LinkedIn profile for recruiter and
                professional enquiries.
              </p>

              <StatusBadge tone="known">
                Public contact approved
              </StatusBadge>
            </div>

            <div className="contact-list">
              <a
                href={`mailto:${PUBLIC_EMAIL}`}
              >
                <span>Email</span>
                <strong>
                  {PUBLIC_EMAIL}
                </strong>
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
              >
                <span>LinkedIn</span>
                <strong>
                  View profile ↗
                </strong>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer section-wrap">
        <div>
          <span className="brand-mark">
            SA
          </span>

          <p>
            <strong>
              Sheikh Suhel Ahmed
            </strong>

            <small>
              Aspiring Data Analyst &amp; BBA
              Student
            </small>
          </p>
        </div>

        <p>
          Verified content · Evidence-backed
          portfolio
        </p>

        <a href="#home">
          Back to top ↑
        </a>
      </footer>
    </div>
  );
}
