declare module 'node-webvtt' {
  function parse(input: string, options: ParseOptions): ParseResult;

  interface ParseOptions {
    meta?: boolean;
    strict?: boolean;
  }

  interface ParseResult {
    valid: boolean;
    cues: Array<Cue>;
  }

  interface Cue {
    identifier: string;
    start: number;
    end: number;
    text: string;
    styles: string;
  }
}
