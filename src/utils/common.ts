import { showToast } from "vant";
import PinYin from "./pinyin";

import excel from "@/assets/images/messageItem/excel.png";
import ppt from "@/assets/images/messageItem/ppt.png";
import word from "@/assets/images/messageItem/word.png";
import zip from "@/assets/images/messageItem/zip.png";
import pdf from "@/assets/images/messageItem/pdf.png";
import unknown from "@/assets/images/messageItem/unknown.png";

// i18n
import { i18n } from "@/i18n";
import { FriendUserItem } from "@/utils/open-im-sdk-wasm/types/entity";
// @ts-ignore
const { t } = i18n.global;

type FeedbackToastParams = {
  message?: string;
  error?: unknown;
  duration?: number;
  onClose?: () => void;
};

export const feedbackToast = (config?: FeedbackToastParams) => {
  const { message, error, duration, onClose = () => {} } = config ?? {};
  showToast({
    message:
      message ??
      t(error ? "messageTip.nomalFailed" : "messageTip.nomalSuccess"),
    type: error ? "fail" : "success",
    onClose,
    duration,
  });
  if (error) {
    console.error(message, error);
  }
};

export const removeDefaultBehavior = (event: any) => {
  event = event || window.event;
  if (event.preventDefault) event.preventDefault();
  if (event.returnValue) event.returnValue = false;

  if (event.stopPropagation) {
    event.stopPropagation();
  }
  return false;
};

export const sec2Time = (seconds: number) => {
  var theTime1 = 0; // min
  var theTime2 = 0; // hour
  var theTime3 = 0; // day
  if (seconds > 60) {
    theTime1 = parseInt((seconds / 60) as unknown as string);
    seconds = parseInt((seconds % 60) as unknown as string);
    if (theTime1 > 60) {
      theTime2 = parseInt((theTime1 / 60) as unknown as string);
      theTime1 = parseInt((theTime1 % 60) as unknown as string);
      if (theTime2 > 24) {
        theTime3 = parseInt((theTime2 / 24) as unknown as string);
        theTime2 = parseInt((theTime2 % 24) as unknown as string);
      }
    }
  }
  var result = "";
  if (seconds > 0) {
    result = "" + parseInt(seconds as unknown as string) + t("date.seconds");
  }
  if (theTime1 > 0) {
    result =
      "" + parseInt(theTime1 as unknown as string) + t("date.minutes") + result;
  }
  if (theTime2 > 0) {
    result =
      "" + parseInt(theTime2 as unknown as string) + t("date.hours") + result;
  }
  if (theTime3 > 0) {
    result =
      "" + parseInt(theTime3 as unknown as string) + t("date.days") + result;
  }
  return result;
};

export const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  var k = 1024,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};

export const secFormat = (sec: any) => {
  let h: any;
  let s: any;
  h = Math.floor(sec / 60);
  s = sec % 60;
  h += "";
  s += "";
  h = h.length === 1 ? "0" + h : h;
  s = s.length === 1 ? "0" + s : s;
  return h + ":" + s;
};

export const copy2Text = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.style.position = "fixed";
    textarea.style.clip = "rect(0 0 0 0)";
    textarea.style.top = "10px";
    textarea.value = text;
    textarea.select();
    document.execCommand("copy", true);
    document.body.removeChild(textarea);
  }
  feedbackToast({ message: t("messageTip.copySuccess") });
};

export const blobToDataURL = (blob: File, cb: (base64: string) => void) => {
  let reader = new FileReader();
  reader.onload = function (evt) {
    let base64 = evt.target?.result;
    cb(base64 as string);
  };
  reader.readAsDataURL(blob);
};

export const getPicInfo = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = _URL.createObjectURL(file);
  });
};

export const getMediaDuration = (path: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const vel = new Audio(path);
    vel.onloadedmetadata = async function () {
      // resolve(vel.duration);
      resolve(Number(vel.duration.toFixed()));
    };
  });
};

