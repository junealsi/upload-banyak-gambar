import api from "../api";

const uploadImage = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return api.post("/upload", formData, {
    headers: { "Content-Type": "application/json" },
    onUploadProgress,
  });
};

const downloadImage = () => {
  return api.get("/files");
};

const FileService = {
  uploadImage,
  downloadImage,
};

export default FileService;
