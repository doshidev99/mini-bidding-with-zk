// function helloworld() {
//   console.log("hello world!");
// }

// self.addEventListener("install", function (event) {
//   console.log("Hello world from the Service Worker 🤙");
// });

// // onmessage = function (e) {
// // console.log(window, "window");

// // if (isNaN(result)) {
// //   postMessage("Please write two numbers");
// // } else {
// //   const workerResult = "Result: " + result;
// //   console.log("Worker: Posting message back to main script");
// //   postMessage(workerResult);
// // }
// // };

// self.addEventListener("message", function (event) {
//   const { type, functionString } = event.data;
//   if (type === "function") {
//     const receivedFunction = new Function("", functionString);
//     receivedFunction();
//   }
// });

onmessage = async function (e) {
  // const rustModule = await require("/public/static/main.wasm");
  // console.log(rustModule.isInitialized);
};
