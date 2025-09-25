# RequestHub - AI-Powered Municipal Complaint Management System
 

## 📌 Overview

RequestHub is a smart platform that lets citizens quickly report municipal issues like potholes, garbage, and streetlight faults. Using AI-powered analysis, it helps administrators prioritize cases and efficiently allocate resources for faster, more effective resolutions.

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
```

### web applications images
```bash
![Add Complaint]([https://github.com/user-attachments/assets/51d0b723-5e7a-460b-a809-b57381decada.png](https://github-production-user-asset-6210df.s3.amazonaws.com/159511729/493789858-51d0b723-5e7a-460b-a809-b57381decada.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250925%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250925T081200Z&X-Amz-Expires=300&X-Amz-Signature=5310753a721920a1e16ac0d4d2a902273a7035def5287d80ae666df3d1a2e52e&X-Amz-SignedHeaders=host))
![Track Complaint ](https://github.com/user-attachments/assets/914b303d-9dda-4cd4-8897-ce634043cc07.png)
![AI Analyse]( https://github.com/user-attachments/assets/ded7f873-762c-44b6-900c-1034be47dac7.png)
