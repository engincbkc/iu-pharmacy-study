# New Session Prompt

Copy everything below this line and paste it as your first message in a new Claude Code session:

---

I need you to build a Pharmaceutical Chemistry study platform. The project planning is already done. Read these files first:

1. `CLAUDE.md` - Project overview and constraints
2. `ARCHITECTURE.md` - Tech stack, project structure, data flow
3. `DESIGN_SYSTEM.md` - Colors, typography, spacing, component patterns
4. `STANDARDS.md` - Coding conventions, patterns, file organization
5. `CONTENT_PLAN.md` - Detailed content structure for all JSON data files

**Important rules:**
- Follow the architecture and standards documents strictly
- No emojis, no gradients in UI
- shadcn/ui with New York style, Zinc palette
- All pharmaceutical content in English, UI chrome bilingual (TR/EN)
- Content accuracy is critical - this is a medical/pharmacy exam prep tool
- Use React Flow 12.x for molecular structure diagrams
- Reusable, modular components following the composition pattern in STANDARDS.md
- Progress persistence with Zustand + localStorage

**Build order:**
1. Initialize Vite + React 19 + TypeScript project
2. Set up Tailwind CSS 4 + shadcn/ui
3. Install React Flow, Zustand, React Router, Lucide icons
4. Create the layout shell (sidebar + header + main content)
5. Set up i18n system (TR/EN)
6. Create all JSON data files with accurate pharmaceutical content (MOST IMPORTANT - reference CONTENT_PLAN.md)
7. Build pages one by one: Dashboard -> Topics -> Flashcards -> Quiz -> Exam Questions -> SAR -> Formulas
8. Add React Flow molecule viewer for key structures
9. Wire up progress tracking with Zustand

**Source materials** (for content accuracy verification):
- `/Users/engin/Desktop/pharmaceutical_chemistry_interactive.html` - Study notes
- `/Users/engin/Desktop/pharmaceutical_chemistry_FINAL.html` - Exam questions with answers
- The PDF content is already extracted into CONTENT_PLAN.md

Start building. Begin with project initialization and work through the build order. Don't ask questions - use the planning documents as your guide.

---
