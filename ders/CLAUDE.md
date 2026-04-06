# Pharmaceutical Chemistry Study Platform

## Project Overview
A React + Vite study application for Istanbul University Faculty of Pharmacy - Pharmaceutical Chemistry 2 course. The app includes interactive study topics, flashcards, quizzes, past exam questions (2021-2025), SAR reference tables, and molecular structure viewers.

## Quick Reference
- **Architecture**: See `ARCHITECTURE.md`
- **Design System**: See `DESIGN_SYSTEM.md`
- **Coding Standards**: See `STANDARDS.md`
- **Content Data**: See `CONTENT_PLAN.md`

## Key Constraints
- All pharmaceutical content is in English (user studies in English)
- UI chrome supports Turkish/English toggle
- No emojis, no gradients in UI
- shadcn/ui New York style with Zinc palette
- React Flow for molecular structure diagrams
- Static JSON for all content (no backend)
- Progress persisted to localStorage via Zustand

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npx shadcn@latest add <component>` - Add shadcn component

## Content Accuracy
All pharmaceutical data must be scientifically accurate. Key drug classes covered:
- Cholinergic agents (Carbachol, Neostigmine, Ipratropium)
- Adrenergic agents (Salbutamol, Propranolol, Atenolol)
- Barbiturates (Phenobarbital, Thiopental)
- Local anesthetics (Benzocaine, Procaine, Lidocaine)
- Antipsychotics (Chlorpromazine, Phenothiazine SAR)
- Benzodiazepines (Diazepam)
- Antidepressants (Imipramine)
- Cardiovascular (Lisinopril, Atorvastatin, Warfarin, Losartan)
- Anticonvulsants (Phenytoin)
- Beta-lactam antibiotics (Penicillins)
- Fluoroquinolones
