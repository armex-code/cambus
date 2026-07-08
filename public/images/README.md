# Homepage photos

Drop three photos in this folder and the homepage picks them up
automatically on the next deploy (the slots stay hidden while the files
are missing):

| File | Where it shows | Suggested content |
| --- | --- | --- |
| `campus.jpg` | Hero, right side | AUI campus |
| `car.jpg` | "How it works" section | Riders in a car |
| `booking.jpg` | "How it works" section, smaller | Someone booking a ride on their phone |

Landscape orientation works best (roughly 4:3 for campus, 16:10 for the
others). Keep each under ~400 KB so the page stays fast: https://squoosh.app
does this in the browser for free.

Easiest way to add them: GitHub repo page -> `public/images` -> "Add file"
-> "Upload files" -> commit to main. Vercel redeploys on its own.