export const getVideoSnshot = (item: string): Promise<File> => {
  return new Promise((reslove, reject) => {
    var video = document.createElement("VIDEO") as HTMLVideoElement;
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute("muted", "muted");
    video.innerHTML = "<source src=" + item + ' type="audio/mp4">';
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    video.addEventListener("canplay", function () {
      var anw = document.createAttribute("width");
      //@ts-ignore
      anw.nodeValue = video.videoWidth;
      var anh = document.createAttribute("height");
      //@ts-ignore
      anh.nodeValue = video.videoHeight;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      //@ts-ignore
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      var base64 = canvas.toDataURL("image/png");
      //@ts-ignore
      video.pause();
      const file = base64toFile(base64);
      reslove(file);
    });
  });
};

export const getVideoSnshotFile = (file: File): Promise<File> => {
  const url = URL.createObjectURL(file);
  return new Promise((reslove, reject) => {
    const video = document.createElement("VIDEO") as HTMLVideoElement;
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute("muted", "muted");
    video.innerHTML = `<source src="${url}" type="audio/mp4">`;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    video.addEventListener("canplay", () => {
      const anw = document.createAttribute("width");
      //@ts-ignore
      anw.nodeValue = video.videoWidth;
      const anh = document.createAttribute("height");
      //@ts-ignore
      anh.nodeValue = video.videoHeight;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      //@ts-ignore
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const base64 = canvas.toDataURL("image/png");
      //@ts-ignore
      video.pause();
      const file = base64toFile(base64);
      reslove(file);
    });
  });
};

export const base64toFile = (base64Str: string) => {
  var arr = base64Str.split(","),
    fileType = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `screenshot${Date.now()}.png`, {
    type: fileType,
  });
};

export const contentEditableDivRange = () => {
  const selection = window.getSelection(),
    range = selection!.getRangeAt(0),
    br = document.createElement("br"),
    textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly
  range.deleteContents(); //required or not?
  range.insertNode(br);
  range.collapse(false);
  range.insertNode(textNode);
  range.selectNodeContents(textNode);
  selection!.removeAllRanges();
  selection!.addRange(range);
  document.execCommand("delete");
};

export const genAvatar = (str: string, size: number) => {
  let colors = ["#0089FF"];
  let cvs = document.createElement("canvas");
  const fontRadio = str ? 0.4 : 0.2;
  cvs.setAttribute("width", size as unknown as string);
  cvs.setAttribute("height", size as unknown as string);
  let ctx = cvs.getContext("2d");
  ctx!.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  ctx!.fillRect(0, 0, size, size);
  ctx!.fillStyle = "rgb(255,255,255)";
  ctx!.font = size * fontRadio + "px Arial";
  ctx!.textBaseline = "middle";
  ctx!.textAlign = "center";
  ctx!.fillText(str ? str.slice(-1) : "UnKnow", size / 2, size / 2);
  return cvs.toDataURL("image/png", 1);
};

