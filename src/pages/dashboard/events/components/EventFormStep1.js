import React, { useState } from "react";
import { selectConstants } from "constants/index";

import { Col, Row } from "reactstrap";
import {
  // FileUpload,
  ImageUpload,
  RadioButtonInput,
  TextEditor,
  TextInput,
} from "components";

export const EventFormStep1 = ({ onFormFieldChange, formData }) => {
  const [base64URL, setBase64URL] = useState("");
  // const [imgTo64, setImgTo64] = useState("")
  const [file, setFile] = useState(null);

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  const handlerFileInputChange = (e) => {
    let go = e.target.files[0];
    getBase64(e.target.files[0])
      .then((result) => {
        go["base64"] = result;
        setFile(go);
        console.log(file);
        setBase64URL(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) {
      if (key === "poster") {
        onFormFieldChange(key, base64URL?.base64);
      }
      onFormFieldChange(key, value);
    }
  };

  return (
    <Row>
      <Col lg={3}>
        <Row>
          <Col lg={12}>
            <ImageUpload
              label="Upload Poster"
              name="poster"
              onChange={handleChange}
              thumbnail
              base64={handlerFileInputChange}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col lg={12}>
            <FileUpload
              label="Upload Handbook"
              name="handbook"
              onChange={handleChange}
            />
          </Col>
        </Row> */}
      </Col>
      <Col lg={9}>
        <Row>
          <Col lg={12}>
            <TextInput
              label="Nama Event"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            />
          </Col>
          <Col lg={6}>
            <TextInput
              label="Lokasi"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Nama GOR/Lapangan"
            />
          </Col>
          <Col lg={6}>
            <TextInput
              label="Kota"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Col>
          <Col lg={6}>
            <div className="d-flex h-100 align-items-center">
              <RadioButtonInput
                name="locationType"
                onChange={handleChange}
                options={selectConstants.eventLocationType}
                value={formData.locationType}
                valueOnly
              />
            </div>
          </Col>
          <Col lg={6}>
            <TextInput
              label="PIC/Call Center"
              name="picCallCenter"
              value={formData.picCallCenter}
              onChange={handleChange}
              placeholder="Contoh: Brady Ellison (085xxxxxxxxx)"
            />
          </Col>
          <Col lg={12}>
            <TextEditor
              label="Deskripsi Tambahan"
              onChange={handleChange}
              name="description"
              value={formData.description}
              placeholder="Hadiah kompetisi, Flow lomba, peraturan, informasi tambahan mengenai lomba..."
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
