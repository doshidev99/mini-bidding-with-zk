const go = new Go();
WebAssembly.instantiateStreaming(fetch("/static/json.wasm"), go.importObject).then((result) => {
    go.run(result.instance);
});
