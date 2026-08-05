# Workflow Builder

Workflow Builder is a React + TypeScript application built using Vite.

---

# Prerequisites

Make sure the following are installed on your machine:

- Node.js (v18 or above recommended)
- npm (comes with Node.js)
- Git

Verify installation:

```bash
node -v
npm -v
git --version
```

---

# Clone the Project

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd <project-folder>
```

---

# Install Dependencies

```bash
npm install
```

---

# Environment Setup

Create a `.env` file in the project root.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Update the API URL according to your backend environment.

---

# Start Development Server

```bash
npm run dev
```

Application will start on

```
http://localhost:5173
```

---

# Build Project

```bash
npm run build
```

---

# Preview Production Build

```bash
npm run preview
```

---
# Git Workflow

Before starting work:

```bash
git pull
```

Create a new feature branch:

```bash
git checkout -b feature/<feature-name>
```

After completing your work:

```bash
git add .
git commit -m "Added <feature-name>"
git push origin feature/<feature-name>
```

Create a Pull Request for review.

---

## Testing

Run all tests

```bash
npm test
```

Run tests in watch mode

```bash
npm run test:watch
```

Generate coverage report

```bash
npm run test:coverage
```

The coverage report is generated in the `coverage/` directory.

Open `coverage/index.html` in your browser to view it.

> Note: The `coverage/` directory is generated automatically and is intentionally excluded from Git.