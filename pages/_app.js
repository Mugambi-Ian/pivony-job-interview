import "../css/_list.css";

import React from "react";
import Splash from "../components/splash";
import Head from "next/head";

export default function Application({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Pivony Job Interview</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PivonyJobInterview
        child={(props) => <Component {... pageProps} {...props} />}
      />
    </>
  );
}

class PivonyJobInterview extends React.Component {
  state = {
    splashShown: false,
  };

  render() {
    return (
      <>
        {this.state.splashShown === true ? (
          <this.props.child />
        ) : (
          <main id="splash">
            <Splash
              isShown={() => {
                this.setState({ splashShown: true });
              }}
            />
          </main>
        )}
      </>
    );
  }
}
