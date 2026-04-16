# Volco Backend Setup

## Environment Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   
   - Update `.env` with your actual credentials:
     - `SECRET_KEY`: Django secret key
     - `DB_PASSWORD`: Your MySQL database password
     - `EMAIL_HOST_USER`: Your Gmail address
     - `EMAIL_HOST_PASSWORD`: Your Gmail App Password (not regular password)

3. **Gmail App Password Setup**
   - Go to https://myaccount.google.com/apppasswords
   - Enable 2-Step Verification if not already enabled
   - Generate an app password for "Mail"
   - Copy the 16-character code (without spaces)
   - Paste it in `.env` as `EMAIL_HOST_PASSWORD`

4. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Run Server**
   ```bash
   python manage.py runserver
   ```

## Important Notes

- Never commit `.env` file to git (it's in .gitignore)
- Always use `.env.example` as a template for new setups
- Keep your credentials secure and never share them

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| SECRET_KEY | Django secret key | django-insecure-xxx |
| DEBUG | Debug mode | True/False |
| DB_NAME | Database name | volco |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | your-password |
| DB_HOST | Database host | 127.0.0.1 |
| DB_PORT | Database port | 3306 |
| EMAIL_HOST_USER | Gmail address | your-email@gmail.com |
| EMAIL_HOST_PASSWORD | Gmail app password | 16-char-code |
| JWT_ACCESS_TOKEN_LIFETIME_HOURS | JWT access token lifetime | 2 |
| JWT_REFRESH_TOKEN_LIFETIME_DAYS | JWT refresh token lifetime | 30 |
