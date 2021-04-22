const latestVersion = "2.0.0"

function getOS() {
    let userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os;

    if(macosPlatforms.indexOf(platform) !== -1) {
        os = 'MacOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'other';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'other';
    } else if (/Linux/.test(platform)) {
        os = 'Linux';
    } else {
        os = 'other';
    }
    return os;
}

async function httpGet(url) {
    return await new Promise((resolve => {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                resolve(xmlHttp.responseText);
            else if(xmlHttp.readyState === 4 && xmlHttp.status != null) {
                resolve(null);
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }))
}

function getAssetNames() {

}

function getAssetDownload(os, release) {
    const version = release.tag_name.substring(1)
    let assetName;
    switch (os) {
        case "Windows":
            assetName = "YouTube-Downloader-GUI-Setup-" + version + ".exe"
            break
        case "MacOS":
            assetName = "YouTube-Downloader-GUI-" + version + ".dmg"
            break
        case "Linux":
            assetName = "YouTube-Downloader-GUI-" + version + ".AppImage"
    }

    for(const asset of release.assets) {
        if(assetName === asset.name) {
            return asset.browser_download_url
        }
    }
}

async function setDownloadButton() {
    const os = getOS();
    if (os !== "other") {
        const versionData = await httpGet("https://api.github.com/repos/jely2002/youtube-dl-gui/releases/latest");
        if(versionData == null) {
            document.getElementById("download-type").innerHTML = "For " + os;
            document.getElementById("download-button").addEventListener('click', () => {
                 window.location.href = 'https://github.com/jely2002/youtube-dl-gui/releases/latest'
            })
        } else {
            const release = JSON.parse(versionData)
            document.getElementById("download-type").innerHTML = release.tag_name + " - " + os;
            document.getElementById("download-button").addEventListener('click', () => {
                window.location = getAssetDownload(os, release)
            })
        }
    }
}

(function() {
    setDownloadButton().then(() => console.log("Download button configured"));
}());

