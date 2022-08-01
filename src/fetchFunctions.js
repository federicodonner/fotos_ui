// Función que hacer un GET al endpoint indicado y devuelve los datos
// Tiene un timeout de 5 segundos.
export function getData(endpoint) {
  const url = process.env.REACT_APP_API_URL + "/fotos/" + endpoint;
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(url, {
      method: "GET",
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 30000);
    }),
  ]);
  return promise;
}

export function getImagen(endpoint, nombre) {
  return process.env.REACT_APP_IMAGENES_URL + "/" + endpoint + "/" + nombre;
}

// Functión para obtener las fotos en dispositivos viejos
// No devuelve una promesa, sino que devuelve el objeto respuesta directamente
// Si la API demora mucho falla silenciosamente.
// Recibe la función de callback de éxito y la de rechazo
export function getDataOld(endpoint, successCallback, rejectCallback) {
  const url = process.env.REACT_APP_API_URL + "/fotos/" + endpoint;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  // set timeout
  // xhr.timeout = 30000;

  // request state change event
  xhr.onreadystatechange = function () {
    alert(url);
    alert(
      xhr.readyState +
        " status: " +
        xhr.status +
        " response:" +
        xhr.response +
        " onabort: " +
        xhr.onabort +
        " onerror: " +
        xhr.onerror +
        " responseURL: " +
        xhr.responseURL
    );
    console.log(xhr);
    // request completed?
    if (xhr.readyState !== 4) return;

    if (xhr.status === 201) {
      successCallback(xhr);

      // request successful - show response
    } else {
      // request error
      rejectCallback(xhr);
    }
  };

  // start request
  xhr.send();
}
