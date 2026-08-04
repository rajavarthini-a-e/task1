import { z } from 'zod';

export const enrollmentSchema = z.object({
  studentName: z.string().min(2).max(100).trim(),
  email: z.string().email().trim().toLowerCase(),
  phone: z.string().min(8).max(15).regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),
  courseInterested: z.enum([
    'Artificial Intelligence Masterclass',
    'Data Science & Analytics Professional',
    'Machine Learning Engineering',
    'Full Stack Web Development',
  ]),
  qualification: z.enum([
    'High School / 12th Grade',
    "Bachelor's Degree (Undergraduate)",
    "Master's Degree (Postgraduate)",
    'PhD / Doctorate',
    'Working Professional',
  ]),
  learningGoal: z.string().min(10).max(1000).trim(),
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
