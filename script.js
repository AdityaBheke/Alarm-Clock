let isPlayed = false;
function updateTime(){
  let date = new Date();
  document.querySelector(".current-time").textContent = date.toLocaleTimeString();
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
    const alarmListItem = document.createElement('div');
    alarmListItem.className = 'alarm-list-item';
    const alarmName = document.createElement('span');
    alarmName.textContent = aName;
    const alarmTime = document.createElement('span');
    alarmTime.textContent = aHours +":"+ aMinutes;
    alarmTime.className = 'alarm-time';
    const timeLeft = document.createElement('span');
    const snoozeButton = document.createElement('button');
    snoozeButton.classList.add('set-alarm','snooze-button')
    const stopButton = document.createElement('button');
    stopButton.className = 'set-alarm';
    stopButton.textContent = "Stop alarm";
    const alarmAudio = document.createElement('audio');
    alarmAudio.src = getSoundSrc(aSound);
    alarmAudio.loop = true;
//do something for snooze
    alarmListItem.appendChild(alarmName);
    alarmListItem.appendChild(alarmTime);
    alarmListItem.appendChild(timeLeft);
    alarmListItem.appendChild(stopButton);
    alarmList.appendChild(alarmListItem);
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