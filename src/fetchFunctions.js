import variables from "./var/variables.js";

// Función que hacer un GET al endpoint indicado y devuelve los datos
// Tiene un timeout de 5 segundos.
export function getData(endpoint) {
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(variables.api_url + "/fotos/" + endpoint, {
      method: "GET",
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 30000);
    }),
  ]);
  return promise;
}

export function getImagen(endpoint, nombre) {
  return variables.imagenes_url + "/" + endpoint + "/" + nombre;
}

// Functión para obtener las fotos en dispositivos viejos
// No devuelve una promesa, sino que devuelve el objeto respuesta directamente
// Si la API demora mucho falla silenciosamente.
// Recibe la función de callback de éxito y la de rechazo
export function getDataOld(endpoint, successCallback, rejectCallback) {
  // return fetch(variables.api_url + "/fotos/" + endpoint, {
  //   method: "GET",
  // });

  // return fetch(variables.api_url + "/fotos/" + endpoint);
  let xhr = new XMLHttpRequest();
  xhr.open("GET", variables.api_url + "/fotos/" + endpoint);

  // set timeout
  xhr.timeout = 30000;


  // request state change event
  xhr.onreadystatechange = function () {
    // request completed?
    if (xhr.readyState !== 4) return;

    if (xhr.status === 201) {
      successCallback(xhr);

      // request successful - show response
      // return xhr.responseText;
      // return "chau";
    } else {
      // request error
      rejectCallback(xhr);
    }
  };

  // start request
  xhr.send();
}
