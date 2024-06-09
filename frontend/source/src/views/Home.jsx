import React from "react";
import Header from "../components/Header";
import Warehouse from "./apps/Warehouse";

const apps = {
  warehouse: Warehouse,
};

const Home = ({app}) => {

  if (!app) app = window.location.host.split(".")[0];

  if (apps[app]) {
    const Comp = apps[app];
    return <Comp />;
  }

  return <div>
    <Header />
    <p>You reached app {app} but it is not recognised.</p>
  </div>;
};

export default Home;
