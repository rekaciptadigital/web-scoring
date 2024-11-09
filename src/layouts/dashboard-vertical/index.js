import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Footer from "./Footer";
// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";

// Functional Component untuk Layout
const Layout = (props) => {
  // State untuk memeriksa apakah pengguna menggunakan perangkat mobile
  const [isMobile, setIsMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  
  // Menggunakan useEffect untuk mensimulasikan componentDidMount
  useEffect(() => {
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

  // Fungsi untuk toggle menu callback
  const toggleMenuCallback = () => {
    setIsMobile(!isMobile);
  };

  return (
    <React.Fragment>
      {/* Menampilkan Header */}
      <Header />
      {/* Menampilkan Sidebar dengan fungsi toggle */}
      <Sidebar isMobile={isMobile} toggleMenuCallback={toggleMenuCallback} />
      {/* Menampilkan anak komponen yang dikirim melalui props */}
      {props.children}
      {/* Menampilkan Footer */}
      <Footer />
    </React.Fragment>
  );
};

// Membungkus komponen dengan withRouter untuk mendapatkan akses ke props history
export default withRouter(Layout);
