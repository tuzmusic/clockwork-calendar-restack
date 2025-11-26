# Clockwork Calendar

A personal project that I use to more easily save my band's weekly schedule emails to my calendar.

1. Authenticates with Google
2. Fetches the latest scheduling email
3. Parses the HTML of the email into `Event` objects
4. Fetches all upcoming gigs from my Google Calendar
5. Serializes and returns all email and calendar gigs to the client
6. Displays the email and calendar gigs on the page, noting any differences between the details in the email and in the calendar events
7. Allows the user to save new gigs, and update existing gigs, to the Google Calendar
8. Uses Google Maps APIs to fetch various relevant distances to the gig to help with my planning
9. Saves/updates calendar event title to contain easily skimmable info about a gig (distance and time to venue; whether it's far enough for a hotel)

Currently hardcodes my name (for detecting if I'm playing ceremony or cocktails) and my address and relevant addresses, for distance calculations.
