document.addEventListener("DOMContentLoaded", function(event) {
    
let socket = io();

function validateUser(){
  socket.emit('login' , {
            username : loginInput.value,
            password : loginPass.value,
        })    
}

socket.on('logged_in' , (data)=>{      
  loginBox.classList.add('hide');
  chatBox.classList.remove('hide');
  displayUser.innerText = `Hi ${data.username} ,`;  
})


socket.on('login_failed' , ()=>{
  alert('Invalid Username or Password');
});


socket.on('unfilled' , ()=>{
alert('Please eneter a valid Username and password')
})

function sendMsg(){
  socket.emit('msg_send' , {
            msg: msgBox.value,        
            username : loginInput.value,
            to: toUser.value
        })
}

socket.on('msg_rcvd' , (data)=>{
  let li = document.createElement('li');
  li.innerText = `[${data.from}] : ${data.msg}`;
  ulList.appendChild(li);
})

chatBox.classList.add('hide');
//login button clicked
loginBtn.addEventListener('click' , validateUser)

//send button got clicked
sendMsgBtn.addEventListener('click' , sendMsg)



/* Build out functions */
function togglePlay() {
  socket.emit('togglePlay');
}

socket.on('toggletoall' ,()=>{
  const method = video.paused ? 'play' : 'pause';
  video[method]();
})

function updateButton() {
  const icon = this.paused ? '▶' : '⏸';
  console.log(icon);
  toggle.textContent = icon;
}

function skip() {
 video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

});







