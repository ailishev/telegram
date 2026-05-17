import {NextResponse} from 'next/server';
import {getPrisma} from '@/lib/server/prisma';
import {appLog} from '@/lib/observability/logger';

export async function GET() {
  const startedAt = Date.now();

  try {
    await getPrisma().$queryRaw`SELECT 1`;
    const durationMs = Date.now() - startedAt;
    appLog('info', 'healthcheck.ok', {durationMs});

    return NextResponse.json({
      status: 'ok',
      database: 'up',
      durationMs,
      timestamp: new Date().toISOString()
    });
  }catch(error) {
    const durationMs = Date.now() - startedAt;
    appLog('error', 'healthcheck.failed', {
      durationMs,
      error: error instanceof Error ? error.message : 'unknown'
    });

    return NextResponse.json({
      status: 'error',
      database: 'down',
      durationMs,
      timestamp: new Date().toISOString()
    }, {status: 503});
  }
}
