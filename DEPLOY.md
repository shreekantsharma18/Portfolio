# Deployment Guide

This guide will help you deploy your portfolio for free using **GitHub Pages**.

## Prerequisites
- A GitHub account.
- Git installed on your computer.

## Strategy: GitHub Pages (Recommended)
We have configured a `deploy` script that automatically pushes your built website to a `gh-pages` branch on your repository. GitHub will then serve this branch as your live website.

### Step 1: Initialize Git and Push to GitHub
If you haven't already connected this project to a GitHub repository:

1.  **Create a new repository** on GitHub (do not initialize with README/gitignore).
2.  Open your terminal in the project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual details)*

### Step 2: Deploy
Once your code is on GitHub, deploy it by running:

```bash
npm run deploy
```

This command will:
1.  Build your project (creating a `dist` folder).
2.  Push that folder to a special `gh-pages` branch.

### Step 3: Configure GitHub Settings
1.  Go to your repository on GitHub.
2.  Navigate to **Settings** > **Pages**.
3.  Under **Source**, ensure it is set to **Deploy from a branch**.
4.  Under **Branch**, select `gh-pages` and `/ (root)`.
5.  Click **Save**.

Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` in a few minutes!

---

## Alternative: Vercel / Netlify
If you prefer Vercel or Netlify, the process is even simpler:

1.  Push your code to GitHub (Step 1 above).
2.  Log in to Vercel/Netlify.
3.  Click **"Add New Project"** and select your GitHub repository.
4.  The default settings (Vite) should trigger automatically.
5.  Click **Deploy**.
