import Link from "next/link";
import Router from "next/router";
import React from "react";
import { readFileStorage, syncFileStorage } from "../../utils";

export default class Files extends React.Component {
  state = {
    files: readFileStorage(),
  };
  render() {
    const { files } = this.state;
    return (
      <div className="files-page">
        <div style={{ display: "flex", margin: "10px" }}>
          <Link href="/">
            <a
              onClick={async (e) => {
                e.preventDefault();
                await setTimeout(() => {
                  Router.push("/");
                }, 200);
              }}
            >
              🏡
            </a>
          </Link>
          <div style={{ flex: 1 }} />
          <h1>Saved Documents</h1>
        </div>
        <div className="files-list">
          {files.map((_file, index) => {
            return (
              <div key={index} className="list-item">
                <img
                  src={`/img/ic-${_file.extension}.png`}
                  height="120px"
                  width="120px"
                />
                <h5>{_file.filename}</h5>
                <div style={{ display: "flex" }}>
                  <button
                    onClick={async () =>
                      await setTimeout(() => {
                        files.splice(index, 1);
                        syncFileStorage(files);
                        this.setState({ files: files });
                      }, 200)
                    }
                  >
                    Delete
                  </button>
                  <button>Open</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
