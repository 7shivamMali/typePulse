# TypePulse — Production Deployment Guide (Vercel + Render)

This guide walks you through deploying **TypePulse** to the web using the **Free Cloud Split (Vercel + Render)**.
- **Frontend**: Hosted globally on **Vercel** (Free, instant global CDN, automatic SSL).
- **Backend**: Hosted on **Render** (Free Python FastAPI web service).
- **Setup Time**: ~3 to 5 minutes.

---

## Step 1: Push Code to GitHub

1. Open your browser and go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. `typepulse` or `typing-website`).
3. Set visibility to **Public** or **Private**, then click **Create repository**.
4. In your terminal in this project folder (`e:\Study\Projects\Typing website - gemini`), run:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main
git push -u origin main
```

*(Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPO_NAME>` with your GitHub details)*

---

## Step 2: Deploy the FastAPI Backend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in (you can sign in with GitHub).
2. Click **New +** in the top-right and select **Web Service**.
3. Choose **Build and deploy from a Git repository**, click **Next**, and select your `typepulse` repository.
4. Fill in the following settings:
   - **Name**: `typepulse-api`
   - **Region**: Select the region closest to you (e.g. *Frankfurt*, *Oregon*, or *Singapore*).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Select **Free** ($0/month).
5. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL` = `sqlite:///./typing.db`
   - `PYTHON_VERSION` = `3.12.0`
   - `SECRET_KEY` = *(Type any long random string, e.g. `typepulse-prod-secret-98234`)*
6. Click **Deploy Web Service**.
7. Once deployment succeeds, Render gives you a public URL at the top:
   > Example: `https://typepulse-api.onrender.com`
   
   *(Copy this URL — you'll use it in Step 3! You can test it by visiting `https://your-api.onrender.com/api/health`, which should return `{"status":"healthy"}`)*

---

## Step 3: Deploy the React Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (with GitHub).
2. Click **Add New...** -> **Project**.
3. Import your `typepulse` GitHub repository.
4. In the configuration screen:
   - **Project Name**: `typepulse`
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: Click *Edit* and select **`frontend`**.
5. Expand the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render Backend URL from Step 2 (e.g. `https://typepulse-api.onrender.com`)
6. Click **Deploy**.

---

## Step 4: Verification

In about 30–60 seconds, Vercel will present you with your live production URL (e.g. `https://typepulse.vercel.app`):
- Open the URL in any browser or mobile device.
- The React application connects to your Render backend at `https://typepulse-api.onrender.com/api`.
- Words, code snippets, AI drills, 15 themes, 8 switch sounds, and cockpit telemetry will all be live worldwide!

---

## Alternative: All-in-One Deployment on Render (Single Blueprint)

If you prefer to deploy both frontend and backend on Render using our included blueprint:
1. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
2. Connect your GitHub repository.
3. Render will auto-detect the `render.yaml` in your repository and set up both the API service and static web frontend automatically.
