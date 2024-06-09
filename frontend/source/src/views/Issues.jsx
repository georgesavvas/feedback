import React, { useState } from "react";
import Kanban from "../components/kanban/Kanban";
import Wrapper from "./Wrapper";
import Header from "../components/Header";

const Issues = () => {
  const [filterValue, setFilterValue] = useState("");
  const [forceUserUpdate, setForceUserUpdate] = useState(0);

  const app = window.location.host.split(".")[0];

  return (
    <Wrapper>
      <Header page="issues" setForceUpdate={setForceUserUpdate} />
      <Kanban
        title="Issues"
        service={app}
        kind="issues"
        filter={filterValue}
        forceUserUpdate={forceUserUpdate}
      />
    </Wrapper>
  );
};

export default Issues;
