/**
 * Minimal Chrome WebMCP Imperative API typings (origin trial / flag).
 * Prefer local declarations over webmcp-types while the API is still in flux.
 * @see https://developer.chrome.com/docs/ai/webmcp/imperative-api
 */

interface WebMCPToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
}

interface WebMCPToolDefinition {
  name: string;
  title?: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: WebMCPToolAnnotations;
  execute: (
    input: Record<string, unknown>,
    extras?: { signal?: AbortSignal },
  ) => unknown | Promise<unknown>;
}

interface WebMCPRegisterOptions {
  signal?: AbortSignal;
  exposedTo?: string[];
}

interface ModelContext extends EventTarget {
  registerTool(tool: WebMCPToolDefinition, options?: WebMCPRegisterOptions): Promise<void>;
  getTools(options?: { fromOrigins?: string[] }): Promise<WebMCPToolDefinition[]>;
  executeTool(
    tool: WebMCPToolDefinition | string,
    input?: Record<string, unknown>,
    options?: { signal?: AbortSignal },
  ): Promise<unknown>;
}

interface Document {
  modelContext?: ModelContext;
}

interface Navigator {
  modelContext?: ModelContext;
}
