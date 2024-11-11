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
  border: 'none',  // Add this for button styling
};

const textStyle = {
  margin: 0,
  fontWeight: 700,
};

export default function ColorPickerContainer({ children, color = '#495057' }) {
  const [isShowPicker, setShowPicker] = React.useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setShowPicker((show) => !show);
    }
  };

  return (
    <React.Fragment>
      <button
        style={colorPickerStyle}
        onClick={() => setShowPicker((show) => !show)}
        onKeyDown={handleKeyDown}
      >
        <h5 style={{ ...textStyle, color: color }}>
          A
        </h5>
        <div />
      </button>

      {isShowPicker && (
        <div style={{ position: 'absolute' }}>
          <button
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
              border: 'none',
              background: 'transparent',
            }}
            onClick={() => setShowPicker(false)}
            onKeyDown={(e) => e.key === 'Enter' && setShowPicker(false)}
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
