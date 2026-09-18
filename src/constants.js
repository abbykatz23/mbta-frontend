export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTHS = [
  { value: 1, label: "January", days: 31 },
  { value: 2, label: "February", days: 29 },
  { value: 3, label: "March", days: 31 },
  { value: 4, label: "April", days: 30 },
  { value: 5, label: "May", days: 31 },
  { value: 6, label: "June", days: 30 },
  { value: 7, label: "July", days: 31 },
  { value: 8, label: "August", days: 31 },
  { value: 9, label: "September", days: 30 },
  { value: 10, label: "October", days: 31 },
  { value: 11, label: "November", days: 30 },
  { value: 12, label: "December", days: 31 }
];

const MONTH_TRAIN_THEMES = [
  "snowflakes",
  "hearts",
  "luck symbols — a ladybug and an evil eye",
  "bunnies",
  "flowers",
  "a pride train",
  "an American flag",
  "boobs",
  "pencils",
  "bats",
  "pilgrims and pumpkins",
  "holiday icons",
];

export function getMonthlyTrainIntroText(closingSentence) {
  const monthIndex = new Date().getMonth();
  const monthName = MONTHS[monthIndex].label;
  const monthTrainTheme = MONTH_TRAIN_THEMES[monthIndex];

  return (
    "Abby has a physical LED display in her apartment which uses live MBTA data to tell her how many minutes she " +
    "should wait before leaving her apartment to catch each of the train lines exactly on time. When a train is " +
    "currently at the station, a little train animation for the appropriate colored line goes by. 1 in 6 train " +
    `animations that goes by has a chance of being a special monthly train. For ${monthName} it's ${monthTrainTheme}! ` +
    "Also, anyone can upload a pixelated train png, which could show up on the display at any time, with increased " +
    `odds during the submitter's birth month! ${closingSentence}`
  );
}
