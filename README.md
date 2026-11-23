# Steepest Descent Solver

**Interactive Optimization Learning Tool for B.Tech Numerical Methods**

A web application for learning and experimenting with the **Steepest Descent Method** for unconstrained numerical optimization. It presents the algorithm iteration by iteration, with mathematical derivations, interactive graphs, an iteration history, and code-learning resources.

---

## 1. Features

- **Step-by-step mathematical derivations** — partial derivatives, gradient vectors, search directions, line search, step sizes, coordinate updates, and convergence checks.
- **Interactive 2D contour plot** — displays the optimization trajectory, iteration points, and direction of movement.
- **Interactive 3D surface plot** — displays the objective function surface and the optimization path.
- **Convergence graphs** — objective function value, gradient norm, and step size against iteration number.
- **Iteration controls** — first, previous, next, last, play, and run all.
- **Expandable iteration history** — inspect the numerical values and derivation for each iteration.
- **Textbook Dry Run mode** — follow worked numerical examples.
- **Understand the Code mode** — explore the TypeScript implementation and its relationship to the mathematical algorithm.
- **Viva Preparation** — review relevant concepts and questions.
- **Stationary-point classification** — uses Hessian information to help classify stationary points.

## 2. Technology Stack

| Area | Technology |
|---|---|
| Frontend | React + TypeScript |
| Development/build tool | Vite |
| Styling | Tailwind CSS |
| Mathematical computation | math.js |
| Graphs | Plotly.js |
| Mathematical notation | KaTeX |
| Tests | Vitest |

## 3. Prerequisites

Install the following before running the project:

