import { ICONS } from '../data';
import { ket, inisial, key, namaLok } from '../utils';

export const Icon = ({ name }) => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d={ICONS[name]} />
  </svg>
);

export const Pill = ({ u }) => (
  <span className={`pill st-${u.st}`}>
    <i />
    {ket(u)}
  </span>
);

export const Who = ({ u }) => (
  <div className="who">
    <span className="av">{inisial(u.penghuni)}</span>
    <div>
      <b>{u.penghuni}</b>
      <span>
        {u.no} · {namaLok(u.lok)}
      </span>
    </div>
  </div>
);

// Tombol aksi untuk tagihan yang belum lunas. stopPropagation agar klik tombol tidak ikut membuka panel detail.
export const Aksi = ({ u, actions, lg }) => {
  if (u.st === 'lunas' || u.st === 'kosong') return null;
  const cls = lg ? ' lg' : '';
  const run = (fn) => (e) => {
    e.stopPropagation();
    fn(key(u));
  };
  return (
    <>
      <button className={'btn' + cls} onClick={run(actions.wa)}>Salin pengingat</button>{' '}
      <button className={'btn pri' + cls} onClick={run(actions.lunas)}>Tandai lunas</button>
    </>
  );
};
