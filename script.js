function updateTime(){
  let date = new Date();
  document.querySelector(".current-time").textContent = date.toLocaleTimeString();
  document.querySelector(".current-date").textContent = date.toDateString();
}
setInterval(updateTime,1000)