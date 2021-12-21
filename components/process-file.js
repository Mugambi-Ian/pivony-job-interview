import Router from "next/router";
import React from "react";
import { Progress } from "reactstrap";
import * as XLSX from "xlsx";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { writeFileToStorage } from "../utils";

export default class ProcessFile extends React.Component {
  state = {
    progress: 0,
    step: 1,
    file: {
      filename: this.props.file.selectedFile.name,
      content: "",
      extension:
        this.props.file.extension === "application/vnd.ms-excel"
          ? "xls"
          : this.props.file.extension ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "csv",
      header: [],
    },
    contentParsed: false,
  };

  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  componentDidMount() {
    this.parseFile();
    this.renderProgress();
  }

  parseFile() {
    const { selectedFile } = this.props.file;
    const reader = new FileReader();
    if (this.props.isCSV) {
      reader.onload = (e) => {
        const data = e.target.result;
        const header = data.split("\n")[0].split(",");
        this.setState({
          file: {
            ...this.state.file,
            content: data,
            header,
          },
          contentParsed: true,
        });
      };
      reader.readAsText(selectedFile);
    } else {
      reader.onload = (e) => {
        const ab = e.target.result;
        const wb = XLSX.read(ab, { type: "array" });
        const data = [];
        for (let i = 0; i < wb.SheetNames.length; i++) {
          const wsname = wb.SheetNames[i];
          const ws = wb.Sheets[wsname];
          const sheet = XLSX.utils.sheet_to_json(ws, { header: 1 });
          data.push(sheet);
        }
        let header = [];
        if (data.length !== 0) {
          header = data[0][0];
          header = header.slice(1);
        }
        this.setState({
          file: {
            ...this.state.file,
            content: JSON.stringify(data),
            header,
          },
          contentParsed: true,
        });
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }

  renderProgress() {
    this.function = function () {
      let { progress } = this.state;
      if (progress >= 100) {
        clearInterval(this.interval);
      } else {
        progress = this.getRandomNumberBetween(
          progress + 1,
          progress / 3 - progress / (progress + 4)
        );
        this.setState({ progress: progress > 100 ? 100 : progress * 2 });
      }
    };
    const run = this.function.bind(this);
    this.interval = setInterval(run, 300);
  }
  render() {
    const { progress, contentParsed, file, step } = this.state;
    return progress <= 100 || !contentParsed ? (
      <>
        <Progress
          max="100"
          value={`${progress}`}
          color="success"
          animated={true}
        ></Progress>
        <p>Processing Document</p>
      </>
    ) : (
      <>
        <header>
          <h2>{file.filename}</h2>
        </header>
        <section>
          {step === 1
            ? this.step_1()
            : step === 2
            ? this.step_2()
            : step === 3
            ? this.step_3()
            : step === 4
            ? this.step_4()
            : this.step_5()}
        </section>
      </>
    );
  }

  step_1 = () => {
    return (
      <>
        <button
          id="btn"
          onClick={async () => {
            await setTimeout(() => {
              Router.push("/");
            }, 300);
          }}
        >
          <img width="70px" height="70px" src="/img/ic-delete.png" />
          <label>Delete File</label>
        </button>
        <button
          id="btn"
          onClick={async (e) => {
            await setTimeout(() => {
              this.setState({ step: 2 });
            }, 300);
          }}
        >
          <img width="70px" height="70px" src="/img/ic-spreadsheet.png" />
          <label>Select Columns</label>
        </button>
      </>
    );
  };
  step_2 = () => {
    const { containsHeaders } = this.state;
    return (
      <div>
        <p>Does the file contain headers?</p>
        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={containsHeaders !== undefined ? containsHeaders : false}
              onChange={async () =>
                await setTimeout(() => {
                  this.setState({ step: 3, containsHeaders: true });
                }, 500)
              }
            />
            Yes
          </label>
          <label>
            <input
              type="checkbox"
              checked={containsHeaders !== undefined ? !containsHeaders : false}
              onChange={async () =>
                await setTimeout(() => {
                  this.setState({ step: 6, containsHeaders: false });
                }, 500)
              }
            />
            No
          </label>
        </div>
      </div>
    );
  };
  step_3 = () => {
    const { header } = this.state.file;
    console.log(header);
    return (
      <div className="step_3">
        <p>Choose the column name that contains text </p>
        <Autocomplete
          value={this.state.text_headers || []}
          onChange={(event, newValue) => {
            this.setState({ text_headers: newValue });
          }}
          multiple
          id="tags-standard"
          options={header}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label={"Column Name"} />
          )}
        />
        <button
          id="next"
          onClick={async (e) => {
            if (this.state.text_headers && this.state.text_headers.length !== 0)
              await setTimeout(() => {
                this.setState({ step: 4 });
              }, 300);
            else alert("Input Required");
          }}
        >
          Proceed{">"}
        </button>
      </div>
    );
  };

  #date_list() {
    const { header } = this.state.file;
    const { text_headers = [] } = this.state;
    const result = [...header];
    text_headers.forEach((e) => {
      result.splice(result.indexOf(e), 1);
    });
    return result;
  }
  step_4 = () => {
    return (
      <div className="step_4">
        <p>Choose the column name that contains date(optional)</p>
        <Autocomplete
          value={this.state.date_headers || []}
          onChange={(event, newValue) => {
            this.setState({ date_headers: newValue });
          }}
          multiple
          id="tags-standard"
          options={this.#date_list()}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label={"Column Name"} />
          )}
        />
        <button
          id="next"
          onClick={async (e) => {
            await setTimeout(() => {
              this.setState({ step: 5 });
            }, 300);
          }}
        >
          Proceed{">"}
        </button>
      </div>
    );
  };
  step_5 = () => {
    return (
      <div className="step_3">
        <p>All Is Done!</p>
        <button
          id="next"
          onClick={async () => {
            await setTimeout(() => {
              const { content, extension, filename } = this.state.file;
              writeFileToStorage({ content, extension, filename });
              Router.push("/files");
            }, 200);
          }}
        >
          Submit
        </button>
      </div>
    );
  };
}
