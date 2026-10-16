import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const HIDDEN = ['passwordHash', 'resetToken'];

function strip(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(strip);
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  const out: Record<string, unknown> = {};

  for (const [key, inner] of Object.entries(value)) {
    if (HIDDEN.includes(key)) continue;
    out[key] = strip(inner);
  }

  return out;
}

@Injectable()
export class RedactInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((body) => strip(body)));
  }
}