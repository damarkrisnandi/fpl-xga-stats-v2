// const API_URL = "https://fantasy-pl-vercel-proxy.vercel.app";
const API_URL = "http://localhost:3001"
const ARCHIVED_API_URL = "https://fpl-static-data.vercel.app";

export async function getBootstrap() {
  return fetch(`${API_URL}/bootstrap-static`).then((res) =>
    res.ok ? res.json() : null
  );
}

export function getBootstrapFromStorage() {
  return fromStorage("boostrap-static", `${API_URL}/bootstrap-static`, 7);
}

export function getFixtures() {
  return fromStorage("fixtures", `${API_URL}/fixtures`);
  //   return fetch(`${API_URL}/fixtures`).then((res) => res.json());
}

export function getLeagueData(league: string, page: number, phase?: number) {
  return fromStorage(
    `league/${league}/${page || 1}`,
    `${API_URL}/league/${league}/${page || 1}${phase ? '&phase=' + phase : ''}`
  );
  // return fetch(`${API_URL}/league/${league}/${page || 1}`).then((res) =>
  //   res.json()
  // );
}

export function getManagerData(id: number) {
  return fromStorage(
    `manager/${id}`,
    `${API_URL}/manager/${id}`
  );
  // return fetch(`${API_URL}/league/${league}/${page || 1}`).then((res) =>
  //   res.json()
  // );
}

export function getLiveEventData(event: number) {
  return fromStorage(
    `live-event/${event}`,
    `${API_URL}/live-event/${event}`
  );
  // return fetch(`${API_URL}/league/${league}/${page || 1}`).then((res) =>
  //   res.json()
  // );
}

export function getArchivedBootstrap(season: string) {
  return fetch(`${ARCHIVED_API_URL}/${season}/bootstrap-static.json`).then(
    (res) => res.json()
  );
}

export function getArchivedLeague(
  season: string,
  league: string,
  page?: number
) {
  return fetch(
    `${ARCHIVED_API_URL}/${season}/leagues-classic/fplmgm/${league}/${
      page || 1
    }.json`
  ).then((res) => res.json());
}

async function fromStorage(key: string, urlFetch: string, holdTime?: number) {
  // storageSizeCheck();
  clearStorage(key, holdTime);
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key) as string);
  } else {
    const response = await fetch(urlFetch).then((res) =>
      res.ok ? res.json() : { error: true }
    ).catch((err) => {return { error: true }});
    if (response && !response.error) {
      localStorage.setItem(key, JSON.stringify(response));
    } else {
      localStorage.removeItem(key);
      localStorage.removeItem(`expired_data_storage:${key}`);
      return { error: true }
    }
  }
  return JSON.parse(localStorage.getItem(key) as string);
}

function clearStorage(key: string, holdTime?: number) {
  if (checkExpired(key) && localStorage.getItem(key)) {
    localStorage.removeItem(key);
    localStorage.removeItem(`expired_data_storage:${key}`);
  }

  if (!localStorage.getItem(`expired_data_storage:${key}`)) {
    localStorage.setItem(
      `expired_data_storage:${key}`,
      (new Date().getTime() + 1000 * 60 * (holdTime || 3)).toString()
    );
  }
}

function checkExpired(key: string) {
  return (
    localStorage.getItem(`expired_data_storage:${key}`) &&
    new Date().getTime() >= Number(localStorage.getItem(`expired_data_storage:${key}`))
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
    css
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
    css
  );
}
