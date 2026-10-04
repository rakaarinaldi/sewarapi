# SewaRapi (demo React)

Demo aplikasi pengelolaan kos dan kontrakan: dashboard hunian dan tunggakan, tagihan dengan pengingat WhatsApp, denah kamar, data penghuni, dan mode gelap.

## Menjalankan

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev      # buka alamat yang muncul di terminal (biasanya http://localhost:5173)
npm run build    # hasil siap unggah ada di folder dist/
```

## Yang perlu Anda ubah

| Apa | Di mana |
|---|---|
| Nomor WhatsApp untuk tombol konsultasi | `KONTAK_WA` di `src/data.js` (format 628xxxxxxxxxx) |
| Nama lokasi, kamar, penghuni, harga sewa | `LOK` dan `UNITS` di `src/data.js` |
| Riwayat untuk grafik | `H_HUNI` dan `H_UANG` di `src/data.js` |
| Warna dan font | token di bagian atas `src/styles.css` |

## Struktur

```
src/
  main.jsx            titik masuk
  App.jsx             state utama dan semua aksi (tandai lunas, pengingat, penghuni baru)
  data.js             data contoh dan pengaturan
  utils.js            format rupiah, tanggal, dan perhitungan grafik
  styles.css          seluruh gaya, termasuk mode gelap
  components/         Sidebar, Topbar, Dashboard, Charts, Kamar, Tagihan, Penghuni, Drawer, dialog, toast
```

## Catatan penting

Semua data adalah **data contoh** dan hanya disimpan di memori: perubahan hilang saat halaman dimuat ulang. Untuk dipakai klien sungguhan, aplikasi ini masih perlu database, login, dan server (misalnya Supabase atau Firebase).
