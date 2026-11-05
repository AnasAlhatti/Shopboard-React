import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import type { Product } from '../../../types/product';

interface CompareTableProps {
  items: Product[];
  onRemove: (id: string) => void;
  onOpenPicker: () => void;
}

export function CompareTable({ items, onRemove, onOpenPicker }: CompareTableProps) {
  const { addToCart } = useCart();
  const isCpu = items[0]?.category === 'cpu';

  return (
    <div className="compare-table-container">
      <div className="compare-table-scroller">
        <table className="compare-matrix">
          <thead>
            <tr>
              <th scope="col" className="compare-matrix__label-col">
                Hardware Model
              </th>
              {items.map((item) => (
                <th key={item.id} scope="col" className="compare-matrix__item-col">
                  <div className="compare-chip-header">
                    <button
                      type="button"
                      className="compare-remove-btn"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name} from compare`}
                      title="Remove from compare"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                    <div className="compare-chip-media">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <span className="compare-chip-series">{item.series} Series</span>
                    <h3 className="compare-chip-name">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="compare-chip-price">${item.price.toLocaleString()}</p>
                    <button
                      type="button"
                      className="button button--primary button--sm"
                      onClick={() => addToCart(item, 1)}
                    >
                      <Plus size={14} aria-hidden="true" /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
              {items.length < 4 && (
                <th scope="col" className="compare-matrix__item-col compare-matrix__item-col--empty">
                  <div className="compare-add-slot">
                    <p className="eyebrow">Slot {items.length + 1} of 4</p>
                    <button
                      type="button"
                      className="button button--quiet button--full"
                      onClick={onOpenPicker}
                    >
                      <Plus size={16} aria-hidden="true" /> Add Silicon
                    </button>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="matrix-section-row">
              <th colSpan={items.length + (items.length < 4 ? 2 : 1)} scope="colgroup">
                Silicon Microarchitecture
              </th>
            </tr>
            {isCpu ? (
              <>
                <tr>
                  <th scope="row">Physical Cores</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data">
                      {item.specs.cores} Cores
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
                <tr>
                  <th scope="row">Concurrent Threads</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data">
                      {item.specs.threads} Threads
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
                <tr>
                  <th scope="row">Boost Clock</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data matrix-data--highlight">
                      {item.specs.boostClock}
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
                <tr>
                  <th scope="row">Unified Cache</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data">
                      {item.specs.cache}
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th scope="row">VRAM Capacity</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data matrix-data--highlight">
                      {item.specs.vram}
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
                <tr>
                  <th scope="row">Compute Engine (FP32)</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data">
                      {item.specs.tflops?.toFixed(1)} TFLOPs
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
                <tr>
                  <th scope="row">Memory Bus Width</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data">
                      {item.specs.busWidth ?? '384-Bit'}
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
                <tr>
                  <th scope="row">Engine Clock</th>
                  {items.map((item) => (
                    <td key={item.id} className="matrix-data">
                      {item.specs.boostClock}
                    </td>
                  ))}
                  {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
                </tr>
              </>
            )}

            <tr className="matrix-section-row">
              <th colSpan={items.length + (items.length < 4 ? 2 : 1)} scope="colgroup">
                Power & Thermal Specifications
              </th>
            </tr>
            <tr>
              <th scope="row">TDP Rating</th>
              {items.map((item) => (
                <td key={item.id} className="matrix-data">
                  {item.specs.tdp} Watts
                </td>
              ))}
              {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
            </tr>
            <tr>
              <th scope="row">Efficiency Rating</th>
              {items.map((item) => (
                <td key={item.id} className="matrix-data matrix-data--highlight">
                  {item.benchmarks.efficiencyScore.toFixed(1)} / 10
                </td>
              ))}
              {items.length < 4 && <td className="matrix-data matrix-data--empty" />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
