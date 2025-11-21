import { useEffect, useState } from 'react'

interface IFile {
  id: string;
  name: string;
  key: string;
  url: string;
  createdAt: string;
}

function App() {
  const [images, setImages] = useState<IFile[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ name: string; url?: string; text?: string }[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const newPreviews: { name: string; url?: string; text?: string }[] = [];

    for (const file of selectedFiles) {
      // 이미지면 미리보기 URL 생성
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        newPreviews.push({ name: file.name, url });
      }
      // 텍스트 파일이면 내용 읽기
      else if (file.type.startsWith("text/")) {
        const text = await file.text();
        newPreviews.push({ name: file.name, text: text.slice(0, 200) }); // 일부만 표시
      } else {
        newPreviews.push({ name: file.name });
      }
    }

    setPreviews(newPreviews);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return alert("파일이 없습니다.");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Nest multer field name
    });

    const res = await fetch("http://localhost:3000/files", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("업로드 결과:", result);
    alert("업로드 완료!");
  };

  const getAllImages = async () => {
    try {
      const res = await fetch("http://localhost:3000/files", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("서버 응답 오류");
      }

      const data = await res.json();
      console.log("파일 목록", data);

      setImages(data);
    } catch (error) {
      console.error("파일 조회 실패", error)
    }
  };

  useEffect(() => {
    getAllImages();
  }, [])

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>파일 업로드 테스트</h1>

      <div>저장 완료된 이미지들</div>
      <div>
        {
          images.map((img) => (
            <img
              src={img.url}
              alt={img.name}
              style={{ width: "200px", marginTop: "10px", borderRadius: "6px" }}
            />
          ))
        }
      </div>

      <button onClick={uploadFiles}>저장</button>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ marginTop: "20px" }}
      />

      {files.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>업로드된 파일 목록</h2>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
            ))}
          </ul>
        </div>
      )}

      {previews.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>미리보기</h2>

          {previews.map((p) => (
            <div key={p.name} style={{ marginBottom: "20px" }}>
              <strong>{p.name}</strong>

              {p.url && (
                <div>
                  <img
                    src={p.url}
                    alt={p.name}
                    style={{ width: "200px", marginTop: "10px", borderRadius: "6px" }}
                  />
                </div>
              )}

              {p.text && (
                <pre
                  style={{
                    background: "#f4f4f4",
                    padding: "10px",
                    borderRadius: "6px",
                    marginTop: "10px",
                  }}
                >
                  {p.text}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App
