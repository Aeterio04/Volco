# Quick Installation Guide

## Install python-dotenv

Run this command to install the required package:

```bash
pip install python-dotenv
```

Or install all dependencies:

```bash
pip install -r requirements.txt
```

## Verify Setup

Your `.env` file is already configured with your credentials. Just restart the Django server:

```bash
python manage.py runserver
```

## That's it!

Your credentials are now secure and won't be committed to git.

---

## What Changed?

- ✅ All credentials moved from `settings.py` to `.env`
- ✅ `.env` file is in `.gitignore` (won't be committed)
- ✅ `settings.py` now uses environment variables
- ✅ More secure and production-ready

## Files to Commit

Safe to commit:
- `settings.py` (no credentials anymore)
- `.env.example` (template only)
- `requirements.txt`
- `.gitignore`

Never commit:
- `.env` (contains actual credentials) ← Already in .gitignore
