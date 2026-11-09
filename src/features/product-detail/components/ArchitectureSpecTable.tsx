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
      <h3 id="architecture-specs-heading" className="spec-table-title">
        Technical Specifications
      </h3>

      <div className="spec-table-wrap">
        <table className="spec-table">
          <tbody>
            <tr>
              <th scope="row">Architecture Node</th>
              <td>3nm High-Density TSMC FinFET</td>
            </tr>
            <tr>
              <th scope="row">Silicon Family</th>
              <td>{product.series} Ultra Generation</td>
            </tr>
            {isCpu ? (
              <>
                <tr>
                  <th scope="row">Physical Cores</th>
                  <td>{product.specs.cores} Cores</td>
                </tr>
                <tr>
                  <th scope="row">Thread Concurrency</th>
                  <td>{product.specs.threads} Simultaneous Threads</td>
                </tr>
                <tr>
                  <th scope="row">Peak Boost Frequency</th>
                  <td>{product.specs.boostClock}</td>
                </tr>
                <tr>
                  <th scope="row">Total Unified Cache</th>
                  <td>{product.specs.cache}</td>
                </tr>
                <tr>
                  <th scope="row">Estimated Transistors</th>
                  <td>71.5 Billion High-Density FinFET</td>
                </tr>
                <tr>
                  <th scope="row">Vector & Matrix Acceleration</th>
                  <td>AVX-512, Dual-Issue SIMD, FP16 Hardware Engines</td>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th scope="row">Video Memory (VRAM)</th>
                  <td>{product.specs.vram}</td>
                </tr>
                <tr>
                  <th scope="row">Memory Bus Width</th>
                  <td>{product.specs.busWidth ?? '384-Bit'} High-Bandwidth</td>
                </tr>
                <tr>
                  <th scope="row">FP32 Compute Throughput</th>
                  <td>{product.specs.tflops?.toFixed(1)} TFLOPs</td>
                </tr>
                <tr>
                  <th scope="row">Engine Clock</th>
                  <td>{product.specs.boostClock}</td>
                </tr>
                <tr>
                  <th scope="row">Estimated Transistors</th>
                  <td>84.8 Billion High-Density FinFET</td>
                </tr>
                <tr>
                  <th scope="row">Ray Tracing & Neural Pipeline</th>
                  <td>Gen-3 Hardware Ray Accelerators, Neural Supersampling</td>
                </tr>
              </>
            )}
            <tr>
              <th scope="row">Thermal Design Power (TDP)</th>
              <td>{product.specs.tdp} Watts</td>
            </tr>
            <tr>
              <th scope="row">Host Interface</th>
              <td>PCI Express 5.0 x16</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
