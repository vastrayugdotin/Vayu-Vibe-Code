'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// AnnouncementBar — Top-of-site promotional strip
// Reference: component_architecture.md §3.1, admin_panel_spec.md §15
//
// Fetches the active AnnouncementBar record from the API
// and renders a dismissible strip with custom bg/text colours.
// State is preserved in sessionStorage so it stays hidden
// for the duration of the user's session if dismissed.
// ─────────────────────────────────────────────────────────────

interface AnnouncementData {
  id: string
  message: string
  link_url: string | null
  link_text: string | null
  bg_colour: string
  text_colour: string
}

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [isDismissed, setIsDismissed] = useState(true) // Start true to prevent hydration mismatch/flicker

  useEffect(() => {
    // Check session storage first
    const dismissedKey = 'vastrayug_announcement_dismissed'
    const hasDismissed = sessionStorage.getItem(dismissedKey)

    if (hasDismissed === 'true') {
      setIsDismissed(true)
      return
    }

    // Fetch active announcement
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch('/api/storefront/announcements/active')
        if (res.ok) {
          const data = await res.json()
          if (data?.success && data.data) {
            setAnnouncement(data.data)
            setIsDismissed(false)
          }
        }
      } catch (error) {
        // Silently fail — announcement bar is non-critical
        console.error('Failed to fetch announcement bar:', error)
      }
    }

    fetchAnnouncement()
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('vastrayug_announcement_dismissed', 'true')
  }

  // Do not render anything if no announcement or if dismissed
  if (!announcement || isDismissed) return null

  // Ensure Fallback colours just in case DB values are missing
  const bgColour = announcement.bg_colour || '#C9A84C' // default Nebula Gold
  const textColour = announcement.text_colour || '#0A0A0F' // default Cosmic Black

  return (
    <div
      className="relative z-[60] flex items-center justify-center px-8 py-2.5 w-full text-center transition-all duration-300"
      style={{
        backgroundColor: bgColour,
        color: textColour,
      }}
      role="alert"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto px-4 text-sm font-body tracking-wide font-medium">
        <span className="flex items-center flex-wrap justify-center gap-1.5">
          {announcement.message}
          {announcement.link_url && announcement.link_text && (
            <Link
              href={announcement.link_url}
              className="underline decoration-1 underline-offset-4 font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              {announcement.link_text}
            </Link>
          )}
        </span>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 opacity-60 hover:opacity-100 transition-opacity rounded-full focus:outline-none focus:ring-2 focus:ring-black/20"
        aria-label="Dismiss announcement"
        style={{ color: textColour }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
