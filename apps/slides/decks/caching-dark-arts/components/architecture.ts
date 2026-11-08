export type Variant = 'client' | 'bff' | 'query' | 'prefetch'
export type Role = 'client' | 'server' | 'api' | 'risk'
export const clicks: Record<Variant, number> = { client: 11, bff: 5, query: 4, prefetch: 5 }
export interface FlowNode { id: string; x: number; y: number; w: number; label: string; detail: string; role: Role; icon: string; current: boolean }
export interface FlowEdge { id: string; d: string; role: Role; label?: string; x?: number; y?: number; dashed?: boolean; current: boolean }
export interface Snapshot { nodes: FlowNode[]; edges: FlowEdge[]; complete: boolean; queryRetry: boolean; cacheRoute: boolean; prefetch: boolean; timeout: boolean; variant: Variant; step: number }

// Each new version starts with the exact preceding final state. Native Slidev
// clicks alone determine the snapshot, including deep links and reverse steps.
export function architecture(variant: Variant, rawStep: number): Snapshot {
  const step = Math.max(0, Math.min(clicks[variant], Math.floor(rawStep || 0)))
  if (step === 0 && variant !== 'client') {
    const previous: Record<string, Variant> = { bff: 'client', query: 'bff', prefetch: 'query' }
    return architecture(previous[variant], clicks[previous[variant]])
  }
  const client = variant === 'client'
  const bff = !client
  const mapped = bff && (variant !== 'bff' || step >= 2)
  const payload = bff && (variant !== 'bff' || step >= 3)
  const query = variant === 'query' || variant === 'prefetch'
  const cacheRoute = query && (variant !== 'query' || step >= 2)
  const queryRetry = query && (variant !== 'query' || step >= 3)
  const prefetch = variant === 'prefetch'
  const dehydrate = prefetch && step >= 2
  const hydrate = prefetch && step >= 3
  const timeout = prefetch && step >= 4
  const complete = step === clicks[variant]
  const nodes: FlowNode[] = []
  const edges: FlowEdge[] = []
  const focus: Record<Variant, string[][]> = {
    client: [['ui'], ['requests', 'outbound'], ['loading', 'pending'], ['map', 'success'], ['state', 'result'], ['render', 'rendered'], ['refetch', 'requests', 'render'], ['retry', 'failure'], ['retry'], ['retry'], ['retry', 'retry-loop', 'requests', 'loading'], []],
    bff: [[], ['bff', 'outbound', 'fanout'], ['map', 'success', 'result'], ['payload', 'shaped', 'result'], ['retry', 'retry-loop', 'refetch'], []],
    query: [[], ['state', 'result'], ['render', 'rendered', 'refetch'], ['retry', 'retry-loop', 'loading'], []],
    prefetch: [[], ['prefetch', 'start'], ['payload', 'shaped'], ['state', 'result', 'render', 'rendered'], ['timeout', 'retry', 'retry-loop', 'loading'], []],
  }
  const active = (id: string) => !complete && focus[variant][step].includes(id)
  function node(id: string, x: number, y: number, w: number, label: string, detail: string, role: Role, icon: string, reveal = 0) {
    if (!client || step >= reveal) nodes.push({ id, x, y, w, label, detail, role, icon, current: active(id) })
  }
  function edge(id: string, d: string, role: Role, reveal: number, label?: string, x?: number, y?: number, dashed = false) {
    if (!client || step >= reveal) edges.push({ id, d, role, label, x, y, dashed, current: active(id) })
  }
  node('ui', 16, 112, 164, 'UI', 'Browser', 'client', 'window')
  node('requests', 938, 112, 204, '5 API Requests', '1,000 Records Each', 'api', 'server', 1)
  node('loading', 16, 246, 164, 'Loading', queryRetry ? 'Query State' : 'In Flight', 'client', 'clock', 2)
  node('map', mapped ? 580 : 242, 246, 204, 'Map Data', mapped ? 'On The Server' : 'In The Browser', mapped ? 'server' : 'client', 'map', 3)
  node('state', 242, 380, 204, query ? 'Query Cache' : 'Set State', query ? 'TanStack Query' : 'React State', 'client', 'cache', 4)
  node('render', 16, 380, 164, 'Render UI', hydrate ? 'Initial Data' : 'Render Data', 'client', 'check', 5)
  node('retry', 886, 348, 256, queryRetry ? 'Query Retry' : 'Custom Retry', queryRetry ? 'Backoff / Error State' : 'ALL Or ONLY FAILED', 'risk', 'retry', 7)
  if (bff) node('bff', 580, 112, 204, 'Next.js BFF', 'One Client Request', 'server', 'server')
  if (payload) node('payload', 580, 380, 204, dehydrate ? 'Query State' : 'Small Payload', dehydrate ? 'Per Request' : 'Shaped Data', 'server', 'cache')
  if (prefetch) node('prefetch', 580, 6, 204, 'Prefetch', 'Fetch / Timeout', 'server', 'clock')
  edge('outbound', bff ? 'M180 146 H580' : 'M180 146 H938', 'client', 1, hydrate ? 'Client Fallback' : bff ? '1 Request' : '5 Parallel Requests', bff ? 358 : 510, 134, hydrate)
  if (bff) edge('fanout', 'M784 146 H938', 'server', 0, 'Fan Out', 900, 134)
  edge('pending', 'M98 180 V246', 'client', 2)
  edge('success', `M1040 180 V216 Q1040 228 1028 228 H${mapped ? 694 : 356} Q${mapped ? 682 : 344} 228 ${mapped ? 682 : 344} 240 V246`, mapped ? 'server' : 'client', 3, 'Success', 920, 216)
  if (payload) edge('shaped', 'M682 314 V380', 'server', 0)
  edge('result', payload ? 'M580 414 H446' : mapped ? 'M580 280 H500 Q484 280 484 296 V348 Q484 364 468 364 H360 Q344 364 344 380' : 'M344 314 V380', 'client', 4, payload ? (hydrate ? 'Hydrate' : 'Response') : undefined, 513, 402)
  edge('rendered', 'M242 414 H180', 'client', 5)
  edge('refetch', cacheRoute ? 'M344 448 V474 H820 V92 H682 V112' : bff ? 'M98 448 V474 H820 V92 H682 V112' : 'M98 448 V474 H1160 V92 H1040 V112', cacheRoute ? 'client' : 'risk', 6, cacheRoute ? 'Refetch When Needed' : 'Effect/State Bug: Fetch Again', 578, 490, true)
  edge('failure', 'M1142 146 H1174 V316 Q1174 330 1160 330 H1014 V348', 'risk', 7, 'Failure / 429 Risk', bff ? 1040 : 985, bff ? 314 : 265, true)
  edge('retry-loop', bff ? 'M886 390 H850 V82 H740 V112' : 'M1014 348 V278 H1090 V180', 'risk', 10, bff ? 'Retry BFF' : 'Retry', bff ? 896 : 1120, bff ? 270 : 267, true)
  if (prefetch) edge('start', 'M682 74 V112', 'server', 0)
  if (timeout) edge('timeout', 'M784 40 H1192 V438 H1014 V416', 'risk', 0, 'Abort / Client Recovery', 1002, 454, true)
  return { nodes, edges, complete, queryRetry, cacheRoute, prefetch, timeout, variant, step }
}
