# Frogbot v3 GitHub npm demo

Minimal Node/npm project with intentional Critical/High vulnerabilities. [Frogbot v3](https://docs.jfrog.com/security/docs/frogbot-v3) scans the repo via GitHub Actions, shows findings in GitHub and the JFrog Platform, and opens an aggregated autofix pull request for human review.

## Intentional vulnerable dependencies

| Package | Pinned version | Typical severity | Why it’s here |
|---------|----------------|------------------|---------------|
| `handlebars` | 4.5.2 | Critical | Fixable direct dep for autofix demo |
| `minimist` | 1.2.5 | Critical | Fixable direct dep for autofix demo |
| `lodash` | 4.17.15 | High | Fixable direct dep for autofix demo |
| `ejs` | 3.1.5 | Critical | Fixable direct dep for autofix demo |

These are **direct** dependencies so Frogbot can open remediation PRs (autofix upgrades directs only).

```bash
npm install
npm start -- --name=Demo
```

## One-time GitHub setup

1. Create an empty GitHub repo and push this project to `main`.
2. Add Actions secrets (`Settings → Secrets and variables → Actions`):
   - `JF_URL` — JFrog Platform URL (e.g. `https://myorg.jfrog.io`)
   - `JF_ACCESS_TOKEN` — token with Xray read and Deploy to the Frogbot/SBOM results repository
3. Allow Actions to create PRs: `Settings → Actions → General → Workflow permissions` → **Read and write permissions** and enable **Allow GitHub Actions to create and approve pull requests**.
4. On the JFrog side, ensure the repo is indexed under **Administration → Xray Settings → Indexed Resources → Git Repositories** (or inherits your org Frogbot Config Profile).

## Workflows

| Workflow | When | What it does |
|----------|------|--------------|
| [`.github/workflows/frogbot-scan-repository.yml`](.github/workflows/frogbot-scan-repository.yml) | Push to `main`, schedule, or manual | Full SCA scan; uploads results to JFrog; opens **one** aggregated autofix PR (`JF_GIT_AGGREGATE_FIXES=TRUE`) |
| [`.github/workflows/frogbot-scan-pull-request.yml`](.github/workflows/frogbot-scan-pull-request.yml) | PR opened/updated targeting `main` | Compares source vs target; comments only on **new** issues |

Both use `jfrog/frogbot@v3`.

## How to run the demo

1. Push to `main` (or run **Actions → Frogbot Scan Repository → Run workflow**).
2. On **GitHub**:
   - Open the Actions run and confirm SCA findings in the logs.
   - Expect an autofix PR titled roughly `[🐸 Frogbot] Update npm dependencies` (or per-package titles if aggregation is off). Review the dependency bumps, then merge when ready.
3. In **JFrog**:
   - Go to **Xray → Scans List → Git Repositories** and open this org/repo for the uploaded scan / SBOM findings.

### Optional: PR decoration

Open a branch that adds another vulnerable direct dependency and open a PR to `main`. Frogbot should comment only on issues introduced by that PR.

## Notes

- Frogbot autofix runs on **repository/commit scans**, not PR scans.
- If the scan reports zero packages (`Couldn't determine a package manager`), check DEBUG logs in Actions and that the Git repo is bound to a Frogbot Config Profile on the platform.
