import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useEffect, useState } from "react";

function App() {
  const ffmpeg = createFFmpeg({ log: true });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  async function convertToGif() {
    // escribir el archivo en la memoria
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));
    // ejecutar el comando FFMpeg
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "2.5",
      "-ss",
      "2.0",
      "-f",
      "gif",
      "result.gif"
    );
    // -i = inputFile
    // -t = video time lenght // la duracion del video
    // -ss = start socond
    // -f = encode // export to/as

    // read the result
    const data = ffmpeg.FS("readFile", "result.gif");

    // crear url
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);

    // Blob = raw file = binary acdedible desde el buffer en el objeto data
  }
  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      await ffmpeg.load();
      setReady(true);
    } catch (error) {
      setError(error.toString());
    }
  }
  if (error) {
    return (
      <div>
        <h2>{error}</h2>
      </div>
    );
  }
  return !ready ? (
    <div>
      <h1>Hola mundo</h1>
      <div>
        <input
          type="file"
          onChange={({ target }) => setVideo(target.files.item(0))}
        />
      </div>
      {video && (
        <div>
          <video controls width={250} src={URL.createObjectURL(video)}></video>
          <div>
            <button onClick={convertToGif}>Convert</button>
          </div>
          {gif && <img src={gif} alt="gif" width={250} />}
        </div>
      )}
    </div>
  ) : (
    <div>
      <h2>Cargando...</h2>
    </div>
  );
}

export default App;
