# CI/CD Setup Guide

**Quick Start Guide for Setting Up the DevKit CI/CD Pipeline**

This guide will walk you through setting up the essential CI/CD pipeline for DevKit, from GitHub Actions to Netlify deployment.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ GitHub repository for DevKit (already exists)
- ✅ GitHub account with admin access to the repository
- ✅ Netlify account (free tier is sufficient)
- ✅ Node.js 20.x installed locally
- ✅ Git configured with SSH or HTTPS access

---

## Step 1: Enable GitHub Actions

GitHub Actions should be enabled by default, but let's verify:

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Actions** → **General** in the sidebar
4. Under "Actions permissions," ensure **Allow all actions and reusable workflows** is selected
5. Scroll down to "Workflow permissions"
6. Select **Read and write permissions**
7. Check **Allow GitHub Actions to create and approve pull requests**
8. Click **Save**

**Why:** This allows workflows to run and post reports on PRs.

---

## Step 2: Verify Workflow File

The following workflow file should exist in your repository:

```
.github/
└── workflows/
    └── ci.yml              # Main CI workflow
```

**To verify:**
```bash
ls -la .github/workflows/
```

You should see `ci.yml`.

**If missing:** The file was created in this session. Commit and push it:
```bash
git add .github/
git commit -m "ci: add GitHub Actions CI workflow"
git push origin main
```

---

## Step 3: Connect Netlify to GitHub

### 3.1 Create Netlify Account (if needed)

