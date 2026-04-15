# NeuroMind AI - Development Guide

Complete guide for local development, testing, and contributing to NeuroMind AI.

## Development Environment Setup

### Prerequisites
- Node.js 18+ (check with `node --version`)
- Python 3.9+ (check with `python --version`)
- Git
- Code editor (VS Code recommended)

### Step 1: Clone or Download Project
```bash
# If cloning from GitHub
git clone <repository-url>
cd neuromind-ai

# Or download the ZIP from v0
unzip project.zip
cd neuromind-ai
```

### Step 2: Frontend Setup
```bash
# Install dependencies
pnpm install
# or
npm install

# Create environment file
cp .env.example .env.local

# Start dev server
pnpm run dev
```

Frontend available at: `http://localhost:3000`

### Step 3: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate
# Or Windows
venv\Scripts\activate

# Install dependencies and train model
pip install -e .
python generate_data.py
python train_model.py

# Run server
python main.py
```

Backend available at: `http://localhost:8000`

## Development Workflow

### Frontend Development

#### File Structure
```
app/
├── page.tsx              # Home page
├── assess/
│   └── page.tsx          # Assessment form
├── history/
│   └── page.tsx          # History page
├── layout.tsx            # Root layout
└── globals.css           # Global styles

components/
├── ui/                   # shadcn/ui components
└── AssessmentResults.tsx # Custom components
```

#### Making Changes
```bash
# Frontend hot-reloads automatically
# Edit files in app/ or components/
# Changes visible immediately at http://localhost:3000
```

#### Creating New Components
```typescript
// components/MyComponent.tsx
'use client'

import { Button } from '@/components/ui/button'

export default function MyComponent() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}
```

#### Creating New Pages
```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

#### Using UI Components
```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

// shadcn/ui provides pre-made components
// See components/ui folder for all available
```

#### Styling with Tailwind
```typescript
<div className="bg-primary text-primary-foreground p-4 rounded-lg">
  Styled content
</div>

// Use semantic design tokens:
// bg-background, text-foreground, bg-primary, text-accent, etc.
```

### Backend Development

#### File Structure
```
backend/
├── main.py              # FastAPI app
├── generate_data.py     # Data generation
├── train_model.py       # Model training
├── pyproject.toml       # Dependencies
└── models/              # Trained models (generated)
```

#### Making Changes
```bash
# API hot-reload with FastAPI dev mode
cd backend
python -m uvicorn main:app --reload

# Now changes auto-reload at http://localhost:8000
```

#### Creating New API Endpoints
```python
# In backend/main.py

from fastapi import FastAPI
from pydantic import BaseModel

class MyRequest(BaseModel):
    text: str

class MyResponse(BaseModel):
    result: str

@app.post("/my-endpoint", response_model=MyResponse)
async def my_endpoint(request: MyRequest):
    """Detailed description of endpoint"""
    return MyResponse(result=f"Processed: {request.text}")
```

#### Testing Backend Endpoints
```bash
# Test health check
curl http://localhost:8000/

# Test assessment
curl -X POST http://localhost:8000/assess \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling stressed today"}'

# View interactive docs
# Open http://localhost:8000/docs in browser
```

#### Modifying the ML Model

##### Change Training Data
```python
# In backend/generate_data.py

MENTAL_HEALTH_TEXTS = {
    'low': [
        "Add more positive sentiment examples",
        # ...
    ],
    'moderate': [
        # ...
    ],
    'high': [
        # ...
    ]
}
```

##### Change Model Algorithm
```python
# In backend/train_model.py

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

# Change to Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Or Support Vector Machine
model = SVC(probability=True)
```

##### Retrain Model
```bash
python generate_data.py
python train_model.py
```

## Testing

### Frontend Testing

#### Manual Testing
1. Go to http://localhost:3000
2. Test each page:
   - Home: Check layout and navigation
   - Assessment: Fill form and submit
   - History: Check assessment history
3. Test functionality:
   - Navigation between pages
   - Form validation
   - API integration

#### Browser Console
```bash
# Open browser DevTools (F12 or right-click → Inspect)
# Go to Console tab to see:
# - Fetch errors
# - JavaScript errors
# - API calls
```

#### Debugging
```typescript
// Add debug logs
console.log("[v0] Variable value:", variableValue)

// Use browser DevTools debugger
// Set breakpoints and step through code
```

### Backend Testing

#### Unit Testing
```python
# Create backend/test_main.py

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_assess():
    response = client.post("/assess", json={
        "text": "I am feeling great and optimistic about life"
    })
    assert response.status_code == 200
    assert "prediction" in response.json()
