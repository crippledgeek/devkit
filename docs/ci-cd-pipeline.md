# CI/CD Pipeline Documentation

**Last Updated:** December 27, 2025

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for DevKit, including GitHub Actions workflows and Netlify deployment.

---

## Table of Contents

1. [Overview](#overview)
2. [GitHub Actions Workflow](#github-actions-workflow)
3. [Netlify Deployment](#netlify-deployment)
4. [Quality Gates](#quality-gates)
5. [Troubleshooting](#troubleshooting)
6. [Future Enhancements](#future-enhancements)

---

## Overview

The DevKit CI/CD pipeline is designed to:
- ✅ Ensure code quality (linting, type checking)
- ✅ Prevent build failures (build validation)
- ✅ Automate deployments (Netlify)
- ✅ Provide preview environments for PRs

### Pipeline Architecture

```
┌─────────────────┐
│  Developer      │
│  Push/PR        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  GitHub Actions (CI)                     │
├─────────────────────────────────────────┤
│  1. Lint & Type Check                   │
│  2. Build                                │
│  3. Bundle Size Report                  │
└────────┬────────────────────────────────┘
         │
         ▼ (on merge to main)
┌─────────────────────────────────────────┐
│  Netlify (CD)                           │
├─────────────────────────────────────────┤
│  1. Auto-deploy to production           │
│  2. Generate preview for PRs            │
└─────────────────────────────────────────┘
```

---

## GitHub Actions Workflow

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

**Jobs:**

#### Job 1: Lint & Type Check
- **Purpose:** Validate code quality and type safety
- **Node Version:** 20.x
- **Steps:**
  1. Checkout code
  2. Setup Node.js with npm cache
  3. Install dependencies (`npm ci`)
  4. Run ESLint (`npm run lint`)
  5. Run TypeScript type check (`npx tsc -b --noEmit`)

**Quality Gates:**
- ❌ Fails if ESLint reports any errors
- ❌ Fails if TypeScript reports any type errors

**Why this matters:**
- Catches syntax errors and code style issues
- Prevents type-related bugs from reaching production
- Ensures consistent code quality across the team

---

#### Job 2: Build
- **Purpose:** Validate that the project builds successfully
- **Node Version:** 20.x
- **Dependencies:** Requires `lint-and-typecheck` to pass first
- **Steps:**
  1. Checkout code
  2. Setup Node.js with npm cache
  3. Install dependencies (`npm ci`)
  4. Build project (`npm run build`)
  5. Upload build artifacts (retained for 7 days)
  6. Generate bundle size report (visible in GitHub Actions summary)

**Quality Gates:**
- ❌ Fails if build process fails
- ℹ️ Bundle size report for visibility (no hard limit enforced)

**Artifacts:**
- `dist/` - Built application files (available for download for 7 days)
- Bundle size report in GitHub Actions summary tab

**Why this matters:**
- Ensures the code can be built successfully
- Detects import errors and build configuration issues
- Provides visibility into bundle size changes

---

## Netlify Deployment

### Configuration: `netlify.toml`

**Build Settings:**
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 20

### Deployment Strategy

#### Production Deployments (main/master branch)
1. Code merged to `main` or `master` branch
2. Netlify automatically detects the push
3. Runs build command (`npm run build`)
4. Deploys to production URL
5. Previous version available for instant rollback

**Production URL:** `https://your-site.netlify.app`

#### Preview Deployments (Pull Requests)
1. Pull request created or updated
2. Netlify automatically builds the PR branch
3. Generates unique preview URL
4. Posts comment on PR with preview link
5. Preview updates on every commit to the PR

**Preview URL Pattern:** `https://deploy-preview-{PR_NUMBER}--your-site.netlify.app`

### Netlify Features Enabled

✅ **SPA Routing:** All routes redirect to `/index.html` (status 200)
✅ **Security Headers:**
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

✅ **Caching:**
- `/assets/*` - Immutable (1 year) for Vite's hashed assets
- `/*.html` - Revalidate (max-age=0, must-revalidate)

✅ **Infrastructure:**
- Automatic HTTPS with SSL certificates
- Global CDN for fast delivery
- Atomic deploys (zero downtime)
- Instant rollbacks (one-click revert)
- Build caching for faster deployments

---

## Quality Gates

### Pre-Commit Checks (Local)
Developers should run before committing:
```bash
npm run lint          # ESLint
npx tsc -b --noEmit   # TypeScript type check
npm run build         # Build validation
```

### CI Checks (Automated)
Required to pass before merging:
- ✅ **ESLint:** No errors allowed
- ✅ **TypeScript:** No type errors allowed
- ✅ **Build:** Must complete successfully

### Code Review Checklist
See `.github/pull_request_template.md` for full checklist including:
- Code quality (TypeScript, no `any`, follows patterns)
- Testing (manual browser testing, functional testing, accessibility)
- Performance (bundle size awareness, lazy loading)
- Security (input validation, no XSS vulnerabilities)
- Documentation (CLAUDE.md, README.md updates)

---

## Troubleshooting

### CI Workflow Failures

#### ESLint Errors
**Symptoms:** `npm run lint` fails in CI

**Solutions:**
1. Run `npm run lint` locally to see errors
2. Fix linting issues manually or run `npm run lint -- --fix` (if auto-fixable)
3. Commit and push fixes

**Common causes:**
- Unused variables
- Missing semicolons (if configured)
- Console.log statements in production code
- Import/export issues

---

#### TypeScript Errors
**Symptoms:** `npx tsc -b --noEmit` fails in CI

**Solutions:**
1. Run `npx tsc -b --noEmit` locally to see errors
2. Fix type errors (avoid using `any` - use proper types)
3. Ensure all dependencies have types
4. Commit and push fixes

**Common causes:**
- Type mismatches (passing wrong type to function)
- Missing type definitions (`@types/*` packages)
- Incorrect generic types
- Null/undefined issues (use optional chaining `?.`)

---

#### Build Failures
**Symptoms:** `npm run build` fails in CI

**Solutions:**
1. Run `npm run build` locally to reproduce
2. Check for import errors or missing dependencies
3. Verify `vite.config.ts` is correct
4. Clear and reinstall:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

**Common causes:**
- Missing dependencies (not in `package.json`)
- Import path errors (case sensitivity on Linux)
- Environment variables missing (if added)
- Vite plugin configuration issues

---

### Netlify Deployment Failures

#### Build Fails on Netlify but Works Locally
**Common Causes:**
- Node version mismatch
- Environment variables missing
- Build command different from local
- Case-sensitive paths (Windows vs Linux)

**Solutions:**
1. Check Netlify build logs for specific error
2. Verify Node version matches `netlify.toml` (should be 20)
3. Ensure build command is exactly: `npm run build`
4. Test with exact Node version locally:
   ```bash
   nvm use 20
   npm run build
   ```

---

#### 404 on Routes (SPA Routing Issue)
**Symptoms:** Direct navigation to `/converters/text-to-binary` returns 404

**Solutions:**
1. Verify `netlify.toml` has SPA redirect rule:
   ```toml
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```
2. If rule exists, redeploy: **Deploys** → **Trigger deploy** → **Deploy site**

---

#### Slow Builds
**Symptoms:** Netlify builds take longer than expected (>3 minutes)

**Solutions:**
1. Check if npm packages are cached (should be automatic)
2. Review `package.json` for unnecessary dependencies
3. Consider reducing build steps if any custom scripts added

---

## Best Practices

### For Developers

1. **Before Creating PR:**
   - ✅ Run `npm run lint` and fix all errors
   - ✅ Run `npm run build` to ensure build succeeds
   - ✅ Test changes locally on Chrome, Firefox, Safari
   - ✅ Review your own code first (self-review)

2. **During Code Review:**
   - ✅ Use PR template checklist
   - ✅ Check CI workflow results (all green)
   - ✅ Test preview deployment URL
   - ✅ Verify bundle size hasn't increased significantly

3. **After Merging:**
   - ✅ Monitor Netlify deployment logs
   - ✅ Verify on production URL
   - ✅ Update feature tracking docs (if applicable)
   - ✅ Close related issues

### For Maintainers

1. **Daily:**
   - Review failed CI workflows
   - Merge approved PRs

2. **Weekly:**
   - Check for security vulnerabilities: `npm audit`
   - Review open PRs and issues
   - Update dependencies if needed: `npm update`

3. **Monthly:**
   - Review bundle size trends
   - Audit unused dependencies
   - Update major dependencies (test thoroughly)

---

## Future Enhancements

### Planned Additions

#### Performance Monitoring
- [ ] Add Lighthouse CI for automated performance testing
- [ ] Set performance budgets (FCP, LCP, CLS, TBT)
- [ ] Track Core Web Vitals over time

#### Automated Testing
- [ ] Add unit tests with Vitest
- [ ] Add test coverage reporting (Codecov)
- [ ] Add E2E tests with Playwright
- [ ] Add visual regression testing

#### Dependency Management
- [ ] Add Dependabot for automated dependency updates
- [ ] Configure automated security updates
- [ ] Group dependency updates by type

#### Quality & Security
- [ ] Add bundle analyzer to CI
- [ ] Add security scanning (npm audit in CI)
- [ ] Add automatic changelog generation
- [ ] Add semantic versioning with automated releases

---

## Resources

**GitHub Actions:**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

**Netlify:**
- [Netlify Documentation](https://docs.netlify.com/)
- [Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Netlify Redirects and Rewrites](https://docs.netlify.com/routing/redirects/)

**Vite:**
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Summary

The DevKit CI/CD pipeline provides:
- ✅ **Automated quality checks** on every PR
- ✅ **Fast feedback** (CI completes in ~2-3 minutes)
- ✅ **Safe deployments** with preview environments
- ✅ **Zero-downtime production deploys**
- ✅ **Instant rollback** capability

**Current Status:**
- Core CI/CD pipeline: ✅ Fully operational
- Netlify deployment: ✅ Configured and ready
- Performance monitoring: 📋 Planned for future
- Automated testing: 📋 Planned for future

---

**Document Version:** 1.0
**Maintained By:** DevKit Development Team
**Last Updated:** December 27, 2025
