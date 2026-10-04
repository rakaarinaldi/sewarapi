import { useEffect, useRef, useState } from 'react';
import { rp, jt } from '../utils';

// Lebar wadah grafik, diperbarui saat ukuran layar berubah.
function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

const Tip = ({ tip, children }) =>
  tip ? (
    <div
      className="tip"
      style={{ left: Math.max(8, Math.min(window.innerWidth - 230, tip.x + 14)), top: Math.max(8, tip.y - 76) }}
    >
      {children}
    </div>
  ) : null;

const Angka = ({ head, rows }) => (
  <details>
    <summary>Lihat angka</summary>
    <div className="scroll">
      <table>
        <thead>
          <tr>{head.map((h, i) => <th key={h} className={i ? 'num' : ''}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>{r.map((c, i) => <td key={i} className={i ? 'num' : ''}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
);

export function LineChart({ data }) {
  const [ref, W] = useWidth();
  const [hov, setHov] = useState(null); // { i, x, y }
  const H = 220, m = { l: 40, r: 46, t: 14, b: 24 }, n = data.length;
  const step = (W - m.l - m.r) / (n - 1);
  const x = (i) => m.l + i * step;
  const y = (v) => m.t + ((100 - v) / 50) * (H - m.t - m.b);
  const skip = n <= 6 ? 1 : W < 440 ? 3 : 2;
  const pts = data.map((o, i) => `${x(i).toFixed(1)},${y(o.v).toFixed(1)}`).join(' L');
  const last = data[n - 1];
  const move = (e) => {
    const left = ref.current.getBoundingClientRect().left;
    const i = Math.max(0, Math.min(n - 1, Math.round((e.clientX - left - m.l) / step)));
    setHov({ i, x: e.clientX, y: e.clientY });
  };
  const o = hov && data[hov.i];
  return (
    <>
      <div className="chart" ref={ref} onPointerMove={move} onPointerLeave={() => setHov(null)}>
        {W > 0 && (
          <svg viewBox={`0 0 ${W} ${H}`} height={H} role="img" aria-label="Grafik garis tingkat hunian">
            {[50, 75, 100].map((v) => (
              <g key={v}>
                <line className={v === 50 ? 'ax' : 'g'} x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} />
                <text className="t" x={m.l - 8} y={y(v) + 4} textAnchor="end">{v}%</text>
              </g>
            ))}
            {data.map((d, i) =>
              (n - 1 - i) % skip === 0 ? (
                <text key={d.lb} className="t" x={x(i)} y={H - 6} textAnchor="middle">{d.lb}</text>
              ) : null
            )}
            <path className="ar" d={`M${pts} L${x(n - 1)},${y(50)} L${x(0)},${y(50)} Z`} />
            {o && <line className="cross" x1={x(hov.i)} x2={x(hov.i)} y1={m.t} y2={H - m.b} />}
            <path className="ln" d={`M${pts}`} />
            {o && <circle className="dot" r="5" cx={x(hov.i)} cy={y(o.v)} />}
            <circle className="dot" r="5" cx={x(n - 1)} cy={y(last.v)} />
            <text className="v" x={x(n - 1) + 9} y={y(last.v) + 4}>{Math.round(last.v)}%</text>
          </svg>
        )}
        <Tip tip={hov}>
          {o && (
            <>
              <b>{o.lb}</b>Hunian {Math.round(o.v)}%<br />
              {o.n} dari {o.tot} unit terisi
            </>
          )}
        </Tip>
      </div>
      <Angka head={['Bulan', 'Terisi', 'Hunian']} rows={data.map((d) => [d.lb, `${d.n} / ${d.tot}`, `${Math.round(d.v)}%`])} />
    </>
  );
}

// Batang dengan sudut atas membulat dan dasar rata.
const roundTop = (x, y, w, h) => {
  const r = Math.min(4, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
};

export function BarChart({ data }) {
  const [ref, W] = useWidth();
  const [hov, setHov] = useState(null);
  const H = 220, m = { l: 44, r: 10, t: 22, b: 24 }, n = data.length;
  const top = Math.max(5e6, Math.ceil(Math.max(...data.map((o) => o.d + o.t)) / 5e6) * 5e6);
  const band = (W - m.l - m.r) / n, bw = Math.min(44, band * 0.58), base = H - m.b;
  const y = (v) => m.t + (1 - v / top) * (base - m.t);
  const move = (e) => {
    const left = ref.current.getBoundingClientRect().left;
    const i = Math.max(0, Math.min(n - 1, Math.floor((e.clientX - left - m.l) / band)));
    setHov({ i, x: e.clientX, y: e.clientY });
  };
  const o = hov && data[hov.i];
  return (
    <>
      <div className="chart" ref={ref} onPointerMove={move} onPointerLeave={() => setHov(null)}>
        {W > 0 && (
          <svg viewBox={`0 0 ${W} ${H}`} height={H} role="img" aria-label="Grafik batang sewa diterima dan tunggakan">
            {o && <rect className="hov" x={m.l + hov.i * band} y={m.t - 6} width={band} height={base - m.t + 6} rx="4" />}
            {[0, top / 2, top].map((v) => (
              <g key={v}>
                <line className={v ? 'g' : 'ax'} x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} />
                <text className="t" x={m.l - 8} y={y(v) + 4} textAnchor="end">{v ? jt(v) : '0'}</text>
              </g>
            ))}
            {data.map((d, i) => {
              const x0 = m.l + i * band + (band - bw) / 2, yd = y(d.d), yt = y(d.d + d.t);
              return (
                <g key={d.lb}>
                  {d.t > 0 ? (
                    <>
                      <rect className="b1" x={x0} y={yd} width={bw} height={base - yd} />
                      <path className="b2" d={roundTop(x0, yt, bw, Math.max(1, yd - 2 - yt))} />
                    </>
                  ) : (
                    <path className="b1" d={roundTop(x0, yd, bw, base - yd)} />
                  )}
                  <text className="t" x={x0 + bw / 2} y={H - 6} textAnchor="middle">{d.lb}</text>
                  {i === n - 1 && <text className="v" x={x0 + bw / 2} y={yt - 6} textAnchor="middle">{jt(d.d + d.t)}</text>}
                </g>
              );
            })}
          </svg>
        )}
        <Tip tip={hov}>
          {o && (
            <>
              <b>{o.lb}</b>
              <i style={{ background: 'var(--s1)' }} />Diterima {rp(o.d)}<br />
              <i style={{ background: 'var(--s2)' }} />Menunggak {rp(o.t)}
            </>
          )}
        </Tip>
      </div>
      <Angka head={['Bulan', 'Diterima', 'Menunggak']} rows={data.map((d) => [d.lb, rp(d.d), rp(d.t)])} />
    </>
  );
}
