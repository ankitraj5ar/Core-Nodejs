import EventEmitter from "events";

const event = new EventEmitter();

event.on("test", () => {
  console.log("An event occurred 1.");
});
event.on("test", () => {
  console.log("An event occurred 2.");
});
event.on("test", (x) => {
  console.log("An event occurred with parameter: " + x);
});

event.emit("test");
event.emit("test", "hello");
