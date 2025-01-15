import { useState } from "react";
import PropTypes from "prop-types";

function ListGroup({ items, heading, onSelectItem }) {
  // Hook (tap into built in features of react)
  // useState tells react that the state of the var will change
  var [selectedIndex, setSelectedIndex] = useState(-1);

  // Get message if the items array is empty
  const getMessage = () => {
    return items.length === 0 && <p>No items found</p>;
  };

  //event handle
  const handleClick = (event) => console.log(event);

  return (
    <>
      <h1>{heading}</h1>
      {getMessage()}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

// Define prop types for validation
ListGroup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure items is an array of strings
  heading: PropTypes.string.isRequired, // Ensure heading is a string
  onSelectItem: PropTypes.func.isRequired, // Callback function
};

export default ListGroup;
