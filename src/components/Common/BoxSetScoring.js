import React, { useState, useCallback } from "react";
import { EventsService } from "services";
import { Row, Col, Card, Button, CardBody } from "reactstrap";

// Functional Component untuk BoxSetScoring
const BoxSetScoring = React.memo((props) => {
  const [error, setError] = useState("");

  // Fungsi untuk menyimpan skor, di-memoize dengan useCallback untuk mencegah penciptaan ulang
  const save = useCallback(async () => {
    setError("");  // Reset error state sebelum mencoba menyimpan data

    // Menyiapkan form data berdasarkan props
    let form = {
      "schedule_id": props.memberScore?.participant?.scheduleId,
      "target_no": props.memberScore?.no_target,
      "type": 1,
    };

    let scors = [];  // Array untuk menyimpan skor yang dikumpulkan dari props
    props.memberScore?.scors?.forEach((s, i) => {
      let ms = [];
      s.forEach((sc) => {
        ms.push(sc.value);  // Mengumpulkan nilai skor
      });
      scors[i] = ms;  // Menambahkan skor yang telah diproses ke array scors
    });
    form.shoot_scores = scors;  // Menyertakan skor ke dalam form data

    try {
      const { data, errors, success, message } = await EventsService.saveScore(form);  // Memanggil service API untuk menyimpan skor
      if (success) {
        if (data) {
          props.setMemberScore({});  // Reset member score setelah berhasil menyimpan
          if (props.callback) {
            props.callback(props.memberScore?.participant?.scheduleId);  // Memanggil callback jika disediakan
          }
        }
      } else {
        setError(message || errors);  // Menampilkan pesan error jika penyimpanan gagal
      }
    } catch (err) {
      setError("An error occurred while saving the score.");  // Menangani error jaringan atau lainnya
    }
  }, [props]);  // Dependensi pada props untuk mencegah perhitungan ulang yang tidak perlu

  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            {/* Menampilkan pesan error jika ada */}
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Tombol untuk menyimpan skor */}
            <Button onClick={save}>Save</Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
});

export default BoxSetScoring;
