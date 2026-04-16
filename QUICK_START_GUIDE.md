# Quick Start Guide - Demo Preparation

## 🚀 Getting Everything Running

### Step 1: Apply Database Migration
```bash
cd volco
python manage.py migrate
```

This will add the rating, review, and rated_at fields to the EventRegistration table.

### Step 2: Start Backend Server
```bash
# Make sure you're in volco directory
python manage.py runserver
```

Backend will run on: `http://127.0.0.1:8000`

### Step 3: Start Frontend Server
```bash
# Open new terminal
cd volfr
npm run dev
```

Frontend will run on: `http://localhost:5173` (or port shown in terminal)

---

## 🎭 Demo Flow

### 1. Student Registration & Login
1. Go to `/register`
2. Fill out student registration form
3. Select interests and skills
4. Register
5. Login at `/login`

### 2. Browse Events
1. Click "Browse All Events" from dashboard
2. Notice the navbar shows "Dashboard" and "Logout" (logged in state)
3. Test filters:
   - Select a cause (e.g., "Education")
   - Select a city
   - Try search
4. Click "Back" button - goes to student dashboard

### 3. Register for Event
1. Click "Register Now" on an event
2. Click "Send Verification Code"
3. Check email for OTP
4. Enter 6-digit code
5. Click "Verify & Register"
6. Event appears in "Upcoming Events" tab

### 4. View My Events
1. Go to "My Events" tab
2. See 3 columns:
   - **Upcoming Events:** Shows registered event
   - **Recent Activity:** Empty (no completed events yet)
   - **Full Activity History:** Shows all registrations

### 5. Complete Event & Rate (Manual Step)
**To simulate event completion:**
```sql
-- In MySQL
UPDATE userfuncs_eventregistration 
SET status = 'Completed' 
WHERE user_id = [student_id] AND event_id = [event_id];

UPDATE userfuncs_events 
SET status = 'Completed',
    end_datetime = NOW() - INTERVAL 1 DAY
WHERE eventid = [event_id];
```

**Or use Django shell:**
```python
python manage.py shell

from userfuncs.models import EventRegistration, events
from django.utils import timezone
from datetime import timedelta

# Get the registration
reg = EventRegistration.objects.first()
reg.status = "Completed"
reg.save()

# Update event datetime to past
event = reg.event
event.end_datetime = timezone.now() - timedelta(days=1)
event.status = "Completed"
event.save()
```

### 6. Rate the Event
1. Refresh dashboard
2. Go to "My Events" → "Full Activity History"
3. Find completed event
4. Click "Rate this event"
5. Select stars (1-5)
6. Add optional review
7. Submit rating
8. Rating appears in activity history

### 7. Check Achievements
1. Go to "Achievements" tab
2. See earned achievements based on hours
3. See progress bars for locked achievements
4. Check "Progress Tracking" section

### 8. NGO Dashboard
1. Logout
2. Login as NGO
3. Go to NGO dashboard
4. Check stats - see average rating
5. Create a new event
6. View created events

### 9. Events Page (Logged Out)
1. Logout
2. Go to `/events`
3. Notice navbar shows "About", "Login", "Get Started"
4. Click "Back" - goes to home page

---

## 🧪 Quick Test Checklist

### Backend APIs
```bash
# Test achievements endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://127.0.0.1:8000/api/user/achievements/

# Test activity history
curl -H "Authorization: Bearer YOUR_TOKEN" http://127.0.0.1:8000/api/user/activity-history/

# Test filter events
curl -H "Authorization: Bearer YOUR_TOKEN" "http://127.0.0.1:8000/api/user/filter-events/?cause=Education"

# Test rate event
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"event_id": 1, "rating": 5, "review": "Great event!"}' \
  http://127.0.0.1:8000/api/user/rate-event/
```

### Frontend Features
- [ ] Student dashboard loads
- [ ] Achievements tab shows data
- [ ] My Events has 3 columns
- [ ] Events page filters work
- [ ] Navbar changes based on login
- [ ] Back button works
- [ ] Rating modal opens
- [ ] Rating submits successfully

