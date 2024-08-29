import React from "react";

const Home = (props: any) => {
  return (
    <div className="container">
      <div className="row">
        <main className="col-12 py-3">
          <h1>{props.title}</h1>
        </main>
      </div>
    </div>
  );
};

export default Home;
