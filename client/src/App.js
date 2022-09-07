import { useState, useRef } from 'react';
import './App.css';
import { Header, Footer } from './components';
import download from "downloadjs";

const uploadTypes = ["pdf", "word"];
const convertedTypes = ["word", "pdf", "jpg", "png"];
const baseUrl = "http://localhost:4000";

const App = () => {
  const [uploadType, setUploadType] = useState({ name: "pdf", type: "application/pdf" });
  const [convertedType, setConvertedType] = useState("word");
  const [file, setFile] = useState();
  const [blob, setBlob] = useState();
  const ref = useRef();
  const [converting, setConverting] = useState(0);

  const handleUploadType = (e) => {
    switch (e?.target?.value) {
      case "pdf":
        setUploadType({ name: "pdf", type: "application/pdf" });
        break;
      case "word":
        setUploadType({ name: "word", type: ".doc,.docx,application/msword" });
        break;
    }
  }
  const handleConvertedType = (e) => {
    setConvertedType(e.target.value);
  }
  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  }
  const requestConvert = async () => {
    if (converting === 2) {
      console.log("down..")
      let ext = "";
      switch (convertedType) {
        case "word":
          ext = "docx";
          break;
        case "pdf":
          ext = "pdf";
          break;
      }
      download(blob, `converted.${ext}`);
    } else {
      setConverting(1);
      const data = new FormData();
      data.append("file", file);
      data.append("uploadType", uploadType);
      data.append("convertedType", convertedType);
      const res = await fetch(`${baseUrl}/convert`, { method: "POST", body: data });
      setBlob(await res.blob());
      setConverting(2);
    }
  }
  return (
    <div>
      <Header />
      <div className="body">
        <div className="page-content">
          <div>
            <div className="type-text">Input File Type</div>
            <select
              className="type-select"
              onChange={handleUploadType}
            >
              {uploadTypes.map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input type="file" ref={ref} hidden onChange={handleUpload} accept={uploadType.type} />
            {file ? <div>{file.name}</div> : <button className="upload-btn" onClick={() => ref?.current?.click()}>Upload</button>}
          </div>
          <div>
            <div className="type-text">Select desired type</div>
            <select
              className="type-select"
              onChange={handleConvertedType}
            >
              {convertedTypes.map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <button
            className='upload-btn'
            disabled={convertedType === uploadType.name || converting === 1}
            onClick={requestConvert}
          >
            {converting === 1 ?
              <div className='loadersmall' /> :
              <span>{converting === 0 ? "Convert" : "Download"}</span>
            }
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default App;
