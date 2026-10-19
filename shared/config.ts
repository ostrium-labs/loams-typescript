// Shared by the examples: where the engine is, and which namespace they may touch.
export const ENDPOINT = (process.env.LOAMS_ENDPOINT ?? 'http://127.0.0.1:8080').replace(/\/$/, '');
export const NAMESPACE = process.env.LOAMS_NAMESPACE ?? 'examples-typescript';
// Auth is off on `loams dev`. Set LOAMS_API_KEY against a protected instance.
export const API_KEY = process.env.LOAMS_API_KEY;
