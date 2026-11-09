import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { LoadingState } from '../../shared/async/LoadingState';
import { ConfiguratorWorkbench } from './components/ConfiguratorWorkbench';
export function ConfiguratorPage() {
  return (
    <AsyncBoundary fallback={<LoadingState label="Loading configurator…" />}>
      <ConfiguratorWorkbench />
    </AsyncBoundary>
  );
}
