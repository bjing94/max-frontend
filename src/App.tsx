import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { service, UpscaleStatus } from "./service";

function App() {
  const [status, setStatus] = useState<UpscaleStatus | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [statusInterval, setStatusInterval] = useState<NodeJS.Timer>();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(null);
      setFileName(null);
    }
  };
  const checkStatus = () => {
    if (!fileName) return;

    service
      .checkStatus(fileName)
      .then((res) => {
        setStatus(res);
        return;
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const handleUpscale = () => {
    if (!file) return;

    service
      .upscale(file)
      .then((res) => {
        setFileName(res);
        return;
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await checkStatus();
    }, 2000);
    setStatusInterval(interval);
  }, [fileName]);

  useEffect(() => {
    if (status === "ready") {
      clearInterval(statusInterval);
    }
  }, [status]);

  return (
    <div className="main-app">
      <Container maxWidth="sm" style={{ paddingTop: 150 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {status === "in work" && <CircularProgress />}
          {status === "ready" && (
            <a
              href={`${process.env.REACT_APP_SERVER_URL}/upscale/download?name=${fileName}`}
            >{`Download ${fileName}`}</a>
          )}
          {status === "not found" && <Typography>File not found!</Typography>}
          <label htmlFor="file-upload" className="custom-file-upload">
            {file ? file.name : "Select file"}
          </label>
          <input id="file-upload" type="file" onChange={handleFileSelected} />
          {status === null && (
            <Button variant="contained" onClick={handleUpscale}>
              Upscale!
            </Button>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default App;
