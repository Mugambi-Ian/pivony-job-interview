import React from "react";
import { FileDrop } from "react-file-drop";
import ProcessFile from "../components/process-file";

export default class Upload extends React.Component {
  state = {
    selectedFile: null,
    drop: undefined,
  };

  async #validateFile(extension, file) {
    if (
      extension === "application/vnd.ms-excel" ||
      extension ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      extension === "text/csv"
    ) {
      this.setState({
        extension,
        selectedFile: file,
        isCSV: extension === "text/csv",
      });
      await setTimeout(() => {
        this.setState({ removeSelect: true });
      }, 500);
    } else alert("Unsupported Type");
  }
  render() {
    const { selectedFile, extension, removeSelect, isCSV } = this.state;
    return (
      <main className="ui-page">
        <header>
          <h1 style={selectedFile ? { display: "none" } : {}}>Upload File</h1>
          <p>
            {!selectedFile
              ? "Select a file from your computer or drop on the box bellow"
              : ""}
          </p>
        </header>
        <section id={!selectedFile ? "select-file" : "upload"}>
          {!removeSelect ? (
            <FileDrop
              onDrop={async (selectedFile) => {
                const files = selectedFile.item(0);
                const extension = files.type.toLowerCase();
                await this.#validateFile(extension, selectedFile.item(0));
              }}
            >
              <input
                onChange={async (e) => {
                  const files = e.target.files;
                  const extension = files[0].type.toLowerCase();
                  await this.#validateFile(extension, e.target.files[0]);
                }}
                type="file"
              />
            </FileDrop>
          ) : (
            <ProcessFile file={{ selectedFile, extension }} isCSV={isCSV} />
          )}
        </section>
      </main>
    );
  }
}
