export interface WorkshopInstance {
  workshopDate: string
  accessDurationDays: number
  forceClose: boolean
  /** ISO datetime — instructor ended the live layer early */
  liveEndedAt?: string | null
}

/** Materials window only (legacy name kept for callers). */
export type AccessStatus = 'open' | 'upcoming' | 'closed' | 'force-closed'

/** Full attend phase including live vs read-only while materials remain open. */
export type AccessPhase = 'upcoming' | 'live' | 'readonly' | 'closed' | 'force-closed'

export function getCloseDate(instance: WorkshopInstance): Date {
  const openDate = new Date(instance.workshopDate)
  openDate.setHours(0, 0, 0, 0)
  const closeDate = new Date(openDate)
  closeDate.setDate(closeDate.getDate() + instance.accessDurationDays)
  return closeDate
}

/** End of the calendar day of `workshopDate` (local/server timezone). */
export function getEndOfWorkshopDay(workshopDate: string): Date {
  const d = new Date(workshopDate)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
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

export function isLiveEnded(instance: WorkshopInstance, now = new Date()): boolean {
  if (instance.liveEndedAt) {
    const ended = new Date(instance.liveEndedAt)
    if (!Number.isNaN(ended.getTime()) && now >= ended) return true
  }
  return now > getEndOfWorkshopDay(instance.workshopDate)
}

export function getAccessPhase(instance: WorkshopInstance, now = new Date()): AccessPhase {
  const materials = getAccessStatus(instance, now)
  if (materials === 'upcoming') return 'upcoming'
  if (materials === 'closed') return 'closed'
  if (materials === 'force-closed') return 'force-closed'
  return isLiveEnded(instance, now) ? 'readonly' : 'live'
}

export function getWorkshopStatus(instance: WorkshopInstance) {
  return {
    status: getAccessStatus(instance),
    phase: getAccessPhase(instance),
    closeDate: getCloseDate(instance),
    liveEnded: isLiveEnded(instance),
  }
}
