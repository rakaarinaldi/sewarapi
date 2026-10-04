import { useCallback, useEffect, useState } from 'react';
import { LOK, UNITS, LOG, VIEWS, KONTAK_WA } from './data';
import { rp, key, namaLok, blnPanjang, hariIni } from './utils';
import { Icon } from './components/ui';
import Dashboard from './components/Dashboard';
import { Kamar, Tagihan, Penghuni } from './components/Views';
import { Drawer, TenantDialog, Toast } from './components/Overlays';

// Mode gelap/terang: pilihan manual disimpan di browser; tanpa pilihan, ikut pengaturan perangkat.
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem('sewarapi-tema');
      if (t === 'dark' || t === 'light') return t;
    } catch (e) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggle = () => {
    const t = theme === 'dark' ? 'light' : 'dark';
    setTheme(t);
    try { localStorage.setItem('sewarapi-tema', t); } catch (e) {}
  };
  return [theme, toggle];
}

export default function App() {
  const [units, setUnits] = useState(UNITS);
  const [log, setLog] = useState(LOG);
  const [lok, setLok] = useState('all');
  const [view, setView] = useState('dash');
  const [filt, setFilt] = useState('semua');
  const [openKey, setOpenKey] = useState(null);
  const [form, setForm] = useState(null); // null, atau { k } saat formulir penghuni baru terbuka
  const [toast, setToast] = useState(null);
  const [theme, toggleTheme] = useTheme();

  const pilih = units.filter((u) => lok === 'all' || u.lok === lok);
  const loks = LOK.filter((l) => lok === 'all' || l.id === lok);
  const kosong = units.filter((u) => u.st === 'kosong');
  const telatSemua = units.filter((u) => u.st === 'telat').length;
  const cari = (k) => units.find((u) => key(u) === k);
  const terbuka = openKey && cari(openKey);

  const go = (v, f) => {
    setView(v);
    if (f) setFilt(f);
    setOpenKey(null);
    window.scrollTo(0, 0);
  };
  const tutup = useCallback(() => setOpenKey(null), []);
  const tutupToast = useCallback(() => setToast(null), []);

  const bukaForm = (k) => {
    if (!kosong.length) return setToast({ title: 'Semua unit sudah terisi' });
    setForm({ k });
  };

  const actions = {
    open: setOpenKey,
    lunas: (k) => {
      const u = cari(k);
      setUnits((us) => us.map((x) => (key(x) === k ? { ...x, st: 'lunas', hr: 0 } : x)));
      setLog((l) => [{ w: 'Baru saja', t: `${u.penghuni} membayar sewa ${u.no}`, a: u.sewa }, ...l]);
      setToast({ title: `Sewa ${u.no} ditandai lunas`, body: `${rp(u.sewa)} dari ${u.penghuni} masuk ke pemasukan bulan ini.` });
    },
    wa: (k) => {
      const u = cari(k);
      const kapan = u.st === 'telat' ? `sudah telat ${u.hr} hari` : `jatuh tempo tanggal ${u.hr}`;
      const msg = `Halo ${u.penghuni}, mengingatkan sewa ${u.no} ${namaLok(u.lok)} bulan ${blnPanjang(0)} sebesar ${rp(u.sewa)}, ${kapan}. Mohon kabari bila sudah transfer. Terima kasih.`;
      const done = (ok) =>
        setToast({ title: ok ? 'Pengingat disalin, tinggal tempel di WhatsApp' : 'Pengingat untuk penghuni (salin teks di bawah)', body: msg });
      try {
        navigator.clipboard.writeText(msg).then(() => done(true), () => done(false));
      } catch (e) {
        done(false);
      }
    },
    isi: (k) => {
      setOpenKey(null);
      bukaForm(k);
    },
  };

  const simpanPenghuni = ({ k, nama, hp, bayar }) => {
    const u = cari(k);
    setUnits((us) =>
      us.map((x) => (key(x) === k ? { ...x, penghuni: nama, hp, st: bayar, hr: bayar === 'belum' ? 10 : 0, lama: 0, sisa: 12 } : x))
    );
    setLog((l) => [{ w: 'Baru saja', t: `${nama} masuk ke ${u.no}`, a: bayar === 'lunas' ? u.sewa : 0 }, ...l]);
    setForm(null);
    setToast({ title: `${nama} masuk ke ${u.no}`, body: `${namaLok(u.lok)}, sewa ${rp(u.sewa)} per bulan.` });
  };

  const NavBtn = ({ v, badge }) => (
    <button aria-current={view === v[0] ? 'page' : undefined} onClick={() => go(v[0])}>
      <Icon name={v[2]} />
      <span>{v[1]}</span>
      {badge && v[0] === 'tagihan' && telatSemua > 0 && <b>{telatSemua}</b>}
    </button>
  );
  const waLink = KONTAK_WA
    ? `https://wa.me/${KONTAK_WA}?text=${encodeURIComponent('Halo, saya sudah coba demo SewaRapi. Saya mau tanya soal aplikasi untuk kos/kontrakan saya.')}`
    : null;

  return (
    <>
      <div className="app">
        <aside className="side">
          <div className="logo"><span><Icon name="home" /></span>SewaRapi</div>
          <nav className="nav">
            <small>Menu</small>
            {VIEWS.map((v) => <NavBtn key={v[0]} v={v} badge />)}
          </nav>
          <div className="sidefoot">
            <strong>Mode demo</strong>Semua nama dan angka di sini adalah data contoh. Perubahan kembali ke awal saat halaman dimuat ulang.
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="title">
              <h1>{VIEWS.find((v) => v[0] === view)[1]}<span className="badge">DEMO · DATA CONTOH</span></h1>
              <p>{hariIni()}</p>
            </div>
            <select className="field" id="lok" aria-label="Pilih lokasi" value={lok} onChange={(e) => setLok(e.target.value)}>
              <option value="all">Semua lokasi</option>
              {LOK.map((l) => <option key={l.id} value={l.id}>{l.nama}</option>)}
            </select>
            <button className="iconbtn" aria-label="Tagihan telat" onClick={() => go('tagihan', 'telat')}>
              <Icon name="bell" />
              {telatSemua > 0 && <i>{telatSemua}</i>}
            </button>
            <button className="iconbtn" onClick={toggleTheme} title={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'} aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <button className="btn pri lg" onClick={() => bukaForm()}><Icon name="plus" />Penghuni baru</button>
            <div className="avatar"><span>PK</span><b>Pemilik</b></div>
          </header>

          <main className="content">
            {view === 'dash' && <Dashboard pilih={pilih} loks={loks} log={log} actions={actions} go={go} />}
            {view === 'kamar' && <Kamar units={units} loks={loks} actions={actions} />}
            {view === 'tagihan' && <Tagihan pilih={pilih} filt={filt} setFilt={setFilt} actions={actions} />}
            {view === 'penghuni' && <Penghuni pilih={pilih} actions={actions} />}

            <section className="card cta">
              <div>
                <h2>Mau aplikasi seperti ini untuk kos atau kontrakan Anda?</h2>
                <p>Nama lokasi, jumlah kamar, harga sewa, aturan denda, dan laporan disesuaikan dengan cara Anda mengelola. Bisa dibuka dari HP, tanpa instal apa pun.</p>
              </div>
              {waLink && <a className="btn pri lg" href={waLink} target="_blank" rel="noopener">Tanya lewat WhatsApp</a>}
            </section>
          </main>
        </div>
      </div>

      <nav className="botnav">{VIEWS.map((v) => <NavBtn key={v[0]} v={v} />)}</nav>
      {terbuka && <Drawer u={terbuka} actions={actions} onClose={tutup} />}
      {form && <TenantDialog kosong={kosong} pilihan={form.k} onSave={simpanPenghuni} onClose={() => setForm(null)} />}
      <Toast toast={toast} onDone={tutupToast} />
    </>
  );
}
