import { useState } from 'react';

const hotspots = [
  {
    id: 'cache',
    label: '3D V-Stack Cache Layer',
    description:
      'Stacked cache keeps critical game data close to the cores for quicker access.',
    position: { left: '31%', top: '38%' },
  },
  {
    id: 'compute',
    label: '3nm Compute Cluster',
    description:
      'Dense 3nm compute clusters balance high clock speeds with efficient power use.',
    position: { left: '62%', top: '26%' },
  },
  {
    id: 'thermal',
    label: 'Graphene Vapor Base',
    description:
      'A graphene vapor base moves heat away from the silicon under sustained load.',
    position: { left: '54%', top: '68%' },
  },
];

export function ExplodedTeardown() {
  const [activeId, setActiveId] = useState(hotspots[0].id);
  const activeHotspot =
    hotspots.find((hotspot) => hotspot.id === activeId) ?? hotspots[0];

  return (
    <section
      className="teardown-section page-width"
      aria-labelledby="teardown-title"
    >
      <div className="section-heading">
        <p className="eyebrow">Inside the architecture</p>
        <h2 id="teardown-title">Every layer has a purpose.</h2>
        <p>Explore the material choices and engineering behind the silicon.</p>
      </div>

      <div className="teardown-layout">
        <figure className="teardown-visual">
          <img
            className="teardown-visual__image"
            src="/assets/exploded-hardware-assembly-627c842e.jpg"
            alt="An exploded assembly view of a processor and its cooling layers"
            loading="lazy"
          />
          {hotspots.map((hotspot, index) => (
            <button
              className={`hotspot${activeId === hotspot.id ? ' is-active' : ''}`}
              key={hotspot.id}
              type="button"
              style={hotspot.position}
              aria-label={hotspot.label}
              aria-pressed={activeId === hotspot.id}
              onMouseEnter={() => setActiveId(hotspot.id)}
              onFocus={() => setActiveId(hotspot.id)}
              onClick={() => setActiveId(hotspot.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
          <figcaption>
            Exploded silicon assembly · interactive engineering view
          </figcaption>
        </figure>

        <div className="teardown-readout" aria-live="polite" aria-atomic="true">
          <span className="teardown-readout__number">
            {String(
              hotspots.findIndex((hotspot) => hotspot.id === activeId) + 1,
            ).padStart(2, '0')}
          </span>
          <p className="eyebrow">Engineering note</p>
          <h3>{activeHotspot.label}</h3>
          <p>{activeHotspot.description}</p>
          <div className="teardown-readout__rule" />
          <span className="teardown-readout__meta">
            AETHEL / MICROARCHITECTURE
          </span>
        </div>
      </div>
    </section>
  );
}
