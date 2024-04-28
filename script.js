let isPlayed = false;

// Function to update Current time
function updateTime() {
  let date = new Date();
  document.querySelector(".current-time").textContent =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
    ":" +
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":" +
    (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
  document.querySelector(".current-date").textContent = date.toDateString();
}
// Calling update function after every 1 second
setInterval(updateTime, 1000);

// Accessing all the necessary DOM elements
const aName = document.getElementById("alarm-name");
const aHours = document.getElementById("hours");
const aMinutes = document.getElementById("minutes");
const aSound = document.getElementById("sound");
const testSoundImg = document.getElementById("test-sound");
const testSoundTag = document.getElementById("test-sound-element");
const aSnooze = document.getElementById("snooze");
const alarmList = document.querySelector(".alarm-list");
const alarmForm = document.getElementById("alarm-form");

// Adding eventlistener to dropdown for changing the 'Test' sound
aSound.addEventListener("change", updateTestSound);
// Adding eventlistener to 'Test sound' icon
testSoundImg.addEventListener("click", testSound);

// Function to update test audio depending upon which option is selected from dropdown
function updateTestSound() {
  // If test sound is already playing then it will stop playing
  if (isPlayed) {
    testSound();
  }
  testSoundTag.src = getSoundSrc(aSound.value); // get source of selected sound and assigning to audio tag
}
// Function to implement when test icon is clicked
function testSound() {
  if (isPlayed) {
    // if test sound is already playing then it will pause
    testSoundImg.src = "svgs/play-circle-fill.svg";
    testSoundTag.pause();
    isPlayed = false;
  } else {
    // and if test sound is paused then it will play
    testSoundImg.src = "svgs/pause-circle-fill.svg";
    testSoundTag.loop = true;
    testSoundTag.play();
    isPlayed = true;
  }
}
// Add alarm function will be called when the form is submitted
alarmForm.addEventListener("submit", (event) => {
  addAlarm(
    aName.value,
    aHours.value,
    aMinutes.value,
    aSound.value,
    aSnooze.value
  );
  event.preventDefault();
  alarmForm.reset();
});

// Function to set an alarm and create alarm card
function addAlarm(aName, aHours, aMinutes, aSound, aSnooze) {
  //Converting string values into Numbers
  let hours = parseInt(aHours);
  let minutes = parseInt(aMinutes);
  // Getting total time left to ring an alarm by passing HH and MM to the function
  let timeLeft = getTimeLeft(hours, minutes);
  let isStopped = false;
  const alarmListItem = document.createElement("div"); // Creating card body
  alarmListItem.className = "alarm-list-item";
  const deleteAlarm = document.createElement("img"); //Creating delete alarm icon
  deleteAlarm.src = "svgs/trash.svg"; //Adding source to icon
  deleteAlarm.className = "delete-alarm";
  const alarmName = document.createElement("span"); //Creating span to display alarm Name
  alarmName.textContent = aName; //Assigning Alarm name to span
  const alarmTime = document.createElement("span"); //Creating span to display Alarm Time
  alarmTime.textContent =
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes);   //Converting time to HH:MM and assing to span
  alarmTime.className = "alarm-time";
  const timeLeftLabel = document.createElement("span");   //Creating span to display total time left 
  timeLeftLabel.textContent = `${timeLeft.hr}h ${timeLeft.min}m ${timeLeft.sec}s left`; //Assigning values in HH:MM:SS format
  const buttonCont = document.createElement("div");   //Creating div to contain snooze and stop button
  buttonCont.className = "button-container";
  const snoozeButton = document.createElement("button");  //Creating snooze button
  snoozeButton.classList.add("set-alarm", "snooze-button");
  snoozeButton.textContent = "Snooze";
  snoozeButton.hidden = true;   //Initially setting snooze button as hidden
  const stopButton = document.createElement("button");    //Creating stop alarm button
  stopButton.className = "set-alarm";
  stopButton.textContent = "Stop alarm";
  const alarmAudio = document.createElement("audio");   //Creating audio tag for an alarm
  alarmAudio.src = getSoundSrc(aSound);   //getting and assigning source of sound
  alarmAudio.loop = true;

  snoozeButton.addEventListener("click", () => {
    alarmAudio.pause();   //Pause alarm 
    minutes += parseInt(aSnooze);   //Add snooze minutes provided by user
    timeLeft = getTimeLeft(hours, minutes);   //Update total time left 
    snoozeButton.hidden = true;   //Hide snooze button
  });
  // Interval of 1 second to update total time left  
  const timer = setInterval(() => {
    //if HH:MM:SS is 00:00:00 and if alarm is not stopped then alarm will Ring
    if (timeLeft.hr == 0 && timeLeft.min == 0 && timeLeft.sec == 0 && !isStopped) {
      alarmAudio.play();
      if (aSnooze) {    
        snoozeButton.hidden = false;    //If snooze is not set to off then snooze button will be displayed at 00:00:00
      }
    } else {
      //if HH:MM:SS is not 00:00:00 then continue updating total time left
      timeLeft = getTimeLeft(hours, minutes);
      timeLeft.hr = timeLeft.hr == 24 ? 0 : timeLeft.hr;
      timeLeftLabel.textContent = `${timeLeft.hr}h ${timeLeft.min}m ${timeLeft.sec}s left`;
    }
  }, 1000);

  stopButton.addEventListener("click", () => {
    alarmAudio.pause();   //Alarm will stop ringing if it is ringing
    if (isStopped) {
      // If 'set alarm' button is clicked then new timeLeft will be fetched and button title will be set to 'Stop alarm'
      hours = parseInt(aHours);
      minutes = parseInt(aMinutes);
      timeLeft = getTimeLeft(hours, minutes);
      timeLeftLabel.textContent = `${timeLeft.hr}h ${timeLeft.min}m ${timeLeft.sec}s left`;
      timeLeftLabel.hidden = false;
      stopButton.textContent = "Stop alarm";
      isStopped = false;
    } else {
      //if stop button is clicked timeleft will set to 00:00:00 and button title will be set to 'Set alarm'
      timeLeft = { hr: 0, min: 0, sec: 0 };
      timeLeftLabel.hidden = true;
      snoozeButton.hidden = true;
      stopButton.textContent = "Set alarm";
      isStopped = true;
    }
  });

  deleteAlarm.addEventListener("click", () => {
    alarmAudio.pause();
    alarmListItem.remove();   //If delete icon is clicked Alarm card will be removed from the container
    clearInterval(timer);
  });
  //Appending all child elements to Alarm card
  alarmListItem.appendChild(deleteAlarm);
  alarmListItem.appendChild(alarmName);
  alarmListItem.appendChild(alarmTime);
  alarmListItem.appendChild(timeLeftLabel);
  buttonCont.appendChild(snoozeButton);
  buttonCont.appendChild(stopButton);
  alarmListItem.appendChild(buttonCont);
  alarmList.appendChild(alarmListItem);
}