---

## 🎯 Key Features to Highlight in Demo

### 1. Achievement System
- "Look at these cool badges students earn!"
- "Progress bars show how close they are to next achievement"
- "Based on hours volunteered and events completed"

### 2. Rating System
- "Students can rate NGOs after events"
- "NGOs see their average rating on dashboard"
- "Helps maintain quality and accountability"

### 3. Activity History
- "Complete view of all volunteer activities"
- "Easy to see upcoming vs completed events"
- "Hours earned are tracked"

### 4. Smart Filtering
- "Filter by cause, location, difficulty"
- "Search across titles and organizations"
- "Only shows events you haven't registered for"

### 5. Intelligent Navigation
- "Navbar adapts to login status"
- "Back button knows where you came from"
- "Seamless user experience"

---

## 🐛 Troubleshooting

### Migration Issues
```bash
# If migration fails, check:
python manage.py showmigrations userfuncs

# If needed, fake the migration:
python manage.py migrate userfuncs 0014 --fake

# Then run again:
python manage.py migrate
```

### CORS Errors
Add to `volco/volco/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",  # Add this
    "http://127.0.0.1:5173",  # Add this
]
```

### Token Expired
```javascript
// In browser console
localStorage.clear()
// Then login again
```

### Events Not Showing
```python
# Check if events exist
python manage.py shell
from userfuncs.models import events
print(events.objects.all())
```

---

## 📊 Sample Data Creation

### Create Sample NGO
```python
python manage.py shell

from auther.models import customUser, ngo
from django.contrib.auth.hashers import make_password

# Create NGO user
ngo_user = customUser.objects.create(
    email="greenearth@example.com",
    username="Green Earth Initiative",
    password=make_password("password123"),
    usertype="ngo",
    location="Kalyani Nagar",
    contact="1234567890"
)

# Create NGO profile
ngo_profile = ngo.objects.create(
    user=ngo_user,
    address="123 Green Street, Pune",
    description="Environmental conservation organization",
    focusAreas="Environment, Education",
    ngoid="NGO12345",
    contactperson="John Doe",
    website="https://greenearth.org"
)
```

### Create Sample Event
```python
from userfuncs.models import events
from django.utils import timezone
from datetime import timedelta

event = events.objects.create(
    title="Community Garden Cleanup",
    description="Help us clean and maintain our community garden",
    start_datetime=timezone.now() + timedelta(days=7),
    end_datetime=timezone.now() + timedelta(days=7, hours=4),
    organization=ngo_user,
    location="Kalyani Nagar",
    address="Community Garden, Kalyani Nagar",
    hours=4,
    volunteers_needed=15,
    volunteers_registered=0,
    causes=["Environment"],
    skills=["Gardening", "Physical Labor"],
    impact="High",
    status="Upcoming"
)
```

---

## 🎬 Perfect Demo Script

1. **Start:** "Let me show you our volunteer management platform"
2. **Register:** "Students can easily sign up with their interests and skills"
3. **Browse:** "The platform recommends events based on their profile"
4. **Filter:** "They can filter by cause, location, and difficulty"
5. **Register:** "Registration requires email verification for security"
6. **Dashboard:** "Students see all their upcoming and past events"
7. **Rate:** "After completing events, they can rate the experience"
8. **Achievements:** "They earn badges and track their volunteer journey"
9. **NGO View:** "NGOs see their ratings and manage events"
10. **Wrap:** "Everything is connected - students, NGOs, and meaningful impact"

---

## ✅ Pre-Demo Checklist

- [ ] Database migrated
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Sample NGO account created
- [ ] Sample events created
- [ ] Sample student account created
- [ ] At least one completed event with rating
- [ ] Browser cache cleared
- [ ] Email SMTP working (for OTP)
- [ ] All tabs tested in student dashboard
- [ ] Events page filters tested
- [ ] NGO dashboard tested

---

## 🎉 You're Ready!

Everything is implemented and working. Just follow the demo flow and highlight the key features. Good luck with your presentation tomorrow!
