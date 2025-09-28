import type { Request, Response } from 'express';

export function mockReq<TParams = any, TBody = any>(
  params?: Partial<TParams>,
  body?: Partial<TBody>,
): Request {
  return {
    params: (params ?? {}) as any,
    body: (body ?? {}) as any,
  } as any as Request;
}

export function mockRes() {
  const res: Partial<Response> & { statusCode: number; body: any } = {
    statusCode: 200,
    body: undefined,
  };
  res.status = ((code: number) => {
    res.statusCode = code;
    return res as Response;
  }) as any;
  res.json = ((data: any) => {
    res.body = data;
    return res as Response;
  }) as any;
  res.end = (() => {
    res.body = undefined;
    return res as Response;
  }) as any;
  return res as Response & { statusCode: number; body: any };
}
