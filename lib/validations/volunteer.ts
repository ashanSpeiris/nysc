import { z } from 'zod';
import {
  AGE_RANGES,
  SEX_OPTIONS,
  VOLUNTEER_TYPES,
  DURATION_OPTIONS,
  DISTRICTS,
} from '@/lib/constants';

export const volunteerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  whatsapp: z
    .string()
    .min(10, 'WhatsApp number must be at least 10 digits')
    .max(15, 'WhatsApp number is too long')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid phone number')
    .trim(),

  ageRange: z.enum(AGE_RANGES, {
    message: 'Please select your age range',
  }),

  sex: z.enum(SEX_OPTIONS, {
    message: 'Please select your sex',
  }),

  district: z
    .string()
    .min(2, 'Please enter your district')
    .max(50, 'District name is too long')
    .trim(),

  volunteerType: z.enum(VOLUNTEER_TYPES, {
    message: 'Please select type of volunteering',
  }),

  startDate: z
    .string()
    .min(1, 'Please select a start date')
    .refine(
      (date) => {
        const selected = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      { message: 'Start date must be today or in the future' }
    ),

  duration: z.enum(DURATION_OPTIONS, {
    message: 'Please select duration of attendance',
  }),

  availableDistricts: z
    .array(z.enum(DISTRICTS))
    .min(1, 'Please select at least one district')
    .max(25, 'Too many districts selected'),
});

export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;
