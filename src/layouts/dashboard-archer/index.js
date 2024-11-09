import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

// Import komponen lain yang terkait dengan Layout
// import Navbar from "./Navbar"
// import HeaderForm dari "../landingpage/HeaderForm"
import Footer from "./Footer";

// Functional Component untuk LayoutArcher
const LayoutArcher = (props) => {
  // Menggunakan useEffect untuk mensimulasikan componentDidMount
  useEffect(() => {
    // Mengatur layout body menjadi horizontal
    if (document.body) document.body.setAttribute('data-layout', 'horizontal');

    // Logika untuk preloader
    if (props.isPreloader === true) {
      // Menampilkan elemen preloader
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      // Menyembunyikan preloader setelah 2.5 detik
      setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      // Jika preloader tidak diaktifkan, langsung sembunyikan elemen preloader
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }

    // Menggulir halaman ke atas saat komponen dimuat atau saat path berubah
    window.scrollTo(0, 0);
  }, [props.isPreloader]); // Menggunakan isPreloader sebagai dependensi

  return (
    <React.Fragment>
      {/* Menampilkan anak komponen yang dikirim melalui props */}
      {props.children}
      {/* Menampilkan Footer */}
      <Footer />
    </React.Fragment>
  );
};

// Membungkus komponen dengan withRouter untuk mendapatkan akses ke props history
export default withRouter(LayoutArcher);
