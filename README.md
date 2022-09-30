# My Archery: Organizer (Admin)

Code base My Archery Organizer dan Archer (tidak jauh beda).

## Selayang Pandang

TODO: deskripsi...

- [CRA](https://create-react-app.dev/) (Create React App) dengan React 17
- [API hook](https://reactjs.org/docs/hooks-reference.html) standar React
- _Styling_ komponen UI dengan [Styled Components](https://www.joshwcomeau.com/css/styled-components/) (lebih disukai)
- ~~Reactstrap (Bootstrap 4 (5?), masih bisa dipakai tapi kurang direkomendasikan di sini)~~
  - butuh [alternatif yang lebih sesuai](https://www.smashingmagazine.com/2022/05/you-dont-need-ui-framework/) &amp; fleksibel
- React Redux, dengan RTK (hanya sebagian kecil yang perlu state "global")

> Lebih lengkap di `package.json`.

# Development Setup

Persiapan development lokal. Penuhi rekomendasi persyaratan teknis wajib ini di device lokal, lalu instal.

Image Docker juga tersedia, boleh pakai kalau suka.

## Wajib

- [ ] Node versi 14+ (bisa dengan NPM atau YARN, versi menyesuaikan)
- [ ] TODO

## Instalasi

```sh
git clone https://gitlab.com/my-archery/web-admin.git

# bisa pakai opsi lewat SSH:
# git clone git@gitlab.com:my-archery/web-admin.git

cd web-admin

# File dot ENV dibutuhkan juga di server development lokal,
# meskipun isinya default saja sudah cukup.
# https://create-react-app.dev/docs/adding-custom-environment-variables/
cp .env.example .env

npm i # `yarn install`, kalau pingin

# Server development dijalankan di port 3333, atau
# sesuaikan kebutuhan saja.
# Pasang port secara eksplisit begini disarankan,
# supaya bisa bedakan server untuk `web-admin` dan
# yang untuk `web` lalu dijalankan bareng (bila perlu).
PORT=3333 npm start

# favorit pribadi
# supaya gak memunculkan jendela browser baru tiap restart dev server:
# BROWSER=none PORT=3333 npm start

```

## Tool Rekomendasi

- [ ] Pakai [NVM](https://github.com/nvm-sh/nvm) (atau pakai version manager untuk Node apapun yang berguna).
- [ ] Aktifkan [setting Emmet](https://code.visualstudio.com/docs/editor/emmet#_emmet-abbreviations-in-other-file-types) untuk JSX di editor.
- [ ] Prettier
  - ekstensi VSCode bisa (disarankan),
  - CLI juga bisa (bawaan CRA): `npm run format`.
- [ ] Ekstensi VSCode: [Git Graph](https://open-vsx.org/vscode/item?itemName=mhutchie.git-graph), untuk bantu visualisasi branching dan riwayat commit.
- [ ] Ekstensi VSCode: [Styled Components](https://open-vsx.org/vscode/item?itemName=jpoissonnier.vscode-styled-components), untuk _syntax highlighting_.

# Mulai Development

TODO: deskripsi workflow git

# Kode _Reuseable_ yang Bisa Berguna:

## "Servis-servis" API

```sh
src/sevices
```

Kumpulan fungsi untuk kirim request HTTP ke API (hit API) berdasarkan endpoint API yang tersedia. Tiap fungsi mencerminkan URL endpoint API. Jumlah fungsinya sama banyak dengan jumlah endpoint.

## Fungsi utility (helper) data tanggal

```sh
src/utils/datetime.js
```

Ada helper untuk memudahkan interaksi dengan data tanggal (objek `Date` di javascript) yang sering dipakai di kasus My Archery:

- formatting tanggal jadi teks
- konversi tanggal dari API sesuai timezone client/user
- konversi tanggal input jadi format yang diterima backend, dsb.

Masing-masing adalah fungsi wrapper dari library `date-fns` yang sudah disesuaikan kebutuhan khusus untuk fitur-fitur UI My Archery.

## Fungsi-fungsi utility lain dan utility "_legacy_"

```sh
# lainnya
src/utils/file.js
src/utils/url.js
src/utils/misc.js
src/utils/errors.js

...

# legacy, di-reexport di file `index.js`-nya
src/utils
```

Bawaan kode lama, tapi beberapa masih tetap bermanfaat. Yang sering dipakai, seperti `stringUtils.createRandom()`, bisa dipakai untuk buat `key` unik yang dipakai untuk render list di komponen React.

Masih ada lainnya yang mungkin juga berguna untuk use case tertentu, bisa eksplorasi lebih jauh ke direktorinya.

## Hook custom `useUserProfile()`

```sh
src/hooks/user-profile.js
```

Mengenkapsulasi fetching data user profile dari implementasi dengan `react-redux`. Data di-GET hanya sekali ketika aplikasi pertama kali diload browser, dan diperbarui tiap ada perubahan status otentikasi. State tersedia global dan bisa diakses/dipanggil dengan hook ini di komponen mana saja.

## Hook custom `useFetcher()`

```sh
src/hooks/alt-fetcher.js
```

Hook custom untuk membantu implementasi kirim request HTTP ke API. Di-custom untuk dipakai dengan utility API &amp; service API bawaan My Archery. Belum secanggih React Query atau SWR dan semacamnya, tapi cukup berguna untuk dipakai di My Archery.

Fitur:

- Tracking status proses asinkronus selama kirim request (`loading`, `success`, `error`, dll.), yang bisa diakses untuk merender UI/indikator/pesan sesuai statusnya.
- Simpan data respon saat sudah berhasil
- Simpan error yang sudah diterjemahkan saat gagal request

Secara umum dipakai untuk get data dari API, atau untuk submit data ke API.

> Selain untuk kirim request ke API, bisa dimanfaatkan juga untuk proses asinkronus yang lain, tapi lebih baik bikin custom hook sendiri yang memang untuk tujuan itu saja.

Contoh implementasi:

```javascript
import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { EventServices } from "services";

function App() {
  return <PageEventDetail />;
}

function PageEventDetail() {
  const fetcher = useFetcher();

  /**
   * Fetcher mereturn objek dengan beberapa properti (bisa lihat
   * lengkapnya di definisi function-nya). Yang dipakai untuk
   * mengeksekusi method dari service itu sendiri adalah function
   * `runAsync`.
   */
  const { runAsync } = fetcher;

  /**
   * Pakai status untuk merender indikator proses dan hasil (data/error)
   */
  const { data, isInitialLoading, isLoading, isError, errors } = fetcher;

  /**
   * Panggil `runAsync()` di `useEffect`, atau di event handler
   * manapun yang sesuai.
   */
  React.useEffect(() => {
    // Ini akan GET data API ketika komponen di-mounting
    runAsync(function () {
      return EventServices.getEventDetail({ event_id: 22 });
    });
  }, []);

  const handleFetchData = () => {
    runAsync(() => EventServices.getEventDetail({ event_id: 22 }));
  };

  if (isInitialLoading) {
    return <div>Sedang memuat data</div>;
  }

  if (isError) {
    return (
      <div>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    );
  }

  if (!data) {
    return <div>Data tidak tersedia</div>;
  }

  return (
    <main>
      <h1>{data.eventName}</h1>

      <div>
        <button onClick={handleFetchData}>Get Ulang!</button>{" "}
        {isLoading && <span>Sedang memuat ulang...</span>}
      </div>

      <p>Detail:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
```

Ke depannya bisa ditambahkan fitur "abort" untuk membatalkan request ketika komponen di-unmount/pindah halaman, tapi untuk saat ini utility API bawaan masih belum memungkinkan untuk mengimplementasi ini.

# Rekomendasi Gaya Pengkodean (_Coding Styles_)

Disarankan untuk diamalkan, meskipun tidak wajib diikut semua, karena sejauh ini sebagian besar code base berkembang seperti ini.

Harapannya nantinya lebih mudah untuk membaca, merefaktor, menghapus, dan optimisasi kode ke depannya. Kontribusi untuk meng-_improve_ basis kode sangat dipersilakan.

## Implementasikan sendiri kalau bisa dibuat sendiri

Banyak kasus development yang bisa kita implementasikan sendiri sehingga gak perlu instal _library 3rd party_ untuk hal-hal yang simpel. Gunakan yang sudah ada (import atau _copy-paste_) saja biasanya sudah cukup.

Kurangi ketergantungan pada "`npm install package-name`". Instal library tambahan hanya kalau problem yang perlu diimplementasi cukup rumit sampai gak bisa dibuat sendiri, atau kurang masuk akal untuk dijadikan _sprint_ development tersendiri.

## Pendekatan _bottom-up_

TODO: deskripsi...

Mulai dengan satu komponen `Page` yang besar, kemudian baru ekstrak komponen & hook custom setelah dibutuhkan.

... supaya mempercepat gerak development tanpa waktu lama memikirkan [abstraksi](https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase), dan aman untuk hapus kode ketika ternyata gak dibutuhkan lagi.

Abstraksi, refaktor, ekstrak komponen, reusability, dst. bisa di kemudian waktu ketika sudah muncul _pattern_ berulang yang stabil (tapi tetap perlu dikerjakan juga, cepat atau lambat).

## Kurangi pakai inline styling &amp; bootstrap

Hingga saat ini, kode My Archery diuntungkan oleh Styled Component yang memungkinkan cepat bikin styling komponen yang terisolasi.

Kalau menemui inline style &amp; class Bootstrap, silakan refaktor saja ke Styled Component bila memungkinkan.

## Hapus `console.log()` yang sudah gak terpakai

Lebih disarankan pakai cara [_step debugging_](https://www.youtube.com/watch?v=H0XScE08hy8) (debugger). Juga dihapus kalau pakai breakpoint `debugger` di kode ketika sudah selesai.

## Hapus _dead code_

Pakai "komen" untuk menulis keterangan pada bagian kode yang penting dan perlu dipahami rekan developer saja.

Supaya kode lebih nyaman dibaca rekan developer lain, [tidak perlu "mengkomen" kode yang gak dipakai](https://kentcdodds.com/blog/please-dont-commit-commented-out-code) lagi (_dead code_). Lebih sering kode front-end My Archery yang gak dipakai (tapi dikomen) **tidak akan** dipakai lagi (jarang kejadian di-_uncomment_ lagi). _**Dead code**_ aman dihapus, yang gak aman itu kalau _**working code**_ yang dihapus.

> Kalau memang perlu banget mau lihat kode lama yang sudah dihapus, bisa buka history commit (dari Git Graph, misalnya).

> Kalau ragu bisa sebaiknya diskusi dulu dengan yang punya commit.

## Pakai hook `useReducer()` untuk manage state form

Banyak form di My Archery yang _field_ inputnya didesain untuk saling mempengaruhi nilai _field_ yang lain. Reducer bisa menyederhanakan penulisan kode tanpa bergantung pada `useEffect()` di "body" komponen function.

## Enkapsulasikan logic komponen ke dalam custom hook

TODO: deskripsi...

Pattern yang umum di My Archery:

- hook untuk ambil data dari API (baca `useFetcher`)
- hook untuk form (yang bisa dijadikan seperti [headless UI](https://www.merrickchristensen.com/articles/headless-user-interface-components/), terinspirasi dari [Tanstack Table](https://tanstack.com/table/v8/docs/guide/introduction#what-is-headless-ui))
- hook untuk submit data form ke API

---

## Referensi Lebih Lanjut:

- [Panduan Frontend Engineering](https://web.archive.org/web/20220923114316/https://engineering.dot.co.id/), DEPOT - DOT Engineering Portal.
- Hooks:
  - [Managing State](https://beta.reactjs.org/learn/managing-state), React Docs.
  - Hook `useReducer`: [Extracting State Logic into a Reducer](https://beta.reactjs.org/learn/extracting-state-logic-into-a-reducer), React Docs.
    - [The State Reducer Pattern with React Hooks](https://www.youtube.com/watch?v=RENGNzZ0dIs), Kent C. Dodds (versi [tulisan blog](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks))
  - Custom Hook: [Reusing Logic with Custom Hooks](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks), React Docs.
- Styled component: [The styled-components Happy Path](https://www.joshwcomeau.com/css/styled-components/), Josh Comeau.
- Alternatif untuk UI framework: [You Don’t Need A UI Framework](https://www.smashingmagazine.com/2022/05/you-dont-need-ui-framework/), Josh Comeau.
- Form di React tanpa library: [What you need to know about forms in React](https://goshacmd.com/on-forms-react/), Gosha Arinich.
- Pendekatan _bottom-up_: [The WET Codebase](https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase), Dan Abrahamov, Deconstruct Conf 2019.
  - Versi [tulisan blog](https://overreacted.io/the-wet-codebase/).
- Pattern di React: [Livestream with Kent: React Patterns](https://www.youtube.com/watch?v=WV0UUcSPk-0).
- Teknik step debugging: [Debugging JavaScript - Chrome DevTools 101](https://www.youtube.com/watch?v=H0XScE08hy8), Google Chrome Developers.
  - Breakpoint dengan `debugger`: [Debugging JavaScript - Are you doing it wrong?](https://www.youtube.com/watch?v=ABlaMXkUwzY), Free Code Camp.

# Known Issues

TODO: deskripsi & lengkapi list

- [ ] Kode _reuseable_ yang sama (komponen utama, komponen ikon, utility, hook) ada di 2 repo sekaligus, di `web-admin` dan `web`, jadi redundan karena harus `copy-paste`.
- [ ] Bundle size `web-admin` terlalu besar, perlu perlakuan untuk optimisasi.
- [ ] Data dari file `.env` masih terekspos di script bundle ketika di-build.

# Penutup

Segala masukan dipersilakan.
