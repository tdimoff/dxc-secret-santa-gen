import "./App.css";
import Snowfall from "react-snowfall";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";

const App = () => (
  <div className="bg-black absolute inset-0">
    <Header />
    <FileUpload />
    <Snowfall />
  </div>
);

export default App;
