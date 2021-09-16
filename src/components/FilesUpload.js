import { useEffect, useRef, useState } from "react";
import FileService from "../service/uploadService";

const FilesUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [progressInfos, setProgressInfos] = useState({ val: [] });
  const [message, setMessage] = useState([]);
  const [fileInfos, setFileInfos] = useState([]);
  const progressInfosRef = useRef(null);

  const selectImages = (e) => {
    setSelectedFiles(e.target.files);
    setProgressInfos({ val: [] });
  };

  const upload = (idx, file) => {
    let _progressInfos = [...progressInfosRef.current.val];
    return FileService.uploadImage(file, (e) => {
      _progressInfos[idx].percentage = Math.round((100 * e.loaded) / e.total);
      setProgressInfos({ val: _progressInfos });
    })
      .then(() => {
        setMessage((prevMessage) => [
          ...prevMessage,
          "Uploaded image successfully: " + file.name,
        ]);
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        setProgressInfos({ val: _progressInfos });
        setMessage((prevMessage) => [
          ...prevMessage,
          "Could not upload the image: " + file.name,
        ]);
      });
  };

  const uploadImages = () => {
    const files = Array.from(selectedFiles);

    let _progressInfos = files.map((file) => ({
      percentage: 0,
      fileName: file.name,
    }));

    progressInfosRef.current = { val: _progressInfos };

    const uploadPromises = files.map((file, i) => upload(i, file));

    Promise.all(uploadPromises)
      .then(() => FileService.downloadImage())
      .then((files) => setFileInfos(files.data));

    setMessage([]);
  };

  useEffect(() => {
    FileService.downloadImage().then((response) => setFileInfos(response.data));
  }, []);

  return (
    <div>
      {progressInfos &&
        progressInfos.val.length > 0 &&
        progressInfos.val.map((progressInfo, index) => (
          <div className="mb-2" key={index}>
            <div className="progress">
              <div
                className="progress-bar progress-bar-info"
                role="progressbar"
                aria-valuenow={progressInfo.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progressInfo.percentage + "%" }}
              >
                {progressInfo.percentage}%
              </div>
            </div>
          </div>
        ))}
      <div className="row my-3">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" multiple onChange={selectImages} />
          </label>
        </div>
        <div className="col-4">
          <button
            className="btn btn-success btn-sm"
            disabled={!selectedFiles}
            onClick={uploadImages}
          >
            Upload
          </button>
        </div>
      </div>
      {message.length > 0 && (
        <div className="alert alert-secondary" role="alert">
          <ul>
            {message.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        </div>
      )}
      <div className="card">
        <div className="card-header">List of Images</div>
        <ul className="list-group list-group-flush">
          {fileInfos &&
            fileInfos.map((info, index) => (
              <li className="list-group-item" key={index}>
                <a href={info.url}>{info.name}</a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default FilesUpload;
