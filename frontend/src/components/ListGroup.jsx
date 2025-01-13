function ListGroup() {
  var items = ["New York", "Tokyo", "London", "Rochester", "Paris"];

  const getMessage = () => {
    return items.length === 0 && <p>No items found</p>;
  };
  //event handle
  const handleClick = (event) => console.log(event);

  return (
    <>
      <h1>List</h1>
      {getMessage()}
      <ul className="list-group">
        {items.map((item, index) => (
          <li className="list-group-item" key={item} onClick={handleClick}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
