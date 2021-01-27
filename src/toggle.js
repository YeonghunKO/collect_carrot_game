const jsToggle = document.querySelectorAll('.js_toggle');
const toggleContent = document.querySelector('.toggle_content');
const toggleSection = toggleContent.querySelector('.toggle_section');
const swooshSound = new Audio('./sound/swoosh.mp3');
const blobSound = new Audio('./sound/blop.mp3');

function toggleFunc(event) {
  const btnClass = event.target.classList[1];
  //   console.log(btnClass);
  if (btnClass === 'open_toggle') {
    swooshSound.play();
    toggleContent.classList.toggle('non_display');
    toggleContent.classList.replace('swirl-out-bck', 'swirl-in-fwd');
    setTimeout(toggleSectionAppear, 400);
    function toggleSectionAppear() {
      sectionToggle();
    }
  } else {
    blobSound.play();
    toggleContent.classList.toggle('non_display');
    // toggleContent.classList.replace('swirl-in-fwd', 'swirl-out-bck');
    sectionToggle();
  }

  function sectionToggle() {
    toggleSection.classList.toggle('non_display');
    toggleSection.classList.toggle('bounce-in-top');
  }
}

function init() {
  jsToggle.forEach(btn => btn.addEventListener('click', toggleFunc));
}

init();
