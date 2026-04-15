# NeuroMind AI - Command Reference

Quick reference for common commands and workflows.

## Local Development

### Frontend Commands

```bash
# Install dependencies
pnpm install

# Start development server (auto-reload)
pnpm run dev

# Build for production
pnpm run build

# Run production build locally
pnpm run start

# Lint and check code
pnpm run lint
```

### Backend Commands

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate              # macOS/Linux
# or
venv\Scripts\activate                 # Windows

# Install dependencies
pip install -e .

# Generate training data
python generate_data.py

# Train the ML model
python train_model.py

# Run development server (auto-reload)
python -m uvicorn main:app --reload

# Run production server
python main.py

# Run with specific port
python -m uvicorn main:app --host 0.0.0.0 --port 8001
```

## Testing

### Frontend Testing

```bash
# Build and check for errors
pnpm run build

# Check TypeScript
pnpm run type-check

# Manual testing in browser
# 1. Open http://localhost:3000
# 2. Test each page and feature
# 3. Open DevTools (F12) to check console
```

### Backend Testing

```bash
# Test health endpoint
curl http://localhost:8000/

# Test assessment endpoint
curl -X POST http://localhost:8000/assess \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling stressed and anxious"}'

# View API documentation
# Open http://localhost:8000/docs in browser

# View Swagger/OpenAPI schema
curl http://localhost:8000/openapi.json
```

## Model Management

### Training and Updating

```bash
# Generate training data
python backend/generate_data.py

# Train model
python backend/train_model.py

# Train both
python backend/generate_data.py && python backend/train_model.py

# Retrain (e.g., after changing training data)
cd backend
python generate_data.py
python train_model.py
```

### Model Files

```bash
# Check if model files exist
ls backend/models/

# Remove models to retrain
rm backend/models/model.pkl
rm backend/models/vectorizer.pkl
rm backend/training_data.json

# Then retrain
cd backend
python generate_data.py
python train_model.py
```

## Git & GitHub

### Basic Workflow

```bash
# Check status
git status

# Add files
git add .
git add frontend/   # Specific folder
git add file.txt   # Specific file

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Create feature branch
git checkout -b feature/my-feature
git push origin feature/my-feature
# Then create Pull Request on GitHub
```

### Before Deployment

```bash
# Make sure everything is committed
git status

# Pull latest changes
git pull

# Push to main branch
git push origin main
```

## Environment Setup

### Frontend Environment

```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# For production (replace with your Render URL)
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com" > .env.local
```

### Backend Environment

```bash
# No environment variables needed for development
# For production on Render, configure in dashboard
```

## Debugging

### Frontend Debugging

```bash
# Open browser DevTools
# Right-click → Inspect (or F12)

# Check Network tab for API calls
# Check Console for errors
# Use debugger: 
# - Set breakpoints
# - Step through code
# - Inspect variables

# Add console logs
console.log("[v0] Variable:", variable)
```

### Backend Debugging

```bash
# Check server logs (should see requests)
# Terminal showing "python main.py" output

# Add debug logging
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Debug message")

# View error responses
curl -X POST http://localhost:8000/assess \
  -H "Content-Type: application/json" \
  -d '{"text": "short"}' | python -m json.tool
```

## Deployment

### Prepare for Deployment

```bash
# Frontend
pnpm run build  # Check for errors

# Backend
cd backend
python generate_data.py
python train_model.py

# Commit all changes
git add .
git commit -m "Final build before deployment"
git push origin main
```

### Deploy to Vercel (Frontend)

```bash
# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Import GitHub repository
# 4. Set NEXT_PUBLIC_API_URL environment variable
# 5. Click Deploy

# Or with Vercel CLI
npm i -g vercel
vercel
```

### Deploy to Render (Backend)

```bash
# 1. Go to render.com
# 2. Click "New +" → "Web Service"
# 3. Connect GitHub repository
# 4. Set build and start commands:
#    Build: cd backend && pip install -e . && python generate_data.py && python train_model.py
#    Start: cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
# 5. Deploy

# No CLI needed, all through dashboard
```

## Troubleshooting

### Reset Everything

```bash
# Frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Backend
rm -rf venv backend/models backend/training_data.json
cd backend
python -m venv venv
source venv/bin/activate
pip install -e .
python generate_data.py
python train_model.py
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Or use different port
python -m uvicorn main:app --port 8001
```

### Clear Cache

```bash
# Frontend (Next.js cache)
rm -rf .next

# Browser cache
# DevTools → Application → Clear storage

# Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
```

## Logs & Monitoring

### View Frontend Logs

```bash
# Browser DevTools Console (F12)
# Check for:
# - JavaScript errors
# - API call failures
# - Fetch responses
```

### View Backend Logs

```bash
# Terminal running "python main.py"
# Should see:
# - Startup messages
# - Request logs (if enabled)
# - Error messages
# - Model loading messages
```

### View Deployment Logs

```bash
# Vercel
# Go to vercel.com → Select project → Deployments → Select deployment → Logs

# Render
# Go to render.com → Select service → Logs
```

## Useful Links

### Local URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Swagger: http://localhost:8000/redoc

### Documentation
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- FastAPI: https://fastapi.tiangolo.com/
- Next.js: https://nextjs.org/docs
- scikit-learn: https://scikit-learn.org/

## Quick Workflows

### Add New Feature

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes to code

# Test locally
pnpm run dev  # Frontend
python main.py  # Backend

# Commit and push
git add .
git commit -m "Add my feature"
git push origin feature/my-feature

# Create Pull Request on GitHub
```

### Update Model

```bash
# Edit backend/generate_data.py to add training data

# Retrain
cd backend
python generate_data.py
python train_model.py

# Test with new model
python main.py

# Commit and deploy
git add backend/
git commit -m "Update ML model with new training data"
git push origin main
```

### Deploy Update

```bash
# Make changes
# Test locally
pnpm run build  # Frontend
python backend/train_model.py  # Backend if updated

# Commit
git add .
git commit -m "Feature/fix description"
git push origin main

# Services auto-deploy from GitHub
# Check Vercel and Render dashboards
```

## One-Liners

```bash
# Check everything is running
curl http://localhost:3000 && curl http://localhost:8000

# Full restart (from project root)
cd backend && python train_model.py && cd .. && pnpm run dev

# Build everything
pnpm run build && cd backend && python train_model.py && cd ..

# Test assessment
curl -s -X POST http://localhost:8000/assess \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been feeling very stressed lately"}' | python -m json.tool
```

## Performance

### Optimize Frontend

```bash
# Check bundle size
pnpm run build  # Shows size info

# Analyze bundle
npm install -g next-bundle-analyzer
# Then see .next/analyze report
```

### Optimize Backend

```bash
# Check model size
ls -lh backend/models/

# Profile code
python -m cProfile main.py
```

## Security Notes

```bash
# Never commit secrets
# Don't put API keys in code
# Use .env files for secrets

# Check what's in git
git log --name-status

# Remove accidental commits
git reset HEAD~1  # Undo last commit
```

---

**Save this file for quick reference during development!**
