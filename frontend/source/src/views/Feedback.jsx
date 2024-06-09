import React, { useState } from "react";
import Kanban from "../components/kanban/Kanban";
import Wrapper from "./Wrapper";
import Header from "../components/Header";

const Feedback = () => {
  const [filterValue, setFilterValue] = useState("");
  const [forceUserUpdate, setForceUserUpdate] = useState(0);

  const service = window.location.host.split(".")[0];

  return (
    <Wrapper>
      <Header page="feedback" setForceUpdate={setForceUserUpdate} />
      <Kanban
        title="Feedback"
        service={service}
        kind="rfe"
        filter={filterValue}
        forceUserUpdate={forceUserUpdate}
      />
    </Wrapper>
  );
};

export default Feedback;
