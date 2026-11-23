# Steepest Descent Solver

> Interactive Optimization Learning Tool for B.Tech Numerical Methods

A fully functional web application that demonstrates the **Steepest Descent (Gradient Descent) Method** for unconstrained numerical optimization — step by step, with full mathematical derivations and interactive visualizations.

---

## Features

- **Step-by-step mathematical derivations** — every iteration shown with LaTeX-rendered partial derivatives, gradient vectors, line search, and convergence checks
- **Interactive 2D Contour Plot** — optimization path with iteration labels and arrows (Plotly.js)
- **Interactive 3D Surface Plot** — full surface with trajectory overlay, rotation/zoom/pan
- **Convergence graphs** — objective value, gradient norm, and step size vs iteration
- **Iteration stepper** — First / Previous / Next / Last / Play / Run All
- **Expandable iteration table** — full derivation per row
- **Textbook Dry Run mode** — matches hand-calculated textbook solutions exactly
- **Code Explanation mode** — actual TypeScript source with inline annotations
- **Viva Preparation** — Q&A mode for exam readiness
- **Stationary point classification** — Hessian eigenvalue analysis (min / max / saddle)

---

## Example Problems

| # | Function | Minimum |
|---|----------|---------|
| 1 | `f(x,y) = x² + y² - 4x - 6y` | `(2, 3)` |
| 2 | `f(x,y) = x² + 4y² - 4x - 8y` | `(2, 1)` |
| 3 | `f(x,y) = x² + xy + 2y² - 6x - 8y` | `(16/7, 10/7)` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Math engine | math.js (symbolic differentiation) |
| Plots | Plotly.js |
| LaTeX rendering | KaTeX |
| Tests | Vitest |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Run all tests
npm test

# Production build
npm run build
```

---

## Algorithm

The app implements the classic steepest descent update rule:

```
Xₖ₊₁ = Xₖ − αₖ ∇f(Xₖ)
```

**Line search options:**
- **Exact (analytical)** — closed-form `α` for quadratic functions via `dφ/dα = 0`
- **Backtracking (Armijo)** — sufficient decrease condition for general functions
- **Fixed α** — user-specified constant step size

**Convergence criterion:** `‖∇f(Xₖ)‖ < ε`

---

## Project Structure

```
c:\Maths Project\
├── src/
│   ├── engine/
│   │   ├── solver.ts          # Core steepest descent solver
│   │   ├── symbolic.ts        # Symbolic differentiation (math.js)
│   │   ├── linesearch.ts      # Exact & backtracking line search
│   │   ├── presets.ts         # Preset benchmark problems
│   │   ├── dryRunGenerator.ts # Textbook dry-run generator
│   │   └── codeMetadata.ts    # Code explanation metadata
│   ├── components/
│   │   ├── charts/            # Contour, Surface, Convergence plots
│   │   ├── code-explanation/  # Code explanation panel
│   │   ├── Navbar.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── IterationStepper.tsx
│   │   ├── MathDerivationCard.tsx
│   │   └── IterationTable.tsx
│   ├── types/
│   │   └── optimization.ts    # TypeScript interfaces
│   ├── tests/
│   │   └── solver.test.ts     # 27 mathematical assertions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .gitignore
├── .gitattributes
└── README.md
```

---

## Tests

```bash
npm test
```

All 6 test groups (27 assertions) verify:
- Gradient calculations for all example functions
- Exact line search `α` values
- Coordinate updates per iteration
- Function values at computed points
- Convergence detection
- Hessian / stationary point classification

---

## License

MIT
