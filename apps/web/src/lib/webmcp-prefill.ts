/** CustomEvent name islands listen for; WebMCP tools dispatch on the form. */
export const WEBMCP_PREFILL = 'webmcp:prefill';

export type WebmcpPrefillDetail = Record<string, string | undefined>;
