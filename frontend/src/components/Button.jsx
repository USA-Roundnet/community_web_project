import PropTypes from "prop-types";

const Button = ({ color = "primary", text, onClick }) => {
  return (
    <div>
      <button className={"btn btn-" + color} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

// Define acceptable color values using PropTypes
Button.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ]), // Restrict to these values
  text: PropTypes.string.isRequired, // Ensure text is provided
  onClick: PropTypes.func.isRequired, // Ensure onClick is a function
};

export default Button;
