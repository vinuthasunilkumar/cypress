import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";

const View = (props: any) => {
  const Container = props.name;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${props.title} | MatrixCare Orderwriter Service`;
    //loads Neo stuff when done rendering view
    document.dispatchEvent(new Event("neoInitEvent"));
    const bodyQuerySelector = document.querySelector("body") as HTMLBodyElement;
    bodyQuerySelector.classList.contains("mxcLoginBody") &&
      bodyQuerySelector.classList.remove("mxcLoginBody");
  }, [props.title]);

  return (
    <>
      <Header />
      <Container title={props.title} />
      <Footer />
    </>
  );
};

export default View;
