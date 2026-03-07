// ─────────────────────────────────────────────────────────────
// Vastrayug — Marketing Content Validation Schemas
// Reference: admin_panel_spec.md §14 (Pop-ups), §15 (Announcements)
// ─────────────────────────────────────────────────────────────

import { z } from 'zod'

// ── Pop-up (§14) ─────────────────────────────────────────────

export const popupSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100),
    contentJson: z.object({
      heading: z.string().optional(),
      body: z.string().optional(),
      imageUrl: z.string().url().optional(),
      ctaText: z.string().optional(),
      ctaLink: z.string().optional(),
      showEmailForm: z.boolean().default(false),
      emailPlaceholder: z.string().optional(),
      submitText: z.string().optional(),
    }),
    triggerType: z.enum(['DELAY', 'SCROLL_DEPTH', 'EXIT_INTENT']),
    triggerValue: z.number().int().positive().nullable().optional(),
    targetPagesJson: z.array(z.string()).default(['all']),
    frequency: z.enum(['ONCE_SESSION', 'ONCE_EVER', 'EVERY_VISIT']).default('ONCE_SESSION'),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    isActive: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.triggerType === 'DELAY' || data.triggerType === 'SCROLL_DEPTH') {
        return data.triggerValue != null
      }
      return true
    },
    { message: 'Trigger value is required for Delay and Scroll Depth triggers', path: ['triggerValue'] }
  )

export type PopupInput = z.infer<typeof popupSchema>

// ── Announcement Bar (§15) ───────────────────────────────────

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

export const announcementBarSchema = z
  .object({
    message: z.string().min(1, 'Message is required').max(200),
    linkUrl: z.string().url('Must be a valid URL').nullable().optional(),
    linkText: z.string().max(50).nullable().optional(),
    bgColour: z.string().regex(HEX_REGEX, 'Must be a hex colour').default('#C9A84C'),
    textColour: z.string().regex(HEX_REGEX, 'Must be a hex colour').default('#0A0A0F'),
    isActive: z.boolean().default(false),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.linkUrl) return !!data.linkText
      return true
    },
    { message: 'Link text is required when a link URL is set', path: ['linkText'] }
  )

export type AnnouncementBarInput = z.infer<typeof announcementBarSchema>
