import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { parseColor } from "tailwindcss/lib/util/color";
import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import {v4 as uuidv4} from 'uuid';
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Dispatch, SetStateAction } from "react";
import countries from '@/assets/files/country.json'
import { toast } from "sonner";

dayjs.extend(duration);

const cutText = (text: string, length: number) => {
  if (text.split(" ").length > 1) {
    const string = text.substring(0, length);
    const splitText = string.split(" ");
    splitText.pop();
    return splitText.join(" ") + "...";
  } else {
    return text;
  }
};

const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format);
};

const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.toLowerCase().charAt(0).toUpperCase() + string.slice(1);
  } else {
    return "";
  }
};

export const capitalizeWord = (string: string) => {
  if (string) {
    const tab = string.split(' ');
    var mtab = tab;
    for (var i=0;i<tab.length;i++) mtab[i] = capitalizeFirstLetter(tab[i])

    return mtab.join(" ")
  } else {
    return "";
  }
};

const onlyNumber = (string: string) => {
  if (string) {
    return string.replace(/\D/g, "");
  } else {
    return "";
  }
};

const formatCurrency = (number: number) => {
  if (number) {
    const formattedNumber = number.toString().replace(/\D/g, "");
    const rest = formattedNumber.length % 3;
    let currency = formattedNumber.substr(0, rest);
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g);
    let separator;

    if (thousand) {
      separator = rest ? "." : "";
      currency += separator + thousand.join(".");
    }

    return currency;
  } else {
    return "";
  }
};

const timeAgo = (time: string) => {
  const date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " "));
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return dayjs(time).format("MMMM DD, YYYY");
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && "just now") ||
        (diff < 120 && "1 minute ago") ||
        (diff < 3600 && Math.floor(diff / 60) + " minutes ago") ||
        (diff < 7200 && "1 hour ago") ||
        (diff < 86400 && Math.floor(diff / 3600) + " hours ago"))) ||
    (dayDiff === 1 && "Yesterday") ||
    (dayDiff < 7 && dayDiff + " days ago") ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + " weeks ago")
  );
};

const diffTimeByNow = (time: string) => {
  const startDate = dayjs(dayjs().format("YYYY-MM-DD HH:mm:ss").toString());
  const endDate = dayjs(dayjs(time).format("YYYY-MM-DD HH:mm:ss").toString());

  const duration = dayjs.duration(endDate.diff(startDate));
  const milliseconds = Math.floor(duration.asMilliseconds());

  const days = Math.round(milliseconds / 86400000);
  const hours = Math.round((milliseconds % 86400000) / 3600000);
  let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000);
  const seconds = Math.round(
    (((milliseconds % 86400000) % 3600000) % 60000) / 1000
  );

  if (seconds < 30 && seconds >= 0) {
    minutes += 1;
  }

  return {
    days: days.toString().length < 2 ? "0" + days : days,
    hours: hours.toString().length < 2 ? "0" + hours : hours,
    minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
    seconds: seconds.toString().length < 2 ? "0" + seconds : seconds,
  };
};

const isset = (obj: object | string) => {
  if (obj !== null && obj !== undefined) {
    if (typeof obj === "object" || Array.isArray(obj)) {
      return Object.keys(obj).length;
    } else {
      return obj.toString().length;
    }
  }

  return false;
};

const toRaw = (obj: object) => {
  return JSON.parse(JSON.stringify(obj));
};

const randomNumbers = (from: number, to: number, length: number) => {
  const numbers = [0];
  for (let i = 1; i < length; i++) {
    numbers.push(Math.ceil(Math.random() * (from - to) + to));
  }

  return numbers;
};

const toRGB = (value: string) => {
  return parseColor(value).color.join(" ");
};

const stringToHTML = (arg: string) => {
  const parser = new DOMParser(),
    DOM = parser.parseFromString(arg, "text/html");
  return DOM.body.childNodes[0] as HTMLElement;
};

const slideUp = (
  el: HTMLElement,
  duration = 300,
  callback = (el: HTMLElement) => {}
) => {
  el.style.transitionProperty = "height, margin, padding";
  el.style.transitionDuration = duration + "ms";
  el.style.height = el.offsetHeight + "px";
  el.offsetHeight;
  el.style.overflow = "hidden";
  el.style.height = "0";
  el.style.paddingTop = "0";
  el.style.paddingBottom = "0";
  el.style.marginTop = "0";
  el.style.marginBottom = "0";
  window.setTimeout(() => {
    el.style.display = "none";
    el.style.removeProperty("height");
    el.style.removeProperty("padding-top");
    el.style.removeProperty("padding-bottom");
    el.style.removeProperty("margin-top");
    el.style.removeProperty("margin-bottom");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition-duration");
    el.style.removeProperty("transition-property");
    callback(el);
  }, duration);
};

