🧠 FinanceAI – AI-Powered Personal Finance Dashboard

FinanceAI is a full-stack personal finance application that helps users track income, expenses, and savings while providing AI-driven affordability insights and spending alerts. The platform enables users to make informed financial decisions through real-time analytics and intelligent recommendations.

🚀 Key Features

Income & Expense Tracking with categorized transactions
AI-Based Affordability Check to evaluate whether a planned expense fits within the user’s financial limits
Category-wise Analytics with interactive charts and monthly breakdowns
Overspending Alerts via push notifications
Secure Authentication with personalized user dashboards
Fully Responsive UI optimized for mobile and desktop

🧠 How AI is Used

User spending patterns and monthly budget data are sent to an AI inference layer

AI evaluates affordability by comparing:
Monthly income
Fixed & variable expenses
Historical spending trends
Returns a natural-language affordability recommendation (e.g., safe, risky, not recommended)
AI integration is implemented using Hugging Face / OpenAI Router API, ensuring scalable and configurable model usage.

🏗️ System Architecture (High-Level)

Frontend (React.js)
Handles user input, dashboards, and charts
Communicates with backend APIs using Axios

Backend (Node.js + Express)
REST APIs for authentication, transactions, and analytics
AI request handling and response processing

Database (MongoDB)
Stores user profiles, transactions, budgets, and alerts

Notifications (OneSignal)
Triggers alerts when spending exceeds thresholds

🖼️ Preview


<img width="1000" height="750" alt="image" src="https://github.com/user-attachments/assets/feb4480b-ce9a-4a9a-b9c3-c0b4a43b9613" />

⚙️ Tech Stack

Frontend

React.js
Tailwind CSS / Material UI
Axios

Backend
Node.js
Express.js
MongoDB

AI Integration
Hugging Face / OpenAI Router API

Notifications
OneSignal

Deployment
Vercel


✨ Author

👨‍💻 Shubham Ekkaldevi

