# Summit Retail Group – Team Updates

A demo announcement app for 5 stores and 200 people. Managers post updates. Employees read them and tap "Got it" on important ones. Everything is saved in your web browser, so there are no logins and no server.

## How to run it (no coding needed)

### 1. Install Node.js (one time only)
1. Go to https://nodejs.org
2. Download the **LTS** version and install it, clicking **Next / Continue** through every screen.

### 2. Open a terminal in this folder
- **Mac:** Open Finder and find the `summit-announcements` folder. Right-click it and choose **New Terminal at Folder**. (If you don't see that option, open the **Terminal** app, type `cd ` with a space at the end, drag the folder into the window, and press **Return**.)
- **Windows:** Open the `summit-announcements` folder in File Explorer. Click the address bar, type `cmd`, and press **Enter**.

### 3. Install the app's parts (one time only)
Type this and press Enter, then wait about a minute until it finishes:

```
npm install
```

### 4. Start the app
```
npm run dev
```
Your browser should open the app by itself. If it doesn't, go to **http://localhost:5173**.

### 5. Stop the app
Click the terminal window and press **Ctrl + C**. Next time, you only need to repeat steps 2 and 4.

## Try it on your phone
Your phone needs to be on the same Wi-Fi network as your computer.
1. Start the app with `npm run dev -- --host` instead of step 4.
2. The terminal shows a **Network:** address, for example `http://192.168.1.20:5173`. Type that address into your phone's browser.

Changes made on your phone are saved only on your phone. Each browser keeps its own data.

## Using the app
- Use **Manager / Employee** at the top to switch roles, and the **Viewing as** dropdown to pick a person.
- **Manager:** tap **+ New announcement** to post. Each important post shows the percentage of employees who acknowledged it and a list of who hasn't. Company-wide posts let you switch between your store, a single other store, or all stores.
- **Employee:** important updates you haven't acknowledged are pinned at the top until you tap **Got it**.
- **Reset sample data** at the bottom of the page restores the original announcements.
