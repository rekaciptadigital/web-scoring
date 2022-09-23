# My Archery: Organizer (Admin)

Code base My Archery Organizer.

## TODO:

- [ ] Lengkapi beberapa informasi

## _Reuseable utilities_ yang bisa berguna:

### Hook custom `useFetcher()`

Hook custom untuk membantu implementasi kirim request HTTP ke API. Di-custom untuk dipakai dengan utility API & service API bawaan My Archery. Belum secanggih React Query atau SWR dan semacamnya, tapi cukup berguna untuk dipakai di My Archery.

Fitur:

- Tracking status proses asinkronus selama kirim request (`loading`, `success`, `error`, dll.), yang bisa diakses untuk merender UI/indikator/pesan sesuai statusnya.
- Simpan data respon saat sudah berhasil
- Simpan error yang sudah diterjemahkan saat gagal request

Secara umum dipakai untuk get data dari API, atau untuk submit data ke API.

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

Bisa dimanfaatkan juga untuk proses asinkronus lain yang buat kirim request HTTP, tapi callback untuk `runAsync` perlu disesuaikan supaya me-return Promise yang me-resolve objek seperti ini:

```javascript
{
  success: true, // Boolean
  data: null, // atau nilai apapun, bebas
  errors: null, // ...
  message: "", // ...
}

// Ini objek yang di-resolve oleh promise dari service.
// Jadi kalau mau dipakai untuk keperluan lain, bisa dengan
// cara me-resolve objek yang serupa.
```

Ke depannya bisa ditambahkan fitur "abort" untuk membatalkan request ketika komponen di-unmount/pindah halaman, tapi untuk saat ini utility API bawaan masih belum memungkinkan untuk mengimplementasi ini.
