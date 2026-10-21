
# 🧮 Math Expression Evaluator

A simple, interactive, and user-friendly web application built with React.js that helps users evaluate mathematical expressions, explore formulas, and practice mathematics through quizzes.

🌐 **Live Demo:** https://math-expression-evaluator.netlify.app/

## ✨ Features

- **Math Calculator:** Evaluate mathematical expressions quickly and accurately.
- **Step-by-Step Solutions:** Understand the calculation process with explanations for supported expressions.
- **Formula Library:** Browse, search, and explore useful mathematical formulas by category.
- **Favorites:** Save your favorite formulas for quick access.
- **Practice Quizzes:** Test your mathematical knowledge with interactive quizzes.
- **Instant Feedback:** Get immediate feedback and explanations for quiz answers.
- **Calculation History:** Access previous calculations.
- **Responsive Design:** Use the application on desktop, tablet, and mobile devices.
- **Theme Support:** Switch between available themes.
- **Local Storage:** Save selected preferences and supported progress directly in your browser.

## 🛠️ Technologies Used

- **React.js** – Building the user interface.
- **Vite** – Fast development server and build tool.
- **JavaScript** – Application logic and interactivity.
- **CSS3** – Styling and responsive layouts.
- **Math.js** – Parsing and evaluating mathematical expressions.
- **React Router** – Navigation between application pages.
- **Lucide React** – Icons and visual elements.
- **KaTeX** – Mathematical notation rendering.
- **Browser Local Storage** – Saving user preferences and local data.
- **Netlify** – Hosting and deployment.
- **Git and GitHub** – Version control and source code management.

## 📸 Application Pages

| Page | Description |
|---|---|
| Home | Landing page introducing the application. |
| Calculator | Evaluate mathematical expressions. |
| Formula Library | Search, browse, and save useful formulas. |
| Practice Quiz | Solve questions and review your answers. |

## 🚀 Getting Started

Follow these steps to run the project on your local machine.

### Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/) (optional)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/SumitKumar-2004/Math-Expression-Evaluator.git
```

**2. Open the project directory**

```bash
cd Math-Expression-Evaluator
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Open the local URL shown in your terminal, usually:

```text
http://localhost:5173
```

## 🏗️ Build for Production

To create an optimized production build, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The production files will be generated in the `dist` directory.

## 📂 Project Structure

```text
Math-Expression-Evaluator/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── math.js
│   └── styles.css
├── index.html
├── package.json
├── package-lock.json
├── netlify.toml
└── README.md
```

*Note: The exact folder structure may vary slightly depending on the project version.*

## 🧠 How It Works

1. Open the application using the live website or run it locally.
2. Navigate to the calculator page.
3. Enter a mathematical expression.
4. Evaluate the expression and view the result.
5. Review the available solution steps for supported expressions.
6. Explore the formula library to find useful formulas.
7. Attempt practice quiz questions and review the feedback.
8. Use available favorites, history, and preferences features.

## 💾 Data Storage

This project is a frontend-only React application and does not require a backend server or MongoDB database.

Browser Local Storage is used to retain supported information, such as calculation history, theme preferences, favorite formulas, and quiz progress.

This information is stored locally in the user's browser and is not automatically synchronized across devices.

## 🌐 Deployment

The application is deployed using Netlify.

**Live Website:** https://math-expression-evaluator.netlify.app/

To deploy your own version:

1. Push the project source code to GitHub.
2. Sign in to [Netlify](https://www.netlify.com/).
3. Import the GitHub repository.
4. Set the build command to `npm run build`.
5. Set the publish directory to `dist`.
6. Start the deployment.

## 🔮 Future Enhancements

- Support for more advanced mathematical expressions.
- More detailed step-by-step explanations.
- Additional formula categories.
- Difficulty levels for practice quizzes.
- More quiz questions and topics.
- Export calculation results.
- Improved accessibility and user experience.
- Optional cloud synchronization across devices.

## 🎯 Project Objective

The main objective of this project is to develop an interactive mathematical tool that makes evaluating expressions, exploring formulas, and practicing mathematics easier. It combines a calculator, a formula reference library, and a quiz system in one responsive web application.

## 👨‍💻 Author

**Sumit Kumar**

GitHub: [SumitKumar-2004](https://github.com/SumitKumar-2004)

## 📄 License

This project is available for educational and personal learning purposes. Add a specific open-source license if you intend to grant formal reuse, modification, and distribution permissions.
