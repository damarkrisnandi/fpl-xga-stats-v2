const API_URL = "https://fantasy-pl-vercel-proxy-rs.vercel.app";
// const API_URL = "http://localhost:3001"
const ARCHIVED_API_URL = "https://fpl-static-data.vercel.app";

export async function getBootstrap() {
  return fetch(`${API_URL}/bootstrap-static`).then((res) =>
    res.ok ? res.json() : null
  );
}

export function getBootstrapFromStorage() {
  return getBootstrap()
  // return fromStorage("boostrap-static", `${API_URL}/bootstrap-static`, 7);
}

export function getElementSummaryFromStorage(id: number | string) {
  return fromStorage(`/element-summary/${id}`, `${API_URL}/element-summary/${id}`, 15);
}

export function getFixtures() {
  return fromStorage("fixtures", `${API_URL}/fixtures`);
  //   return fetch(`${API_URL}/fixtures`).then((res) => res.json());
}

export function getLeagueData(league: string, page: number, phase?: number) {
  return fromStorage(
    `league/${league}/${page || 1}`,
    `${API_URL}/league/${league}/${page || 1}${phase ? "&phase=" + phase : ""}`,
  );
  // return fetch(`${API_URL}/league/${league}/${page || 1}`).then((res) =>
  //   res.json()
  // );
}

export function getManagerData(id: number | string) {
  return fromStorage(
    `manager/${id}`,
    `${API_URL}/manager/${id}`,
  );
  // return fetch(`${API_URL}/league/${league}/${page || 1}`).then((res) =>
  //   res.json()
  // );
}

export function getManagerTransferData(id: number | string) {
  return fromStorage(
    `manager/${id}/transfers`,
    `${API_URL}/manager/${id}/transfers`,
  );
}

export function getPicksData(managerId: number | string, gameweek: number) {
  return fromStorage(
    `picks/${managerId}/${gameweek}`,
    `${API_URL}/picks/${managerId}/${gameweek}`,
    5,
  );
  // return fetch(`${API_URL}/league/${league}/${page || 1}`).then((res) =>
  //   res.json()
  // );
}

export function getLiveEventData(event: number) {
  return fromStorage(
    `live-event/${event}`,
    `${API_URL}/live-event/${event}`,
  );
  // return fetch(`${API_URL}/league/${league}/${page || 1}`).then((res) =>
  //   res.json()
  // );
}

export function getArchivedBootstrap(season: string) {
  return fetch(`${ARCHIVED_API_URL}/${season}/bootstrap-static.json`).then(
    (res) => res.json(),
  );
}

export function getArchivedLeague(
  season: string,
  league: string,
  page?: number,
) {
  return fetch(
    `${ARCHIVED_API_URL}/${season}/leagues-classic/fplmgm/${league}/${page || 1
    }.json`,
  ).then((res) => res.json());
}

export function getArchivedLiveEventData(season: string, event: number) {
  return fetch(`${ARCHIVED_API_URL}/${season}/live-event/${event}.json`).then(
    (res) => res.json(),
  );
}

async function fromStorage(key: string, urlFetch: string, holdTime?: number) {
  // console.log('test encode decode', '{"name": "damar", "id"}', lzw_encode('abcdefgh'), lzw_decode(lzw_encode('abcdefgh')))
  storageSizeCheck();
  clearStorage(key, holdTime);
  if (localStorage.getItem(key)) {
    return JSON.parse(lzw_decode(localStorage.getItem(key) || '') as string);
  } else {
    const response = await fetch(urlFetch).then((res) =>
      res.ok ? res.json() : { error: true }
    ).catch(() => {
      return { error: true };
    });
    if (response && !response.error) {
      localStorage.setItem(key, lzw_encode(JSON.stringify(response)));
    } else {
      localStorage.removeItem(key);
      localStorage.removeItem(`expired_data_storage:${key}`);
      return { error: true };
    }
  }
  return JSON.parse(lzw_decode(localStorage.getItem(key) || '') as string);
}