1. Go to [https://netlify.com](https://netlify.com)
2. Click **Sign up** and choose **GitHub** authentication
3. Authorize Netlify to access your GitHub account

### 3.2 Create New Site from Git

1. In Netlify dashboard, click **Add new site** → **Import an existing project**
2. Click **GitHub**
3. Authorize Netlify to access your repositories (if first time)
4. Select your DevKit repository from the list

### 3.3 Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

- **Branch to deploy:** `main` (or `master`)
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** Should use 20 (from `netlify.toml`)

Click **Deploy site**

### 3.4 Wait for Initial Deployment

- Netlify will start building your site
- Watch the deployment logs for any errors
- Once complete, you'll get a URL like `https://random-name-123.netlify.app`

### 3.5 Configure Custom Domain (Optional)

1. Click **Domain settings** in your Netlify site
2. Click **Add custom domain**
3. Enter your domain (e.g., `devkit.example.com`)
4. Follow Netlify's DNS instructions
5. SSL certificate will be automatically provisioned

---

## Step 4: Enable Netlify Deploy Previews

Deploy previews should be enabled by default, but verify:

1. In Netlify site dashboard, go to **Site settings** → **Build & deploy**
2. Scroll to **Deploy contexts**
3. Ensure these are enabled:
   - **Production branch:** `main` or `master`
   - **Deploy Previews:** ✅ Any pull request against your production branch/branch deploy branches
   - **Branch deploys:** (Optional) Enable for `develop` branch if you use it

4. Scroll to **Deploy notifications**
5. Consider enabling:
   - **GitHub commit statuses** (should be on by default)
   - **GitHub pull request comments** (useful for sharing preview URLs)

---

## Step 5: Test the CI/CD Pipeline

### 5.1 Create a Test Branch

```bash
git checkout -b test/ci-cd-pipeline
```

### 5.2 Make a Small Change

Edit `README.md` or add a comment somewhere:

```bash
echo "<!-- CI/CD test -->" >> README.md
git add README.md
git commit -m "test: verify CI/CD pipeline"
git push origin test/ci-cd-pipeline
```

### 5.3 Create Pull Request

1. Go to your GitHub repository
2. Click **Pull requests** → **New pull request**
3. Select `test/ci-cd-pipeline` as the compare branch
4. Click **Create pull request**
5. Fill in the PR template

### 5.4 Watch CI Workflow Run

You should see:

1. **CI Workflow** starts automatically
   - ✅ Lint & Type Check job runs (~1 min)
   - ✅ Build job runs (~1-2 min)
   - ✅ Bundle size report appears in workflow summary

2. **Netlify Deploy Preview**
   - 🔨 Netlify starts building (~1-2 min)
   - ✅ Preview URL posted as comment on PR
   - ✅ Deploy status check updates

### 5.5 Review Results

**GitHub Actions:**
- Click **Checks** tab on the PR
- Expand each workflow to see details
- Review bundle size report in workflow summary

**Netlify Preview:**
- Click the preview URL in the PR comment
- Test the site on the preview deployment
- Verify all routes work correctly

### 5.6 Merge (if successful)

If all checks pass:
1. Click **Merge pull request**
2. Choose **Squash and merge** or **Create a merge commit**
3. Delete the branch after merging

**What happens next:**
- Netlify automatically deploys to production
- Production site updates within ~2 minutes
- Old deployment available for rollback if needed

---

## Step 6: Set Up Branch Protection Rules (Recommended)

Protect your `main` branch from accidental pushes:

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main` (or `master`)
4. Enable these rules:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: 1 (if team, 0 if solo)
   - ✅ **Require status checks to pass before merging**
     - Search and add required checks:
       - `Lint & Type Check`
       - `Build`
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings** (if team)
5. Click **Create**

**Why:** Ensures all code goes through CI before reaching production.

---

## Step 7: Configure Notifications (Optional)

### GitHub Notifications

1. Go to **Settings** (personal, not repo) → **Notifications**
2. Configure how you want to be notified:
   - Email for failed workflows
   - Web + Mobile for PR reviews

### Netlify Notifications

1. In Netlify site, go to **Site settings** → **Build & deploy** → **Deploy notifications**
2. Add notifications:
   - **Email** for failed deployments
   - **Slack** (if you use Slack)
   - **Webhook** for custom integrations

---

## Step 8: Monitor and Maintain

### Daily
- Review failed CI workflows (if any)
- Merge approved PRs

### Weekly
- Check for security vulnerabilities: `npm audit`
- Review open PRs and issues
- Update dependencies if needed: `npm update`

### Monthly
- Review bundle size trends in CI artifacts
- Audit unused dependencies
- Test production site on multiple browsers

---

## Troubleshooting

### CI Workflow Not Running

**Check:**
1. GitHub Actions enabled in repository settings
2. Workflow file exists: `.github/workflows/ci.yml`
3. Branch name matches workflow trigger (e.g., PR to `main`, `master`)

**Solution:**
```bash
# Verify workflow file exists
ls -la .github/workflows/

# Check workflow syntax is valid
cat .github/workflows/ci.yml
```

### Netlify Build Fails

**Check:**
1. Build logs in Netlify dashboard
2. Node version matches `netlify.toml` (should be 20)
3. Build command correct: `npm run build`

**Solution:**
```bash
# Test build locally with exact Node version
nvm use 20
npm run build

# If fails, clear cache and retry
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Routes

**Symptoms:** Direct navigation to `/converters/text-to-binary` returns 404

**Solution:**
1. Verify `netlify.toml` has SPA redirect rule:
   ```toml
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```
2. Redeploy if needed

---

## Verification Checklist

After completing setup, verify:

- [ ] GitHub Actions workflows run on PR creation
- [ ] ESLint and TypeScript checks pass
- [ ] Build succeeds and artifacts are uploaded
- [ ] Bundle size report appears in workflow summary
- [ ] Netlify creates deploy preview for PRs
- [ ] Netlify deploys to production on merge to main
- [ ] Branch protection rules are active (if configured)
- [ ] Notifications are set up (optional)

---

## Next Steps

✅ **CI/CD is now fully operational!**

1. Start implementing features from the roadmap
2. Create PRs using the template (`.github/pull_request_template.md`)
3. Monitor CI results and fix any failures
4. Test preview deployments before merging
5. Monitor production deployments after merging

---

## Future Enhancements

When you're ready to add more automation:

### Performance Monitoring
- Add Lighthouse CI for automated performance testing
- Set performance budgets (FCP, LCP, CLS, TBT)

### Automated Testing
- Add unit tests with Vitest
- Add E2E tests with Playwright

### Dependency Management
- Add Dependabot for automated dependency updates
- Configure automated security updates

See [CI/CD Pipeline Documentation](./ci-cd-pipeline.md) for detailed information on future enhancements.

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Documentation](https://docs.netlify.com/)
- [CI/CD Pipeline Documentation](./ci-cd-pipeline.md) - Full technical details

---

**Setup Guide Version:** 1.0
**Last Updated:** December 27, 2025
