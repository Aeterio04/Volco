# NGO Event Management Features

## Implementation Summary

Successfully implemented comprehensive event management features for NGO Dashboard including event details viewing, volunteer list, and event editing with automated email notifications.

---

## Features Implemented

### 1. View Event Details with Registered Volunteers

**Backend Endpoint:**
- `GET /api/ngo/event/<event_id>/`
- Returns complete event details including all registered volunteers
- Shows volunteer information: name, email, college, major, skills, contact, registration status

**Frontend:**
- Eye icon button in Events table opens detailed view modal
- Displays event information: title, date, time, location, address, volunteers count, status
- Shows full description
- Lists all registered volunteers in a table format
- Empty state when no volunteers registered

### 2. Edit Event Functionality

**Backend Endpoint:**
- `PUT /api/ngo/event/<event_id>/update/`
- Allows updating: title, description, address, date, start_time, end_time, volunteers_needed
- Automatically detects critical changes (address, date, time)
- Sends email notifications to all registered volunteers when critical fields change

**Frontend:**
- Edit icon button in Events table opens edit modal
- Pre-populated form with current event data
- All fields editable
- Success message indicates if volunteers were notified

### 3. Automated Email Notifications

**Trigger Conditions:**
Email sent to all registered volunteers when any of these fields change:
- Address
- Event date
- Start time
- End time

**Email Content:**
- Subject: "Event Update: [Event Title]"
- Lists all changes (old value → new value)
- Shows complete updated event details
- Professional formatting

**Email Configuration:**
- Uses Django's SMTP backend
- Configured for Gmail with App Password
- Sends from: EMAIL_HOST_USER in settings.py

---

## API Endpoints

### Get Event Details
```
GET /api/ngo/event/<event_id>/
Authorization: Bearer <token>

Response:
{
  "eventid": 1,
  "title": "Community Garden Cleanup",
  "description": "...",
  "start_datetime": "2026-04-22T03:20:00Z",
  "end_datetime": "2026-04-22T15:21:00Z",
  "location": "Shaniwar Peth",
  "address": "123 Main St",
  "hours": 12.02,
  "volunteers_needed": 55,
  "volunteers_registered": 12,
  "causes": ["Environment", "Community Development"],
  "skills": ["Programming", "Photography"],
  "status": "Upcoming",
  "volunteers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "college": "State University",
      "major": "Computer Science",
      "skills": "Programming, Teaching",
      "contact": "+1234567890",
      "registered_at": "2026-04-15T10:30:00Z",
      "status": "Registered"
    }
  ]
}
```

### Update Event
```
PUT /api/ngo/event/<event_id>/update/
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Updated Event Title",
  "description": "Updated description",
  "address": "New address",
  "volunteers_needed": 60,
  "date": "2026-04-25",
  "start_time": "09:00",
  "end_time": "17:00"
}

Response:
{
  "success": true,
  "message": "Event updated successfully",
  "notifications_sent": true
}
```

---

## Files Modified

### Backend
1. **volco/ngofuncs/views.py**
   - Added `get_event_details()` function
   - Added `update_event()` function
   - Added `send_event_update_email()` helper function

2. **volco/ngofuncs/urls.py**
   - Added route: `api/ngo/event/<int:event_id>/`
   - Added route: `api/ngo/event/<int:event_id>/update/`

### Frontend
3. **volfr/client/pages/NGODashboard.tsx**
   - Added state: `isEditEventOpen`, `eventVolunteers`
   - Added `fetchEventDetails()` function
   - Added `handleViewEvent()` function
   - Added `handleEditEvent()` function
   - Added `editForm` with react-hook-form
   - Added `onEditSubmit()` function
   - Updated View Event Dialog with volunteers table
   - Added Edit Event Dialog with form
   - Updated action buttons to use new handlers

---

## User Flow

### Viewing Event Details
1. NGO clicks Eye icon (👁️) in Events table
2. Modal opens showing:
   - Event details (date, time, location, address, volunteers, status)
   - Full description
   - Table of all registered volunteers
3. NGO can see volunteer contact information and registration status

### Editing Event
1. NGO clicks Edit icon (✏️) in Events table
2. Edit modal opens with pre-filled form
3. NGO modifies any fields:
   - Event title
   - Description
   - Address
   - Date
   - Start time
   - End time
   - Volunteers needed
4. NGO clicks "Update Event"
5. If address/date/time changed:
   - System sends email to all registered volunteers
   - Success message: "Event updated successfully! Volunteers have been notified."
6. Otherwise:
   - Success message: "Event updated successfully!"
7. Page refreshes to show updated data

---

## Email Notification Example

```
Subject: Event Update: Community Garden Cleanup

Hello,

The event "Community Garden Cleanup" has been updated with the following changes:

Address: 123 Main St → 456 Oak Avenue
Start Time: 2026-04-22 03:20 → 2026-04-25 09:00
End Time: 2026-04-22 15:21 → 2026-04-25 17:00

Updated Event Details:
- Title: Community Garden Cleanup
- Date: 2026-04-25
- Time: 09:00 - 17:00
- Location: Shaniwar Peth
- Address: 456 Oak Avenue

Please make note of these changes. If you have any questions, please contact the organization.

Thank you,
VolunteerConnect Team
```

---

## Security Features

- JWT authentication required for all endpoints
- NGOs can only view/edit their own events
- Validates event ownership before allowing modifications
- Emoji stripping to prevent database encoding issues
- Input validation on all fields

---

## Testing Checklist

- [ ] View event details shows correct information
- [ ] Volunteer list displays all registered volunteers
- [ ] Edit form pre-populates with current data
- [ ] Updating title/description only (no email sent)
- [ ] Updating address triggers email notification
- [ ] Updating date triggers email notification
- [ ] Updating time triggers email notification
- [ ] Email contains correct change information
- [ ] Email sent to all registered volunteers
- [ ] Page refreshes after successful update
- [ ] Error handling for failed updates
- [ ] Permission check (NGO can only edit own events)

---

## Next Steps (Optional Enhancements)

1. **Delete Event Functionality**
   - Add confirmation dialog
   - Send cancellation email to volunteers
   - Update volunteer hours if event was completed

2. **QR Code Generation**
   - Generate QR for volunteer registration
   - Generate QR for event check-in

3. **Bulk Email**
   - Send custom messages to all event volunteers
   - Announcement system

4. **Event Analytics**
   - Track volunteer attendance
   - Show completion rates
   - Rating trends

---

## Notes

- Email password must be Gmail App Password (not regular password)
- Remove spaces from app password: `abcdefghijklmnop`
- Emojis are automatically stripped from title/description
- Empty strings in arrays are automatically cleaned
- Page reload ensures data consistency after updates
