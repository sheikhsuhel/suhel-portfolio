# Sheikh Suhel Ahmed · Data & Business Portfolio

The existing React App Router portfolio includes the Olist Excel case study, SQL project downloads, education, skills and certificate documents. The production domain is https://suhel-portfolio-blue.vercel.app/.

## Development

Use Node 22.15 or later and pnpm. Run `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm lint` and `pnpm test`. The test command builds the existing Vinext worker, checks server-rendered pages and exercises the assistant and analytics routes. Vercel uses its existing Git integration.

## Ask Suhel AI

Ask Suhel selects public evidence by project, topic and question terms before requesting generation. The UI labels every answer with its actual mode and links to the supporting records. Only the last three visitor questions and a public source identifier cross the chat API boundary. The site does not log conversation text.

To enable cloud answers, set `GROQ_API_KEY` as a **server-only Production** variable in the existing Vercel project, using a key from a Groq **Free** organization, then redeploy. Optional variables are `AI_PROVIDER=groq` and `AI_MODEL=openai/gpt-oss-120b`. Without an explicit model, a model access error also permits the documented Free-plan alternative `openai/gpt-oss-20b`. Set `AI_PROVIDER=off` to disable cloud generation. The app does not inspect billing or upgrade accounts.

The server enforces an 8 KiB body limit, 600 characters per question, an eight-second provider deadline, a maximum of two attempts and 640 completion tokens. Replies are buffered so citation IDs and numbers can be checked before display. The service applies per-minute limits (4 requests per caller, 12 per instance); existing Redis credentials enable shared counters across instances. Groq organization quotas apply across all instances. Access tokens and raw conversation text are excluded from analytics.

Missing configuration, throttling and provider errors yield source passages. A visitor with an available local browser model can then choose **Expand on device**. A local model download always requires an explicit action. The three Grameenphone Academy PDFs verify individual courses. The public Aspire document verifies the program and 40 hours. Cohort number, IBM Generative AI and a separate Grameenphone program award need further public evidence.

Provider references: [models](https://console.groq.com/docs/models), [Free limits](https://console.groq.com/docs/rate-limits), [billing](https://console.groq.com/docs/billing-faqs), [service terms](https://console.groq.com/docs/legal/services-agreement).

## Private traffic dashboard

Visit `/admin` over HTTPS. Configure these server-only variables in the existing Vercel project and redeploy to activate collection:

- `ADMIN_ANALYTICS_TOKEN` - a random printable ASCII password of at least 32 characters. Use the HTTP Basic username `admin`.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` - credentials for a dedicated free Upstash Redis database.

The dashboard locks when its password is absent. Collection is disabled until all three variables are configured. Counts begin at activation. Each allowlisted event increments one UTC daily counter, retained for 35 days. The dashboard displays seven days of pageviews, active reading and engagement. No cookies, chat text, IP addresses or visitor identifiers are written by the application. Do Not Track disables client events. Public counts are directional and can include bots or repeat visits.

The three additional course PDFs are listed with their document titles and dates. The Google and IBM cards also link to the issuer verification records.
