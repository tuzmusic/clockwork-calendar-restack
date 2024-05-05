An EventRow represents the full event set. The row consists of:
 - The "real" event (in the middle), which represents the true (correct) and full (detailed) state of the event.
 - The email event (on the left), which is the source of true and correct basic data (date, times of parts, and location)
 - The calendar event (on the right), which is the persistent representation of the data. 

The storage (calendar event) is where derived data -- into the "real" event from the correct basic data (in the email event) -- may be
 retrieved, saving the expense of recalculating/refetching it.

Importantly, the basic data of the "real" event _always matches the data of the email event_.
When a "real" event is created for the first time, the derived data (distance info) is fetched, and stored "locally",
i.e., in the running app. It may then be written to persist in the remote calendar when the event is first stored there.

Henceforth, the app will always show the "middle" event with the correct basic data from the email event, and the stored derived data from the calendar event.
The times/parts of the stored calendar event may be shown in the UI, but they are essentially ignored in the "middle" event.
If any of the times/parts in the email event differ from those of the calendar event, there will be an opportunity to update the stored calendar event.
The UI may have some visual indication of the discrepancy in some cosmetically interesting way.
And if the user does not choose to update this stored event, the remote calendar will remain "out of date" (though the app will always show the discrepancy and offer the chance to update)

If the location of an event has not changed (i.e., the stored calendar event has the same location as the email event) then any distance info (or other location-related derived data) will be sourced from the stored calendar event, to appear in the "middle" event.
If a stored calendar event is _missing_ any such data, it can be updated (since the "middle" event will have derived/fetched it).
If the location of the email event is _different_ from the location stored in the calendar, the distance data can be recalculated in the "middle", and then updated in the external calendar.

Again, **_the unit of an event is the full "row"_**. A "real" event is created using these two, and it isn't really practical to worry about creating an event from one _or_ the other in isolation.
