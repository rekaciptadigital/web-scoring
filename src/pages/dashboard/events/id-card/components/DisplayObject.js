import * as React from "react";
import eye from "../../../../../assets/images/eye.png"
import eyeSlash from "../../../../../assets/images/eye-slash.png"

export default function DisplayObject({ onChange, none = false }) {
  return (
    <>
    <div
      style={{
        padding: 5,
        width: 42,
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 0 0 1px rgb(204, 204, 204)",
        cursor: "pointer",
        textAlign: "center",
      }}
      onClick={() => onChange?.()}
      >
      {/* <h5
        >
        V
      </h5> */}
      {none ? (

        <img
        style={{
          margin: 0,
        }}
        src={eyeSlash} 
        />
        ) : 
          <img
          style={{
            margin: 0,
          }}
          src={eye} 
          />
        }
      <div />
    </div>
    </>
  );
}
