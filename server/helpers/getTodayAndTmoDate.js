function getTodayAndTmoDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayToday = today.toISOString();
  const tdy = todayToday.substring(0, 10);

  const str = tomorrow.toISOString();
  const tmo = str.substring(0, 10); // Tomorrow

  const dateRange = "date=" + tdy + "," + tmo;

  console.log(dateRange);
  return dateRange;
}
module.exports = getTodayAndTmoDate;
