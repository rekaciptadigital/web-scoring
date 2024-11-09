import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// Import komponen lain yang terkait dengan Layout
import Header from "./Header";
import Footer from "./Footer";

const EventLayout = (props) => {
  // Contoh penggunaan state untuk mengelola kondisi tertentu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Menggunakan useEffect untuk mensimulasikan componentDidMount
  useEffect(() => {
    // Logika yang biasanya ada di componentDidMount
    if (props.someCondition) {
      document.body.classList.add("some-class");
    }

    // Cleanup jika diperlukan
    return () => {
      document.body.classList.remove("some-class");
    };
  }, [props.someCondition]); // Dependency array sesuai props atau state yang digunakan

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <React.Fragment>
      {/* Header komponen */}
      <Header toggleMenu={handleMenuToggle} />
      {/* Konten utama */}
      <div>{props.children}</div>
      {/* Footer komponen */}
      <Footer />
    </React.Fragment>
  );
};

// Membungkus komponen dengan withRouter untuk mendapatkan akses ke props history
export default withRouter(EventLayout);
