const playBtnDiv = document.querySelector('.play_button_div');
const playBtn = playBtnDiv.querySelector('.play_button');
const audioBackground = document.querySelector('#audio');
const playField = document.querySelector('.play_field');
const popUp = document.querySelector('.popup');
const gameResult = popUp.querySelector('span');
const countSpan = document.querySelector('.count');

let count;
let intervalId;
let playFromTheVeryStart = true;

function decreasingCount() {
  if (count < 0) {
    audioBackground.pause();
    const audioLose = new Audio('./sound/game_lose.mp3');
    audioLose.play();
    popUp.classList.remove('non_display');
    playBtnDiv.style.visibility = 'hidden';
    clearInterval(intervalId);
    gameResult.innerHTML = `Time out..😅 Wanna play again?`;
    playFromTheVeryStart = true;
    return;
  }
  const timeDisplay = document.querySelector('.time_display');
  timeDisplay.innerHTML = count < 10 ? `00:0${count}` : `00:${count}`;
  --count;
  // console.log(count);
}

function countCarrotFunc() {
  const carrotCount = playField.getElementsByClassName('carrot').length;
  // console.log(carrotCount);
  if (carrotCount < 1) {
    playBtnDiv.style.visibility = 'hidden';
    audioBackground.pause();
    const audioWin = new Audio('./sound/game_win.mp3');
    audioWin.play();
    countSpan.innerHTML = carrotCount;
    clearInterval(intervalId);
    gameResult.innerHTML = 'you won! 🎉';
    popUp.classList.toggle('non_display');
  } else {
    countSpan.innerHTML = carrotCount;
  }
}

function onIconButton(event) {
  const whichIcon = event.target;
  // console.log(whichIcon);
  if (whichIcon.classList.value === 'carrot') {
    whichIcon.remove();
    countCarrotFunc();
    const audioCarrot = new Audio('./sound/carrot_pull.mp3');
    audioCarrot.play();
  } else {
    clearInterval(intervalId);
    gameResult.innerHTML = 'You clicked the bug😝 wanna play again?';
    popUp.classList.toggle('non_display');
    const audioBug = new Audio('./sound/bug_pull.mp3');
    audioBug.play();
    audioBackground.pause();
    playBtnDiv.style.visibility = 'hidden';
  }
}

function getRandomCoor(min, max) {
  var minV = Math.ceil(min);
  var maxV = Math.floor(max);
  return Math.random() * (maxV - minV) + minV;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 참고
}

function creatIcon(iconName, iconPath) {
  iconName.src = `./img/${iconPath}.png`;
  iconName.classList.add(`${iconPath}`);
  iconName.addEventListener('click', onIconButton);
  const playCoor = playField.getBoundingClientRect();
  var translateX = getRandomCoor(0, playCoor.right);
  var translateY = getRandomCoor(-35, playCoor.bottom - playCoor.top);
  iconName.style.transform = `translate(${translateX - 10}px,${translateY}px)`;
  return iconName;
}

function activateReplayBtn() {
  const replayBtn = document.querySelector('.fa-reply-all');

  replayBtn.addEventListener('click', startGame);
}

function createCarrotIcon() {
  const imgCarrot = new Image();
  const carrotItems = creatIcon(imgCarrot, 'carrot');
  return carrotItems;
}

function createBugIcon() {
  const imgBug = new Image();
  const bugItems = creatIcon(imgBug, 'bug');
  return bugItems;
}

function displayAll() {
  init().then(items => {
    //아이콘 초기화
    playField.innerHTML = '';
    // json안에 있는 data를 전달해주긴 했지만 그걸 사용하지는 않았음.
    const carrotItems = items.map(createCarrotIcon);
    const bugItems = items.map(createBugIcon);
    // console.log(carrotItems[0],typeof bugItems);
    playField.append(...carrotItems);
    playField.append(...bugItems);
    countCarrotFunc();
  });
}

function startAgain() {
  playBtnDiv.style.visibility = 'visible';
  playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  audioBackground.play();
  count = 10;
  clearInterval(intervalId);
  intervalId = setInterval(decreasingCount, 1000);
  popUp.classList.add('non_display');
  displayAll();
}

function startGame(event) {
  if (playFromTheVeryStart === true) {
    activateReplayBtn();
    startAgain();
    playFromTheVeryStart = false;

    // console.log(intervalId);
  } else if (playFromTheVeryStart === false) {
    if (event.target.classList.contains('fa-pause')) {
      playBtn.innerHTML = `<i class="fas fa-play"></i>`;
      audioBackground.pause();
      clearInterval(intervalId);
      popUp.classList.toggle('non_display');
      gameResult.innerHTML = `Restart?`;
    }

    if (event.target.classList.contains('fa-play')) {
      playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      audioBackground.play();
      intervalId = setInterval(decreasingCount, 1000);
      popUp.classList.toggle('non_display');
    }

    if (event.target.classList.contains('fa-reply-all')) {
      startAgain();
    }
  }
}

//main
function init() {
  playBtnDiv.addEventListener('click', startGame);

  return fetch('./data/data.json')
    .then(response => response.json())
    .then(json => json.items);
}

init();

// 로직순서
// 1. 플레이 버튼을 누르면 안에 innerHtml이 바뀌면서 타이머가 시작되고 노래가 나옴 C
// 2. 그리고 ul안에 캐릭터가 출력
// 3. count가 나타남
// 4. 당근을 클릭했을때 당근을 없어지게 함.
// 당근의 위치를 랜덤으로 결정되게 하는 방법. random 함수를 쓴다음 transform을 이용해서 그 값을 pass하면 됨

// 성공했을경우
// 1. 시간이 끝나기 전에 당근을 다 클릭했으면 시간 중지.
// 2. 재생버튼 없어짐
// 3. 팝업창이 나타나면서 이겼다고 나옴
// 4. 리플레이를 클릭하면 시작함수로 돌아감

// 실패했을경우
// 1. 타이머가 멈춤
// 2. 팝업창이 뜨면서 실패했다고 메세지가 바뀜.
// 3. 리플레이버튼을 누르면 시작함수로 돌아감

// 설명팝업 니코 10* 홈피보고 만들어보기. 에니메이션도 넣어가면서
