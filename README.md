# Sheikh Suhel Ahmed � Data & Business Portfolio

The existing React App Router portfolio includes the Olist Excel case study, SQL project downloads, education, skills and certificate documents. The production domain is https://suhel-portfolio-blue.vercel.app/.

## Development

Use Node 22.15 or later and pnpm. Run `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm lint` and `pnpm test`. The test command builds the existing Vinext worker, checks server-rendered pages and exercises the assistant and analytics routes. Vercel uses its existing Git integration.

## Ask Suhel AI

The assistant retrieves local portfolio passages, carries the previous topic into follow-ups and links to its evidence. Browsers with an already-installed, available Prompt API language model synthesize replies locally. Other browsers return the retrieved passage. On eligible devices, visitors can explicitly enable a model download. The assistant works during setup. Chat text stays in page memory and is excluded from analytics.

## Private traffic dashboard

Visit `/admin` over HTTPS. Configure these server-only variables in the existing Vercel project and redeploy to activate collection:

- `ADMIN_ANALYTICS_TOKEN` - a random printable ASCII password of at least 32 characters. Use the HTTP Basic username `admin`.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` - credentials for a dedicated free Upstash Redis database.

The dashboard locks when its password is absent. Collection is disabled until all three variables are configured. Counts begin at activation. Each allowlisted event increments one UTC daily counter, retained for 35 days. The dashboard displays seven days of pageviews, active reading and engagement. No cookies, chat text, IP addresses or visitor identifiers are written by the application. Do Not Track disables client events. Public counts are directional and can include bots or repeat visits.

The three additional course PDFs are listed with their document titles and dates. The Google and IBM cards also link to the issuer verification records.
