# NeuroMind AI - Deployment Guide

This guide explains how to deploy NeuroMind AI with the frontend on Vercel and the backend on Render.

## Architecture Overview

```
┌─────────────────────────────┐
│   Vercel (Frontend)         │
│   - Next.js 16              │
│   - React Components        │
│   - localStorage            │
└──────────────┬──────────────┘
               │ API calls
               │ (CORS enabled)
               ▼
┌─────────────────────────────┐
│   Render (Backend)          │
│   - FastAPI                 │
│   - ML Model (scikit-learn) │
│   - TF-IDF + Logistic Reg.  │
└─────────────────────────────┘
```

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with the v0 project repository
- Vercel account (free tier available)

### Steps

1. **Prepare the Frontend**
   ```bash
   # Install dependencies
   pnpm install
   
   # Build and test locally
   pnpm run build
   pnpm run dev
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the project root directory
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**
   In your Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
   ```
   
   This tells the frontend where to find the backend API.

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be live at a Vercel-provided URL

## Backend Deployment (Render)

### Prerequisites
- Render.com account (free tier available)
- GitHub repository with the backend code

### Steps

1. **Prepare the Backend**
   ```bash
   cd backend
   
   # Ensure pyproject.toml and Procfile are in place
   # Test locally first
   python generate_data.py
   python train_model.py
   python main.py
   # Visit http://localhost:8000/docs to see API documentation
   ```

2. **Push to GitHub**
   ```bash
   git add backend/
   git commit -m "Add FastAPI backend"
   git push origin main
   ```

3. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the deployment:
     
     **Name:** `neuromind-backend` (or your choice)
     
     **Environment:** Python 3.11
     
     **Build Command:** 
     ```
     cd backend && pip install -e . && python generate_data.py && python train_model.py
     ```
     
     **Start Command:** 
     ```
     cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
     ```
     
     **Root Directory:** `./` (leave as default, or enter if backend is in a subdirectory)

4. **Set Environment Variables**
   - In Render dashboard, go to your service
   - Click "Environment"
   - Add any additional variables if needed (none required for basic setup)

5. **Deploy**
   - Click "Deploy"
   - Render will build and start your backend
   - Once deployed, you'll get a URL like `https://neuromind-backend.onrender.com`

### Verify Backend Deployment
Once deployed, test your backend:
```bash
# Health check
curl https://your-render-backend-url.onrender.com/

# View API documentation
# Visit https://your-render-backend-url.onrender.com/docs in your browser
```

## Connecting Frontend to Backend

After both are deployed:

1. Get your Render backend URL (e.g., `https://neuromind-backend.onrender.com`)

2. Update Vercel environment variable:
   - Go to Vercel Project Settings → Environment Variables
   - Set `NEXT_PUBLIC_API_URL` to your Render URL

3. Redeploy frontend:
   - Vercel will automatically redeploy when you update environment variables

4. Test the integration:
   - Go to your Vercel frontend URL
   - Try creating an assessment
   - It should call the Render backend API

## Monitoring & Maintenance

### Frontend (Vercel)
- Vercel provides free SSL and automatic deployments
- Check analytics and logs in Vercel dashboard
- Monitor build times and failures

### Backend (Render)
- Free tier has limitations:
  - Services spin down after 15 minutes of inactivity
  - First request will be slow (cold start)
  - Limited to 0.5 GB RAM
  
- Upgrade to paid tier for production:
  - Always-on services
  - Better performance
  - More storage and bandwidth

### API Rate Limiting
For production, consider adding rate limiting:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/assess")
@limiter.limit("30/minute")
async def assess_mental_health(request: AssessmentRequest):
    # ... assessment logic
```

## Troubleshooting

### Frontend Can't Connect to Backend
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend URL is correct and accessible
- Check CORS is enabled in backend
- Look at browser console for error messages

### Backend Model Not Loading
- Check `/models` directory contains `model.pkl` and `vectorizer.pkl`
- Verify build command ran successfully
- Check Render logs for Python errors

### Cold Start Issues
- On Render free tier, first request takes ~30 seconds
- Consider upgrading to paid tier for production
- Or set up health checks to keep service warm

### Memory Issues
- If you get out-of-memory errors, upgrade Render plan
- Monitor model file size: should be < 100 MB
- Check for memory leaks in long-running services

## Production Recommendations

1. **Security**
   - Set `CORS` to specific domains only
   - Add API key authentication
   - Use HTTPS everywhere (both services support it)
   - Implement rate limiting

2. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Log important events
   - Set up alerts for failures

3. **Scaling**
   - Frontend: Vercel scales automatically
   - Backend: Upgrade to paid Render tier
   - Consider caching responses
   - Add database for persistent storage if needed

4. **Data Privacy**
   - Don't store user data unless necessary
   - Follow GDPR/CCPA compliance
   - Implement data deletion requests
   - Secure any sensitive information

## Cost Estimation

### Free Tier (Development/Demo)
- **Vercel:** $0 (limited to 100GB bandwidth/month)
- **Render:** $0 (service spins down after 15 min inactivity)
- **Total:** $0/month

### Paid Tier (Production)
- **Vercel:** ~$20/month (Pro plan)
- **Render:** ~$12/month (Starter instance)
- **Total:** ~$32/month

## Support & Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Render Documentation:** https://render.com/docs
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **scikit-learn Documentation:** https://scikit-learn.org/