export const formatContacts = (data: FriendUserItem[], key = "nickname") => {
  const ucfirst = (l1: any) => {
    if (l1.length > 0) {
      var first = l1.substr(0, 1).toUpperCase();
      var spare = l1.substr(1, l1.length);
      return first + spare;
    }
  };

  const arraySearch = (l1: any, l2: any) => {
    for (var name in PinYin) {
      // @ts-ignore
      if (PinYin[name].indexOf(l1) != -1) {
        return ucfirst(name);
        break;
      }
    }
    return false;
  };

  const codefans = (l1: any) => {
    l1 = l1 ?? "unkown";
    var l2 = l1.length;
    var I1 = "";
    var reg = new RegExp("[a-zA-Z0-9- ]");
    for (var i = 0; i < l2; i++) {
      var val = l1.substr(i, 1);
      var name = arraySearch(val, PinYin);
      if (reg.test(val)) {
        I1 += val;
      } else if (name !== false) {
        I1 += name;
      }
    }
    I1 = I1.replace(/ /g, "-");
    while (I1.indexOf("--") > 0) {
      I1 = I1.replace("--", "-");
    }
    return I1;
  };

  var arr = [],
    firstName;

  for (var i = 0; i < data.length; i++) {
    // @ts-ignore
    firstName = data[i].initial = codefans(data[i][key]).substr(0, 1);
    arr.push(firstName.toUpperCase());
  }

  var arrlist = [];
  for (i = 0; i < arr.length; i++) {
    if (arrlist.indexOf(arr[i]) == -1) {
      arrlist.push(arr[i]);
    }
  }

  var dataSort = [] as any[];
  for (var i = 0; i < arrlist.length; i++) {
    dataSort[i] = {
      initial: arrlist[i],
    };
    dataSort[i].data = [];
    for (var j = 0; j < data.length; j++) {
      // @ts-ignore
      if (data[j].initial.toUpperCase() == dataSort[i].initial) {
        dataSort[i].data.push(data[j]);
      }
    }
  }
  for (var i = 0; i < dataSort.length - 1; i++) {
    for (var j = 1; j < dataSort.length - i; j++) {
      if (dataSort[j - 1].initial > dataSort[j].initial) {
        var a = dataSort[j];
        dataSort[j] = dataSort[j - 1];
        dataSort[j - 1] = a;
      }
    }
  }
  const NomalInitial = "QWERTYUIOPLKJHGFDSAZXCVBNM".split("");
  const special = {
    initial: "#",
    data: [] as any[],
  };
  const newFilterData = dataSort.filter((d) => {
    if (!NomalInitial.includes(d.initial)) {
      special.data = [...special.data, ...d.data];
    } else {
      return d;
    }
  });
  if (special.data.length > 0) {
    newFilterData.push(special);
  }
  const indexList = newFilterData.map((item) => item.initial);
  const dataList = newFilterData.map((item) => item.data);
  return {
    indexList,
    dataList,
  };
};

export const filterEmptyValue = (obj: Record<string, unknown>) => {
  for (let key in obj) {
    if (obj[key] === "") {
      delete obj[key];
    }
  }
};

export const checkIsSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export const downloadFile = (filePath: string, filename: string) => {
  const linkNode = document.createElement("a");
  linkNode.download = filename;
  linkNode.style.display = "none";
  linkNode.href = filePath;
  document.body.appendChild(linkNode);
  linkNode.click();
  document.body.removeChild(linkNode);
};

export const getFileType = (name: string) => {
  const idx = name.lastIndexOf(".");
  return name.slice(idx + 1);
};

export const secondsToTime = (seconds: number) => {
  let minutes = 0; // min
  let hours = 0; // hour
  let days = 0; // day
  if (seconds > 60) {
    minutes = parseInt((seconds / 60) as unknown as string);
    seconds = parseInt((seconds % 60) as unknown as string);
    if (minutes > 60) {
      hours = parseInt((minutes / 60) as unknown as string);
      minutes = parseInt((minutes % 60) as unknown as string);
      if (hours > 24) {
        days = parseInt((hours / 24) as unknown as string);
        hours = parseInt((hours % 24) as unknown as string);
      }
    }
  }
  let result = "";
  if (seconds > 0) {
    result = t("date.second", { num: parseInt(seconds as unknown as string) });
  }
  if (minutes > 0) {
    result =
      t("date.minute", { num: parseInt(minutes as unknown as string) }) +
      result;
  }
  if (hours > 0) {
    result =
      t("date.hour", { num: parseInt(hours as unknown as string) }) + result;
  }
  if (days > 0) {
    result =
      t("date.day", { num: parseInt(days as unknown as string) }) + result;
  }
  return result;
};

export const fileIcon = (fileType: string) => {
  const wordType = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const pdfType = ["application/pdf"];

  const pptType = [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const excelType = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const zipType = ["application/x-zip-compressed"];

  if (wordType.includes(fileType)) {
    return word;
  }
  if (pdfType.includes(fileType)) {
    return pdf;
  }
  if (pptType.includes(fileType)) {
    return ppt;
  }
  if (excelType.includes(fileType)) {
    return excel;
  }
  if (zipType.includes(fileType)) {
    return zip;
  }

  return unknown;
};
