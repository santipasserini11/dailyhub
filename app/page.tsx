import { AppProvider } from '@/lib/context';
import { App } from '@/components/app';

export default function Page() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
