# DevDoc - Developer Documentation & Project Management

**DevDoc** is a comprehensive solution designed to streamline the process of gathering requirements, managing project documentation, and tracking tasks. It provides a structured environment for developers and project managers to organize SRS, ERD, use cases, and design files in one secure location.

## 🚀 Overview
DevDoc simplifies project management by offering tools to collect requirements, manage todos, and store critical documents. With features like easy sharing and ZIP exports, collaboration with stakeholders becomes effortless.

## ✨ Key Features
- **📂 Organized Requirements:** Collect and structure your project requirements in a dedicated workspace.
- **📄 Document Management:** Upload and store SRS, ERD, use cases, and design files securely.
- **📦 Smart Export:** Download all your project documentation as an organized ZIP package for offline access or backups.
- **🤝 Easy Sharing:** Share complete project packages with team members and stakeholders instantly.
- **✅ Todo Management:** Track project tasks and progress with an integrated todo list.
- **🔗 Resource Links:** Keep all your important project-related links in one place.
- **🔒 Secure Authentication:** Protected routes and user authentication to keep your data safe.

## 🛠️ Tech Stack
- **Frontend Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Utilities:** [JSZip](https://stuk.github.io/jszip/) for file compression.

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yasith-1/dev-doc-frontend.git
    cd dev-doc-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Configuration:**
    Create a `.env` file in the root directory and configure your API URL (if different from default):
    ```env
    VITE_API_URL=http://localhost:5001/api
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  **Open in Browser:**
    Navigate to `http://localhost:5173` to view the application.

## 📂 Project Structure

\`\`\`
src/
├── components/       # Reusable UI components
│   ├── common/       # Generic components (Buttons, Inputs)
│   ├── layout/       # Header, Footer, Navigation
│   └── home/         # Home page specific components
├── config/           # App configuration constants
├── contexts/         # React Contexts (Auth, Project, Theme)
├── pages/            # Application views/routes
├── services/         # API integration services
├── types/            # TypeScript type definitions
├── constants/        # Global constants
├── hooks/            # Custom React hooks
└── utils/            # Helper utility functions
\`\`\`

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.