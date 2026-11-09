'use client';
import { useState } from 'react';
import { notify } from '../../../shared/notifications/notify';
import { RefreshNotice } from '../../../components/ui/RefreshNotice';
import { useProducts } from '../../../shared/products/hooks/useProducts';
import type { Product } from '../../../shared/products/types/product';
import { useCart } from '../../cart/hooks/useCart';
import type { BundledRig } from '../../cart/types/cart';
import { MEMORY_STORAGE_TIERS } from '../data/tiers';
import { calculateSynergy } from '../utils/bottleneck';
import { ComponentSlotSelector } from './ComponentSlotSelector';
import { PowerSynergyMeter } from './PowerSynergyMeter';
import { RigVisualizer } from './RigVisualizer';

export function ConfiguratorWorkbench() {
  const { products, error, refresh } = useProducts();
  const { addRigToCart, addToCart } = useCart();

  const cpus = products.filter((p) => p.category === 'cpu');
  const gpus = products.filter((p) => p.category === 'gpu');

  const [selectedCpuId, setSelectedCpuId] = useState<string | null>(null);
  const [selectedGpuId, setSelectedGpuId] = useState<string | null>(null);
  const [selectedTierId, setSelectedTierId] = useState(
    MEMORY_STORAGE_TIERS[0].id,
  );
  const selectedTier =
    MEMORY_STORAGE_TIERS.find((tier) => tier.id === selectedTierId) ??
    MEMORY_STORAGE_TIERS[0];

  // Fallbacks to first items when data loads
  const activeCpu =
    cpus.find((cpu) => cpu.id === selectedCpuId) ?? cpus[0] ?? null;
  const activeGpu =
    gpus.find((gpu) => gpu.id === selectedGpuId) ?? gpus[0] ?? null;

  // Power Calculations
  const baseMotherboardTdp = 50;
  const cpuTdp = activeCpu?.specs.tdp ?? 105;
  const gpuTdp = activeGpu?.specs.tdp ?? 250;
  const totalTdp = cpuTdp + gpuTdp + selectedTier.tdp + baseMotherboardTdp;

  // Recommended PSU: 1.5x overhead rounded to nearest 50
  const rawPsu = totalTdp * 1.45;
  const recommendedPsu = Math.max(650, Math.ceil(rawPsu / 50) * 50);

  // Synergy & Bottleneck calculation
  const diagnosis = calculateSynergy(activeCpu, activeGpu);

  // Pricing
  const cpuPrice = activeCpu?.price ?? 0;
  const gpuPrice = activeGpu?.price ?? 0;
  const chassisBasePrice = 180; // Premium chassis + thermal assembly
  const totalPrice =
    cpuPrice + gpuPrice + selectedTier.price + chassisBasePrice;

  const memoryStorage: Product = {
    id: `tier-${selectedTier.id}`,
    name: `Aethel ${selectedTier.name} (RAM & Gen5 NVMe)`,
    category: 'storage',
    series: 'Quantum',
    tagline: selectedTier.specs,
    price: selectedTier.price,
    image: '/assets/pc-hardware-glass-case-a7ed0ff3.jpg',
    specs: {
      boostClock: `${/DDR5-(\d+)/.exec(selectedTier.specs)?.[1] ?? 'Unknown'} MT/s`,
      tdp: selectedTier.tdp,
    },
    benchmarks: {
      efficiencyScore: 9.8,
    },
    description: `High-bandwidth memory and Gen5 storage package: ${selectedTier.specs}`,
    features: [selectedTier.specs, `${selectedTier.tdp}W TDP`],
  };

  const handleAddAssembledRig = () => {
    if (!activeCpu || !activeGpu) return;

    const rig: BundledRig = {
      id: `rig-${Date.now()}`,
      name: `Aethel Battlestation (${activeCpu.series} + ${activeGpu.series})`,
      cpu: activeCpu,
      gpu: activeGpu,
      ramTier: selectedTier.name,
      storageTier: selectedTier.specs,
      memoryStorage,
      totalPrice,
      totalTdp,
    };

    addRigToCart(rig);
    notify.success('Custom rig added to cart.');
  };

  const handleAddIndividual = () => {
    if (!activeCpu || !activeGpu) return;
    addToCart(activeCpu, 1);
    addToCart(activeGpu, 1);

    addToCart(memoryStorage, 1);

    notify.success('CPU, GPU, and memory/storage added to cart.');
  };

  if (!activeCpu || !activeGpu)
    return (
      <div className="p-8 text-muted" role="status">
        <h1>No compatible hardware available</h1>
        <p>
          The configurator needs at least one processor and one graphics card.
        </p>
      </div>
    );

  return (
    <main className="pt-8 pb-16 w-shell max-w-page mx-auto">
      {Boolean(error) && <RefreshNotice error={error} onRefresh={refresh} />}
      <header className="mb-12">
        <p className="mb-3 text-xs font-extrabold tracking-widest uppercase text-muted max-w-prose">
          Precision System Engineering
        </p>
        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mt-1 mr-0 mb-0 ml-0">
          Custom Rig Engine
        </h1>
        <p className="text-muted max-w-prose">
          Configure an extreme workstation or gaming battlestation. Monitor
          real-time TDP power dissipation, verify PSU headroom, and validate
          zero compute bottleneck.
        </p>
      </header>

      <div className="flex flex-col gap-12">
        <RigVisualizer
          selectedCpu={activeCpu}
          selectedGpu={activeGpu}
          selectedRamTier={selectedTier.specs}
          totalTdp={totalTdp}
          totalPrice={totalPrice}
        />

        <ComponentSlotSelector
          cpus={cpus}
          gpus={gpus}
          selectedCpu={activeCpu}
          onSelectCpu={(cpu) => setSelectedCpuId(cpu.id)}
          selectedGpu={activeGpu}
          onSelectGpu={(gpu) => setSelectedGpuId(gpu.id)}
          selectedTier={selectedTier}
          onSelectTier={(tier) => setSelectedTierId(tier.id)}
        />

        <PowerSynergyMeter
          totalTdp={totalTdp}
          recommendedPsu={recommendedPsu}
          diagnosis={diagnosis}
          totalPrice={totalPrice}
          onAddAssembledRig={handleAddAssembledRig}
          onAddIndividualComponents={handleAddIndividual}
        />
      </div>
    </main>
  );
}