const slideDown = (
  el: HTMLElement,
  duration = 300,
  callback = (el: HTMLElement) => {}
) => {
  el.style.removeProperty("display");
  let display = window.getComputedStyle(el).display;
  if (display === "none") display = "block";
  el.style.display = display;
  let height = el.offsetHeight;
  el.style.overflow = "hidden";
  el.style.height = "0";
  el.style.paddingTop = "0";
  el.style.paddingBottom = "0";
  el.style.marginTop = "0";
  el.style.marginBottom = "0";
  el.offsetHeight;
  el.style.transitionProperty = "height, margin, padding";
  el.style.transitionDuration = duration + "ms";
  el.style.height = height + "px";
  el.style.removeProperty("padding-top");
  el.style.removeProperty("padding-bottom");
  el.style.removeProperty("margin-top");
  el.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    el.style.removeProperty("height");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition-duration");
    el.style.removeProperty("transition-property");
    callback(el);
  }, duration);
};

// Store in local storage
export const write = function(key: string, value: any) {
  localStorage.setItem(key, value)
  return key
}

// Get from local storage
export const read = function(key: string) {
  return localStorage.getItem(key)
}

// Remove from local storage
export const remove = function(key: string) {
  return localStorage.removeItem(key)
}

// get if token in the storage
export const getLocalToken = function(key: string){
  if (read(key)) return read(key)

  return undefined
}

// format currency
export const currencyFormat = (num: number) => new Intl.NumberFormat('en-US').format(num)


// 
export const serializeNumber = (num: number, decimals: number) => {
  if (num <= 0) return "0"
  const suffixes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"]
  var i = Math.floor((Math.log(num)/Math.log(1000)))
  return ((num/Math.pow(1024,i)).toFixed(decimals)) + ' ' + suffixes[i]
}

export const shortenAddressFormat = (address: string) => `${address.slice(0, 5)}...${address.slice(address.length-4)}`

export function jsonToBlob(json: any) {
  const textEncoder = new TextEncoder();
  const seen = new WeakSet();
  let buffer = new Uint8Array(1024 * 1024); // Start with 1MB buffer
  let position = 0;
  let stringBuffer = '';

  function ensureCapacity(additionalBytes: any) {
    if (position + additionalBytes > buffer.length) {
      const newBuffer = new Uint8Array(Math.max(buffer.length * 2, position + additionalBytes));
      newBuffer.set(buffer);
      buffer = newBuffer;
    }
  }

  function writeToBuffer(str: any) {
    const encoded = textEncoder.encode(str);
    ensureCapacity(encoded.length);
    buffer.set(encoded, position);
    position += encoded.length;
  }

  function flushStringBuffer() {
    if (stringBuffer.length > 0) {
      writeToBuffer(stringBuffer);
      stringBuffer = '';
    }
  }

  function processValue(value: any) {
    if (seen.has(value)) {
      throw new TypeError("Converting circular structure to JSON");
    }

    if (value && typeof value.toJSON === "function") {
      value = value.toJSON();
    }

    if (typeof value === 'object' && value !== null) {
      seen.add(value);

      const isArray = Array.isArray(value);
      stringBuffer += isArray ? '[' : '{';

      let first = true;
      for (const [key, val] of Object.entries(value)) {
        if (!first) stringBuffer += ',';
        first = false;

        if (!isArray) {
          stringBuffer += JSON.stringify(key) + ':';
        }

        processValue(val);
      }

      stringBuffer += isArray ? ']' : '}';
    } else if (typeof value === 'function' || typeof value === 'undefined') {
      stringBuffer += 'null';
    } else {
      stringBuffer += JSON.stringify(value);
    }

    // Flush the string buffer if it gets too large
    if (stringBuffer.length > 1024) {
      flushStringBuffer();
    }
  }

  processValue(json);
  flushStringBuffer();

  return new Blob([buffer.subarray(0, position)]);
}

export const createUUID = () => {
  const myuuid = uuidv4();
  return myuuid;
}

export const setDarkModeClass = (darkMode: boolean) => {
  const el = document.querySelectorAll("html")[0];
  darkMode ? el.classList.add("dark") : el.classList.remove("dark");
};

