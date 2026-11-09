import type { Product } from '../../../shared/products/types/product';

interface ArchitectureSpecTableProps {
  product: Product;
}

export function ArchitectureSpecTable({ product }: ArchitectureSpecTableProps) {
  const isCpu = product.category === 'cpu';

  return (
    <section
      className="spec-table-section"
      aria-labelledby="architecture-specs-heading"
    >
      <h3
        id="architecture-specs-heading"
        className="text-xl font-bold mt-0 mr-0 mb-4 ml-0"
      >
        Technical Specifications
      </h3>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <th
                scope="row"
                className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
              >
                Architecture Node
              </th>
              <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                3nm High-Density TSMC FinFET
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
              >
                Silicon Family
              </th>
              <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                {product.series} Ultra Generation
              </td>
            </tr>
            {isCpu ? (
              <>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Physical Cores
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.cores} Cores
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Thread Concurrency
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.threads} Simultaneous Threads
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Peak Boost Frequency
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.boostClock}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Total Unified Cache
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.cache}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Estimated Transistors
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    71.5 Billion High-Density FinFET
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Vector & Matrix Acceleration
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    AVX-512, Dual-Issue SIMD, FP16 Hardware Engines
                  </td>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Video Memory (VRAM)
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.vram}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Memory Bus Width
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.busWidth ?? '384-Bit'} High-Bandwidth
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    FP32 Compute Throughput
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.tflops?.toFixed(1)} TFLOPs
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Engine Clock
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    {product.specs.boostClock}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Estimated Transistors
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    84.8 Billion High-Density FinFET
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
                  >
                    Ray Tracing & Neural Pipeline
                  </th>
                  <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                    Gen-3 Hardware Ray Accelerators, Neural Supersampling
                  </td>
                </tr>
              </>
            )}
            <tr>
              <th
                scope="row"
                className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
              >
                Thermal Design Power (TDP)
              </th>
              <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                {product.specs.tdp} Watts
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="py-3 px-4 border-border text-left border-b-0 text-muted font-medium w-44"
              >
                Host Interface
              </th>
              <td className="py-3 px-4 border-border text-left border-b-0 text-foreground font-bold tabular-nums">
                PCI Express 5.0 x16
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
