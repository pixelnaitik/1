# 🤝 Contributing to SecureVoyage

Thank you for your interest in contributing to **SecureVoyage**! We welcome contributions from developers, designers, security enthusiasts, and safety advocates.

---

## 👥 Project Collaborators & Contributors

Here are the active collaborators working on the **SecureVoyage** repository:

| Name | GitHub Username | GitHub Profile |
| :--- | :--- | :--- |
| **TheAnonymous** | `@ahemadmansur20` | [github.com/ahemadmansur20](https://github.com/ahemadmansur20) |
| **nayan472-sudo** | `@nayan472-sudo` | [github.com/nayan472-sudo](https://github.com/nayan472-sudo) |
| **Shreya Shrivastav** | `@Shreya14106` | [github.com/Shreya14106](https://github.com/Shreya14106) |
| **Subhajit** | `@Subhajit-22` | [github.com/Subhajit-22](https://github.com/Subhajit-22) |

### Quick Member Links:
- **TheAnonymous** - [@ahemadmansur20](https://github.com/ahemadmansur20)
- **nayan472-sudo** - [@nayan472-sudo](https://github.com/nayan472-sudo)
- **Shreya Shrivastav** - [@Shreya14106](https://github.com/Shreya14106)
- **Subhajit** - [@Subhajit-22](https://github.com/Subhajit-22)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Python** 3.10+ (for AI Service)
- **PostgreSQL 15+** with **PostGIS 3+** extension

### 2. Setup Local Environment

```bash
# Clone the repository
git clone https://github.com/pixelnaitik/SIH-prototype.git
cd SIH-prototype

# Install monorepo dependencies
npm install

# Start development servers
npm run dev
```

---

## 🛠️ Contribution Guidelines

### Branching Strategy
- `main`: Production-ready baseline code.
- `feature/<feature-name>`: New features or UI components.
- `fix/<bug-name>`: Bug fixes and patches.
- `docs/<doc-name>`: Documentation updates.

### Commit Messages Format
Follow standard conventional commits:
- `feat: add safe route comparison component`
- `fix: resolve SOS incident idempotency key check`
- `docs: update API schema contracts`
- `style: update design tokens and dark mode styling`

---

## 🛡️ Core Rules & Safety Standards

1. **Safety First**: Emergency features (SOS triggering, 112 direct dial) must function without dependency on third-party LLM response times.
2. **Privacy by Design**: Routine user GPS location must remain in-memory; explicit location sharing sessions must be time-boxed.
3. **Monorepo Packages**: Use `@voyagesecure/web` and `@voyagesecure/api` npm workspace packages.
4. **Code Quality**: Ensure `npm run lint` and `npm test` pass before submitting a Pull Request.

---

## 📩 Submitting a Pull Request (PR)

1. Fork or create a workspace branch on the repository.
2. Commit your changes with descriptive commit messages.
3. Push your branch to GitHub.
4. Open a Pull Request targeting the `main` branch with a summary of changes and test verification results.
