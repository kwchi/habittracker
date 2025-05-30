# Habit Tracker
Track your daily habits and stay motivated in one simple web-app!

**Habit Tracker** — a minimalist productivity tracker built from scratch using HTML, CSS, and vanilla JavaScript.
Includes habit creation, daily completion tracking, a visual 7-day calendar, completion stats and streaks.
Fully client-side (localStorage), responsive, with user-centered UI logic and flows.

Check here - https://kwchi.github.io/habittracker/

## Features
- Add daily habits with category and color
- Daily check-in (one click per day)
- View progress for each habit across the last 7 days
- Daily reset to track habits every day
- Stats: completion %, current streaks, and progress bars
- Color-coded categories for better organization
- LocalStorage support — your data stays even after refreshing

## UI Logic
- The interface is designed around the main user interaction flow: Add → Display → Mark → Analytics
- You can check off a habit only once per day
- Habits are shown automatically every day
- Calendar and stats update with every action
- Data is saved in localStorage

## Analytics
- Completion Calendar — visually shows the days the habit was completed
- Completion Rate — overall progress over the last 7 days
- Streak — how many consecutive days the habit has been done

## Responsive UI
- On mobile — vertical layout
- Large buttons, readable fonts
- Works without installation

## Technical Details
- HTML, CSS, JavaScript (vanilla)
- No backend 
- Data stored in the browser (localStorage)
- No dependencies — fully lightweight

## User Interaction Flow diagram
![graph](https://github.com/user-attachments/assets/7515e1fa-96a5-406b-a61e-efc14b69cac8)
