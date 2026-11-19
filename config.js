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
    { name: "Survey 01", url: "https://binghamton.qualtrics.com/jfe/form/SV_3OEBzBHmWa8GBM2 " }, // bed
    { name: "Survey 02", url: "https://binghamton.qualtrics.com/jfe/form/SV_88j09e5p5nZoLsO" }, // bread
    { name: "Survey 03", url: "https://binghamton.qualtrics.com/jfe/form/SV_5tkMl7d6DExVhP0" }, // cake
    { name: "Survey 04", url: "https://binghamton.qualtrics.com/jfe/form/SV_0wHtg2zJ9I7erZQ" }, // chair
    { name: "Survey 05", url: "https://binghamton.qualtrics.com/jfe/form/SV_02sBELcovX7Dyaq" }, // computer
    { name: "Survey 06", url: "https://binghamton.qualtrics.com/jfe/form/SV_6zg2nHK9xTzFRt4" }, // cup
    { name: "Survey 07", url: "https://binghamton.qualtrics.com/jfe/form/SV_0xr7sJvcZ83UFym" }, // flower
    { name: "Survey 08", url: "https://binghamton.qualtrics.com/jfe/form/SV_1RlaH0TtDZDmeJE" }, // lock
    { name: "Survey 09", url: "https://binghamton.qualtrics.com/jfe/form/SV_6zLA015uQM0yd26" }, // pear
    { name: "Survey 10", url: "https://binghamton.qualtrics.com/jfe/form/SV_ddsbtp4WPf2HgMu" }, // plastic
    { name: "Survey 11", url: "https://binghamton.qualtrics.com/jfe/form/SV_cYoqLRMGr0aqnA2" }, // potato
    { name: "Survey 12", url: "https://binghamton.qualtrics.com/jfe/form/SV_b9GZr5UX1XjtiQu" }, // spice
    { name: "Survey 13", url: "https://binghamton.qualtrics.com/jfe/form/SV_8eLNzRqLgerFU2" }, // spoon
    { name: "Survey 14", url: "https://binghamton.qualtrics.com/jfe/form/SV_eSfH6BJkFU1xngy" }, // stone
    { name: "Survey 15", url: "https://binghamton.qualtrics.com/jfe/form/SV_73uj0jOAAShc9eK" }, // truck
  ],

  // Instructions shown before the session starts (Markdown).
  // Supported: # headings, **bold**, *italic*, [links](url), - lists,
  // 1. numbered lists, > quotes, --- rules, and blank-line paragraphs.
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
**You have completed all of the surveys.** Please remain seated and wait for the timer to finish.
`,
};
