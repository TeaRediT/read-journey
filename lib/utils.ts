export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\./g, ".");
};

export const formatDuration = (start: string, finish: string) => {
  const diffMs = new Date(finish).getTime() - new Date(start).getTime();

  const totalSeconds = Math.max(1, Math.floor(diffMs / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (totalMinutes === 0) {
    return `${totalSeconds} ${totalSeconds === 1 ? "second" : "seconds"}`;
  }

  if (hours === 0) {
    return `${totalMinutes} ${totalMinutes === 1 ? "minute" : "minutes"}`;
  }

  const hoursText = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  const minutesText =
    minutes > 0 ? ` ${minutes} ${minutes === 1 ? "minute" : "minutes"}` : "";

  return `${hoursText}${minutesText}`;
};
