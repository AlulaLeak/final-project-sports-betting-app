function getTodayAndTmoDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayToday = today.toISOString();
  const tdy = todayToday.substring(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tmoStr = tomorrow.toISOString();
  const tmo = tmoStr.substring(0, 10); // Tomorrow

  const ystdyStr = yesterday.toISOString();
  const ystdy = ystdyStr.substring(0, 10);

  const dateRange = "date=" + ystdy;
  return dateRange;
}
module.exports = getTodayAndTmoDate;
