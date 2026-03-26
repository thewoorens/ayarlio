export function getOffset(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export function getDays(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function onlyLetters(value: string): string {
  return value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function toHHMM(value: { hour: number; minute: number }): string {
  return `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;
}

export function generateCalendarCells(year: number, month: number): (number | null)[] {
  const offset = getOffset(year, month);
  const totalDays = getDays(year, month);
  
  const cells: (number | null)[] = Array.from(
    { length: offset + totalDays },
    (_, i) => i < offset ? null : i - offset + 1
  );
  
  while (cells.length % 7) {
    cells.push(null);
  }
  
  return cells;
}