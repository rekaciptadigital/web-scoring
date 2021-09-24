const dummyHtml = ` 
<div>
                    <div>
                      <h4>DESKRIPSI</h4>
                      <p>
                      Kegiatan scoring untuk kembali menumbuhkan semangat berlatih panahan serta ajang silaturahmi secara langsung sesuai dengan protocol Kesehatan saat ini.
                      </p>
                    </div>
                    <div>
                      <h4>WAKTU DAN TEMPAT</h4>
                      <ol type="a">
                        <li>
                          Waktu
                          <div>28 September – 29 October 2021 (Babak Kualifikasi – Weekdays)</div>
                          <div>3,4,5 November 2021 (Babak Eliminasi dan Final)</div>
                        </li>
                        <li>
                          Tempat
                          <div>Lapangan Panahan Utama – HuB Cibubur, Kota Bekasi.</div>
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h4>DIVISI YANG DIPERLOMBAKAN</h4>
                      <div>
                      <table style={{width: '100%'}}>
                        <tr>
                          <th>No</th>
                          <th>DIVISI/KATEGORI</th>
                          <th>JARAK</th>
                          <th>GENDER</th>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Standard Bow/Recurve U16</td>
                          <td>30M</td>
                          <td>Putra & Putri</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Barebow Umum</td>
                          <td>50M</td>
                          <td>Putra & Putri</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Compound U16</td>
                          <td>30M</td>
                          <td>Putra & Putri</td>
                        </tr>
                      </table>
                      </div>
                    </div>
                    <div>
                      <h4>HADIAH</h4>
                      <div>
                        <ol>
                          <li>Juara Eliminasi Putra & Putri</li>
                          <li>Hadiah berupa barang/ alat panahan</li>
                          <li>Sertifikat</li>
                        </ol>
                      </div>
                    </div>
                    <div>
                      <h4>MEKANISME SCORING</h4>
                      <div>
                        <ol>
                          <li>
                          Pemanah mendaftarkan diri dengan investasi sebesar Rp 249,000, berhak untuk mengikuti proses scoring (babak Kualifikasi) sebanyak 3 Kloter
                          </li>
                          <li>
                          Setelah pendaftaran dan selesai pembayaran maka pemanah berhak atas 3 Kloter babak kualifikasi (1 kloter = 1 sesi scoring) <b>dan langsung mengatur ke bagian pendaftaran</b> waktu untuk kualifikasi tersebut tanpa ada perubahan (sifatnya fixed).
                          </li>
                          <li>
                          Pemanah berhak menyetorkan salah satu score tertingginya dari ke 3 scoring tersebut kebidang pertandingan secara langsung <b>setelah proses scoring seluruhnya selesai.</b>
                          </li>
                          <li>Babak kualifikasi diawasi dan dipimpin oleh wasit.</li>
                          <li>Proses 3x scoring tersebut bisa dilaksanakan berbeda harinya dan dalam kurun waktu yang telah ditentukan, apabila melewati maka dianggap score terakhirlah (yang tertinggi yang diambil) yang dimasukkan ke database oleh bidang pertandingan.</li>
                          <li>Babak Eliminasi akan diambil 1/8 putra & putri dari masing2 kategori dan pelaksanaannya akan dipisah baik putra maupun putri.</li>
                          <li>Untuk kategori standard bow/Recurve U-16 busur yang boleh digunakan adalah busur standard bow dan recurve.</li>
                          <li>Apabila pemanah sudah mendaftarkan diri dan tidak dapat hadir di waktu yang telah di booking ke admin maka slot tersebut dianggap hangus dan hanya bisa mengikuti sisa slot berikutnya dan di jam yang telah dipilih.</li>
                          <li>Apabila cuaca hujan terkecuali badai dan petir maka babak kualifikasi tetap berjalan seperti biasa.</li>
                          <li>Untuk kategori standard bow/recurve & Compound U-16, batasan umur 16 tahun pada tahun 2021 (tahun kelahiran 2005).</li>
                        </ol>
                      </div>
                    </div>
                    <div>
                      <h4>PERATURAN PERLOMBAAN</h4>
                      <div>Peraturan pertandingan pada The HuB Scoring menggunakan peraturan <b>Internasional World Archery.</b></div>
                      <div>
                        <ol>
                          <li>Babak kualifikasi
                            <div>
                            Babak Kualifikasi dilaksanakan pada hari selasa – jum’at dimulai tanggal 21 September hingga 22 Oktober 2021
                            <ul>
                              <li>Selasa – kamis,
                                <div>
                                  <ul>
                                    <li> kloter 1. Jam 08.00 – 10.00</li>
                                    <li> kloter 2. Jam 10.00 – 12.00</li>
                                    <li> kloter 3. Jam 13.00 – 15.00</li>
                                    <li> kloter 4. Jam 15.00 – 17.00</li>
                                  </ul>
                                </div>
                              </li>
                              <li>Jumat,
                              <div>
                                  <ul>
                                    <li> kloter 1. Jam 08.00 – 10.00</li>
                                    <li> kloter 2. Jam 13.00 – 15.00</li>
                                    <li> kloter 3. Jam 15.00 – 17.00</li>
                                  </ul>
                                </div>
                              </li>
                            </ul>
                            </div>
                          </li>
                          <li>Babak eliminasi
                            <div>Peserta individu yang lolos ke babak eliminasi adalah 16 besar/ Babak eliminasi 1/8 untuk divisi Recurve/Nasional U-16, Compound U-16 dan Barebow Umum.</div>
                          </li>
                          <li>Nilai sama
                            <div>
                              <ul>
                                <li>Pada saat penentuan untuk masuk ke babak eliminasi apa bila terjadi total skor yang sama, maka akan dilaksanakan shoot off 1 anak panah tanpa adanya penentuan jumlah (X) dan juga (10) dengan ketentuan sebagai berikut apabila sama-sama mendapatkan nilai “10” maka akan diukur langsung posisi anak panah yang terdekat dengan titik tengah. Source : <a href="ttps://worldarchery.org/news/178830/executive-board-updates-mission-and-vision-statements-guide-post-pandemic-planning?fbclid=IwAR3TSJq_HiQrBxTRMMpsiMFqoJmUIHvUgZd0aVv6uml6vZ28SLRpll7gI_Q">https://worldarchery.org/news/178830/executive-board-updates-mission-and-vision-statements-guide-post-pandemic-planning?fbclid=IwAR3TSJq_HiQrBxTRMMpsiMFqoJmUIHvUgZd0aVv6uml6vZ28SLRpll7gI_Q</a>
                                </li>
                                <li>
                                Untuk penentuan juara (1,2,3) apabila terjadi total skor yang sama, maka akan dilihat terlebih dahulu jumlah (X dan 10) kemudian X yang lebih banyak, ketika masih sama maka akan dilaksanakan shoot off 1 anak panah dengan ketentuan
                                </li>
                                <li>
                                Untuk penentuan rangking apabila terjadi total skor yang sama, maka akan dilihat terlebih dahulu jumlah (X+10) kemudian X yang lebih banyak, ketika masih sama maka akan dilaksanakan coin toss.
                                </li>
                                <li>
                                Pada saat babak eliminasi apabila terjadi nilai sama (5 – 5) atau (140 – 140), maka akan dilaksanakan shoot off 1 anak panah dan apabila masih terdapat nilai sama akan dilakukan pengukuran anak panah yang terdekat ke titik inner dengan ketentuan apabila sama-sama mendapatkan nilai “10” maka akan dilaksanakan shoot off  1 kali lagi.
                                </li>
                              </ul>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div>
                      <h4>STANDAR PROTOKOL COVID-19 SKORING PANAHAN</h4>
                      <div>
                      Pelaksanaan Skoring akan mengikuti standar protokol kesehatan dengan tahapan sebagai Berikut:
                      <div>
                        <ol>
                          <li>Tahap Persiapan Skoring
                            <ul>
                              <li>Pelaksanaan pertandingan wajib memenuhi standar panduan protokol kesehatan covid-19.</li>
                              <li>Selanjutnya instansi Perpani terkait membuat rekomendasi untuk penyelenggaraan kegiatan panahan tersebut.</li>
                              <li>Pendaftaran peserta pertandingan dilakukan secara online tanpa ada interaksi langsung dengan calon peserta di lapangan.</li>
                            </ul>
                          </li>
                          <li>Lokasi Skoring
                            <ul>
                              <li>Seluruh lokasi kegiatan di bersihkan setiap hari sebelum dimulainya proses kegiatan.</li>
                              <li>Spanduk dan banner protokol wajib dipasang dibeberapa titik lokasi sebagai sarana edukasi bagi para penonton dan peserta.</li>
                              <li>Panitia menyiapkan petugas pengukur suhu sebelum memasuki lokasi agar lebih efektif disiapkan beberapa petugas dan menghindari kerumunan.</li>
                              <li>Panitia menyediakan tempat cuci tangan dan sabun yang cukup dan terhindar dari kerumunan peserta dan penonton.</li>
                            </ul>
                          </li>
                          <li>Atlet, Official, Pengunjung dan Perangkat Pertandingan
                            <ul>
                              <li>Seluruh perangkat pertandingan, penonton dan pelatih wajib menggunakan masker selama pertandingan.</li>
                              <li>Peserta wajib membawa hand santizer dan selalu disemprotkan media-media yang biasa disentuh orang lain saat dilokasi pertandingan serta alat kebersihan diri lainnya.</li>
                              <li>Peserta mencabut anak panah secara bergantian agar terhindar dari sentuhan dengan peserta lainnya.</li>
                            </ul>
                          </li>
                        </ol>
                      </div>
                      </div>
                    </div>
                    <div>
                      <h4>PESERTA & OFFICIAL</h4>
                      <div>
                        <ol>
                          <li>Peserta/Pemanah diperkenankan mewakili daerah, klub, komunitas dan ekskul</li>
                          <li>Peserta diperbolehkan mengikuti lebih dari 1 kategori di hari yang berbeda</li>
                          <li>Syarat peserta untuk kategori U-16 sesuai waktu berjalan,
                            <ol type='a'>
                              <li>Untuk U-16 kelahiran tahun 2005</li>
                            </ol>
                          </li>
                          <li>Melampirkan FC/ Scan Akte Kelahiran dan FC/Scan Kartu Keluarga</li>
                          <li>Official Setiap peserta dapat mengirimkan sejumlah officialnya 1 orang.</li>
                        </ol>
                      </div>
                    </div>
                    <div>
                      <h4>PENDAFTARAN</h4>
                      <div>
                      Pendaftaran dan pembayaran peserta melalui link website :<br />
                      <a href="https://bit.ly/TheHuBScoring2021">https://bit.ly/TheHuBScoring2021</a><br />
                      Call Center Panitia : <b>0812 1224 1633</b> (WhatsApp)
                      </div>
                    </div>
                    <div>
                      <h4>BIAYA PENDAFTARAN</h4>
                      <div>Kategori Perorangan	<b>Rp. 249.000, - Nett</b></div>
                    </div>
                    <div>
                      <h4>PAKAIAN PESERTA DAN OFFICIAL</h4>
                      <div>
                        <ol>
                          <li>Selama  skoring berlangsung, di arena panahan, setiap peserta/pemanah dan official diwajibkan memakai pakaian yang sopan dan bersepatu tertutup <b>bukan sepatu sandal.</b></li>
                          <li>
                          Peserta/pemanah dalam satu tim wajib memakai pakaian yang sama/seragam ketika sedang bertanding.
                          </li>
                          <li>
                          Peserta/pemanah dan official tidak dibenarkan memakai celana pendek  dan harus dibawah lutut, dan tidak memakai sandal di arena pertandingan.
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                   
`

export { dummyHtml }