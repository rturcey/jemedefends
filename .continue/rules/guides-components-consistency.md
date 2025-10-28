---
globs: frontend/src/components/guides/**/*.tsx
description: Ensure consistency across all guide-related components. The
  TableOfContents component should be the primary implementation, with
  GuideTOCDesktop and GuideTOCMobile serving as responsive wrappers. All
  components should use proper TypeScript interfaces, follow naming conventions,
  and implement accessibility features.
alwaysApply: true
---

All guide components must use TypeScript interfaces for props, follow consistent naming conventions, and implement proper error handling and accessibility features. The TableOfContents component should be the single source of truth for TOC functionality, with GuideTOCDesktop and GuideTOCMobile components delegating to it.