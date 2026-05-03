# BachatGatLite

BachatGatLite is a web application for managing community savings groups (Bachat Gat), built with React, Firebase, and Vite. It supports multi-language (Marathi, Hindi, English) and provides features for group management, member tracking, savings, and loans.

## Key Features
- Phone OTP authentication (Firebase)
- Dashboard with group stats and charts
- Create and manage groups
- Add/remove members
- Record and track monthly savings
- Track loans and repayments
- Multi-language UI (Marathi, Hindi, English)
- Responsive, mobile-friendly design

## Tech Stack
- React 18, React Router, React Context
- Firebase Auth & Firestore
- Axios for API calls
- Tailwind CSS for styling
- Vite for fast development

## Main Files
- App.jsx: Routing and layout
- AuthContext.jsx: Global authentication state
- DashboardPage.jsx: Overview and stats
- GroupsPage.jsx: List and create groups
- GroupDetailPage.jsx: Group details and actions
- MembersPage.jsx: Manage group members
- SavingsPage.jsx: Record and view savings
- api.js: API integration
- firebase.js: Firebase setup