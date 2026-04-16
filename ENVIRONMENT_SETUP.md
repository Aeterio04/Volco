# Environment Variables Setup - Complete

## Summary

Successfully moved all sensitive credentials from hardcoded values in `settings.py` to environment variables stored in `.env` file.

---

## Changes Made

### 1. Created `.env` File
**Location:** `volco/.env`

Contains all sensitive credentials:
- Django SECRET_KEY
- Database credentials (user, password, host, port)
- Email credentials (Gmail address and app password)
- JWT token lifetimes

### 2. Updated `settings.py`
**Location:** `volco/volco/settings.py`

Changes:
- Added `import os` and `from dotenv import load_dotenv`
- Load environment variables from `.env` file
- Replaced all hardcoded credentials with `os.getenv()` calls
- Added fallback default values for safety

**Before:**
```python
SECRET_KEY = 'django-insecure-hpztq6^g*&((*%kt6p63ycz8cz!@#lp4*zajhqywcq2-mg_en+'
DB_PASSWORD = 'OjasSangwai@17'
EMAIL_HOST_PASSWORD = 'ziohowomfpuqmljq'
```

**After:**
```python
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key-change-this')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
```

### 3. Created `.env.example`
**Location:** `volco/.env.example`

Template file showing required environment variables without actual credentials. Safe to commit to git.

### 4. Updated `.gitignore`
**Location:** `.gitignore` (root)

Added comprehensive ignore rules:
- `.env` and all environment files
- Python cache files (`__pycache__`, `*.pyc`)
- Django files (`*.log`, `db.sqlite3`)
- Virtual environments (`venv/`, `env/`)
- IDE files (`.vscode/`, `.idea/`)
- Database files
- Credentials and secrets

### 5. Created `requirements.txt`
**Location:** `volco/requirements.txt`

Added `python-dotenv` dependency for loading environment variables.

### 6. Created Setup Documentation
**Location:** `volco/README.md`

Complete setup instructions for new developers.

---

## Environment Variables Reference

| Variable | Purpose | Current Value (in .env) |
|----------|---------|------------------------|
| SECRET_KEY | Django secret key | django-insecure-hpztq6^g*&((*%kt6p63ycz8cz!@#lp4*zajhqywcq2-mg_en+ |
| DEBUG | Debug mode | True |
| DB_ENGINE | Database backend | django.db.backends.mysql |
| DB_NAME | Database name | volco |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | OjasSangwai@17 |
| DB_HOST | Database host | 127.0.0.1 |
| DB_PORT | Database port | 3306 |
| EMAIL_BACKEND | Email backend | django.core.mail.backends.smtp.EmailBackend |
| EMAIL_HOST | SMTP server | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USE_TLS | Use TLS | True |
| EMAIL_HOST_USER | Gmail address | ojsangwai17@gmail.com |
| EMAIL_HOST_PASSWORD | Gmail app password | ziohowomfpuqmljq |
| JWT_ACCESS_TOKEN_LIFETIME_HOURS | Access token lifetime | 2 |
| JWT_REFRESH_TOKEN_LIFETIME_DAYS | Refresh token lifetime | 30 |

---

## Installation Steps

### For New Setup:

1. **Install python-dotenv**
   ```bash
   cd volco
   pip install python-dotenv
   # or install all dependencies
   pip install -r requirements.txt
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Update .env with your credentials**
   - Edit `volco/.env`
   - Replace placeholder values with actual credentials

4. **Restart Django server**
   ```bash
   python manage.py runserver
   ```

### For Existing Setup:

The `.env` file already exists with your current credentials. Just install python-dotenv:

```bash
pip install python-dotenv
```

Then restart your Django server.

---

## Security Benefits

1. **No Credentials in Code**
   - All sensitive data is in `.env` file
   - `.env` is in `.gitignore` and won't be committed

2. **Easy Credential Rotation**
   - Change credentials in `.env` without touching code
   - No need to search through code for hardcoded values

3. **Environment-Specific Configuration**
   - Different `.env` files for development, staging, production
   - Same codebase works across all environments

4. **Team Collaboration**
   - Share `.env.example` with team
   - Each developer maintains their own `.env`
   - No risk of accidentally committing credentials

5. **Production Ready**
   - Easy to use environment variables in deployment platforms
   - Compatible with Docker, Heroku, AWS, etc.

---

## Files Created/Modified

### Created:
- `volco/.env` - Environment variables with actual credentials
- `volco/.env.example` - Template for environment variables
- `volco/requirements.txt` - Python dependencies
- `volco/README.md` - Setup documentation
- `.gitignore` - Git ignore rules (root level)

### Modified:
- `volco/volco/settings.py` - Updated to use environment variables

---

## Important Notes

⚠️ **NEVER commit `.env` file to git!**

✅ **DO commit `.env.example` file** - it's safe and helps others set up

🔒 **Keep your `.env` file secure** - it contains all your credentials

📝 **Update `.env.example`** when adding new environment variables

---

## Troubleshooting

### Error: "No module named 'dotenv'"
**Solution:** Install python-dotenv
```bash
pip install python-dotenv
```

### Error: Environment variables not loading
**Solution:** Check that `.env` file is in the correct location (`volco/.env`)

### Error: Database connection failed
**Solution:** Verify database credentials in `.env` file

### Error: Email not sending
**Solution:** 
1. Check `EMAIL_HOST_PASSWORD` is Gmail App Password (not regular password)
2. Remove any spaces from the app password
3. Verify `EMAIL_HOST_USER` is correct

---

## Next Steps

1. ✅ Install python-dotenv: `pip install python-dotenv`
2. ✅ Verify `.env` file exists in `volco/` folder
3. ✅ Restart Django server
4. ✅ Test that everything works (database, email, authentication)
5. ✅ Commit changes to git (`.env` will be automatically ignored)

---

## Git Status

The following files are now protected from being committed:
- `volco/.env` (contains actual credentials)
- All `__pycache__` directories
- `*.pyc` files
- Database files
- Log files

Safe to commit:
- `volco/.env.example` (template only)
- `volco/volco/settings.py` (no credentials)
- `.gitignore`
- `volco/requirements.txt`
- `volco/README.md`
