import { useEffect, useRef } from 'react';
import { Icon, Pill, Aksi } from './ui';
import { rp, key, namaLok, blnPanjang } from '../utils';

// Panel detail unit yang terbuka dari sisi kanan.
export function Drawer({ u, actions, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  const kosong = u.st === 'kosong';
  // Riwayat contoh: tanggal bayar dibuat dari nama dan nomor unit agar konsisten tiap kali dibuka.
  const tgl = ((u.penghuni.length * 3 + u.no.charCodeAt(1)) % 8) + 1;
  const hist = [];
  for (let k = 1; k <= Math.min(5, u.lama); k++) hist.push([blnPanjang(k), `Lunas, dibayar tgl ${tgl + (k % 3)}`]);

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" aria-label="Detail unit">
        <header>
          <h2>Unit {u.no}</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Tutup"><Icon name="x" /></button>
        </header>
        <div className="body">
          {kosong ? (
            <dl>
              <dt>Lokasi</dt><dd>{namaLok(u.lok)}</dd>
              <dt>Harga sewa</dt><dd>{rp(u.sewa)} / bulan</dd>
              <dt>Status</dt><dd><Pill u={u} /></dd>
            </dl>
          ) : (
            <>
              <dl>
                <dt>Penghuni</dt><dd>{u.penghuni}</dd>
                <dt>No. HP</dt><dd>{u.hp || '-'}</dd>
                <dt>Lokasi</dt><dd>{namaLok(u.lok)}</dd>
                <dt>Sewa</dt><dd>{rp(u.sewa)} / bulan</dd>
                <dt>Masuk sejak</dt><dd>{blnPanjang(u.lama)}</dd>
                <dt>Kontrak sampai</dt><dd>{blnPanjang(-u.sisa)}</dd>
                <dt>Bulan ini</dt><dd><Pill u={u} /></dd>
              </dl>
              <div>
                <p className="sub">Riwayat pembayaran</p>
                <ul className="hist">
                  {hist.length ? (
                    hist.map(([b, t]) => <li key={b}><b>{b}</b><span>{t}</span></li>)
                  ) : (
                    <li><span>Belum ada riwayat, penghuni baru masuk.</span></li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
        {kosong ? (
          <footer><button className="btn pri lg" onClick={() => actions.isi(key(u))}>Isi penghuni</button></footer>
        ) : u.st !== 'lunas' ? (
          <footer><Aksi u={u} actions={actions} lg /></footer>
        ) : null}
      </aside>
    </>
  );
}

// Formulir penghuni baru untuk unit yang kosong.
export function TenantDialog({ kosong, pilihan, onSave, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d.open) d.showModal();
  }, []);
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    onSave({ k: f.get('unit'), nama: f.get('nama').trim(), hp: f.get('hp').trim(), bayar: f.get('bayar') });
  };
  return (
    <dialog ref={ref} onClose={onClose}>
      <h2>Penghuni baru</h2>
      <form className="form" onSubmit={submit}>
        <label>Unit kosong
          <select name="unit" id="fUnit" defaultValue={pilihan || key(kosong[0])}>
            {kosong.map((u) => <option key={key(u)} value={key(u)}>{u.no} · {namaLok(u.lok)} ({rp(u.sewa)})</option>)}
          </select>
        </label>
        <label>Nama penghuni<input name="nama" id="fNama" required placeholder="mis. Rudi" /></label>
        <label>No. HP / WhatsApp<input name="hp" id="fHp" inputMode="tel" placeholder="0812-0000-0000" /></label>
        <label>Sewa bulan pertama
          <select name="bayar" id="fBayar">
            <option value="lunas">Sudah dibayar</option>
            <option value="belum">Belum dibayar</option>
          </select>
        </label>
        <div className="end">
          <button type="button" className="btn lg" onClick={onClose}>Batal</button>
          <button className="btn pri lg">Simpan</button>
        </div>
      </form>
    </dialog>
  );
}

export function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, toast.body ? 7000 : 2600);
    return () => clearTimeout(t);
  }, [toast, onDone]);
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <b>{toast.title}</b>
      {toast.body && <em>{toast.body}</em>}
    </div>
  );
}
