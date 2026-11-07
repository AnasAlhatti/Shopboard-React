import { AsyncBoundary } from '../../shared/components/AsyncBoundary';
import { LoadingState } from '../../shared/components/LoadingState';
import { ConfiguratorWorkbench } from './components/ConfiguratorWorkbench';
import './configurator.css';

export function ConfiguratorPage() {
  return (
    <AsyncBoundary fallback={<LoadingState label="Loading configurator…" />}>
      <ConfiguratorWorkbench />
    </AsyncBoundary>
  );
}
