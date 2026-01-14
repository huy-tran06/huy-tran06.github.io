const channelsContainer = document.getElementById("channels");

async function fetchChannels() {
  try {
    const response = await fetch(
      "https://api.sr.se/api/v2/channels?format=json"
    );

    const data = await response.json();
    const channels = data.channels;

    channelsContainer.innerHTML = "";

    channels.forEach(channel => {
      const div = document.createElement("div");
      div.className = "channel";
      div.textContent = channel.name;

      channelsContainer.appendChild(div);
    });
  } catch (error) {
    channelsContainer.textContent = "Failed to load channels 😢";
    console.error(error);
  }
}

fetchChannels();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("service-worker.js")
        .then(() => console.log("Service worker registered"))
        .catch(err => console.error("Service Worker error", err));
}
