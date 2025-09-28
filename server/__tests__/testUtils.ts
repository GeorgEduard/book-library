import type { Request, Response } from 'express';

// Create a mock Request with typed params and body.
export function mockReq<
  TParams extends Record<string, string> = Record<string, string>,
  TBody = unknown,
>(
  params?: Partial<TParams>,
  body?: Partial<TBody>,
): Request<TParams, unknown, TBody> {
  return {
    params: (params ?? {}) as TParams,
    body: (body ?? {}) as TBody,
  } as unknown as Request<TParams, unknown, TBody>;
}

// Minimal typed mock for Express Response used in tests.
export interface MockResponse<ResBody = unknown> extends Response {
  statusCode: number;
  body: ResBody | undefined;
}

export function mockRes<ResBody = unknown>(): MockResponse<ResBody> {
  const res: Partial<Response> & {
    statusCode: number;
    body: ResBody | undefined;
  } = {
    statusCode: 200,
    body: undefined,
  };

  res.status = ((code: number) => {
    res.statusCode = code;
    return res as Response;
  }) as Response['status'];

  res.json = ((data: ResBody) => {
    res.body = data;
    return res as Response;
  }) as Response['json'];

  res.end = (() => {
    res.body = undefined;
    return res as Response;
  }) as Response['end'];

  return res as unknown as MockResponse<ResBody>;
}
