export const timeAgo = (timestamp, unitSwitch=-1, unitSwitchValue=0) => {
  const now = new Date().getTime() / 1000;
  let timeAgo = Math.round(now - timestamp);
  let timeUnit = timeAgo === 1 ? "second ago" : "seconds ago";
  let timeUnitEnum = 0;
  if (timeAgo > 60) {
    timeAgo = Math.round(timeAgo / 60);
    timeUnit = timeAgo === 1 ? "minute ago" : "minutes ago";
    timeUnitEnum = 1;
  }
  if (timeUnitEnum === 1 && timeAgo > 60) {
    timeAgo = Math.round(timeAgo / 60);
    timeUnit = timeAgo === 1 ? "hour ago" : "hours ago";
    timeUnitEnum = 2;
  }
  if (timeUnitEnum === 2 && timeAgo > 23) {
    timeAgo = Math.round(timeAgo / 24);
    timeUnit = timeAgo === 1 ? "day ago" : "days ago";
    timeUnitEnum = 3;
  }
  if (unitSwitch >= 0 && timeUnitEnum === unitSwitch && timeAgo > unitSwitchValue) {
    timeAgo = new Date(timestamp * 1000).toLocaleString();
    timeUnit = "";
  } else timeUnit = ` ${timeUnit}`;
  return `${timeAgo}${timeUnit}`;
};

export default timeAgo;
