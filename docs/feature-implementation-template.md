# Feature Implementation Template

Use this template when implementing new features in DevKit. Copy this template for each new feature and fill in the details.

---

## Feature: [Feature Name]

**Phase:** [Phase Number]
**Priority:** [High/Medium/Low]
**Complexity:** [Low/Medium/High]
**Estimated Time:** [X days/weeks]
**Assigned To:** [Developer Name]
**Status:** [Not Started/In Progress/Review/Complete]

---

## 1. Overview

### 1.1 Description
[Brief description of what this feature does and why it's needed]

### 1.2 User Stories
- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

### 1.3 Success Criteria
- [ ] [Specific measurable outcome]
- [ ] [Specific measurable outcome]
- [ ] [Specific measurable outcome]

---

## 2. Technical Specification

### 2.1 Files to Create/Modify

**New Files:**
- `src/routes/[category]/[tool-name].tsx` - Route definition with loader
- `src/pages/[ToolName].tsx` - Page component with UI and logic
- `src/lib/[utility-name].ts` - Business logic and utilities
- `src/lib/validation-schemas.ts` - Add validation schema (modify existing)

**Modified Files:**
- `src/components/Header.tsx` - Add navigation link
- `src/pages/Home.tsx` - Add tool card
- `src/lib/navigation.ts` - Add tool metadata

### 2.2 Dependencies

**External Libraries:**
- [Library Name] - [Purpose] - [Version]
- [Library Name] - [Purpose] - [Version]

**Internal Dependencies:**
- `useConverterForm` - Form state management
- `useFormHelpers` - Focus management
- Form components - `FormSelect`, `FormTextArea`, `FormButton`

### 2.3 API Design

**Utility Functions:**
```typescript
// src/lib/[utility-name].ts

export const [ToolName] = {
  encode: async (input: string, options?: Options) => string
  decode: async (input: string, options?: Options) => string
  // Additional methods
}
```

**Validation Schema:**
```typescript
// src/lib/validation-schemas.ts

export const [toolName]Schema = z.object({
  mode: z.enum(['encode', 'decode']),
  // Additional fields
}).superRefine((data, ctx) => {
  // Conditional validation
})

export type [ToolName]Form = z.infer<typeof [toolName]Schema>
```

---

## 3. Implementation Steps

### 3.1 Setup (Dependencies)
- [ ] Install required npm packages: `npm install [package-name]`
- [ ] Verify dependencies in `package.json`

### 3.2 Business Logic (`src/lib/`)
- [ ] Create `src/lib/[utility-name].ts`
- [ ] Implement core conversion functions
- [ ] Add error handling with custom error classes
- [ ] Export namespaced API (e.g., `Base64.encode`)
- [ ] Add TypeScript types and interfaces

### 3.3 Validation (`src/lib/validation-schemas.ts`)
- [ ] Define Zod schema with all fields
- [ ] Add conditional validation with `superRefine`
- [ ] Validate input format, size, and content
- [ ] Export schema and inferred type

### 3.4 Page Component (`src/pages/`)
- [ ] Create `src/pages/[ToolName].tsx`
- [ ] Import and use `useConverterForm` hook
- [ ] Implement form with reusable components
- [ ] Add mode selection (if applicable)
- [ ] Add input/output fields
- [ ] Add submit and reset buttons
- [ ] Add error display with `FieldError`
- [ ] Add output display area

### 3.5 Route Setup (`src/routes/`)
- [ ] Create `src/routes/[category]/[tool-name].tsx`
- [ ] Import page component
- [ ] Define route with `createFileRoute`
- [ ] Add loader (if preloading dependencies)
- [ ] Add pending component (`LoaderPending`)

### 3.6 Navigation
- [ ] Add link in `src/components/Header.tsx`
- [ ] Add tool card in `src/pages/Home.tsx` (if home page exists)
- [ ] Update `src/lib/navigation.ts` with tool metadata

### 3.7 Testing
- [ ] Manual testing (encode/decode flows)
- [ ] Test edge cases (empty input, invalid format, large input)
- [ ] Test error handling
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test keyboard navigation (accessibility)
- [ ] Test with screen reader (if possible)

### 3.8 Documentation
- [ ] Update `CLAUDE.md` with new patterns (if applicable)
- [ ] Add comments to complex logic
- [ ] Update README.md roadmap (mark as complete)

---

## 4. Design & UI

### 4.1 Wireframe / Mockup
[Attach wireframe or describe layout]

```
┌─────────────────────────────────────────┐
│  [Tool Name]                            │
├─────────────────────────────────────────┤
│  Mode: [Encode ▼]                       │
│  [Option 1]: [Value ▼]                  │
│  [Option 2]: [Value ▼]                  │
│                                          │
│  Input:                                  │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │  [Input text area]                 │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [Reset]  [Convert]                     │
│                                          │
│  Output:                                 │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │  [Output text area]                │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 4.2 Component Hierarchy
```
[ToolName]
├── Form
│   ├── FormSelect (mode)
│   ├── FormSelect (options)
│   ├── FormTextArea (input)
│   ├── FormButton (reset)
│   └── FormButton (submit)
└── FormTextArea (output, readOnly)
```

---

## 5. Validation Rules

### 5.1 Input Validation
| Field | Rules | Error Message |
|-------|-------|---------------|
| Mode | Required, enum | "Mode must be 'encode' or 'decode'" |
| Input | Not empty, max 10MB | "Input cannot be empty" / "Input too large" |
| [Field] | [Rules] | [Message] |

### 5.2 Format-Specific Validation
[Describe validation for encode vs decode mode]

**Encode Mode:**
- [Validation rules for text input]

**Decode Mode:**
- [Validation rules for encoded input]

---

## 6. Error Handling

### 6.1 Error Scenarios
| Scenario | Error Type | User Message | Recovery |
|----------|------------|--------------|----------|
| Empty input | ValidationError | "Input cannot be empty" | User fills input |
| Invalid format | EncodingError | "Invalid format. Expected [format]" | User corrects input |
| Unsupported encoding | EncodingError | "Encoding not supported" | User selects valid encoding |
| [Scenario] | [Type] | [Message] | [Recovery] |

### 6.2 Error Codes
```typescript
// Add to src/lib/errors.ts if needed
export const ERROR_CODES = {
  // Existing codes...
  INVALID_[FORMAT]: 'INVALID_[FORMAT]',
}
```

---

## 7. Performance Considerations

### 7.1 Bundle Size
- **Expected Impact:** +[X]KB (gzipped)
- **Mitigation:** Lazy load dependencies, code splitting

### 7.2 Runtime Performance
- **Large Input Handling:** [Strategy for handling large inputs]
- **Debouncing/Throttling:** [If real-time conversion, describe throttling]

### 7.3 Lazy Loading
- [ ] Is the main library lazy-loaded?
- [ ] Is the route code-split?
- [ ] Are dependencies preloaded in route loader?

---

## 8. Accessibility

### 8.1 Requirements
- [ ] All form fields have accessible labels
- [ ] Error messages announced to screen readers
- [ ] Keyboard navigation functional (Tab, Enter, Esc)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] ARIA attributes correct (aria-label, aria-describedby, etc.)

### 8.2 Testing
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test with browser zoom (200%, 400%)

---

## 9. Security

### 9.1 Input Sanitization
- [ ] Validate all user input with Zod schemas
- [ ] Enforce size limits (10MB default)
- [ ] Escape output if rendering HTML (not applicable for text areas)

### 9.2 XSS Prevention
- [ ] No `dangerouslySetInnerHTML` used
- [ ] No `eval()` or `Function()` constructor
- [ ] User input never executed as code

---

## 10. Testing Checklist

### 10.1 Functional Testing
- [ ] Encode mode: valid input → correct output
- [ ] Decode mode: valid input → correct output
- [ ] Invalid input: shows error message
- [ ] Empty input: shows error message
- [ ] Large input (5MB): processes without freezing
- [ ] Reset button: clears form and output
- [ ] Mode change: clears output

### 10.2 Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### 10.3 Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 11. Deployment

### 11.1 Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Bundle size within limits
- [ ] Lighthouse scores maintained (90+)
- [ ] Manual QA on staging

### 11.2 Deployment Steps
1. Create pull request with feature branch
2. Review code (self-review + peer review)
3. Merge to main branch
4. Netlify auto-deploys to production
5. Verify on production URL
6. Monitor for errors (check Netlify logs)

---

## 12. Post-Implementation

### 12.1 Documentation
- [ ] Update `README.md` roadmap (mark feature as complete)
- [ ] Update `CLAUDE.md` if new patterns introduced
- [ ] Update `docs/feature-phases-quick-reference.md`

### 12.2 Monitoring
- [ ] Monitor error rates (if analytics added)
- [ ] Gather user feedback (if feedback mechanism added)
- [ ] Track performance metrics (Lighthouse CI)

---

## 13. Notes & Open Questions

[Add any notes, open questions, or decisions made during implementation]

---

## 14. Review & Sign-Off

**Implemented By:** [Developer Name]
**Reviewed By:** [Reviewer Name]
**Date Completed:** [YYYY-MM-DD]

**Review Checklist:**
- [ ] Code follows established patterns
- [ ] No code duplication
- [ ] Type safety maintained (no `any`)
- [ ] Error handling comprehensive
- [ ] Accessibility requirements met
- [ ] Performance targets met
- [ ] Documentation updated

---

**Template Version:** 1.0
**Last Updated:** December 27, 2025
