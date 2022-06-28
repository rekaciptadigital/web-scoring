import * as React from "react";

function Tutorial({ isOpen }) {
  if (!isOpen) {
    return null;
  }
  return (
    <div>
      <h2>Pengaturan Live Score</h2>

      <div>
        <p>Atur tampilan live score pada layar. Anda dapat mengatur:</p>
        <ol>
          <li>Live score pertandingan yang akan ditampilkan sesuai dengan kategori yg dipilih.</li>
          <li>
            Klik tombol “Atur Live Score” pada tombol dibawah untuk mulai mengatur tampilan live
            score. Selanjutnya klik tombol ”Tambah Kategori” untuk menambah kolom kategori yang akan
            ditampilkan.
          </li>
        </ol>
      </div>
    </div>
  );
}

export { Tutorial };
