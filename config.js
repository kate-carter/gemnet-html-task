// =====================================================================
//  STUDY CONFIGURATION — links/instruction text/etc
// =====================================================================

window.STUDY_CONFIG = {
  // Length of the session in minutes. The countdown starts the moment the
  // participant clicks the FIRST survey link.
  durationMinutes: 60,

  // The 15 survey links. They are shuffled once per participant and shown
  // one at a time, never repeating. The "name" is optional and only used
  // in the exported log (it is NOT shown to participants).
  surveys: [
    { name: "Survey 01", url: "https://" }, // bed
    { name: "Survey 02", url: "https://" }, // bread
    { name: "Survey 03", url: "https://" }, // cake
    { name: "Survey 04", url: "https://" }, // chair
    { name: "Survey 05", url: "https://" }, // computer
    { name: "Survey 06", url: "https://" }, // cup
    { name: "Survey 07", url: "https://" }, // flower
    { name: "Survey 08", url: "https://" }, // lock
    { name: "Survey 09", url: "https://" }, // pear
    { name: "Survey 10", url: "https://" }, // plastic
    { name: "Survey 11", url: "https://" }, // potato
    { name: "Survey 12", url: "https://u" }, // spice
    { name: "Survey 13", url: "https://" }, // spoon
    { name: "Survey 14", url: "https://" }, // stone
    { name: "Survey 15", url: "https://" }, // truck
  ],

  // Instructions shown before the session starts (Markdown).
  startInstructions: `
# Welcome to the GemNet Task 2 Behavioral Task.

## What you will do

You will have **one hour** to complete as many surveys as you can from a set.

1. Click **Get my first survey** below to start your first survey.  Please complete the demographic survey at the end of the first survey.
2. Click the link. The survey opens in a new tab and **the one-hour timer starts**.
3. When you have finished and submitted the survey, return to this tab and click **Next survey** You may skip the demographic survey on all surveys except the firest.
4. Continue completing the surveys until the timer runs out..

## Please note

The survey will take you about 15 minutes, and each concept requires at least 15 responses 
(valid boxes checked) per concept. There are 3 concepts.  Please answer carefully and honestly.
The researcher running your study is available to answer any questions you may have.
`,

  // Instructions shown when the hour is up (Markdown).
  endInstructions: `
# Time is up

Thank you — the survey portion of the session is now over.

Please **close any survey tabs** that are still open and let the researcher know you have finished.
`,

  // Shown instead of a new link if a participant finishes all surveys
  // before time runs out (Markdown). The timer keeps running; the end
  // instructions still appear when it reaches zero.
  allSurveysDoneMessage: `
**You have completed all of the surveys.** Please let the researcher know you have completed the task.
`,
};
