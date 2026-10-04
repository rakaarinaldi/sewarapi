import { useState } from 'react';
import { Icon, Pill, Who, Aksi } from './ui';
import { rp, key, blnPanjang, urutTagih } from '../utils';

export function Kamar({ units, loks, actions }) {
  return (
    <section className="stack">
      {loks.map((l) => {
        const us = units.filter((u) => u.lok === l.id);
        return (
          <div className="stack" key={l.id}>
            <h2 className="lokh">
              {l.nama}
              <span>{us.filter((u) => u.st !== 'kosong').length} dari {us.length} unit terisi</span>
            </h2>
            <div className="units">
              {us.map((u) => (
                <button className={`card unit st-${u.st}`} key={key(u)} onClick={() => actions.open(key(u))}>
                  <span className="row"><span className="no">{u.no}</span><Pill u={u} /></span>
                  <span className="nm">{u.penghuni || 'Belum ada penghuni'}</span>
                  <span className="rp">{rp(u.sewa)} / bulan</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function Tagihan({ pilih, filt, setFilt, actions }) {
  const [q, setQ] = useState('');
  const isi = pilih.filter((u) => u.st !== 'kosong');
  const n = (st) => isi.filter((u) => u.st === st).length;
  const chips = [['semua', 'Semua', isi.length], ['telat', 'Telat', n('telat')], ['belum', 'Belum bayar', n('belum')], ['lunas', 'Lunas', n('lunas')]];
  const rows = urutTagih(isi.filter((u) => u.st !== 'lunas'))
    .concat(isi.filter((u) => u.st === 'lunas'))
    .filter((u) => (filt === 'semua' || u.st === filt) && (u.penghuni + ' ' + u.no).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="card">
      <div className="tools">
        <div className="chips">
          {chips.map(([id, nm, c]) => (
            <button className="chip" key={id} aria-pressed={filt === id} onClick={() => setFilt(id)}>{nm} {c}</button>
          ))}
        </div>
        <label className="search">
          <Icon name="search" />
          <input type="search" placeholder="Cari nama atau unit" aria-label="Cari tagihan" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <div className="scroll">
        <table style={{ minWidth: 680 }}>
          <thead><tr><th>Penghuni</th><th>Status</th><th className="num">Sewa</th><th /></tr></thead>
          <tbody>
            {rows.length ? (
              rows.map((u) => (
                <tr key={key(u)} data-open onClick={() => actions.open(key(u))}>
                  <td><Who u={u} /></td>
                  <td><Pill u={u} /></td>
                  <td className="num"><b>{rp(u.sewa)}</b></td>
                  <td className="acts"><Aksi u={u} actions={actions} /></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="empty">Tidak ada tagihan yang cocok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Penghuni({ pilih, actions }) {
  return (
    <div className="card">
      <div className="scroll">
        <table style={{ minWidth: 680 }}>
          <thead><tr><th>Penghuni</th><th>No. HP</th><th>Masuk sejak</th><th>Kontrak sampai</th><th>Status bulan ini</th></tr></thead>
          <tbody>
            {pilih.filter((u) => u.st !== 'kosong').map((u) => (
              <tr key={key(u)} data-open onClick={() => actions.open(key(u))}>
                <td><Who u={u} /></td>
                <td>{u.hp || '-'}</td>
                <td>{blnPanjang(u.lama)}</td>
                <td>{blnPanjang(-u.sisa)}</td>
                <td><Pill u={u} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
