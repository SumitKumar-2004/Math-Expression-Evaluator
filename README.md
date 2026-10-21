# Math Expression Evaluator

A student-focused mathematics learning website built entirely with React. It has a landing page, expression evaluator with supported solution explanations, formula library, and practice quizzes.

## Technology
- React.js + Vite
- React Router for client-side routes
- Math.js parser for mathematical expression parsing and evaluation
- KaTeX installed for mathematical typesetting if needed
- Lucide React icons
- CSS responsive styling
- `localStorage` for calculation history, theme, favorite formulas and quiz progress

## Features
- Landing page named **Math Expression Evaluator**
- `/calculator`: scientific expression evaluator, DEG/RAD mode, keypad, function shortcuts, safe parsing, supported step explanations, history and copy
- `/formulas`: searchable formula library, categories, favorites and copy
- `/practice`: topic-based multiple-choice quiz, instant explanations, results review, score and accuracy tracking
- Light/dark mode
- Responsive desktop and mobile layout
- No MongoDB, Express server, backend, account, or external calculation API

## Requirements
- Node.js 18 or later and npm

## Run locally
1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Build for production
```bash
npm run build
npm run preview
```
The build output is created in `dist/`. Deploy that folder to a static hosting service such as GitHub Pages, Netlify, or Vercel.

## Routes
- `/` landing page
- `/calculator` expression evaluator
- `/formulas` formula library
- `/practice` practice quiz

## Storage
History, favorites, theme, and quiz progress are stored in browser `localStorage`. They are local to that browser/device and can be cleared by the user. No data is sent to a server.

## Expression examples
- `2 + 3 * 4`
- `sqrt(144)`
- `sin(30)` in degree mode
- `pi * 2`
- `ans * 2`

## Safety note
The evaluator uses Math.js parsing and restricts supported symbols/functions; it does not use JavaScript `eval()`. The step explainer provides detailed steps for simple arithmetic patterns and general precedence guidance for more complex expressions, rather than claiming to provide symbolic algebra solutions.
