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
