import { LOK, ST, H_HUNI, H_UANG } from './data';

const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const now = new Date();

export const rp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
export const jt = (n) => (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
export const key = (u) => u.lok + ':' + u.no;
export const namaLok = (id) => LOK.find((l) => l.id === id).nama;
export const sum = (list) => list.reduce((a, u) => a + u.sewa, 0);

// k bulan ke belakang dari bulan ini (k negatif = ke depan)
const blnKe = (k) => new Date(now.getFullYear(), now.getMonth() - k, 1);
export const labelBulan = (k) => {
  const d = blnKe(k);
  return BLN[d.getMonth()] + " '" + String(d.getFullYear()).slice(2);
};
export const blnPanjang = (k) => blnKe(k).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
export const hariIni = () => now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const ket = (u) =>
  u.st === 'telat' ? `Telat ${u.hr} hari` : u.st === 'belum' ? `Jatuh tempo tgl ${u.hr}` : ST[u.st];
export const inisial = (n) => n.replace(/^Kel\. (Pak|Ibu) /, '').slice(0, 2).toUpperCase();

// Urutan tagihan: yang telat paling lama di atas, lalu yang jatuh tempo paling dekat.
export const urutTagih = (list) =>
  list.slice().sort((a, b) => (b.st === 'telat') - (a.st === 'telat') || (a.st === 'telat' ? b.hr - a.hr : a.hr - b.hr));

// Data grafik hunian 12 bulan: 11 bulan riwayat + bulan ini dihitung dari data unit.
export function huniData(pilih, loks) {
  const tot = pilih.length;
  const out = [];
  for (let i = 0; i < 11; i++) {
    const n = loks.reduce((a, l) => a + H_HUNI[l.id][i], 0);
    out.push({ lb: labelBulan(11 - i), n, tot, v: (n / tot) * 100 });
  }
  const n = pilih.filter((u) => u.st !== 'kosong').length;
  out.push({ lb: labelBulan(0), n, tot, v: (n / tot) * 100 });
  return out;
}

// Data grafik sewa 6 bulan: 5 bulan riwayat + bulan ini dihitung dari data unit.
export function uangData(pilih, loks) {
  const out = [];
  for (let i = 0; i < 5; i++) {
    out.push({
      lb: labelBulan(5 - i),
      d: loks.reduce((a, l) => a + H_UANG[l.id][i][0], 0),
      t: loks.reduce((a, l) => a + H_UANG[l.id][i][1], 0),
    });
  }
  out.push({
    lb: labelBulan(0),
    d: sum(pilih.filter((u) => u.st === 'lunas')),
    t: sum(pilih.filter((u) => u.st === 'belum' || u.st === 'telat')),
  });
  return out;
}
