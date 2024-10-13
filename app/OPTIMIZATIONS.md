# Optimizations, Refinements, Refactoring

- [X] EventPart *class*
  - [X] Ceremony actualStart handled in subclass
- [X] EventTimeline(?) class, handles ordering events
  - [X] Also gets event start and end times?
- Location class, handles distances and stuff?
  - Some kind of service that takes an event and a distance service, and knows which distances to get.
- Use start time when getting route info
- Better width/alignment in email html 
  - probably best to just construct it from data, with grid layout, and scrap the original html
- Use local storage to persist server updates (e.g., multiple gigs can show distance info)

# Functionality
- [X] Distance info in json
- [X] Parts info in json?
  - maybe not since this is really only for hasChanged (which is returned in the event row json)
- [X] Distance info in Full gig UI
- [X] ~~Distance info in Calendar gig UI?~~
- [X] Fetching distance info (resource action)
- [X] Save to calendar (create CalendarService)
- [ ] Update to calendar
- [ ] Check on saving/retrieving extended props
- [ ] Call real services, auth
  - Distance service (Google Maps - no auth needed)
  -[X] Email service (Gmail)
  -[X] Calendar service (Google calendar) 
