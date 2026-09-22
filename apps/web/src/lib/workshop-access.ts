export interface WorkshopInstance {
  workshopDate: string
  accessDurationDays: number
  forceClose: boolean
}

/** Materials window: open from the workshop date until the access duration ends. */
export type AccessStatus = 'open' | 'upcoming' | 'closed' | 'force-closed'

export function getCloseDate(instance: WorkshopInstance): Date {
  const days =
    typeof instance.accessDurationDays === 'number' && Number.isFinite(instance.accessDurationDays)
      ? instance.accessDurationDays
      : 7
  const openDate = new Date(instance.workshopDate)
  if (Number.isNaN(openDate.getTime())) {
    // Fallback: treat "now" as open date so callers never get Invalid Date
    const fallback = new Date()
    fallback.setHours(0, 0, 0, 0)
    fallback.setDate(fallback.getDate() + days)
    return fallback
  }
  openDate.setHours(0, 0, 0, 0)
  const closeDate = new Date(openDate)
  closeDate.setDate(closeDate.getDate() + days)
  return closeDate
}

export function getAccessStatus(instance: WorkshopInstance, now = new Date()): AccessStatus {
  if (instance.forceClose) return 'force-closed'

  const openDate = new Date(instance.workshopDate)
  openDate.setHours(0, 0, 0, 0)
  const closeDate = getCloseDate(instance)

  if (now < openDate) return 'upcoming'
  if (now >= closeDate) return 'closed'

  return 'open'
}

export function getWorkshopStatus(instance: WorkshopInstance) {
  return {
    status: getAccessStatus(instance),
    closeDate: getCloseDate(instance),
  }
}
