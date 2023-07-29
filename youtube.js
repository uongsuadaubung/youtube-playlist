// ==UserScript==
// @name         YouTube Previous Video
// @namespace    http://usdb.dev/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none

// ==/UserScript==

(function () {
  'use strict';
  const data = {
    previousVideo: {},
    asked: {},
    previousName: {}
  };
  const saveData = (name, key, value) => {

    if (name === 'previousVideo') {
      Object.assign(data.previousVideo, {[key]: value})
    } else {
      data.asked = value ? {...data.asked, [key]: value} : {};
    }
    saveVideoName();
    localStorage.setItem('appData', JSON.stringify(data));
  };

  const getData = () => {
    const appData = JSON.parse(localStorage.getItem("appData"))
    if (appData) Object.assign(data, appData);
  };
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("v");
    const list = params.get("list");
    return {v, list};
  }
  const saveVideoName = () => {
    setTimeout(() => {
      const {list} = getUrlParams();
      data.previousName = {
        ...(data.previousName || {}),
        [list]: document.querySelector("#title > h1 > yt-formatted-string").innerText
      };
      localStorage.setItem('appData', JSON.stringify(data));
    }, 3000);

  }
  const handleUrlChange = () => {
    const params = getUrlParams();
    const currentVideo = params.v;
    const currentList = params.list;
    if (!currentList || !currentVideo) {
      saveData("askedVideo", false, false)
    }
    // nếu có rồi thì
    // kiểm tra xem cái v có khác cái video trước không
    const preVideo = data.previousVideo[currentList];

    if (preVideo && preVideo !== currentVideo) {
      if (!(currentList in data.asked)) {
        saveData("askedVideo", currentList, true)
        const preName = data.previousName[currentList];
        if (confirm("Quay lại video đã xem lần trước?\n" + preName)) {
          window.location.href = "https://www.youtube.com/watch?v=" + preVideo + "&list=" + currentList;
        }
      }
    }

    currentVideo && currentList && saveData("previousVideo", currentList, currentVideo)
  }
  getData();
  // sự kiện sau khi chuyển hướng xong sẽ nhảy vào cái này;
  window.addEventListener("yt-navigate-finish", () => {
    handleUrlChange();
  });

})();