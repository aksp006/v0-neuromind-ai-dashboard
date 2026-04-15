# Troubleshooting Guide - NeuroMind AI

## "Failed to fetch" Error

This is the most common issue when the frontend can't connect to the backend. Here's how to fix it.

### Root Causes & Solutions

#### 1. Backend Server Not Running

**Symptom:** You see "Failed to fetch" or "Connection failed" error

**Solution:**
```bash
cd backend
python main.py
```

**Check:** Open http://localhost:8000 in your browser. You should see:
```json
{
  "status": "ok",
  "message": "NeuroMind AI backend is running",
  "version": "0.1.0"
}
```

---

#### 2. Backend Model Files Not Found

**Symptom:** Backend starts but returns 503 error "Model not loaded"

**Solution:**
```bash
cd backend
python generate_data.py    # Generate synthetic training data
python train_model.py      # Train the ML model
```

**Check:** Verify the `backend/models/` directory exists with:
- `model.pkl`
- `vectorizer.pkl`

---

#### 3. Wrong API URL Configuration

**Symptom:** "Failed to fetch" error or "Cannot find module 'NEXT_PUBLIC_API_URL'"

**Solution:**

Create `.env.local` in the frontend root:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production (Render):
```bash
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
```

**Check:** 
- File should be in `/vercel/share/v0-project/.env.local`
- Restart frontend dev server after creating `.env.local`
- `pnpm run dev`

---

#### 4. CORS (Cross-Origin) Issues

**Symptom:** "Network request failed" or browser console shows CORS error

**Solution:**

The backend already has CORS enabled. But verify in `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For Production:** Replace `"*"` with your actual domain:
```python
allow_origins=[
    "https://your-frontend-domain.vercel.app",
    "https://your-frontend-domain.com",
],
```

---

#### 5. Port Already in Use

**Symptom:** "Address already in use" when starting backend

**Solution:**

Check what's using port 8000:
```bash
# Find process
lsof -i :8000

# Kill the process (replace PID)
kill -9 <PID>

# Or use a different port
python main.py --port 8001
```

Then update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

#### 6. Frontend App Not Restarted After Env Changes

**Symptom:** Changed `.env.local` but still getting errors

**Solution:**

After creating or updating `.env.local`:
1. Stop the frontend dev server (Ctrl+C)
2. Start it again: `pnpm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try the assessment again

---

### Complete Setup Checklist

Follow this step-by-step to ensure everything works:

#### Step 1: Backend Setup
- [ ] `cd backend`
- [ ] `python -m venv venv`
- [ ] `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
- [ ] `pip install -e .`
- [ ] `python generate_data.py`
- [ ] `python train_model.py`
- [ ] Verify `backend/models/model.pkl` exists
- [ ] Verify `backend/models/vectorizer.pkl` exists

#### Step 2: Start Backend
- [ ] In backend folder: `python main.py`
- [ ] Visit http://localhost:8000
- [ ] Should see status message (not an error)

#### Step 3: Frontend Setup
- [ ] `cd ..` (back to project root)
- [ ] Create `.env.local` with:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```
- [ ] `pnpm install` (if not done already)
- [ ] Clear browser cache

#### Step 4: Start Frontend
- [ ] `pnpm run dev`
- [ ] Visit http://localhost:3000
- [ ] Go to "Get Assessment"
- [ ] Enter test text (minimum 20 characters)
- [ ] Click "Get Assessment"
- [ ] Should see results (not error)

---

### Testing the API Directly

Use `curl` to test the backend endpoint:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been feeling very sad and anxious lately. I am having trouble sleeping and concentrating on my work. My relationships are suffering."}'
```

**Success Response:**
```json
{
  "prediction": "moderate",
  "confidence": 0.85,
  "class_probabilities": {
    "low": 0.1,
    "moderate": 0.85,
    "high": 0.05
  },
  "risk_score": 0.475
}
```

---

### Browser Developer Tools

Check browser console for detailed errors:

1. Open Developer Tools (F12)
2. Go to "Console" tab
3. Go to "Network" tab
4. Submit an assessment
5. Look for the `predict` request
6. Check the response for actual error details

---

### Still Not Working?

Check these logs:

**Backend logs:** Look for errors when you run `python main.py`
- Missing imports?
- Model files not found?
- Port in use?

**Frontend logs:** Check browser console (F12 → Console)
- Network errors?
- Environment variable issues?
- CORS errors?

---

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Failed to fetch" | Backend not running | `python main.py` in backend folder |
| "Model not loaded" (503) | Training not done | `python generate_data.py && python train_model.py` |
| "Text must be at least 20 characters" | Input too short | Enter more detailed text |
| CORS error in console | Origin not allowed | Check CORS config in `main.py` |
| "undefined is not a function" | Missing env file | Create `.env.local` with `NEXT_PUBLIC_API_URL` |

---

### Docker Deployment

If you want to test everything in Docker:

**Backend Dockerfile:**
```dockerfile
FROM python:3.11
WORKDIR /app
COPY backend/pyproject.toml .
RUN pip install -e .
COPY backend/ .
RUN python generate_data.py && python train_model.py
CMD ["python", "main.py"]
```

**Build and run:**
```bash
docker build -t neuromind-backend .
docker run -p 8000:8000 neuromind-backend
```

---

### Getting Help

If you're still stuck:

1. Read the full documentation in `DEVELOPMENT.md`
2. Check the API docs at http://localhost:8000/docs
3. Review `backend/README.md` for backend-specific issues
4. Check project settings for environment variables
