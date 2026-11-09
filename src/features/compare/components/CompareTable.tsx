'use client';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import type { Product } from '../../../shared/products/types/product';
import { useCart } from '../../cart/hooks/useCart';

interface CompareTableProps {
  items: Product[];
  onRemove: (id: string) => void;
  onOpenPicker: () => void;
  highlightWinners?: boolean;
}

export function CompareTable({
  items,
  onRemove,
  onOpenPicker,
  highlightWinners = true,
}: CompareTableProps) {
  const { addToCart } = useCart();
  const isCpu = items[0]?.category === 'cpu';

  const maxCores = Math.max(
    ...items.map((i) => parseInt(i.specs.cores || '0', 10)),
  );
  const maxThreads = Math.max(
    ...items.map((i) => parseInt(i.specs.threads || '0', 10)),
  );
  const maxBoostClock = Math.max(
    ...items.map((i) => parseFloat(i.specs.boostClock || '0')),
  );
  const maxVram = Math.max(
    ...items.map((i) => parseInt(i.specs.vram || '0', 10)),
  );
  const maxTflops = Math.max(...items.map((i) => i.specs.tflops ?? 0));
  const minTdp = Math.min(...items.map((i) => i.specs.tdp));
  const maxEfficiency = Math.max(
    ...items.map((i) => i.benchmarks.efficiencyScore),
  );

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden mb-16 shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-96">
          <thead>
            <tr>
              <th
                scope="col"
                className="w-56 min-w-52 bg-surface text-xs font-semibold text-muted uppercase tracking-wide py-4 px-5 text-left border-b border-border"
              >
                Hardware Model
              </th>
              {items.map((item) => (
                <th
                  key={item.id}
                  scope="col"
                  className="w-64 min-w-60 py-4 px-5 text-left border-b border-border"
                >
                  <div className="relative flex flex-col gap-1.5">
                    <Button
                      variant="ghost"
                      type="button"
                      className="absolute top-0 right-0 bg-transparent border border-border rounded-xl text-muted p-1 cursor-pointer transition duration-200 motion-reduce:transition-none hover:bg-surface hover:border-primary hover:text-primary"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name} from compare`}
                      title="Remove from compare"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </Button>
                    <div className="w-full aspect-video bg-surface rounded-md overflow-hidden mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase">
                      {item.series} Series
                    </span>
                    <h3 className="text-base font-extrabold m-0">
                      <Link href={`/products/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-xl font-extrabold text-foreground mt-0 mr-0 mb-2 ml-0 tabular-nums">
                      ${item.price.toLocaleString()}
                    </p>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => addToCart(item, 1)}
                      size="sm"
                    >
                      <Plus size={14} aria-hidden="true" /> Add to Cart
                    </Button>
                  </div>
                </th>
              ))}
              {items.length < 4 && (
                <th
                  scope="col"
                  className="w-64 min-w-60 bg-surface py-4 px-5 text-left border-b border-border"
                >
                  <div className="h-full min-h-64 flex flex-col items-center justify-center border-2 border-border rounded-md p-6 text-center">
                    <p className="mb-3 text-primary text-xs font-extrabold tracking-widest uppercase">
                      Slot {items.length + 1} of 4
                    </p>
                    <Button
                      variant="secondary"
                      type="button"
                      className="w-full"
                      onClick={onOpenPicker}
                      size="lg"
                    >
                      <Plus size={16} aria-hidden="true" /> Add Silicon
                    </Button>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                colSpan={items.length + (items.length < 4 ? 2 : 1)}
                scope="colgroup"
                className="px-5 text-left border-b border-border bg-surface text-primary text-xs font-bold uppercase tracking-wide py-2.5"
              >
                Silicon Microarchitecture
              </th>
            </tr>
            {isCpu ? (
              <>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    Physical Cores
                  </th>
                  {items.map((item) => {
                    const isWinner =
                      highlightWinners &&
                      items.length > 1 &&
                      parseInt(item.specs.cores || '0', 10) === maxCores;
                    return (
                      <td
                        key={item.id}
                        className={cn(
                          `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                          'py-4 px-5 text-left border-b border-border',
                        )}
                      >
                        {item.specs.cores} Cores
                      </td>
                    );
                  })}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    Concurrent Threads
                  </th>
                  {items.map((item) => {
                    const isWinner =
                      highlightWinners &&
                      items.length > 1 &&
                      parseInt(item.specs.threads || '0', 10) === maxThreads;
                    return (
                      <td
                        key={item.id}
                        className={cn(
                          `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                          'py-4 px-5 text-left border-b border-border',
                        )}
                      >
                        {item.specs.threads} Threads
                      </td>
                    );
                  })}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    Boost Clock
                  </th>
                  {items.map((item) => {
                    const isWinner =
                      highlightWinners &&
                      items.length > 1 &&
                      parseFloat(item.specs.boostClock || '0') ===
                        maxBoostClock;
                    return (
                      <td
                        key={item.id}
                        className={cn(
                          `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                          'py-4 px-5 text-left border-b border-border',
                        )}
                      >
                        {item.specs.boostClock}
                      </td>
                    );
                  })}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    Unified Cache
                  </th>
                  {items.map((item) => (
                    <td
                      key={item.id}
                      className="text-sm font-semibold text-foreground tabular-nums py-4 px-5 text-left border-b border-border"
                    >
                      {item.specs.cache}
                    </td>
                  ))}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    VRAM Capacity
                  </th>
                  {items.map((item) => {
                    const isWinner =
                      highlightWinners &&
                      items.length > 1 &&
                      parseInt(item.specs.vram || '0', 10) === maxVram;
                    return (
                      <td
                        key={item.id}
                        className={cn(
                          `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                          'py-4 px-5 text-left border-b border-border',
                        )}
                      >
                        {item.specs.vram}
                      </td>
                    );
                  })}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    Compute Engine (FP32)
                  </th>
                  {items.map((item) => {
                    const isWinner =
                      highlightWinners &&
                      items.length > 1 &&
                      (item.specs.tflops ?? 0) === maxTflops;
                    return (
                      <td
                        key={item.id}
                        className={cn(
                          `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                          'py-4 px-5 text-left border-b border-border',
                        )}
                      >
                        {item.specs.tflops?.toFixed(1)} TFLOPs
                      </td>
                    );
                  })}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    Memory Bus Width
                  </th>
                  {items.map((item) => (
                    <td
                      key={item.id}
                      className="text-sm font-semibold text-foreground tabular-nums py-4 px-5 text-left border-b border-border"
                    >
                      {item.specs.busWidth ?? '384-Bit'}
                    </td>
                  ))}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-4 px-5 text-left border-b border-border"
                  >
                    Engine Clock
                  </th>
                  {items.map((item) => {
                    const isWinner =
                      highlightWinners &&
                      items.length > 1 &&
                      parseFloat(item.specs.boostClock || '0') ===
                        maxBoostClock;
                    return (
                      <td
                        key={item.id}
                        className={cn(
                          `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                          'py-4 px-5 text-left border-b border-border',
                        )}
                      >
                        {item.specs.boostClock}
                      </td>
                    );
                  })}
                  {items.length < 4 && (
                    <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
                  )}
                </tr>
              </>
            )}

            <tr>
              <th
                colSpan={items.length + (items.length < 4 ? 2 : 1)}
                scope="colgroup"
                className="px-5 text-left border-b border-border bg-surface text-primary text-xs font-bold uppercase tracking-wide py-2.5"
              >
                Power & Thermal Specifications
              </th>
            </tr>
            <tr>
              <th
                scope="row"
                className="py-4 px-5 text-left border-b border-border"
              >
                TDP Rating
              </th>
              {items.map((item) => {
                const isWinner =
                  highlightWinners &&
                  items.length > 1 &&
                  item.specs.tdp === minTdp;
                return (
                  <td
                    key={item.id}
                    className={cn(
                      `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                      'py-4 px-5 text-left border-b border-border',
                    )}
                  >
                    {item.specs.tdp} Watts
                  </td>
                );
              })}
              {items.length < 4 && (
                <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
              )}
            </tr>
            <tr>
              <th
                scope="row"
                className="py-4 px-5 text-left border-b border-border"
              >
                Efficiency Rating
              </th>
              {items.map((item) => {
                const isWinner =
                  highlightWinners &&
                  items.length > 1 &&
                  item.benchmarks.efficiencyScore === maxEfficiency;
                return (
                  <td
                    key={item.id}
                    className={cn(
                      `text-sm font-semibold text-foreground tabular-nums${isWinner ? ' text-primary font-extrabold text-primary font-extrabold bg-surface' : ''}`,
                      'py-4 px-5 text-left border-b border-border',
                    )}
                  >
                    {item.benchmarks.efficiencyScore.toFixed(1)} / 10
                  </td>
                );
              })}
              {items.length < 4 && (
                <td className="text-sm font-semibold text-foreground tabular-nums bg-surface py-4 px-5 text-left border-b border-border" />
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
