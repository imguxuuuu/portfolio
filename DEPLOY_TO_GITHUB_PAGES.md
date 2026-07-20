# Deploy Portfolio to GitHub Pages

Your live URL will be: `https://imguxuuuu.github.io/portfolio/`
(or whatever repo name you choose)

---

## Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in as `imguxuuuu`
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `portfolio` (or `imguxuuuu.github.io` for root URL)
4. Set visibility to **Public**
5. Leave everything else unchecked — do NOT add README/gitignore
6. Click **Create repository**

> **Tip:** If you name the repo exactly `imguxuuuu.github.io`, your URL becomes
> `https://imguxuuuu.github.io` (no subfolder). Any other name gives
> `https://imguxuuuu.github.io/<repo-name>/`.

---

## Step 2 — Install Git (if not already installed)

Open Command Prompt or PowerShell and run:

```
git --version
```

If you get a version number, skip to Step 3.
If not, download Git from: https://git-scm.com/download/win — install with defaults.

---

## Step 3 — Push Your Files

Open Command Prompt, then run these commands one by one:

```bash
cd "C:\Users\GURUR\Downloads\portfolio-website"

git init
git add .
git commit -m "Initial portfolio deploy"
git branch -M main
git remote add origin https://github.com/imguxuuuu/portfolio.git
git push -u origin main
```

> Replace `portfolio` in the remote URL if you chose a different repo name.

When prompted, enter your GitHub username and password.
**Note:** GitHub no longer accepts your account password — you need a Personal Access Token instead.

### Getting a Personal Access Token (one-time setup)
1. GitHub → top-right avatar → **Settings**
2. Scroll to **Developer settings** (bottom of left sidebar)
3. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
4. Give it a name, set expiry, tick the **repo** scope
5. Click **Generate token** — copy it immediately (shown only once)
6. Use this token as the password when Git asks

---

## Step 4 — Enable GitHub Pages

1. Go to your repo on GitHub: `github.com/imguxuuuu/portfolio`
2. Click **Settings** tab
3. Left sidebar → **Pages**
4. Under **Branch**, select `main` and folder `/` (root)
5. Click **Save**

GitHub will show a green banner:
> "Your site is live at https://imguxuuuu.github.io/portfolio/"

It takes about **1–2 minutes** to go live the first time.

---

## Step 5 — Add Your Resume PDF

Drop your CV into the `assets/` folder as `resume.pdf` before pushing,
or push it separately:

```bash
cd "C:\Users\GURUR\Downloads\portfolio-website"
git add assets/resume.pdf
git commit -m "Add resume PDF"
git push
```

---

## Updating the Site Later

Whenever you change any file, just run:

```bash
cd "C:\Users\GURUR\Downloads\portfolio-website"
git add .
git commit -m "Update portfolio"
git push
```

The live site updates within ~30 seconds.

---

## Checklist Before Sharing the Link

- [ ] `assets/resume.pdf` is in the folder
- [ ] `assets/profile.jpg` is in the folder (your photo)
- [ ] LinkedIn URL is correct: `linkedin.com/in/gururaghuraman/`
- [ ] GitHub URL is correct: `github.com/imguxuuuu`
- [ ] Email is correct: `s.gururaghuraman@gmail.com`
- [ ] Opened the live URL in browser and checked it looks right
- [ ] Tested on mobile (resize browser window)
