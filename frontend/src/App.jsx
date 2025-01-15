import ListGroup from "./components/ListGroup";
import Alert from "./components/Alert";
import Button from "./components/Button";
import { useState } from "react";

function App() {
  var items = ["New York", "Tokyo", "London", "Rochester", "Brussels"];

  var handleSelectItem = (item) => {
    console.log(item);
  };

  const [alertVisible, setAlertVisibility] = useState(false);

  return (
    <>
      {/* <div>
        <ListGroup
          items={items}
          heading="Cities"
          onSelectItem={handleSelectItem}
        />
      </div> */}
      <div>
        {alertVisible && (
          <Alert onClose={() => setAlertVisibility(false)}>
            <strong>Big Alert!</strong> You should press the X
          </Alert>
        )}
        <Button
          text="Click Me"
          onClick={() => setAlertVisibility(true)}
        ></Button>
      </div>
    </>
  );
}

export default App;
