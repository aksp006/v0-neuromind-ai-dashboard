# NeuroMind AI - Quick Start Guide

Get up and running with NeuroMind AI in 5 minutes!

## What is NeuroMind AI?

A modern web application for AI-powered mental health assessment, built with FAIR ethics principles. Uses machine learning to analyze text and provide mental health risk assessments.

## ⚠️ Important Disclaimer

This is an educational/research tool, NOT a clinical tool. It cannot replace professional mental health care. Always consult qualified professionals.

## Quick Setup (Local Development)

### 1️⃣ Prerequisites (2 min)
```bash
# Check you have Node.js and Python installed
node --version  # Should be 18+
python --version  # Should be 3.9+
```

### 2️⃣ Frontend (1 min)
```bash
# Install and start
pnpm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
pnpm run dev
```
👉 Frontend ready at: http://localhost:3000

### 3️⃣ Backend (2 min)
```bash
cd backend

# Setup
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -e .

# Train model
python generate_data.py
python train_model.py

# Run
python main.py
```
👉 Backend ready at: http://localhost:8000

### 4️⃣ Test It!
1. Go to http://localhost:3000
2. Click "Start Assessment"
3. Enter some text about your feelings
4. Click "Get Assessment"
5. See your mental health risk assessment!

## Project Structure

```
├── Frontend (Next.js 16)
│   ├── app/page.tsx           → Home page
│   ├── app/assess/page.tsx    → Assessment form
│   └── app/history/page.tsx   → Your assessment history
│
└── Backend (FastAPI)
    ├── main.py                → API server
    ├── train_model.py         → ML model training
    └── generate_data.py       → Training data
```

## Key Features

✅ **AI Assessment:** Machine learning model predicts mental health risk
✅ **Privacy First:** Data stored only in your browser
✅ **Transparent:** See confidence scores and probability distributions
✅ **FAIR Ethics:** Fairness, Accountability, Responsible AI, Transparency
✅ **No Storage:** We never collect or store your assessments
✅ **Assessment History:** Track your assessments locally

## API Endpoints

```bash
# Health check
GET http://localhost:8000/
# → { "status": "ok" }

# Assessment
POST http://localhost:8000/assess
# Request: { "text": "Your mental health text..." }
# Response: { "prediction": "low|moderate|high", "confidence": 0.95, ... }

# API Docs
GET http://localhost:8000/docs
# → Interactive API documentation
```

## Common Tasks

### Add More Training Data
```python
# Edit backend/generate_data.py
# Add more text examples to MENTAL_HEALTH_TEXTS
# Then retrain:
python generate_data.py && python train_model.py
```

### Modify Assessment Form
```typescript
// Edit app/assess/page.tsx
// Change form fields, validation, UI, etc.
// Changes auto-reload in browser
```

### Create New Page
```typescript
// Create app/new-feature/page.tsx
// Next.js auto-creates the route
export default function NewFeature() {
  return <div>New Feature</div>
}
```

### Deploy Frontend (Vercel)
```bash
# 1. Push to GitHub
git add .
git commit -m "My awesome changes"
git push

# 2. Go to vercel.com
# 3. Import your GitHub repo
# 4. Set NEXT_PUBLIC_API_URL environment variable
# 5. Deploy!
```

### Deploy Backend (Render)
```bash
# 1. Push to GitHub
git add backend/
git commit -m "Backend changes"
git push

# 2. Go to render.com
# 3. Create new "Web Service"
# 4. Connect GitHub repo
# 5. Set Build Command: "cd backend && pip install -e . && python generate_data.py && python train_model.py"
# 6. Set Start Command: "cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app"
# 7. Deploy!
```

## Documentation

- **📖 README.md** - Full project overview
- **🚀 DEPLOYMENT.md** - Deploy to Vercel & Render
- **👨‍💻 DEVELOPMENT.md** - Local development guide
- **🔧 backend/README.md** - Backend specifics

## Mental Health Resources

If you're struggling:
- **National Suicide Prevention Lifeline (US):** 988
- **Crisis Text Line:** Text HOME to 741741
- **SAMHSA Helpline:** 1-800-662-4357

## Troubleshooting

### Backend won't start
```bash
# Check model files exist
ls backend/models/

# If not, train them
cd backend
python generate_data.py
python train_model.py
```

### Frontend can't reach backend
```bash
# Check .env.local has correct API URL
cat .env.local

# Should see:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Port already in use
```bash
# Kill the process
lsof -i :8000    # Find backend process
kill -9 <PID>    # Kill it

# Or use different port
python main.py   # Runs on 8000
python -m uvicorn main:app --port 8001  # Use 8001
```

## What's Inside?

### Frontend Stack
- **Next.js 16** - React framework
- **shadcn/ui** - Beautiful components
- **Tailwind CSS** - Styling
- **React hooks** - State management

### Backend Stack
- **FastAPI** - Python web framework
- **scikit-learn** - Machine learning
- **TF-IDF** - Text vectorization
- **Logistic Regression** - Classification

### Data Flow
```
User Input (Text)
    ↓
Frontend (React)
    ↓
API Call (Fetch)
    ↓
Backend (FastAPI)
    ↓
ML Model (scikit-learn)
    ↓
Risk Prediction + Confidence
    ↓
Display Results (React)
    ↓
Save to localStorage
```

## Next Steps

1. ✅ Get it running locally (you're here!)
2. 📚 Read README.md for full details
3. 👨‍💻 Check DEVELOPMENT.md for dev guide
4. 🚀 Deploy to Vercel + Render (see DEPLOYMENT.md)
5. 🔧 Customize the model and UI for your needs

## Key Commits

```bash
# See your changes
git log --oneline

# Create branches for features
git checkout -b feature/my-feature
```

## Learning Resources

- **Next.js:** https://nextjs.org/docs
- **FastAPI:** https://fastapi.tiangolo.com/
- **scikit-learn:** https://scikit-learn.org/
- **Tailwind:** https://tailwindcss.com/docs
- **React:** https://react.dev

## Support

1. Check the documentation files (README, DEPLOYMENT, DEVELOPMENT)
2. Review code comments and docstrings
3. Check FastAPI docs at http://localhost:8000/docs
4. Search online for specific errors

## License

Educational and research purposes. FAIR ethics applied throughout.

---

**Ready to go? Run `pnpm run dev` and open http://localhost:3000!**
