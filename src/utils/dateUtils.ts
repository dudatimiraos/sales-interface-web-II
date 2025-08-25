import { DateArray } from "../types";

export function parseApiDate(date: string | DateArray): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  
  if (Array.isArray(date) && date.length >= 3) {
    const [year, month, day, hour = 0, minute = 0] = date;
    return new Date(year, month - 1, day, hour, minute);
  }
  
  return new Date();
}

export function formatApiDateTime(date: string | DateArray): string {
  const dateObj = parseApiDate(date);
  return dateObj.toLocaleString('pt-BR');
}

export function formatApiDateForInput(date: string | DateArray): string {
  const dateObj = parseApiDate(date);
  return dateObj.toISOString().slice(0, 16);
}

export function formatApiDate(date: string | DateArray): string {
  const dateObj = parseApiDate(date);
  return dateObj.toLocaleDateString('pt-BR');
}
