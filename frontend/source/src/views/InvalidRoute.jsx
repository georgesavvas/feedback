import React from "react";
import {useParams} from "react-router-dom";

const InvalidRoute = () => {
  const params = useParams();
  console.log(params);

  return (
    <div>
      Invalid Route
      <br/>
      <a href="/warehouse">
        Warehouse
      </a>
      <br/>
      <a href="/hub">
        Hub
      </a>
      <br/>
      <a href="/review">
        Review
      </a>
    </div>
  );
};

export default InvalidRoute;
