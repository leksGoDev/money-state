import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function fail(params: {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}): NextResponse {
  return NextResponse.json(
    {
      error: {
        code: params.code,
        message: params.message,
        details: params.details,
      },
    },
    {
      status: params.status,
    },
  );
}
