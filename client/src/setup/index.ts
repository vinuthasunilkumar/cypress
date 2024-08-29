// provides an asynchronous boundary to fix https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption
import("./bootstrap");
declare module '*.jpg';
declare module '*.svg';