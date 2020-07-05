import variables from "./var/variables.js";

export function getExamenDesdeHash(hash) {
  return fetch(variables.api_url + "/examendesdehash/" + hash);
}

export function getTomarExamen(hash) {
  return fetch(variables.api_url + "/tomarexamen/" + hash);
}

export function postRespuestaInterim(data) {
  const url = variables.api_url + "/respuestainterim";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(data),
  });
}

export function postRespuestasFinales(data) {
  const url = variables.api_url + "/respuestafinal";
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept-encoding": "gzip, deflate",
      },
      body: JSON.stringify(data),
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 5000);
    }),
  ]);
  return promise;
}

export function putIndicarExamenUtilizado(data) {
  const url = variables.api_url + "/hashperiodo";
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(data),
  });
}


// Función que hacer un GET al endpoint indicado y devuelve los datos
// Tiene un timeout de 5 segundos.
export function getData(endpoint) {
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(variables.api_url + "/" + endpoint, {
      method: "GET",
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 5000);
    }),
  ]);
  return promise;
}


// Impacata el endpoint de la API que devuelve OK si hay conexión
// Tiene un timeout propio de 5 segundos
export function verificarConexion() {
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(variables.api_url + "/verificarconexion"),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 5000);
    }),
  ]);
  return promise;
}

// Guarda las respuestas en LocalStorage para enviar más adelante
export function guardarRespuestasEnLS(data) {
  var datosGuardar = JSON.stringify(data);
  localStorage.setItem("albus_pendientes", datosGuardar);
}
// Devuelve las respuestas de LocalStorage para enviar
export function getRespuestasEnLS() {
  return localStorage.getItem("albus_pendientes");
}

// Borra el resgistro de LS
export function borrarRespuestasEnLS() {
  return localStorage.removeItem("albus_pendientes");
}


export function getImagen(nombre) {
  return variables.imagenes_url + "/" + nombre;
}
