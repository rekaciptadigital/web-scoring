import React, { useCallback } from "react";

// Functional Component untuk Button
const Button = React.memo(({
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
  // Menggunakan useCallback untuk memoization fungsi handleClick
  const handleClick = useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  return (
    <button
      type="button"
      className={`btn btn${outline ? "-outline-" : "-"}${type} btn-${size}`}
      onClick={handleClick}  // Langsung menggunakan handleClick yang di-memoize
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
});

export default Button;
