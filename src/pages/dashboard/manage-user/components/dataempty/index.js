import * as React from "react";
import './style.css';


function DataEmpty() {
    return (
        <div className="keterangan">
            <div className="icon-empty" />
            <div className="info-empty">Data tidak tersedia</div>
            <p className="inspect">Data pengelola belum tersedia. Anda dapat menambahkan pengelola dengan klik tombol “Tambah Pengelola” di kanan atas</p>
        </div>
    )
}

export default DataEmpty;