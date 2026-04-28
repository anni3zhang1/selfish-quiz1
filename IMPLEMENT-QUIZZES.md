# Implement 9 New Quizzes

## What to do

Add 9 new quiz topics to the Selfish app. The quiz data is ready in `quiz-data/*.json`. You need to convert each JSON file into a TypeScript quiz module and register it.

**No component changes, no API changes, no database changes.** The quiz system is already built and working for AI Governance. You're just adding data files and wiring them up.

## Reference implementation

`src/lib/quizzes/ai-governance.ts` is the template. Every new quiz file must follow this exact pattern. Study it before starting.

Key patterns:
- Uses `const TOPIC = "slug_name"` at the top
- Uses helper `const f = (text: string) => ({ id: "E", text, freeform: true as const })` for option E
- `followupQuestions` is a `Record<string, Question>` containing MC follow-up sub-questions (the ones with IDs like `q1a`, `q3a`)
- `main` is an `AnyQuestion[]` containing all main questions in order
- The last question uses `freeformOnly: true` (no options array)
- Freeform follow-ups (type: "freeform") stay inline in the main question's `followups` object — they are NOT in `followupQuestions`
- Only MC follow-ups (type: "mc") go into `followupQuestions`
- Exports a single object: `{ topic, topicLabel, questions: main, followupQuestions }`
- Types are imported from `../types` — use `AnyQuestion` and `Question`

## The 9 quizzes to add

| JSON source file | TypeScript file to create | TOPIC slug | topicLabel | Export name |
|---|---|---|---|---|
| `quiz-data/climate.json` | `src/lib/quizzes/climate.ts` | `climate` | `Climate` | `climateQuiz` |
| `quiz-data/longevity.json` | `src/lib/quizzes/longevity.ts` | `longevity` | `Longevity` | `longevityQuiz` |
| `quiz-data/meaning_crisis.json` | `src/lib/quizzes/meaning-crisis.ts` | `meaning_crisis` | `Meaning Crisis` | `meaningCrisisQuiz` |
| `quiz-data/bioethics.json` | `src/lib/quizzes/bioethics.ts` | `bioethics` | `Bioethics` | `bioethicsQuiz` |
| `quiz-data/truth_and_media.json` | `src/lib/quizzes/truth-media.ts` | `truth_media` | `Truth & Media` | `truthMediaQuiz` |
| `quiz-data/economic_disruption.json` | `src/lib/quizzes/economic-disruption.ts` | `economic_disruption` | `Economic Disruption` | `economicDisruptionQuiz` |
| `quiz-data/gentrification.json` | `src/lib/quizzes/gentrification.ts` | `gentrification` | `Gentrification` | `gentrificationQuiz` |
| `quiz-data/homelessness.json` | `src/lib/quizzes/homelessness.ts` | `homelessness` | `Homelessness` | `homelessnessQuiz` |
| `quiz-data/gun_rights.json` | `src/lib/quizzes/gun-rights.ts` | `gun_rights` | `Gun Rights` | `gunRightsQuiz` |

**IMPORTANT:** The `topic` field in the JSON files uses the same slug as defined above. The `truth_and_media.json` file uses topic `truth_and_media` but the slug in `index.ts` is `truth_media` — make sure to use `truth_media` as the TOPIC constant.

## How to convert JSON to TypeScript

Each JSON file is an array of question objects. The conversion rules:

1. **Questions with `"freeform_only": true`** → use `freeformOnly: true` in TypeScript (camelCase), no `options` field
2. **Questions with IDs ending in `a`** (e.g., `q1a`, `q3a`, `q5a`) → these are MC follow-up sub-questions; put them in `followupQuestions`
3. **All other questions** → go into `main` array in order
4. **Option E** → use the `f()` helper: `f("None of these / I see it differently")`
5. **Followups with `"type": "mc"`** → stay as `{ type: "mc", question_id: "q1a" }` in the main question
6. **Followups with `"type": "freeform"`** → stay as `{ type: "freeform", prompt: "..." }` in the main question
7. **Empty followups `{}`** → omit the `followups` property entirely (don't include an empty object)
8. **Escape quotes** in text strings — use `\'` for single quotes and `\"` or backticks as needed

## Update index.ts

After creating all 9 TypeScript files, update `src/lib/quizzes/index.ts`:

1. Add 9 imports at the top
2. Add all 9 to the `quizzes` object
3. Set `available: true` for all 9 topic cards (they already exist with `available: false`)

The `topicCards` array already has entries for all 9 topics with correct slugs, names, descriptions, intentions, and gradients. You just need to flip `available: false` to `available: true`.

## Verification

After implementing, run `npm run build` (or `npx next build`) to verify there are no TypeScript errors. Every quiz file should:
- Import types from `../types`
- Export a properly typed quiz object
- Have the correct TOPIC slug matching the `topicCards` entry in index.ts
- Not have any TypeScript errors

## Do not

- Do not modify any components (`QuizRunner.tsx`, `page.tsx`, etc.)
- Do not modify the API routes
- Do not modify the types file
- Do not modify the database schema
- Do not change the AI Governance quiz
- Do not change the topic card metadata (descriptions, intentions, gradients) — they're already correct
