# Kiranpreet Kaur — Student Portfolio Website

A personal student portfolio website developed for B.Tech CSE (Artificial Intelligence).

## 🚀 Key Features
- **Hero Section:** Profile snapshot, contact chips (GitHub, LinkedIn, Email), CV view/download.
- **About Me:** Academic background, specializations, and direct CV access.
- **COA Learning (Number System Converter):** Interactive converter supporting Decimal, Binary, Hexadecimal, and Octal with strict regex validation, base-swapping, and clipboard copy.
- **GitHub Integration:** Featured project (Instruction Set Simulator for COA) and direct link to GitHub profile.
- **Achievements & Certifications:** Verified Microsoft Certified credentials (Azure AI Fundamentals AI-900 & Azure Fundamentals AZ-900) and symposium certificates with PDF links.
- **Assignments:** COA Assignment document review and replacement interface.
- **Connect Section:** Direct mail, LinkedIn, and GitHub contact cards.
- **Responsive Design:** Mobile menu toggle, adaptive grids, and glassmorphic styling.

---

## ⚡ Deploy to Vercel (Recommended — 1 Click, Instant & Free)

### Option 1: Via Vercel Web Dashboard (Simplest)
1. Push your repository to GitHub: [`https://github.com/Kiranpreet-kaur-09/coa`](https://github.com/Kiranpreet-kaur-09/coa)
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **Add New...** &rarr; **Project**.
4. Import your **`coa`** repository.
5. In the Project Configuration:
   - **Framework Preset:** Select **Other** (Static Site).
   - **Root Directory:** If your files are in a subfolder like `student_portfolio_website`, select that folder; otherwise keep `./`.
   - **Build & Output Settings:** Leave default (Build command empty, output directory `./`).
6. Click **Deploy**. Your portfolio will be live at `https://kiranpreet-portfolio.vercel.app` (or similar custom URL)!

### Option 2: Deploy directly via Terminal (Vercel CLI)
Run the following in the project directory:
```bash
npx vercel
```
Follow the quick prompts in your terminal:
- Set up and deploy? **Y**
- Link to existing project? **N**
- Project name: **kiranpreet-portfolio**
- In which directory is your code located? **./**

When ready for production:
```bash
npx vercel --prod
```

---

## 🌐 Deploy to Render (Alternative)
1. Go to [dashboard.render.com](https://dashboard.render.com) &rarr; **New +** &rarr; **Static Site**.
2. Connect your GitHub repository.
3. Set **Publish Directory** to `./` and click **Create Static Site**.
