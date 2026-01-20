import { z } from 'zod';

// URL validation helper - allows empty string or valid URL
const optionalUrl = z.string().trim().max(500, 'URL must be less than 500 characters')
  .refine(
    (val) => val === '' || /^https?:\/\/.+/.test(val),
    { message: 'Must be a valid URL starting with http:// or https://' }
  )
  .transform(val => val || null);

// Profile validation schema
export const profileSchema = z.object({
  username: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  full_name: z.string().trim().max(100, 'Name must be less than 100 characters').optional().nullable(),
  headline: z.string().trim().max(150, 'Headline must be less than 150 characters').optional().nullable(),
  bio: z.string().trim().max(2000, 'Bio must be less than 2000 characters').optional().nullable(),
  profession: z.string().trim().max(100, 'Profession must be less than 100 characters').optional().nullable(),
  location: z.string().trim().max(100, 'Location must be less than 100 characters').optional().nullable(),
  skills: z.array(z.string().trim().max(50, 'Skill must be less than 50 characters')).max(30, 'Maximum 30 skills allowed').optional(),
  github_url: optionalUrl,
  linkedin_url: optionalUrl,
  twitter_url: optionalUrl,
  website_url: optionalUrl,
  avatar_url: optionalUrl,
  theme: z.string().max(20).optional(),
  is_public: z.boolean().optional(),
  meta_title: z.string().trim().max(70, 'Meta title should be under 70 characters').optional().nullable(),
  meta_description: z.string().trim().max(160, 'Meta description should be under 160 characters').optional().nullable(),
});

// Project validation schema
export const projectSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(150, 'Title must be less than 150 characters'),
  short_description: z.string().trim().max(300, 'Description must be less than 300 characters').optional().nullable(),
  problem: z.string().trim().max(2000, 'Problem statement must be less than 2000 characters').optional().nullable(),
  solution: z.string().trim().max(2000, 'Solution must be less than 2000 characters').optional().nullable(),
  tools: z.array(z.string().trim().max(50, 'Tool name must be less than 50 characters')).max(20, 'Maximum 20 tools allowed').optional(),
  role_responsibility: z.string().trim().max(1000, 'Role & responsibilities must be less than 1000 characters').optional().nullable(),
  outcome: z.string().trim().max(2000, 'Outcome must be less than 2000 characters').optional().nullable(),
  cover_image_url: optionalUrl,
  is_public: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