function clearStorage(key: string, holdTime?: number) {
  if (checkExpired(key) && localStorage.getItem(key)) {
    localStorage.removeItem(key);
    localStorage.removeItem(`expired_data_storage:${key}`);
  }

  if (!localStorage.getItem(`expired_data_storage:${key}`)) {
    localStorage.setItem(
      `expired_data_storage:${key}`,
      (new Date().getTime() + 1000 * 60 * (holdTime || 3)).toString(),
    );
  }
}

function checkExpired(key: string) {
  return (
    localStorage.getItem(`expired_data_storage:${key}`) &&
    new Date().getTime() >=
    Number(localStorage.getItem(`expired_data_storage:${key}`))
  );
}

function storageSizeCheck() {
  var _lsTotal = 0,
    _xLen,
    _x;
  for (_x in localStorage) {
    if (!localStorage.hasOwnProperty(_x)) {
      continue;
    }
    _xLen = (localStorage[_x].length + _x.length) * 2;
    _lsTotal += _xLen;
    // console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB")
  }
  var max = 5 * 1024;
  var val = _lsTotal / 1024;
  var css = "";
  if (val / max < 1 && val / max >= 0.75) {
    css = "background: #222; color: red";
  } else if (val / max < 0.75 && val / max >= 0.5) {
    css = "background: #222; color: orange";
  } else if (val / max < 0.5 && val / max >= 0.25) {
    css = "background: #222; color: yellow";
  } else {
    css = "background: #222; color: green";
  }

  /* eslint-disable-next-line no-console */
  console.log(
    "%c LocalStorage Total = " +
    (_lsTotal / 1024).toFixed(2) +
    " KB" +
    ` (${((_lsTotal * 100) / (5 * 1000 * 1024)).toFixed(2)}%)`,
    css,
  );

  var _lsTotal = 0,
    _xLen,
    _x;
  for (_x in sessionStorage) {
    if (!sessionStorage.hasOwnProperty(_x)) {
      continue;
    }
    _xLen = (sessionStorage[_x].length + _x.length) * 2;
    _lsTotal += _xLen;
    // console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB")
  }

  var max = 5 * 1024;
  var val = _lsTotal / 1024;
  var css = "";
  if (val / max < 1 && val / max >= 0.75) {
    css = "background: #222; color: red";
  } else if (val / max < 0.75 && val / max >= 0.5) {
    css = "background: #222; color: orange";
  } else if (val / max < 0.5 && val / max >= 0.25) {
    css = "background: #222; color: yellow";
  } else {
    css = "background: #222; color: green";
  }

  /* eslint-disable-next-line no-console */
  console.log(
    "%c SessionStorage Total = " +
    (_lsTotal / 1024).toFixed(2) +
    " KB" +
    ` (${((_lsTotal * 100) / (5 * 1000 * 1024)).toFixed(2)}%)`,
    css,
  );
}

function lzw_encode(s: string) {
  var dict: any = {};
  var data = (s + "").split("");
  var out = [];
  var currChar;
  var phrase = data[0];
  var code = 256;
  for (var i = 1; i < data.length; i++) {
    currChar = data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    }
    else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code;
      code++;
      phrase = currChar;
    }
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (var i = 0; i < out.length; i++) {
    out[i] = String.fromCharCode(out[i]);
  }
  return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s: string) {
  if (s.length === 0) return "{}";
  var dict: any = {};
  var data = (s + "").split("");
  var currChar = data[0];
  var oldPhrase = currChar;
  var out = [currChar];
  var code = 256;
  var phrase;
  for (var i = 1; i < data.length; i++) {
    var currCode = data[i].charCodeAt(0);
    if (currCode < 256) {
      phrase = data[i];
    }
    else {
      phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
    }
    out.push(phrase);
    currChar = phrase.charAt(0);
    dict[code] = oldPhrase + currChar;
    code++;
    oldPhrase = phrase;
  }
  return out.join("");
}