```

Run tests:
```bash
pip install pytest
pytest backend/test_main.py -v
```

#### Load Testing
```bash
pip install locust

# Create locustfile.py
# See: https://docs.locust.io/

# Run load test
locust -f locustfile.py
```

### Integration Testing

Test frontend + backend together:
```bash
# 1. Ensure backend is running on http://localhost:8000
python backend/main.py

# 2. Set frontend env var
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Start frontend
pnpm run dev

# 4. Test in browser
# Go to http://localhost:3000/assess
# Submit assessment
# Check browser console for API calls
```

## Debugging

### Frontend Debugging

```typescript
// Add detailed logs
const handleSubmit = async (e: React.FormEvent) => {
  console.log("[v0] Form submitted")
  console.log("[v0] Text:", text)
  
  try {
    const response = await fetch(apiUrl, {...})
    console.log("[v0] Response:", response)
    const data = await response.json()
    console.log("[v0] Data:", data)
  } catch (error) {
    console.log("[v0] Error:", error)
  }
}
```

### Backend Debugging

```python
# Add logging
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.post("/assess")
async def assess(request: AssessmentRequest):
    logger.debug(f"[v0] Text received: {request.text}")
    logger.debug(f"[v0] Vectorizing...")
    
    try:
        result = model.predict(...)
        logger.debug(f"[v0] Prediction: {result}")
    except Exception as e:
        logger.error(f"[v0] Error: {e}")
```

### Browser DevTools
- **Console:** See errors and logs
- **Network:** See API calls and responses
- **Application:** Check localStorage
- **Debugger:** Set breakpoints and step through code

### VS Code Debugging

Python debugging in VS Code:
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["main:app", "--reload"],
      "jinja": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

## Performance Optimization

### Frontend

```typescript
// Lazy load components
const AssessmentResults = dynamic(() => import('@/components/AssessmentResults'))

// Use React.memo for expensive components
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})

// Optimize images
import Image from 'next/image'
<Image src="/image.jpg" width={800} height={600} />
```

### Backend

```python
# Add caching
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend

@app.post("/assess")
@cached(expire=3600)  # Cache for 1 hour
async def assess(request: AssessmentRequest):
    # ... assessment logic
```

## Deployment Checklist

Before deploying:

### Frontend
- [ ] Run `pnpm run build` successfully
- [ ] No TypeScript errors
- [ ] Environment variables set in Vercel
- [ ] Test assessment flow end-to-end
- [ ] Check responsive design (mobile, tablet, desktop)

### Backend
- [ ] Model files exist and load
- [ ] API endpoints tested
- [ ] CORS properly configured
- [ ] Environment variables set in Render
- [ ] Build command runs without errors

### Production Checklist
- [ ] HTTPS enabled on both services
- [ ] Proper error handling and logging
- [ ] Rate limiting configured
- [ ] Monitoring and alerts set up
- [ ] Backup and recovery plan
- [ ] Security audit completed

## Common Issues & Solutions

### Frontend can't reach backend
```
Error: Failed to connect to assessment service
```
Solution:
1. Check backend is running on http://localhost:8000
2. Check `NEXT_PUBLIC_API_URL` environment variable
3. Check CORS is enabled in backend
4. Check browser console for detailed error

### Model not found
```
Error: Model files not found
```
Solution:
```bash
cd backend
python generate_data.py
python train_model.py
```

### Port already in use
```
Error: Address already in use
```
Solution:
```bash
# Find process
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill it
kill -9 <PID>
```

### Dependencies conflict
```
ERROR: pip's dependency resolver
```
Solution:
```bash
# Clear and reinstall
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -e .
```

## Contributing

### Code Style

#### Frontend
- Use TypeScript for type safety
- Use functional components with hooks
- Follow shadcn/ui component patterns
- Use Tailwind CSS for styling

#### Backend
- Use type hints in Python
- Follow PEP 8 style guide
- Add docstrings to functions
- Use meaningful variable names

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ...

# Commit with descriptive message
git commit -m "Add feature description"

# Push
git push origin feature/my-feature

# Create Pull Request on GitHub
```

## Resources

- **Next.js:** https://nextjs.org/docs
- **FastAPI:** https://fastapi.tiangolo.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **scikit-learn:** https://scikit-learn.org/
- **shadcn/ui:** https://ui.shadcn.com/
- **TypeScript:** https://www.typescriptlang.org/docs/

## Getting Help

1. Check README.md and DEPLOYMENT.md
2. Review code comments
3. Check API documentation at http://localhost:8000/docs
4. Search existing GitHub issues
5. Check FastAPI and Next.js documentation
