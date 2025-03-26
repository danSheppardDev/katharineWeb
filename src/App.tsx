import React from "react";
import { Layout } from "./components/Layout";
import "bulma/css/bulma.min.css"

export function App() {
  return (
    <div id={"main"} className={"container"}>
      <div className={"section"}>
        <h1 className={"title has-text-centered"}>Katharine's Fundraising Site</h1>
        <Layout />
      </div>
    </div>
  );
}
