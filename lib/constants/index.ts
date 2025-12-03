export const DISTRICTS = [
  'colombo',
  'gampaha',
  'kalutara',
  'kandy',
  'matale',
  'nuwara_eliya',
  'galle',
  'matara',
  'hambantota',
  'jaffna',
  'kilinochchi',
  'mannar',
  'vavuniya',
  'mullaitivu',
  'batticaloa',
  'ampara',
  'trincomalee',
  'kurunegala',
  'puttalam',
  'anuradhapura',
  'polonnaruwa',
  'badulla',
  'moneragala',
  'ratnapura',
  'kegalle',
] as const;

export const VOLUNTEER_TYPES = [
  'cleaning',
  'supplies',
  'counseling',
  'entertainment',
  'transportation',
  'medical',
  'appliances',
  'wellCleaning',
  'medicine',
  'technical',
  'social',
] as const;

export const AGE_RANGES = ['18-20', '20-30', '30-40'] as const;

export const SEX_OPTIONS = ['female', 'male', 'other'] as const;

export const DURATION_OPTIONS = ['1', '2', '3', '4', 'full'] as const;

export type District = (typeof DISTRICTS)[number];
export type VolunteerType = (typeof VOLUNTEER_TYPES)[number];
export type AgeRange = (typeof AGE_RANGES)[number];
export type SexOption = (typeof SEX_OPTIONS)[number];
export type DurationOption = (typeof DURATION_OPTIONS)[number];
