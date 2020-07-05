// Devuelve la fecha formateada a partir de un timestamp
export function convertDate(timestamp) {
  const date = new Date();
  date.setTime(timestamp * 1000);
  return (
    date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

// Devuelve la hora formateada a partir de un timestamp
export function convertTime(timestamp) {
  const date = new Date();
  date.setTime(timestamp * 1000);
  return (
    ("0" + date.getHours()).toString().slice(-2) +
    ":" +
    ("0" + date.getMinutes()).toString().slice(-2)
  );
}

// Devuelve la fecha formateada desde ahora hasta unos días en el futuro
export function getCurrentDatePlus(daysFromToday) {
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + daysFromToday);
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  return date + "/" + month + "/" + year;
}

// Devuelve las horas, minutos y segundos que faltan para finalizar el examen
export function calcularTiempoRestante(endDate) {
  var diff = (new Date(endDate * 1000) - new Date()) / 1000;

  // Guarda el tiempo restante para devolverlo
  var tiempoRestante = Math.floor(diff);

  const timeLeft = {
    hours: 0,
    min: 0,
    sec: 0,
  };

  if (diff >= 3600) {
    timeLeft.hours = Math.floor(diff / 3600);
    diff -= timeLeft.hours * 3600;
  }
  if (diff >= 60) {
    timeLeft.min = Math.floor(diff / 60);
    diff -= timeLeft.min * 60;
  }
  timeLeft.sec = Math.floor(diff);

  return {
    texto:
      timeLeft.hours +
      ":" +
      ("0" + timeLeft.min).toString().slice(-2) +
      ":" +
      ("0" + timeLeft.sec).toString().slice(-2),
    tiempoRestante: tiempoRestante,
  };
}
