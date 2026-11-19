# GemNet Sona Task 2

A plain, offline HTML page for a one-hour survey session. 
DISCLAIMER: This program was partially vibe-coded.  I (Kate) went through all of the code and tested it, everything seems fine, but JS is not my passion :(. Updated 11-19-2026.

## Setup

1. Load repo on the computer.  Open in a code editor capable of running javascript.
2. Make sure the "windows" option is activated in config. 


## Running a session

Double-click `index.html` to open it in a browser. Or, if you'd rather use a local server:

```
cd gemnet-html-task
python3 -m http.server 8000      # on Windows: py -m http.server 8000
# then open http://localhost:8000
```

It works the same on Windows and macOS in any current browser (Edge, Chrome, Firefox, Safari). To move it to another computer, copy the whole folder. The four files must stay together.

How a session works:

1. The participant reads the instructions and clicks **Get my first survey**.
2. A randomly chosen survey link appears. Clicking it opens the survey in a new tab and **starts the timer**.
3. After they submit the survey, they click **Next survey** to get another random link. Links never repeat. The Next button stays disabled until they have opened the current link.
4. When the timer reaches 0:00, the links are removed and the end instructions are shown.

If a participant finishes all 15 surveys early, they see a "completed all surveys" message, and the end instructions still appear when the timer runs out.

## Researcher controls (via the address bar)

| Add to the URL | Effect |
|---|---|
| `?export` | Downloads a CSV of the session: the order surveys were shown, and the time each was shown, opened, and moved past. |
| `?reset`  | Clears the session (new shuffle, timer reset). **Do this between participants.** |

Examples:

- macOS: `file:///Users/Kate/gemnet-html-task/index.html?reset`
- Windows: `file:///C:/Users/YourName/Desktop/gemnet-html-task/index.html?reset` (use wherever you copied the folder)

Progress is saved in the browser's local storage, so refreshing the page or closing the tab by accident does **not** reset the timer or reshuffle the surveys. The timer uses the real clock, so it stays accurate even while the participant is working in another tab.

## Notes

- Export before you reset, because resetting deletes the log.
- The page can't close the participant's survey tabs when time runs out. The end instructions tell them to do so.
- The saved state belongs to a single browser on a single machine. Use one browser per participant station.
