# Intera Sales Dashboard

This project is a full-stack coding challenge for Intera.

### 🔧 Tech Stack
- Frontend: Next.js
- Backend: FastAPI
- Data Source: dummyData.json (mock data)

### ✅ Features
- Read & display nested sales rep data from JSON
- FastAPI endpoint for `/api/sales-reps`
- Next.js UI to view sales, deals, and clients
- (Optional) AI endpoint to answer simple questions

### 🚀 How to Run

#### Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
