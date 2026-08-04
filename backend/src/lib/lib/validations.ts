import { z } from 'zod';

export const enrollmentSchema = z.object({
  studentName: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, 'Invalid phone number format'),
  courseInterested: z.enum(
    [
      'Artificial Intelligence Masterclass',
      'Data Science & Analytics Professional',
      'Machine Learning Engineering',
      'Full Stack Web Development',
    ],
    {
      errorMap: () => ({ message: 'Please select a valid course from the list' }),
    }
  ),
  qualification: z.enum(
    [
      'High School / 12th Grade',
      "Bachelor's Degree (Undergraduate)",
      "Master's Degree (Postgraduate)",
      'PhD / Doctorate',
      'Working Professional',
    ],
    {
      errorMap: () => ({ message: 'Please select your highest qualification' }),
    }
  ),
  learningGoal: z
    .string()
    .min(10, 'Please enter at least 10 characters explaining your learning goal')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export const voiceAgentQuerySchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  action: z.enum(['lookup_lead', 'schedule_call', 'log_call_summary']),
  callDetails: z
    .object({
      summary: z.string().optional(),
      appointmentTime: z.string().optional(),
      status: z.string().optional(),
    })
    .optional(),
});
