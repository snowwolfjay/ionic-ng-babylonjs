window.BY_CONFIGURATION = {
  meteor: {
    ROOT_URL: "",
    DDP_DEFAULT_CONNECTION_URL: localStorage.getItem("ddp-url"), //"http://172.21.16.225:3000", // "https://12.10.10.19:9443", //
    ROOT_URL_PATH_PREFIX: "",
  },
  ddpUrls: [
    "http://172.21.16.225:3000",
    "https://12.10.10.19:9443",
    "http://172.21.16.225:3000",
  ],
  videoSizes: [
    {
      name: "720P",
      value: "1280 720",
    },
    {
      name: "1080P高清",
      value: "1920 1080",
    },
    {
      name: "高清",
      value: "1024 768",
    },
    {
      name: "480P",
      value: "640 480",
    },
    {
      name: "标清",
      value: "640 360",
    },
    {
      name: "240P",
      value: "320 240",
    },
    {
      name: "急速",
      value: "320 180",
    },
  ],
  video: {
    bitratemax: 2048000,
    bitratemin: 256000,
    bitrate: 128000,
  },
};
