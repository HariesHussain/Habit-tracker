const ALLOWED_HABIT_TITLE_REGEX = /^[A-Za-z0-9 .,'!?:;()_\-/]{1,60}$/;
const ALLOWED_NAME_REGEX = /^[A-Za-z .'-]{2,50}$/;

export const sanitizeText = (value: string, maxLength = 120): string => {
  const normalized = value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized.slice(0, maxLength);
};

export const sanitizeEmail = (value: string): string => {
  return sanitizeText(value, 120).toLowerCase();
};

export const validateEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const validatePassword = (value: string): boolean => {
  return value.length >= 8;
};

export const validateDisplayName = (value: string): boolean => {
  return ALLOWED_NAME_REGEX.test(value);
};

export const validateHabitTitle = (value: string): boolean => {
  return ALLOWED_HABIT_TITLE_REGEX.test(value);
};

export const normalizeOtpInput = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 6);
};

export const clampNumber = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};
