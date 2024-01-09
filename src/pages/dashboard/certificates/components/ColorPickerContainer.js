import * as React from 'react';
import PropTypes from 'prop-types';

const colorPickerStyle = {
  padding: 5,
  width: 42,
  background: '#fff',
  borderRadius: 4,
  boxShadow: '0 0 0 1px rgb(204, 204, 204)',
  display: 'inline-block',
  cursor: 'pointer',
  textAlign: 'center',
};

const textStyle = {
  margin: 0,
  fontWeight: 700,
};

export default function ColorPickerContainer({ children, color = '#495057' }) {
  const [isShowPicker, setShowPicker] = React.useState(false);

  return (
    <React.Fragment>
      <div
        style={colorPickerStyle}
        onClick={() => setShowPicker((show) => !show)}
      >
        <h5 style={{ ...textStyle, color: color }}>
          A
        </h5>
        <div />
      </div>

      {isShowPicker && (
        <div style={{ position: 'absolute' }}>
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={() => setShowPicker(false)}
          />
          {children}
        </div>
      )}
    </React.Fragment>
  );
}

ColorPickerContainer.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};
