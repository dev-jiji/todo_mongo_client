import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loading = () => {
  // 로딩창 관련
  const loadingCss = {
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
  };

  return (
    <div style={loadingCss}>
      {/* 부트스트랩의 스피너 */}
      <Spinner animation="border" variant="info" />
    </div>
  );
};

export default Loading;
