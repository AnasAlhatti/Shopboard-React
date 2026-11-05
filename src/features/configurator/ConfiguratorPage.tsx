import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import type { BundledRig } from '../../types/cart';
import type { Product } from '../../types/product';
import { ComponentSlotSelector } from './components/ComponentSlotSelector';
import {
  MEMORY_STORAGE_TIERS,
  type MemoryStorageTier,
} from './data/tiers';
import { PowerSynergyMeter } from './components/PowerSynergyMeter';
import { RigVisualizer } from './components/RigVisualizer';
import { calculateSynergy } from './utils/bottleneck';
import './configurator.css';

export function ConfiguratorPage() {
  const { products, loading, error } = useProducts();
  const { addRigToCart, addToCart } = useCart();

  const cpus = products.filter((p) => p.category === 'cpu');
  const gpus = products.filter((p) => p.category === 'gpu');

  const [selectedCpu, setSelectedCpu] = useState<Product | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<Product | null>(null);
  const [selectedTier, setSelectedTier] = useState<MemoryStorageTier>(
    MEMORY_STORAGE_TIERS[0],
  );

  const [justAddedBundle, setJustAddedBundle] = useState(false);
  const [justAddedIndividual, setJustAddedIndividual] = useState(false);

  // Fallbacks to first items when data loads
  const activeCpu = selectedCpu ?? cpus[0] ?? null;
  const activeGpu = selectedGpu ?? gpus[0] ?? null;

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
  const totalPrice = cpuPrice + gpuPrice + selectedTier.price + chassisBasePrice;

  const handleAddAssembledRig = () => {
    if (!activeCpu || !activeGpu) return;

    const rig: BundledRig = {
      id: `rig-${Date.now()}`,
      name: `Aethel Battlestation (${activeCpu.series} + ${activeGpu.series})`,
      cpu: activeCpu,
      gpu: activeGpu,
      ramTier: selectedTier.name,
      storageTier: selectedTier.specs,
      totalPrice,
      totalTdp,
    };

    addRigToCart(rig);
    setJustAddedBundle(true);
    setTimeout(() => setJustAddedBundle(false), 3000);
  };

  const handleAddIndividual = () => {
    if (!activeCpu || !activeGpu) return;
    addToCart(activeCpu, 1);
    addToCart(activeGpu, 1);

    const storageProduct: Product = {
      id: `tier-${selectedTier.id}`,
      name: `Aethel ${selectedTier.name} (RAM & Gen5 NVMe)`,
      category: 'storage',
      series: 'Quantum',
      tagline: selectedTier.specs,
      price: selectedTier.price,
      image: '/assets/PC_hardware_inside_glass_case_a7ed0ff3.jpg',
      specs: {
        boostClock: '6400 MT/s',
        tdp: selectedTier.tdp,
      },
      benchmarks: {
        efficiencyScore: 9.8,
      },
      description: `High-bandwidth memory and Gen5 storage package: ${selectedTier.specs}`,
      features: [selectedTier.specs, `${selectedTier.tdp}W TDP`],
    };
    addToCart(storageProduct, 1);

    setJustAddedIndividual(true);
    setTimeout(() => setJustAddedIndividual(false), 3000);
  };

  if (loading) {
    return (
      <main className="configurator-page page-width">
        <div className="catalog-empty" role="status">
          <p className="eyebrow">Aethel Rig Engine</p>
          <h3>Loading Silicon Configurator Workbench...</h3>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="configurator-page page-width">
        <div className="home-page__error" role="status">
          Unable to initialize rig engine: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="configurator-page page-width">
      <header className="configurator-header">
        <p className="eyebrow">Precision System Engineering</p>
        <h1>Custom Rig Engine</h1>
        <p>
          Configure an extreme workstation or gaming battlestation. Monitor real-time TDP power
          dissipation, verify PSU headroom, and validate zero compute bottleneck.
        </p>
      </header>

      <div className="configurator-layout">
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
          onSelectCpu={setSelectedCpu}
          selectedGpu={activeGpu}
          onSelectGpu={setSelectedGpu}
          selectedTier={selectedTier}
          onSelectTier={setSelectedTier}
        />

        <PowerSynergyMeter
          totalTdp={totalTdp}
          recommendedPsu={recommendedPsu}
          diagnosis={diagnosis}
          totalPrice={totalPrice}
          onAddAssembledRig={handleAddAssembledRig}
          onAddIndividualComponents={handleAddIndividual}
          justAddedBundle={justAddedBundle}
          justAddedIndividual={justAddedIndividual}
        />
      </div>
    </main>
  );
}
