import { useState } from 'react';

const spotlights = {
  cpu: {
    tab: 'Vortex compute engine',
    eyebrow: 'Vortex CPU architecture',
    title: 'Parallel power. Precise control.',
    description:
      'High-frequency cores and generous on-chip cache adapt to demanding creative workloads and low-latency play.',
    image: '/assets/CPU_heat_spreader_glowing_traces_eb58e993.jpg',
    alt: 'Processor heat spreader with glowing circuit traces',
    accent: 'crimson',
  },
  gpu: {
    tab: 'Zenith graphics engine',
    eyebrow: 'Zenith GPU architecture',
    title: 'More frames. More worlds.',
    description:
      'A wide graphics pipeline brings high-throughput compute, immersive ray tracing, and expansive memory to every frame.',
    image: '/assets/GPU_design_with_fans_0d40afa8.jpg',
    alt: 'Aethel graphics card with triple cooling fans',
    accent: 'amber',
  },
} as const;

type SpotlightKey = keyof typeof spotlights;

export function SiliconSpotlight() {
  const [activeKey, setActiveKey] = useState<SpotlightKey>('cpu');
  const active = spotlights[activeKey];

  return (
    <section
      className="spotlight-section page-width"
      aria-labelledby="spotlight-title"
    >
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Choose your edge</p>
          <h2 id="spotlight-title">Two engines. One ecosystem.</h2>
        </div>
        <div
          className="spotlight-tabs"
          role="tablist"
          aria-label="Silicon architecture"
        >
          {(Object.keys(spotlights) as SpotlightKey[]).map((key) => (
            <button
              id={`spotlight-tab-${key}`}
              className={`spotlight-tab${activeKey === key ? ' is-active' : ''}`}
              key={key}
              type="button"
              role="tab"
              aria-selected={activeKey === key}
              aria-controls="spotlight-panel"
              onClick={() => setActiveKey(key)}
            >
              {spotlights[key].tab}
            </button>
          ))}
        </div>
      </div>

      <article
        id="spotlight-panel"
        className={`spotlight-panel spotlight-panel--${active.accent}`}
        role="tabpanel"
        aria-labelledby={`spotlight-tab-${activeKey}`}
      >
        <div className="spotlight-panel__copy">
          <p className="eyebrow">{active.eyebrow}</p>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
          <span className="spotlight-panel__index">
            AETHEL SILICON / {activeKey.toUpperCase()}
          </span>
        </div>
        <div className="spotlight-panel__image-wrap">
          <img src={active.image} alt={active.alt} loading="lazy" />
        </div>
      </article>
    </section>
  );
}
