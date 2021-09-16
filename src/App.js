import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import FilesUpload from "./components/FilesUpload";

function App() {
  return (
    <div>
      <div className="container">
        <div className="my-3">
          <h3>jagokode.com</h3>
          <h4>Multipe Image Upload</h4>
        </div>
        <FilesUpload />
      </div>
    </div>
  );
}

export default App;