1. **Node.js** — install a current LTS version from [https://nodejs.org/](https://nodejs.org/).
2. **npm** — npm is included with the Node.js installer.
3. **A web browser** — Chrome, Edge, Firefox, or another modern browser.

To check that Node.js and npm are installed, open a terminal and run:

```bash
node --version
npm --version
```

Both commands should print version numbers. If either command is not recognized, install Node.js and reopen the terminal.

## 4. Download and Run the Project

### Step 1: Obtain the project folder

Download or extract the project so that the complete project folder is available on your computer.

The project root is the folder containing `package.json`, `src/`, and the Vite configuration file.

### Step 2: Open a terminal in the project folder

For Windows:

- Open the extracted project folder in File Explorer.
- Open the folder containing `package.json`.
- Right-click in the folder and choose **Open in Terminal** (or open the folder in VS Code and select **Terminal → New Terminal**).

You can also navigate to the folder with `cd`. For example:

```powershell
cd "C:\path\to\Maths Project"
```

Replace the example path with the actual location of the project.

### Step 3: Install dependencies

Run:

```bash
npm install
```

This reads `package.json` and installs the packages required by the application. An internet connection is normally required for the first installation.

### Step 4: Start the development server

Run:

```bash
npm run dev
```

Vite will print a local URL in the terminal, for example:

```text
Local: http://localhost:5173/
```

Open the exact **Local** URL printed by the terminal in a web browser. The port may differ depending on the project configuration.

Keep the terminal open while using the application. To stop the development server, press `Ctrl + C` in that terminal.

## 5. Run the Tests

To run the project's automated tests:

```bash
npm test
```

The current project README records six test groups with 27 mathematical assertions. These cover:

- Gradient calculations for the example functions.
- Exact line-search step sizes.
- Coordinate updates.
- Function values at computed points.
- Convergence detection.
- Hessian and stationary-point classification.

The test command depends on the scripts configured in `package.json`.

## 6. Create a Production Build

To check and build the application for production, run:

```bash
npm run build
```

If the command completes successfully, Vite generates the production build (normally in the `dist/` folder).

To preview the production build locally, run:

```bash
npm run preview
```

Open the local URL printed in the terminal.

## 7. How to Use the Application

1. Open the **Solver & Visualizer** section.
2. Select a predefined benchmark problem or enter an objective function of two variables, `x` and `y`.
3. Enter the initial coordinates `x0` and `y0`.
4. Select a step-size method:
   - **Exact Analytical Line Search** — finds the minimizing step analytically when supported by the function.
   - **Backtracking (Armijo)** — reduces the trial step size until the sufficient-decrease condition is met.
   - **Fixed Alpha** — uses a step size entered by the user.
5. Set the maximum number of iterations and convergence tolerance.
6. Select **Compute Steepest Descent Solution**.
7. Use the iteration controls to move through the solution one iteration at a time.
8. Inspect the contour, surface, and convergence graphs.
9. Expand an iteration in the history table to inspect its calculations.
10. Explore **Understand the Code**, **Textbook Dry Run**, and **Viva Preparation** for additional learning material.

## 8. Example Benchmark Problems

The application includes these example objective functions:

| Example | Objective function | Analytical minimizer |
|---|---|---|
| 1 | `f(x,y) = x² + y² - 4x - 6y` | `(2, 3)` |
| 2 | `f(x,y) = x² + 4y² - 4x - 8y` | `(2, 1)` |
| 3 | `f(x,y) = x² + xy + 2y² - 6x - 8y` | `(16/7, 10/7)` |

The analytical minimizers are reference values for checking the numerical results. The Steepest Descent method approaches a minimizer through successive iterations; the number of iterations depends on the starting point, line-search method, and tolerance.

## 9. Mathematical Method

At iteration \(k\), the gradient is:

\[
g_k = \nabla f(X_k)
\]

The steepest descent direction is the negative gradient:

\[
d_k = -\nabla f(X_k)
\]

The step size is selected by a line-search method. The point is then updated:

\[
X_{k+1} = X_k + \alpha_k d_k
\]

The primary convergence check is based on the gradient norm:

\[
\|\nabla f(X_k)\| < \varepsilon
\]

The application also presents Hessian information to help classify stationary points. A zero gradient alone does not prove that a point is a minimum.

## 10. Project Structure

The main parts of the project are organized as follows:

```text
project-root/
├── src/
│   ├── engine/
│   │   ├── solver.ts
│   │   ├── symbolic.ts
│   │   ├── linesearch.ts
│   │   ├── presets.ts
│   │   ├── dryRunGenerator.ts
│   │   └── codeMetadata.ts
│   ├── components/
│   │   ├── charts/
│   │   ├── code-explanation/
│   │   ├── Navbar.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── IterationStepper.tsx
│   │   ├── MathDerivationCard.tsx
│   │   └── IterationTable.tsx
│   ├── types/
│   │   └── optimization.ts
│   ├── tests/
│   │   └── solver.test.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

Some filenames or configuration files may vary slightly with the submitted project version. The `package.json` in the submitted project is the source of truth for available npm scripts and dependencies.

## 11. Troubleshooting

### `npm` or `node` is not recognized

Install Node.js from [https://nodejs.org/](https://nodejs.org/), close and reopen the terminal, and check the versions again.

### `package.json` is missing

Make sure the terminal is open in the project root—the folder that contains `package.json`. Do not run `npm install` from the `src/` folder.

### Dependencies cannot be installed

Check the internet connection and run `npm install` again from the project root. If an installation is interrupted, close the running development server and retry.

### The local webpage does not open

Check the terminal output from `npm run dev`. Open the exact URL shown next to `Local`. Keep the development server running while using the webpage.

### A port is already in use

Vite may select another available port. Use the new `Local` URL printed in the terminal.

### The application does not start after changing files

Stop the server with `Ctrl + C`, then run:

```bash
npm run dev
```

If the issue continues, note the full error printed in the terminal.

## 12. Academic Project Information

**Project:** Steepest Descent Solver – Interactive Optimization Learning Tool  
**Subject area:** Numerical Optimization / Numerical Methods  
**Institution:** National Institute of Technology Kurukshetra  
**Author:** Yash Karan

---

*This application is intended as an educational tool to help students understand the Steepest Descent Method through numerical calculations, mathematical derivations, source-code explanations, and visualizations.*
