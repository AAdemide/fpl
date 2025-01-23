import React from "react";

function Loading() {
  return (
    <div id="loading-div">
      {/* <img src="loading.gif" alt="" /> */}

      <div id="loading-gif">
        <iframe src="https://lottie.host/embed/f8b3ac3b-065b-4db8-82cb-4ef1c034ef9d/iFE8nYs0sj.json" id="ball"></iframe>
        <div id="ball-shadow"></div>
      </div>
    </div>
  );
}

export default Loading;
