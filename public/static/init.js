export const initGo = () => {
  const go = new window["Go"]();
  window.WebAssembly.instantiateStreaming(
    fetch("./json.wasm", {
      headers: {
        "Content-Type": "application/wasm",
      },
    }),
    go.importObject
  ).then((result) => {
    go.run(result.instance);
  });
};
