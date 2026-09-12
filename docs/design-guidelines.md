# Design Guidelines

## Overview

Đi Đây uses a calm editorial travel language with practical product interactions. The interface should feel local, clear and image-led without looking like a generic travel marketplace.

## Design Direction

- Design variance: 7, asymmetric on large screens and single column below 768px
- Motion intensity: 4, entry and feedback motion only
- Visual density: 5, enough information for trip decisions without dashboard clutter
- Accent: forest green only
- Theme: system preference with manual light and dark toggle

## Shape System

- Cards and media: 18px
- Inputs: 14px
- Compact media: 10px to 12px
- Buttons and chips: full pill
- Icon-only controls: circle

## Interaction Rules

- Every control needs keyboard focus and a visible label
- Loading skeletons match final content dimensions
- Empty and error states explain the next action
- Motion honors `prefers-reduced-motion`
- Images reserve width and height to reduce layout shift

## Content Rules

- Vietnamese copy is direct and concrete
- Displayed price, rating and review data must be marked as mock until backed by an API
- Avoid tourism clichés and generic superlatives
- Use short headings and action labels