export const getPasswordPattern = (password: string, setValue: Dispatch<SetStateAction<number>>) => {
  var percent = 0;
  const charUpperRegExp = RegExp('(?=.*[A-Z])');
  const charLowerRegExp = RegExp('(?=.*[a-z])');
  const charSpecialRegExp = RegExp('(?=.*[!@#\$%\^&\*])');
  const charNumberRegExp = RegExp('(?=.*[0-9])');
  const charLengthRegExp = RegExp('(?=.{8,})')

  if (password.match(charLengthRegExp)){
    percent += 20
  }
  if (password.match(charUpperRegExp)){
    percent += 20
  }
  if (password.match(charLowerRegExp)){
    percent += 20
  }
  if (password.match(charSpecialRegExp)){
    percent += 20
  }
  if (password.match(charNumberRegExp)){
    percent += 20
  }

  setValue(percent)
}

export const key = import.meta.env.VITE_ENCRYPT_KEY
export const apis_url = import.meta.env.VITE_APIS_DOCS_URL

  export const encryptAES = (text: string) => {
    return CryptoJS.AES.encrypt(text, key).toString();
  };

  export const decryptAES = (encryptedBase64: string) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64.toString(), key);
    if (decrypted) {
      try {
        const str = decrypted.toString(CryptoJS.enc.Utf8);
        if (str.length > 0) {
          return str;
        } else {
          return null;
        } 
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  export function encryptTheValue(word: string) {
    try {
      const encJson = CryptoJS.AES.encrypt(JSON.stringify(word), key).toString();
      const encData = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encJson)
      );
      return encData;
    } catch (error) {
      return null
    }
  }
  
  export function decryptTheValue(word: string) {
    try {
      const decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8);
      const bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8);
      return JSON.parse(bytes);
    } catch (error) {
      return null
    }
  }
  

  export function isMacintosh() {
    return navigator.userAgent.indexOf("Mac") > -1;
  }

  export function isWindows() {
    return navigator.userAgent.indexOf("Win") > -1;
  }

   // Phone regex
   export const phoneRegExp = RegExp('/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/')

  export function generateOTPCode(min: number, max: number) {

      // find diff
      let difference = max - min;

      // generate random number 
      let rand = Math.random();

      // multiply with difference 
      rand = Math.floor( rand * difference);

      // add with min value 
      rand = rand + min;

      console.log(rand)

      return rand

  }

  export const charUpperRegExp = RegExp('(?=.*[A-Z])');
  export const charLowerRegExp = RegExp('(?=.*[a-z])');
  export const charSpecialRegExp = RegExp('(?=.*[!@#\$%\^&\*])');
  export const charNumberRegExp = RegExp('(?=.*[0-9])');
  export const charLengthRegExp = RegExp('(?=.{8,})')

  export const languages: {key: string, label: string}[] = [
    {
      key: "en",
      label: "English"
    },
    {
      key: "fr",
      label: "Français"
    }
  ]

  export function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes*60000);
  }

  export function toCapitalize(value: string) {
    if (value !== null && value !== undefined && value.length > 0) {
      var parts = value.split(' ')
      return (parts[0].substring(0,1) +""+ parts[1].substring(0,1)).toUpperCase();
    }
  
    return ''
  }
  

  export const personaKey = import.meta.env.VITE_PERSONA_TEMPLATE_ID

  export const alertToast = (description: string, icon: any, type: "success" | "error" | "warning", position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center', prefix?: any) => {

    toast("", {
        description: description,
        position: position,
        icon: prefix !== undefined ? prefix:null,
        className: type === "error"? "!bg-red-100 !shadow-xl !shadow-neutral-400/5 !border-none":type === "success" ? "!bg-lime-100 !shadow-xl !shadow-neutral-400/5 !border-none":"!bg-yellow-100 !shadow-xl !shadow-neutral-400/5 !border-none",
        action: {
            label: icon,
            onClick: ()=> {}
        },
        classNames: { 
            title: "text-red-500 font-semibold",
            description: "ml-1 !text-neutral-950 !font-medium",
            actionButton: "flex justify-center items-center !bg-transparent !w-8 !h-8 !rounded-full"
        }
    })
    
  }
  

export {
  cutText,
  formatDate,
  capitalizeFirstLetter,
  onlyNumber,
  formatCurrency,
  timeAgo,
  diffTimeByNow,
  isset,
  toRaw,
  randomNumbers,
  toRGB,
  stringToHTML,
  slideUp,
  slideDown,
  countries
};
