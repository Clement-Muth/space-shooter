if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/dist/sw.js")
    .then((registration) => {
      process.env.NODE_ENV === "development" &&
        console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      process.env.NODE_ENV === "development" &&
        console.error("Service Worker registration failed:", error);
    });
}
