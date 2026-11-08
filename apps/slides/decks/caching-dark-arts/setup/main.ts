import { defineAppSetup } from '@slidev/types'

export default defineAppSetup(() => {
  if (!document.startViewTransition) return
  const original = document.startViewTransition.bind(document)
  // Slidev 53 does not observe `ready`. Rapid navigation legitimately aborts an
  // older snapshot, which otherwise becomes an unhandled promise rejection.
  document.startViewTransition = (...args: Parameters<typeof original>) => {
    const transition = original(...args)
    void transition.ready.catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError' && error.message === 'Transition was skipped') return
      console.error('Character transition failed', error)
    })
    return transition
  }
})
