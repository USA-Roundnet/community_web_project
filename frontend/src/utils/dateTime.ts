const pad = (value: number) => String(value).padStart(2, "0");

export const formatSqlDateTime = (dateValue: Date): string =>
  `${dateValue.getFullYear()}-${pad(dateValue.getMonth() + 1)}-${pad(
    dateValue.getDate()
  )} ${pad(dateValue.getHours())}:${pad(dateValue.getMinutes())}:${pad(
    dateValue.getSeconds()
  )}`;

export const toDateInputValue = (dateValue: unknown): string => {
  if (!dateValue) {
    return "";
  }

  if (typeof dateValue === "string") {
    const matchedDate = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);
    if (matchedDate?.[1]) {
      return matchedDate[1];
    }
  }

  const parsedDate = new Date(dateValue as string | number | Date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const localDate = new Date(
    parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().slice(0, 10);
};
