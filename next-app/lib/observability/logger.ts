export type LogLevel = 'info' | 'warn' | 'error';

export function appLog(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    ts: new Date().toISOString(),
    ...meta
  };

  if(level === 'error') {
    console.error(JSON.stringify(payload));
    return;
  }

  if(level === 'warn') {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}
