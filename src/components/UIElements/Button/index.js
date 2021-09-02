import React from "react";

const Button = ({
  label,
  onClick,
  type = "primary",
  icon,
  iconType = "bx",
  trailingIcon,
  trailingIconType = "bx",
  size = "normal",
  outline = false,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      className={`btn btn${outline ? "-outline-" : "-"}${type} btn-${size}`}
      onClick={() => {
        handleClick();
      }}
    >
      {icon && (
        <i
          className={`${iconType} ${iconType}-${icon} font-size-16 align-middle`}
        ></i>
      )}
      {label ? " " + label : ""}
      {trailingIcon && (
        <i
          className={`${trailingIconType} ${trailingIconType}-${trailingIcon} font-size-16 align-middle`}
        ></i>
      )}
    </button>
  );
};

export default Button;
