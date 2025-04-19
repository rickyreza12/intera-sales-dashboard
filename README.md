
# 🧠 Intera Sales Dashboard

A full-stack interactive sales representative dashboard with AI chat assistant.  
Built for a coding challenge using **Next.js (frontend)** and **FastAPI (backend)**.

---

## ✅ Features

- 📊 Sales Summary with total & pipeline revenue
- 🌍 Region-based revenue map (GeoJSON + Bar)
- 🧠 AI Chat Assistant (Gemini + Fallback mock)
- 📈 Deal Status Breakdown (Pie chart)
- 🧑‍💼 Sales Reps Table with:
  - Server-side pagination, search & sorting
  - Sortable columns (Name, Region, Deals)
- 👥 Client Overview Table with:
  - Client-side search, sort, and pagination
- 💡 Top 3 Sales Reps by revenue (with avatars)
- 🌙 Dark Mode toggle
- ⚡ FastAPI backend with:
  - Auth
  - /sales/summary, /deal-status, /clients, /sales-reps, /top-reps
  - /ai endpoint with Gemini fallback

---

## 🛠 Tech Stack

### Frontend
- Next.js 13
- TailwindCSS 3
- React 18
- Recharts
- React Simple Maps
- React Markdown

### Backend
- FastAPI
- PyJWT for auth
- Google Generative AI SDK (Gemini)
- Uvicorn
- Python 3.11+

### Dev/Test
- Pytest
- dotenv

---

## 📁 Folder Structure

```
- backend/
  - auth/, config/, models/, routes/, tests/, utils/
  - main.py, dummyData.json, requirements.txt
- frontend/
  - components/, hooks/, pages/, styles/, constants/
  - public/assets/icons/, public/data/
  - package.json, tailwind.config.js
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourname/intera-sales-dashboard.git
cd intera-sales-dashboard
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# or source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
cp .env.examples .env    # Fill in your GEMINI_API_KEY
uvicorn main:app --reload
```

### 3. Frontend Setup (Next.js)

```bash
cd ../frontend
npm install
cp .env.examples .env     # Set NEXT_PUBLIC_API_BASE_URL and JWT_TOKEN if needed
npm run dev
```

> App will run at `http://localhost:3000`

---

## 🧪 Run Tests

```bash
cd backend
pytest
```

---

## 🖼️ Watch the demo here:  

[![Watch the demo](https://img.youtube.com/vi/zPUIC7yJP6Y/hqdefault.jpg)](https://www.youtube.com/watch?v=zPUIC7yJP6Y)

---

## 📌 Notes

- The dashboard is powered by mock data (`dummyData.json`)
- Google Gemini API used for real-time AI responses
- If quota is exceeded, auto fallback to mock answers
- Responsive layout for both desktop and tablet

---

