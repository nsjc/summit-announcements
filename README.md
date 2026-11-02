# Summit Retail Group – Team Updates

A phone-first prototype for **Scenario 2: Important Employee Updates**.

Summit Retail Group has 5 stores and about 200 employees, most of whom work on the sales floor and don't check email. Store managers share updates by text, printed notices and meetings, and have no way to know who actually saw them. This prototype gives managers one place to post updates and see who has acknowledged the important ones. Employees get a simple feed on their phone.

**Who it's for:** store managers like Rachel, who need proof that safety and policy updates reached everyone, and sales associates like Alex, who don't want another noisy app.

## How to run it

1. Install **Node.js** (the LTS version) from https://nodejs.org.
2. Open a terminal in this folder.
   - **Mac:** right-click the folder in Finder and choose **New Terminal at Folder**.
   - **Windows:** type `cmd` in the folder's address bar and press Enter.
3. Install the app's parts (one time only):
   ```
   npm install
   ```
4. Start the app:
   ```
   npm run dev
   ```
   It opens in your browser at **http://localhost:5173**.
5. Press **Ctrl + C** in the terminal to stop it.

**On a phone:** run `npm run dev -- --host` instead, then open the **Network:** address it prints, with the phone on the same Wi-Fi.

There's no backend or login. Data is mock data saved in the browser (localStorage), so changes survive a refresh. **Reset sample data** at the bottom of the page starts over.

## Walkthrough

Use **Manager / Employee** at the top to switch roles, and **Viewing as** to pick a person. The demo starts as **Rachel Lee**, manager of the Downtown Denver store, and **Alex Garcia**, a cashier there.

**As a manager (Rachel):**
- Post an announcement with a title, message, audience (*my store* or *all stores*) and an **Important – requires acknowledgment** switch.
- Each important post shows the **% acknowledged** plus who **has** and **hasn't** acknowledged it. Company-wide posts can be viewed for your store, any other store, or all stores, with a per-store breakdown.
- **⚡ May not have read it** lists people who tapped "Got it" much faster than the post takes to read.
- Filter the list by audience and type, including **Still waiting on my team**.
- **Archive** your own posts to hide them from employees without losing their acknowledgments. Restore them, or delete them permanently from the Archived section.

**As an employee (Alex):**
- A feed of updates for your store and the whole company.
- Unacknowledged important updates are **pinned at the top** with one **Got it** button. Everything else is just there to read.
- Once everything is acknowledged, the feed says you're all caught up.

## How it balances Rachel and Alex

Rachel needs to know that everyone saw important updates. Alex doesn't want to be constantly asked to confirm things. The prototype handles both like this:

- **Acknowledgment is opt-in per post.** Only posts a manager marks *Important* ask for confirmation. Regular updates never do.
- **One tap, no interruptions.** No pop-ups or forced reading. Pinned items wait at the top of the feed until Alex has a moment.
- **Rachel gets the follow-up list, not Alex.** She sees exactly who hasn't acknowledged, and who tapped too fast to have read it, so she can talk to those people directly. Everyone else is left alone.

The known risk: nothing stops a manager from marking *everything* important, which would bring back Alex's problem. A real version might limit this or show managers how often they use it.

## Assumptions

- **Audience is by store.** A post goes to one store or all stores. There's no targeting by role or shift.
- **Store managers can post to their own store or to all stores**, not to one other specific store. Company-wide posts in the sample data come from Michael, Operations Manager.
- **Only employees count toward acknowledgment %.** Managers aren't asked to acknowledge.
- **"Got it" means "I've seen this," not "I understood it."** The quick-tap flag is a hint for managers, not proof. It compares how long the post was on screen before the tap with an estimated reading time (200 words per minute).
- **Acknowledgments can't be undone**, and regular posts aren't tracked at all.
- **Managers can archive or delete only their own posts.**
- **People:** 5 stores × 40 people (1 manager + 39 employees) = 200. Names are generated. Rachel, Alex and Michael match the people in the brief.
- **Sample content is invented**, including holiday hours, return-policy details and acknowledgment rates.

## What I left out, and why

- **Questions and feedback on announcements.** Michael called this "eventually." It's the most natural next feature, but it needs decisions about who answers and moderates.
- **Notifications (push or SMS).** This is the biggest gap. The app only helps if people open it, and these employees don't check email. Skipped because it needs a real backend and accounts.
- **Real accounts, a server and multiple devices.** Data lives in one browser, so a manager and an employee on different phones won't see each other's activity.
- **Reminders and deadlines** for people who haven't acknowledged.
- **Editing posts, attachments, images, translations.**

## What I'd ask Michael next

1. How should employees find out something new was posted? Text, push notification, or a screen in the break room?
2. Should store managers post to all stores, or only Operations?
3. What should happen when someone hasn't acknowledged by a deadline? Reminder, escalation, or nothing?
4. Do all employees have their own phones, or do some share store devices?
5. For questions on announcements, who answers them, and should they be public to the whole store?

## Testing

Tested at phone size (375px wide) in the browser, beyond the happy path:

- Empty title or message is blocked with a message.
- Empty states: no announcements, no filter matches, and "all caught up."
- Acknowledgments and posts survive a page refresh.
- Archive → hidden from employees → restore brings back the original acknowledgments.
- Filters under combinations that match nothing.

Bugs found while checking the AI-generated code:
- The employee dropdown ran off the edge of phone screens.
- Radio buttons in the post form were stretched across the screen.
- The sample acknowledgment rates came out far from the intended values (one store showed 100%) because of a weak random-number function. It was fixed and re-checked per store.
- All five store managers had the same first name, and every store had the same first names in the same order, because the name generator only varied last names by store. Fixed, and all 200 names were checked to be unique.

## Tech

React 18 + Vite 5, plain CSS, no other libraries. Code is in `src/`:

| File | What it does |
|---|---|
| `data.js` | Stores, people, sample announcements, reading-time helpers |
| `App.jsx` | Role switcher and all data changes |
| `ManagerView.jsx` | Posting, dashboard, archive |
| `EmployeeView.jsx` | Employee feed and "Got it" timing |
| `Filters.jsx` | Shared filter bar |
| `storage.js` | Saving to the browser |
