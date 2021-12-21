import Link from "next/link";
import Router from "next/router";
import React from "react";

export default class Home extends React.Component {

  render() {
    return (
      <main className="ui-page">
        <header>
          <h1>Lets get started</h1>
          <p>Select an option below</p>
        </header>
        <section >
          <Link href="/upload">
            <a
              onClick={async (e) => {
                e.preventDefault();
                await setTimeout(() => {
                  Router.push("/upload");
                }, 300);
              }}
            >
              <img width="100px" height="100px" src="/img/ic-upload.png" />
              <label>Upload Csv</label>
            </a>
          </Link>
          <Link href="/files">
            <a
              onClick={async (e) => {
                e.preventDefault();
                await setTimeout(() => {
                  Router.push("/files");
                }, 300);
              }}
            >
              <img width="100px" height="100px" src="/img/ic-files.png" />
              <label>My Files</label>
            </a>
          </Link>
        </section>
      </main>
    );
  }
}
