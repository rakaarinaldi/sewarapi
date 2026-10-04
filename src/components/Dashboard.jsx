import { useState } from 'react';
import { Icon, Pill, Who, Aksi } from './ui';
import { LineChart, BarChart } from './Charts';
import { rp, sum, key, namaLok, blnPanjang, urutTagih, huniData, uangData } from '../utils';

export default function Dashboard({ pilih, loks, log, actions, go }) {
  const [per, setPer] = useState(12);
  const isi = pilih.filter((u) => u.st !== 'kosong');
  const lunas = pilih.filter((u) => u.st === 'lunas');
  const tung = pilih.filter((u) => u.st === 'belum' || u.st === 'telat');
  const telat = pilih.filter((u) => u.st === 'telat');
  const hd = huniData(pilih, loks);
  const kini = hd[11].v, sel = Math.round(kini - hd[10].v);
  const tagih = sum(isi), pct = tagih ? (sum(lunas) / tagih) * 100 : 0;
  const habis = isi.filter((u) => u.sisa <= 2).sort((a, b) => a.sisa - b.sisa);
  const tren = sel === 0 ? 'sama dengan' : `${sel > 0 ? 'naik' : 'turun'} ${Math.abs(sel)} poin dari`;

  return (
    <section className="stack">
      <div className="kpis">
        <div className="card kpi">
          <div className="hd"><span><Icon name="home" /></span>Tingkat hunian</div>
          <strong>{Math.round(kini)}%</strong>
          <p>{isi.length} dari {pilih.length} unit terisi · <b>{tren}</b> bulan lalu</p>
        </div>
        <div className="card kpi">
          <div className="hd"><span><Icon name="wallet" /></span>Diterima bulan ini</div>
          <strong>{rp(sum(lunas))}</strong>
          <div className="meter" role="img" aria-label={`${Math.round(pct)} persen tertagih`}><div style={{ width: pct + '%' }} /></div>
          <p><b>{Math.round(pct)}%</b> dari tagihan {rp(tagih)}</p>
        </div>
        <div className="card kpi">
          <div className="hd"><span><Icon name="clock" /></span>Belum dibayar</div>
          <strong>{rp(sum(tung))}</strong>
          <p><b>{tung.length} tagihan</b> masih terbuka</p>
        </div>
        <div className="card kpi">
          <div className="hd"><span><Icon name="alert" /></span>Telat bayar</div>
          <strong>{telat.length} penghuni</strong>
          {telat.length ? (
            <p><b>{rp(sum(telat))}</b> · rata-rata telat {Math.round(telat.reduce((a, u) => a + u.hr, 0) / telat.length)} hari</p>
          ) : (
            <p>Tidak ada yang telat</p>
          )}
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="ph">
            <h2>Tingkat hunian<small>Persentase unit terisi di akhir tiap bulan</small></h2>
            <div className="seg">
              {[6, 12].map((p) => (
                <button key={p} aria-pressed={per === p} onClick={() => setPer(p)}>{p} bulan</button>
              ))}
            </div>
          </div>
          <div className="pb"><LineChart data={hd.slice(-per)} /></div>
        </div>
        <div className="card">
          <div className="ph">
            <h2>Sewa diterima dan tunggakan<small>Tagihan 6 bulan terakhir, dalam juta rupiah</small></h2>
            <div className="legend">
              <span><i style={{ background: 'var(--s1)' }} />Diterima</span>
              <span><i style={{ background: 'var(--s2)' }} />Menunggak</span>
            </div>
          </div>
          <div className="pb"><BarChart data={uangData(pilih, loks)} /></div>
        </div>
      </div>

      <div className="card">
        <div className="ph" style={{ paddingBottom: 12 }}>
          <h2>Perlu ditagih<small>Yang telat ada di urutan atas</small></h2>
          <button className="btn" onClick={() => go('tagihan')}>Lihat semua tagihan</button>
        </div>
        {tung.length ? (
          urutTagih(tung).map((u) => (
            <div className="drow" key={key(u)} onClick={() => actions.open(key(u))}>
              <Who u={u} />
              <Pill u={u} />
              <b className="amt">{rp(u.sewa)}</b>
              <div className="acts"><Aksi u={u} actions={actions} /></div>
            </div>
          ))
        ) : (
          <div className="empty">Semua sewa bulan ini sudah dibayar.</div>
        )}
      </div>

      <div className="grid2">
        <div className="card">
          <div className="ph" style={{ paddingBottom: 6 }}><h2>Kontrak segera berakhir<small>Dalam 2 bulan ke depan</small></h2></div>
          <ul className="list">
            {habis.length ? (
              habis.map((u) => (
                <li key={key(u)}>
                  <p><b>{u.penghuni}</b><small>{u.no} · {namaLok(u.lok)}</small></p>
                  <em>{blnPanjang(-u.sisa)}</em>
                </li>
              ))
            ) : (
              <li><p><small>Tidak ada kontrak yang berakhir dalam 2 bulan.</small></p></li>
            )}
          </ul>
        </div>
        <div className="card">
          <div className="ph" style={{ paddingBottom: 6 }}><h2>Aktivitas terbaru</h2></div>
          <ul className="list">
            {log.slice(0, 5).map((a, i) => (
              <li key={i}>
                <span className="dotc" />
                <p>{a.t}<small>{a.w}</small></p>
                {a.a ? <em>+{rp(a.a)}</em> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
