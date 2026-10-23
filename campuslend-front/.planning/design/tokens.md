# CampusLend Design Tokens

## Colors

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Primary | --color-primary | #0056b3 | Buttons, links, active states |
| Primary Light | --color-primary-light | #e6f0ff | Background accents, hover states |
| Secondary | --color-secondary | #64748b | Secondary text, borders |
| Success | --color-success | #10b981 | Success messages, confirmation |
| Warning | --color-warning | #f59e0b | Warning messages, alerts |
| Error | --color-error | #ef4444 | Error messages, validation |
| Background | --color-background | #f8fafc | Page backgrounds, containers |
| Surface | --color-surface | #ffffff | Cards, modals, elevated surfaces |
| Muted | --color-muted | #94a3b8 | Helper text, disabled states |

## Typography

- Font family: Inter var, system-ui, sans-serif
- Scale: 
  - h1 (36px/800) → Page title
  - h2 (30px/700) → Section title
  - h3 (24px/600) → Subsection title
  - h4 (20px/500) → Card title
  - body (16px/400) → Default text
  - small (14px/400) → Secondary/helper text
  - xs (12px/400) → Caption, footnote

## Spacing

- Base: 4px
- Scale: 
  - xs (4px) → hairline spacing
  - sm (8px) → compact spacing
  - md (16px) → default spacing
  - lg (24px) → comfortable spacing
  - xl (32px) → spacious spacing
  - 2xl (48px) → section spacing

## Radius

- Card: 0.5rem (8px)
- Button: 0.375rem (6px)
- Badge: 0.25rem (4px)
- Avatar: 9999px (fully rounded)

## Shadows

- sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- md: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
- lg: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
- xl: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
- inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)

## Glassmorphism

- Background: rgba(255, 255, 255, 0.7)
- Background Hover: rgba(255, 255, 255, 0.8)
- Border: rgba(255, 255, 255, 0.3)
- Border Hover: rgba(255, 255, 255, 0.4)
- Shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15)
- Shadow Hover: 0 12px 40px 0 rgba(31, 38, 135, 0.2)

## Transitions

- Fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Medium: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
