let isPlayed = false;
function updateTime(){
  let date = new Date();
  document.querySelector(".current-time").textContent = (date.getHours()<10?"0"+date.getHours():date.getHours()) + ":" + (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()) + ":" +  (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds());
  document.querySelector(".current-date").textContent = date.toDateString();
}
setInterval(updateTime,1000);
///////////////////////////////////////////////////////////////////////////////////////
const aName = document.getElementById('alarm-name');
const aHours = document.getElementById('hours');
const aMinutes = document.getElementById('minutes');
const aSound = document.getElementById('sound');
const testSoundImg = document.getElementById('test-sound');
const testSoundTag = document.getElementById('test-sound-element');
const aSnooze = document.getElementById('snooze');
const alarmList = document.querySelector('.alarm-list');
const alarmForm = document.getElementById('alarm-form');

aSound.addEventListener('change',updateTestSound);
testSoundImg.addEventListener('click',testSound);

function updateTestSound() {
    if(isPlayed){
        testSound();
    }
    testSoundTag.src = getSoundSrc(aSound.value);
}
function testSound() {
    if (isPlayed) {
        testSoundImg.src = 'svgs/play-circle-fill.svg';
        testSoundTag.pause();
        isPlayed = false;
    } else {
        testSoundImg.src = 'svgs/pause-circle-fill.svg';
        testSoundTag.loop = true;
        testSoundTag.play();
        isPlayed = true;
    }
}
alarmForm.addEventListener("submit",(event)=>{
    addAlarm(aName.value,aHours.value,aMinutes.value,aSound.value,aSnooze.value);
    event.preventDefault();
    alarmForm.reset();
});

function addAlarm(aName,aHours,aMinutes,aSound,aSnooze){
    let hours = parseInt(aHours);
    let minutes = parseInt(aMinutes);
    let timeLeft = getTimeLeft(hours,minutes);
    let isStopped = false;
    const alarmListItem = document.createElement('div');
    alarmListItem.className = 'alarm-list-item';
    const deleteAlarm = document.createElement('img');
    deleteAlarm.src = 'svgs/trash.svg';
    deleteAlarm.className = 'delete-alarm';
    const alarmName = document.createElement('span');
    alarmName.textContent = aName;
    const alarmTime = document.createElement('span');
    alarmTime.textContent = (hours<10?"0"+hours:hours) +":"+ (minutes<10?"0"+minutes:minutes);
    alarmTime.className = 'alarm-time';
    const timeLeftLabel = document.createElement('span');
    timeLeftLabel.textContent = `${timeLeft.hr}h ${timeLeft.min}m ${timeLeft.sec}s left`;
    const buttonCont = document.createElement('div');
    buttonCont.className = 'button-container';
    const snoozeButton = document.createElement('button');
    snoozeButton.classList.add('set-alarm','snooze-button');
    snoozeButton.textContent = 'Snooze';
    snoozeButton.hidden = true;
    const stopButton = document.createElement('button');
    stopButton.className = 'set-alarm';
    stopButton.textContent = "Stop alarm";
    const alarmAudio = document.createElement('audio');
    alarmAudio.src = getSoundSrc(aSound);
    alarmAudio.loop = true;
    snoozeButton.addEventListener('click',()=>{
        alarmAudio.pause();
        minutes+= parseInt(aSnooze);
        timeLeft = getTimeLeft(hours,minutes);
        snoozeButton.hidden = true;
    });
    const timer = setInterval(()=>{
        if(timeLeft.hr!=0 || timeLeft.min!=0 || timeLeft.sec!=0 || isStopped){
            timeLeft = getTimeLeft(hours,minutes);
            timeLeft.hr = timeLeft.hr == 24 ? 0 : timeLeft.hr;
            timeLeftLabel.textContent = `${timeLeft.hr}h ${timeLeft.min}m ${timeLeft.sec}s left`;
        }else{
            alarmAudio.play();
            if (aSnooze) {
                snoozeButton.hidden = false; 
            } 
        }
    },1000);

    stopButton.addEventListener('click',()=>{
        alarmAudio.pause();
        if(isStopped){
            hours = parseInt(aHours);
            minutes = parseInt(aMinutes);
            timeLeft = getTimeLeft(hours,minutes);
            timeLeftLabel.textContent = `${timeLeft.hr}h ${timeLeft.min}m ${timeLeft.sec}s left`;
            timeLeftLabel.hidden = false;
            stopButton.textContent = 'Stop alarm';
            isStopped = false;
        }else{
            timeLeft = {hr:0,min:0,sec:0};
            timeLeftLabel.hidden = true;
            snoozeButton.hidden = true;
            stopButton.textContent = 'Set alarm';
            isStopped = true;
        }
    })
    deleteAlarm.addEventListener('click',()=>{
        alarmAudio.pause();
        alarmListItem.remove();
        clearInterval(timer);
    })
    alarmListItem.appendChild(deleteAlarm);
    alarmListItem.appendChild(alarmName);
    alarmListItem.appendChild(alarmTime);
    alarmListItem.appendChild(timeLeftLabel);
    buttonCont.appendChild(snoozeButton);
    buttonCont.appendChild(stopButton);
    alarmListItem.appendChild(buttonCont);
    alarmList.appendChild(alarmListItem);
    
}

function getTimeLeft(aHours, aMinutes) {
  const currentTimestamp = new Date();
  const newTimestamp = new Date();
  const currentHour = currentTimestamp.getHours();
  const currentMinutes = currentTimestamp.getMinutes();
  const currentDate = currentTimestamp.getDate();
  if (aHours == currentHour) {
    if (aMinutes <= currentMinutes) {
      newTimestamp.setDate(currentDate + 1);
    }
  } else if (aHours < currentHour) {
    newTimestamp.setDate(currentDate + 1);
  }
  newTimestamp.setHours(aHours);
  newTimestamp.setMinutes(aMinutes);
  newTimestamp.setSeconds("0");

  let timeLeft = newTimestamp.getTime() - currentTimestamp.getTime();
  let h = Math.floor(timeLeft / 1000 / 60 / 60);
  timeLeft -= h * 1000 * 60 * 60;
  let m = Math.floor(timeLeft / 1000 / 60);
  timeLeft -= m * 1000 * 60;
  let s = Math.floor(timeLeft / 1000);
  return {hr:h,min:m,sec:s};
}

function getSoundSrc(soundId){
    switch (soundId) {
      case '1':
        return 'sounds/clock-alarm.mp3';
      case '2':
        return 'sounds/clockSound.mp3';
      case '3':
        return 'sounds/cockSound.wav';
      default:
        return 'sounds/cockSound.wav';
    }
}