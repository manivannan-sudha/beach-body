// The training program. Week 1 starts on PLAN.start (a Monday).
window.PLAN = {
  start: "2026-10-19",

  sessions: {
    pushA: {
      name: "Push A", focus: "Upper chest and side delts", tag: "Push",
      ex: [
        { n: "Incline Dumbbell Press", s: 3, r: "6–10", rest: "2–3 min", note: "30° bench. Main chest lift." },
        { n: "Seated Shoulder Press (machine or DB)", s: 3, r: "8–10", rest: "2 min" },
        { n: "Single-arm Cable Lateral Raise", s: 4, r: "12–15", rest: "1 min", note: "Priority lift for width. Slow lowering." },
        { n: "Machine Chest Press", s: 3, r: "8–12", rest: "90 s" },
        { n: "Low-to-high Cable Fly", s: 3, r: "12–15", rest: "1 min", note: "Upper chest line." },
        { n: "Overhead Cable Triceps Extension", s: 3, r: "10–12", rest: "1 min" },
      ],
    },
    pullA: {
      name: "Pull A + Abs", focus: "Lat width", tag: "Pull",
      ex: [
        { n: "Pull-up (assisted if needed) or Lat Pulldown", s: 4, r: "6–10", rest: "2 min", note: "The swimmer's lift. Full stretch at the top." },
        { n: "Seated Cable Row (neutral grip)", s: 3, r: "8–12", rest: "90 s" },
        { n: "Half-kneeling Single-arm Cable Pulldown", s: 3, r: "10–12 / arm", rest: "1 min" },
        { n: "Straight-arm Cable Pulldown", s: 3, r: "12–15", rest: "1 min" },
        { n: "Hanging Knee Raise → Leg Raise", s: 3, r: "10–15", rest: "1 min", note: "Curl the pelvis up, no swinging." },
        { n: "Cable Crunch", s: 3, r: "12–15", rest: "1 min" },
      ],
    },
    legsA: {
      name: "Legs A + Arms", focus: "Athletic strength, no leg press", tag: "Legs",
      ex: [
        { n: "Romanian Deadlift", s: 3, r: "6–8", rest: "2–3 min", note: "Hamstrings and glutes. Bar close to legs." },
        { n: "Bulgarian Split Squat (DB)", s: 3, r: "8–10 / leg", rest: "90 s", note: "Replaces the leg press. Builds balance for running and football." },
        { n: "Lying or Seated Leg Curl", s: 3, r: "10–12", rest: "1 min", note: "Hamstring insurance for sprinting." },
        { n: "Standing Calf Raise + Tibialis Raise", s: 3, r: "12–15 each", rest: "1 min", note: "Superset. Protects shins as running ramps up." },
        { n: "Incline Dumbbell Curl", s: 3, r: "10–12", rest: "1 min" },
        { n: "Rope Pushdown", s: 3, r: "10–15", rest: "1 min" },
      ],
    },
    pushB: {
      name: "Push B", focus: "Shoulders first", tag: "Push",
      ex: [
        { n: "Standing Overhead Press (barbell or DB)", s: 3, r: "6–8", rest: "2–3 min" },
        { n: "Flat Dumbbell Press", s: 3, r: "8–10", rest: "2 min" },
        { n: "Seated DB Lateral Raise", s: 4, r: "12–20", rest: "1 min", note: "From week 3, drop set on the last set." },
        { n: "Pec Deck or Cable Fly", s: 3, r: "12–15", rest: "1 min" },
        { n: "EZ-bar Skull Crusher", s: 3, r: "10–12", rest: "1 min" },
        { n: "Push-ups", s: 2, r: "max", rest: "1 min", note: "Finisher." },
      ],
    },
    pullB: {
      name: "Pull B + Abs", focus: "Back thickness and rear delts", tag: "Pull",
      ex: [
        { n: "Chin-up (assisted if needed)", s: 3, r: "6–10", rest: "2 min" },
        { n: "One-arm Dumbbell Row", s: 3, r: "8–12 / arm", rest: "90 s" },
        { n: "Machine High Row or Wide-grip Cable Row", s: 3, r: "10–12", rest: "90 s" },
        { n: "Reverse Pec Deck", s: 3, r: "15–20", rest: "1 min", note: "Rear delts round out the shoulder from the side." },
        { n: "Ab Wheel Rollout (or Plank 45 s)", s: 3, r: "8–12", rest: "1 min" },
        { n: "Pallof Press or Cable Woodchop", s: 3, r: "10–12 / side", rest: "45 s", note: "Anti-rotation core for football." },
      ],
    },
    legsB: {
      name: "Legs B + Arms", focus: "Power and conditioning", tag: "Legs",
      ex: [
        { n: "Box Jump (step down)", s: 4, r: "4", rest: "90 s", note: "Weeks 1–2: low box, 3 × 5. Land soft." },
        { n: "DB Walking Lunge or Step-up", s: 3, r: "10 / leg", rest: "90 s" },
        { n: "45° Back Extension", s: 3, r: "12–15", rest: "1 min" },
        { n: "Copenhagen Plank or Cable Hip Adduction", s: 3, r: "20–30 s / side", rest: "45 s", note: "Groin insurance for football." },
        { n: "Hammer Curl", s: 3, r: "10–12", rest: "1 min" },
        { n: "Overhead DB Triceps Extension", s: 3, r: "10–12", rest: "1 min" },
      ],
      finisher: "Optional finisher: 6 × 15 s hard bike sprints, 45 s easy.",
    },
  },

  // Monday first. run: which run of the week (1, 2, 3) or 0.
  week: [
    { gym: "pushA", run: 1 },
    { gym: "pullA", run: 0, extra: "Optional: 20 min easy bike after lifting" },
    { gym: "legsA", run: 0 },
    { gym: "pushB", run: 2 },
    { gym: "pullB", run: 0, extra: "Optional: 20 min easy bike after lifting" },
    { gym: "legsB", run: 0, note: "Optional in weeks 1–2. Skip it if you play football this weekend." },
    { gym: null, run: 3, note: "Run 3, football or a swim lesson. Otherwise rest and walk." },
  ],

  // Run from zero. Each run: 5 min brisk walk, the set below, 5 min walk.
  // "r" is minutes of jogging, "w" minutes of walking.
  runs: [
    { wk: 1, d: ["8 × (1:00 jog / 1:30 walk)", "8 × (1:00 jog / 1:30 walk)", "8 × (1:00 jog / 1:30 walk)"], longest: 1 },
    { wk: 2, d: ["6 × (1:30 jog / 2:00 walk)", "6 × (1:30 jog / 2:00 walk)", "6 × (1:30 jog / 2:00 walk)"], longest: 1.5 },
    { wk: 3, d: ["2 × (1:30 jog / 1:30 walk, 3:00 jog / 3:00 walk)", "same as run 1", "same as run 1"], longest: 3 },
    { wk: 4, d: ["3 jog / 1:30 walk / 5 jog / 2:30 walk / 3 jog / 1:30 walk / 5 jog", "same as run 1", "same as run 1"], longest: 5 },
    { wk: 5, d: ["3 × (5:00 jog / 3:00 walk)", "8:00 jog / 5:00 walk / 8:00 jog", "16 min jog, no walking"], longest: 16 },
    { wk: 6, d: ["5 jog / 3 walk / 8 jog / 3 walk / 5 jog", "10:00 jog / 3:00 walk / 10:00 jog", "20 min jog"], longest: 20 },
    { wk: 7, d: ["22 min jog", "22 min jog", "22 min jog"], longest: 22 },
    { wk: 8, d: ["25 min jog", "25 min jog", "25 min jog"], longest: 25 },
    { wk: 9, d: ["28 min jog", "28 min jog", "28 min jog"], longest: 28 },
    { wk: 10, d: ["30 min jog", "30 min jog", "30 min jog (milestone)"], longest: 30 },
    { wk: 11, d: ["30 min easy", "6 × (1:00 quick / 2:00 easy)", "35 min easy"], longest: 35 },
    { wk: 12, d: ["30 min easy", "20 min easy (deload)", "40 min easy"], longest: 40 },
  ],

  runRules: [
    "Jog slowly enough to speak in full sentences. Speed comes later.",
    "Repeat a week if you could not finish it, or if shins or knees ache more than 3/10 the next morning.",
    "Treadmill is fine. Set 1% incline.",
    "Sharp pain stops the run. Dull muscle tiredness is normal.",
  ],

  phases: [
    { wk: [1, 2], name: "Re-entry", rule: "2 working sets per exercise (3 on the first lift). Stop 3–4 reps short of failure. Start at about 60–70% of your old weights. Legs B optional." },
    { wk: [3, 6], name: "Rebuild", rule: "All sets as written. Stop about 2 reps short of failure. When you hit the top of the rep range on every set, add the smallest weight jump next time." },
    { wk: [7, 11], name: "Build while cutting", rule: "Take the last set of each isolation lift to failure. Add a 5th set to lateral raises and pulldowns if recovery is good." },
    { wk: [12, 12], name: "Deload", rule: "Half the sets, same weights. Then start week 1 again with heavier numbers and small exercise swaps." },
  ],

  // Daily step target by week (index 0 = week 1). Last value repeats.
  steps: [6000, 7500, 9000, 9000, 10000],

  swim: "From week 5 (16 Nov): 2 lessons a week. A swim can replace Run 3 when legs feel heavy.",
};
