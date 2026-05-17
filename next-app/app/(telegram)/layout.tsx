import type {ReactNode} from 'react';
import AppShell from '@/components/shell/AppShell';

export default function TelegramLayout(props: {children: ReactNode}) {
  return <AppShell>{props.children}</AppShell>;
}
