import Head from "next/head";
import AppContent from "pangwarta-shared/dist/lib/layout/AppContent";
import withMUI from "pangwarta-shared/dist/lib/layout/withMUI";
import * as React from "react";
import Main from "../src/components/pages/main/Main";

const Index = () => (
  <>
    <Head>
      <title>Taxi Sharing</title>
      <meta name="description" content="Fair shares for taxi fares" />
    </Head>
    <AppContent>
      <Main />
    </AppContent>
  </>
);

export default withMUI()(Index);
