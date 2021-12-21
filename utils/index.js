export const isBrowser = typeof window === "object";

export function writeFileToStorage(file) {
  const ls = require("local-storage");
  const data = ls.get("files") || JSON.stringify([]);
  const _data = JSON.parse(data);
  _data.push(file);
  ls.set("files", JSON.stringify(_data));
}

export function syncFileStorage(files) {
  const ls = require("local-storage");
  ls.set("files", JSON.stringify(files));
}
export function readFileStorage() {
  const ls = require("local-storage");
  const data = ls.get("files") || JSON.stringify([]);
  return JSON.parse(data);
}
