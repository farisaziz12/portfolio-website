export interface WorkshopInstance {
  workshopDate: string
  accessDurationDays: number
  forceClose: boolean
}

export type AccessStatus = 'open' | 'upcoming' | 'closed' | 'force-closed'

export function getCloseDate(instance: WorkshopInstance): Date {
  const openDate = new Date(instance.workshopDate)
  openDate.setHours(0, 0, 0, 0)
  const closeDate = new Date(openDate)
  closeDate.setDate(closeDate.getDate() + instance.accessDurationDays)
  return closeDate
}

export function getAccessStatus(instance: WorkshopInstance): AccessStatus {
  if (instance.forceClose) return 'force-closed'

  const now = new Date()
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
