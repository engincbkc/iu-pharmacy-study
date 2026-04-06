# Content Plan - Data Files Structure

## 1. exam-questions.json

Past exam questions organized by year and type. This is the HIGHEST PRIORITY content.

### Source: PDF "Pharmaceutical Chemistry-2.pdf" + HTML files

```
Structure:
{
  "years": [
    {
      "year": "2024-2025",
      "midterm": [
        {
          "id": "2425-mid-1",
          "questionNumber": 1,
          "type": "open-ended",
          "topic": "Carbachol",
          "question": "Carbachol - IUPAC naming, uses, drawing and synthesis",
          "answer": {
            "iupacName": "2-(Carbamoyloxy)-N,N,N-trimethylethan-1-aminium chloride",
            "chemicalFormula": "H2N-CO-O-CH2-CH2-N+(CH3)3 Cl-",
            "uses": ["Glaucoma treatment", "Postoperative urinary retention", ...],
            "moa": "Both muscarinic (M3) and nicotinic receptor agonist",
            "synthesis": { "steps": [...] },
            "keyPoints": [
              "Not hydrolyzed by acetylcholinesterase (carbamate group)",
              "Long-acting (unlike ACh)",
              "Dual action: muscarinic + nicotinic"
            ]
          }
        }
      ],
      "final": [...]
    },
    {
      "year": "2021-2022",
      "midterm": [
        {
          "id": "2122-mid-1",
          "type": "multiple-choice",
          "question": "Which of the following statements is false for this compound?",
          "options": ["A) ...", "B) ...", ...],
          "correctAnswer": "A",
          "explanation": "..."
        }
      ]
    }
  ]
}
```

### Exam Questions to Include:

**2024-2025 Midterm (10 questions - open-ended):**
1. Carbachol - IUPAC, uses, drawing, synthesis
2. Neostigmine - naming, MOA, treatment, synthesis
3. Ipratropium Bromide - naming, MOA, treatment
4. Salbutamol - drawing, uses, synthesis
5. Inhaled anesthetics - classification + example
6. Halothane metabolites - liver toxic one, IUPAC
7. Barbiturate SAR (min 4-5 points)
8. Benzocaine - IUPAC, MOA, uses
9. Sedative-hypnotic classification
10. Phenobarbital - IUPAC given, draw structure

**2024-2025 Final (12 questions - open-ended):**
1. Propantheline Bromide - naming, synthesis, MOA, activity
2. Suxamethonium - synthesis, MOA, naming
3. Procaine - naming, MOA
4. Sedative-hypnotic classification + Phenobarbital
5. Antiseizure classification (7 types)
6. Phenytoin - IUPAC, draw, MOA, activity, synthesis
7. Chlorpromazine - IUPAC, MOA, activity + Phenothiazine SAR
8. Diazepam - naming, MOA, activity
9. Imipramine - naming, MOA, activity, synthesis
10. Lisinopril - naming, di-zwitterion explanation
11. Atorvastatin - naming, MOA, activity
12. Warfarin - draw, MOA, activity

**2021-2022 Midterm (15 MCQ):**
- Questions 1-15 as listed in PDF

**2022 Midterm (18 questions: 12 MCQ + 6 open-ended):**
- Partial data available

## 2. topics.json

Study topics with detailed notes.

```
Topics to cover:
1. Drug-Receptor Interactions (agonist, antagonist, partial agonist)
2. Isosterism and Bioisosterism
3. Beta-Blockers (aryloxypropanolamine SAR)
4. Barbiturates (sedative-hypnotics)
5. Penicillins (beta-lactam antibiotics)
6. Lipinski's Rule of Five
7. Drug Metabolism (Phase I & II)
8. Prodrugs
9. QSAR (Hansch Analysis)
10. Cholinergic Agents (direct & indirect)
11. Anticholinergic Agents
12. Adrenergic Agents (agonists & antagonists)
13. Local Anesthetics
14. Inhaled Anesthetics
15. Antipsychotics (Phenothiazines)
16. Benzodiazepines
17. Antidepressants (TCAs)
18. Anticonvulsants
19. ACE Inhibitors
20. Statins (HMG-CoA Reductase Inhibitors)
21. Anticoagulants
22. Fluoroquinolones
```

## 3. flashcards.json

Q&A pairs for memorization.

```
Categories:
- Drug-Receptor Concepts (~10 cards)
- SAR Rules (~15 cards)
- Drug Classifications (~10 cards)
- Mechanisms of Action (~15 cards)
- Key Formulas (~8 cards)
- Drug Names & IUPAC (~12 cards)
- Metabolism (~8 cards)
Total: ~78 flashcards
```

## 4. quiz-questions.json

Practice quiz questions (separate from past exams).

```
~50 multiple-choice questions covering all topics
Each with 4-5 options, correct answer, and explanation
```

## 5. sar-tables.json

SAR data for each drug class:
- Beta-Blockers
- Barbiturates
- Penicillins
- Fluoroquinolones
- Phenothiazines
- Local Anesthetics
- Benzodiazepines

## 6. formulas.json

Key equations:
- Hansch Analysis (QSAR)
- Henderson-Hasselbalch
- Partition Coefficient (LogP)
- Bioavailability (F%)
- Hammett Constant (sigma)

## 7. drugs.json

Drug database with:
- Generic name, brand name(s)
- IUPAC name
- Chemical formula (text representation)
- Drug class
- MOA summary
- Clinical uses
- Key SAR points
- Synthesis steps (where required by exams)

## 8. molecules.json

React Flow node/edge data for key molecular structures:
- Beta-blocker general structure (aryloxypropanolamine)
- Barbituric acid core
- Penicillin core (beta-lactam + thiazolidine)
- Phenothiazine core
- Benzodiazepine core
- Fluoroquinolone core

Each molecule has:
- Atom nodes with labels
- Bond edges with type (single, double)
- Functional group annotations
- SAR position markers