// Get total time left by accepting HH and MM as parameter
function getTimeLeft(aHours, aMinutes) {
  const currentTimestamp = new Date();
  const newTimestamp = new Date();
  const currentHour = currentTimestamp.getHours();
  const currentMinutes = currentTimestamp.getMinutes();
  const currentDate = currentTimestamp.getDate();
  if (aHours == currentHour) {
    // if current HH value is equal to value provided by user then check minutes
    if (aMinutes <= currentMinutes) {
      // if current MM is less than or equal to MM value provided by user i.e. req time is already passed then date(DD) will be increamented to set same alarm for next day
      newTimestamp.setDate(currentDate + 1);
    }
  } else if (aHours < currentHour) {
    // if current HH is less than HH value provided by user i.e. req time is already passed then date(DD) will be increamented to set same alarm for next day
    newTimestamp.setDate(currentDate + 1);
  }
  newTimestamp.setHours(aHours);
  newTimestamp.setMinutes(aMinutes);
  newTimestamp.setSeconds(0);

  // Calculating time difference between current time and required time 
  let timeLeft = newTimestamp.getTime() - currentTimestamp.getTime();
  let h = Math.floor(timeLeft / 1000 / 60 / 60);
  timeLeft -= h * 1000 * 60 * 60;
  let m = Math.floor(timeLeft / 1000 / 60);
  timeLeft -= m * 1000 * 60;
  let s = Math.floor(timeLeft / 1000);
  return { hr: h, min: m, sec: s };
}

// Function to get source of an audio using value of an option
function getSoundSrc(soundId) {
  switch (soundId) {
    case "1":
      return "sounds/clock-alarm.mp3";
    case "2":
      return "sounds/clockSound.mp3";
    case "3":
      return "sounds/cockSound.wav";
    default:
      return "sounds/cockSound.wav";
  }
}
