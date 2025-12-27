## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Dependency update

## Related Issue

<!-- Link to the related issue if applicable -->

Closes #

## Changes Made

<!-- List the key changes made in this PR -->

-
-
-

## Testing

<!-- Describe the tests you ran to verify your changes -->

### Manual Testing
- [ ] Tested on Chrome (latest)
- [ ] Tested on Firefox (latest)
- [ ] Tested on Safari (latest)
- [ ] Tested on Edge (latest)
- [ ] Tested on mobile (responsive design)

### Functional Testing
- [ ] All features work as expected
- [ ] Error handling tested
- [ ] Edge cases tested (empty input, large input, invalid format)
- [ ] Output validation verified

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader tested (if possible)
- [ ] Color contrast verified (WCAG 2.1 AA)
- [ ] Focus indicators visible

## Code Quality Checklist

<!-- Ensure your code meets these standards -->

- [ ] Code follows the established patterns in the codebase
- [ ] TypeScript types are properly defined (no `any` types)
- [ ] ESLint passes with no warnings
- [ ] TypeScript compiler passes with no errors
- [ ] Build succeeds (`npm run build`)
- [ ] No console.log statements in production code
- [ ] Comments added for complex logic
- [ ] No code duplication

## Performance Checklist

- [ ] Bundle size impact is acceptable (check CI artifacts)
- [ ] Heavy dependencies are lazy-loaded if applicable
- [ ] Route is code-split (if adding new route)
- [ ] Images are optimized (if applicable)
- [ ] No performance regressions (check Lighthouse CI results)

## Security Checklist

- [ ] User input is validated with Zod schemas
- [ ] Input size limits enforced (10MB default)
- [ ] No use of `dangerouslySetInnerHTML`
- [ ] No use of `eval()` or `Function()` constructor
- [ ] No hardcoded secrets or credentials

## Documentation

- [ ] CLAUDE.md updated (if new patterns introduced)
- [ ] README.md updated (if user-facing changes)
- [ ] Feature documentation added (if new feature)
- [ ] Code comments added for complex logic
- [ ] API documentation updated (if applicable)

## Screenshots / Recordings

<!-- Add screenshots or recordings to demonstrate the changes (if UI changes) -->

### Before
<!-- Screenshot or description of current state -->

### After
<!-- Screenshot or description of new state -->

## Deployment Checklist

- [ ] This PR can be deployed to production
- [ ] Database migrations included (if applicable - N/A for this project)
- [ ] Environment variables documented (if added/changed)
- [ ] Breaking changes documented (if applicable)

## Reviewer Notes

<!-- Any additional context or notes for reviewers -->

## Post-Merge Tasks

<!-- List any tasks that need to be done after merging -->

- [ ] Update docs/feature-phases-quick-reference.md (mark feature as complete)
- [ ] Monitor Netlify deployment for errors
- [ ] Verify on production URL
- [ ] Close related issues

---

**Self-Review Checklist (for PR author before requesting review):**

- [ ] I have reviewed my own code
- [ ] I have tested all changes locally
- [ ] I have checked that the CI pipeline passes
- [ ] I have resolved all merge conflicts
- [ ] I have updated the documentation
- [ ] This PR is ready for review
