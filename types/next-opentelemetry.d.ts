declare module "next/dist/compiled/@opentelemetry/api" {
  export const trace: {
    getTracer: (name: string) => {
      startActiveSpan: <T>(
        name: string,
        callback: (span: {
          setAttribute: (key: string, value: string | number | boolean) => void;
          setStatus: (status: { code: number; message?: string }) => void;
          recordException: (error: Error) => void;
          end: () => void;
        }) => T | Promise<T>,
      ) => T | Promise<T>;
    };
  };

  export const SpanStatusCode: {
    OK: number;
    ERROR: number;
  };
}
