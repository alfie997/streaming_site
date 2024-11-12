const channelButton = document.querySelector(".channel-button");
const iframe = document.querySelector("iframe");

console.log(iframe);
console.log(iframe.src);

channelButton.addEventListener("click", (e) => {
    if (iframe.src === "http://localhost:5500/channel_two_main/channel-two.html") {
        // iframe.contentWindow.history.replaceState("sub", "", "channel_two_sub/channel-two.html");
        iframe.src = "channel_two_sub/channel-two.html";
        channelButton.textContent = "SUB CHANNEL";
    } else {
        // iframe.contentWindow.history.replaceState("main", "", "channel_two_main/channel-two.html");
        iframe.src = "channel_two_main/channel-two.html";
        channelButton.textContent = "MAIN CHANNEL";
    }
});