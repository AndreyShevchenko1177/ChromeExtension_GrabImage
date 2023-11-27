const grabBtn = document.getElementById("grabBtn");


grabBtn.addEventListener("click", () => {

    chrome.tabs.query({ active: true }, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            const injectSpec = {
                target: { tabId: tab.id, allFrames: true },
                func: grabImages,
            };
            chrome.scripting.executeScript(injectSpec, onResult);
        } else {
            alert("There are no active tabs");
        }
    });
});

function grabImages () {
    const images = document.querySelectorAll("img");
    return Array.from(images).map((image) => image.src);  
}

function onResult (frames)  {
    if (!frames || !frames.length) {
        alert("Could not retrieve images from specified page");
        return;
    }
    const imageUrls = frames
        .map((frame) => frame.result)
        .reduce((r1, r2) => r1.concat(r2));

    openImagesPage(imageUrls);
}

function openImagesPage(urls) {
    chrome.tabs.create({ url: "page.html", active: false}, (tab) => {
        setTimeout(()=>{
            chrome.tabs.sendMessage(tab.id, urls, (resp) => {
                // alert(resp);
            chrome.tabs.update(tab.id, { active: true });
        })
        }, 500)
        ;
    });
}
