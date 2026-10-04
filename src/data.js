// Data contoh dan pengaturan. Ganti isi file ini untuk menyesuaikan dengan klien.

// Isi nomor WhatsApp Anda (format 628xxxxxxxxxx) agar tombol konsultasi muncul.
export const KONTAK_WA = '';

export const LOK = [
  { id: 'melati', nama: 'Kos Griya Melati' },
  { id: 'cend', nama: 'Kontrakan Cendrawasih' },
];

// st: lunas | belum | telat | kosong
// hr: jumlah hari telat (st telat) atau tanggal jatuh tempo (st belum)
// lama: sudah berapa bulan tinggal.  sisa: sisa bulan kontrak.
const U = (lok, no, penghuni, hp, sewa, st, hr, lama, sisa) => ({ lok, no, penghuni, hp, sewa, st, hr, lama, sisa });

export const UNITS = [
  U('melati','A1','Rian','0812-5550-101',900000,'lunas',0,14,4),
  U('melati','A2','Fitri','0813-5550-102',900000,'lunas',0,7,1),
  U('melati','A3','Yosep','0821-5550-103',900000,'telat',9,20,5),
  U('melati','A4','','',900000,'kosong',0,0,0),
  U('melati','A5','Nanda','0852-5550-105',900000,'lunas',0,3,9),
  U('melati','A6','Hendra','0811-5550-106',900000,'belum',5,11,2),
  U('melati','B1','Sari','0822-5550-107',1100000,'lunas',0,26,6),
  U('melati','B2','Thomas','0812-5550-108',1100000,'lunas',0,9,3),
  U('melati','B3','Lina','0813-5550-109',1100000,'telat',4,5,7),
  U('melati','B4','Dimas','0821-5550-110',1100000,'lunas',0,16,8),
  U('melati','B5','Putri','0852-5550-111',1100000,'belum',7,2,10),
  U('melati','B6','Arif','0811-5550-112',1100000,'lunas',0,31,5),
  U('cend','P1','Kel. Pak Simon','0812-5550-201',1800000,'lunas',0,38,10),
  U('cend','P2','Kel. Ibu Wati','0813-5550-202',1800000,'lunas',0,22,2),
  U('cend','P3','','',2000000,'kosong',0,0,0),
  U('cend','P4','Kel. Pak Daud','0821-5550-204',2000000,'telat',12,13,11),
  U('cend','P5','Kel. Ibu Ratna','0852-5550-205',2200000,'belum',10,8,4),
  U('cend','P6','Kel. Pak Anton','0811-5550-206',2200000,'lunas',0,45,3)
];

// Riwayat contoh untuk grafik: unit terisi 11 bulan sebelumnya, dan [diterima, menunggak] 5 bulan sebelumnya.
export const H_HUNI = { melati: [9, 9, 10, 10, 11, 11, 10, 11, 12, 12, 11], cend: [4, 4, 5, 5, 5, 6, 6, 5, 5, 6, 6] };
export const H_UANG = {
  melati: [[9600000, 900000], [10500000, 0], [10200000, 1100000], [11400000, 900000], [10600000, 1100000]],
  cend: [[9800000, 0], [12000000, 0], [8000000, 2000000], [10000000, 0], [9800000, 2200000]],
};

export const LOG = [
  { w: 'Hari ini, 08.12', t: 'Arif membayar sewa B6', a: 1100000 },
  { w: 'Kemarin, 19.40', t: 'Kel. Pak Anton membayar sewa P6', a: 2200000 },
  { w: 'Kemarin, 10.05', t: 'Pengingat dikirim ke Yosep (A3)', a: 0 },
  { w: '2 hari lalu', t: 'Nanda membayar sewa A5', a: 900000 },
];

export const ST = { lunas: 'Lunas', belum: 'Belum bayar', telat: 'Telat', kosong: 'Kosong' };

export const VIEWS = [
  ['dash', 'Dashboard', 'dash'],
  ['kamar', 'Kamar', 'door'],
  ['tagihan', 'Tagihan', 'bill'],
  ['penghuni', 'Penghuni', 'users'],
];

export const ICONS = {
  dash:'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
  door:'M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18M14 12h.01',
  bill:'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  users:'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.8M15.5 4.2a3.5 3.5 0 0 1 0 6.6',
  bell:'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0',
  search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5',
  plus:'M12 5v14M5 12h14',
  wallet:'M3 7a2 2 0 0 1 2-2h13v4M3 7v10a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2zM16 14h.01',
  alert:'M12 4l9 16H3zM12 10v4M12 17h.01',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  home:'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  x:'M6 6l12 12M18 6L6 18',
  moon:'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  sun:'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'
};
