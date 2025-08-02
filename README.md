# RequestHub - AI-Powered Municipal Complaint Management System
 

## 📌 Overview

RequestHub is an innovative platform that enables citizens to report municipal issues (potholes, garbage, street lights, etc.) and provides AI-powered analysis for efficient resolution. Administrators can manage complaints with intelligent resource allocation estimates.

## ✨ Key Features

- **Citizen Reporting**:
  - Submit complaints with title, description, location, and images
  - Track complaint status in real-time
- **AI Analysis**:
  - Automatic categorization of issues
  - Time and resource estimation (crew size, equipment)
  - Urgency and priority assessment
- **Admin Dashboard**:
  - View all reported complaints
  - Filter by status/category/location
  - Assign resources based on AI recommendations
- **User Management**:
  - Citizen and admin accounts
  - Authentication with JWT

## 🛠️ Technology Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- React Router
- Axios for API calls
- React Hook Form
- Framer Motion (animations)

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cloudinary (image storage)

### AI Integration
- Perplexity AI API
- Custom prompt engineering
- JSON response parsing

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Cloudinary account (for image uploads)
- Perplexity AI API key

### Fronend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure your VITE_API_BASE_URL
npm run dev
```
### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
