let user = JSON.parse(localStorage.getItem("user")) || null;
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let dms = JSON.parse(localStorage.getItem("dms")) || [];
let follows = JSON.parse(localStorage.getItem("follows")) || [];
let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

function save(){
 localStorage.setItem("user",JSON.stringify(user));
 localStorage.setItem("posts",JSON.stringify(posts));
 localStorage.setItem("dms",JSON.stringify(dms));
 localStorage.setItem("follows",JSON.stringify(follows));
 localStorage.setItem("notifications",JSON.stringify(notifications));
}

function show(page){

const s=document.getElementById("screen");

if(page=="home"){
 renderStories();
}

if(page=="community"){
 s.innerHTML=`
 <h2>커뮤니티</h2>
 <textarea id="text"></textarea>
 <input type="file" id="img">
 <button onclick="write()">글쓰기</button>
 <div id="plist"></div>
 `;
div.innerHTML += `
<div class="feed-card">

 <div class="feed-header">
   <img src="${p.user.img}">
   <div>
     <b>${p.user.name}</b>
     ${p.user.role=="artist"?"<span class='badge'>ARTIST</span>":""}
   </div>
 </div>

 <div>${p.text}</div>

 ${p.img?`<img src="${p.img}" class="feed-img">`:""}

 <div style="margin-top:10px">
   <button onclick="like(${p.id})">🤍 ${p.likes}</button>
   <button onclick="openDM('${p.user.name}')">DM</button>
 </div>

</div>
`;

}

if(page=="profile"){
 s.innerHTML=`
 <h2>프로필</h2>
 이름<input id="name"><br>
 역할<select id="role"><option>fan</option><option>artist</option></select><br>
 프사<input type="file" id="pimg"><br>
 <button onclick="saveProfile()">저장</button>
 `;
}

if(page=="dm"){
 renderDMList();
}
}

function saveProfile(){
 const name=document.getElementById("name").value;
 const role=document.getElementById("role").value;
 const file=document.getElementById("pimg").files[0];

 const reader=new FileReader();
 reader.onload=function(){
  user={name,role,img:reader.result};
  save();
 };
 reader.readAsDataURL(file);
}

function renderStories(){
 const s=document.getElementById("screen");
 let artists=posts.filter(p=>p.user.role=="artist");
 let html="<h2>Artists</h2>";
 artists.forEach(a=>{
  html+=`
  <div class="story">
   <img src="${a.user.img}">
   <div>${a.user.name}</div>
   <button onclick="follow('${a.user.name}')">팔로우</button>
  </div>
  `;
 });
 s.innerHTML=html;
}

function follow(name){
 if(!follows.includes(name)){
  follows.push(name);
  notifications.push(name+" 팔로우");
  save();
 }
}

function write(){
 const text=document.getElementById("text").value;
 const file=document.getElementById("img").files[0];

 const reader=new FileReader();
 reader.onload=function(){
  posts.unshift({
   id:Date.now(),
   text,
   img:reader.result,
   likes:0,
   user:user
  });
  save();
  renderPosts();
 };
 if(file) reader.readAsDataURL(file);
}

function renderPosts(){
 const div=document.getElementById("plist");
 if(!div) return;
 div.innerHTML="";
 posts.forEach(p=>{
  div.innerHTML+=`
  <div class="post">
  <b>${p.user.name} ${p.user.role=="artist"?"<span class='badge'>✔</span>":""}</b>
  <p>${p.text}</p>
  ${p.img?`<img src="${p.img}" width="100%">`:""}
  <button onclick="like(${p.id})">공감 ${p.likes}</button>
  <button onclick="openDM('${p.user.name}')">DM</button>
  </div>
  `;
 });
}

function like(id){
 const p=posts.find(x=>x.id==id);
 p.likes++;
 save();
 renderPosts();
}

function openDM(name){
 const s=document.getElementById("screen");
 s.innerHTML=`
 <div class="chatbox" id="chat"></div>
 <input id="msg">
 <button onclick="sendDM('${name}')">send</button>
 `;
 renderChat(name);
}

function sendDM(name){
 const text=document.getElementById("msg").value;
 dms.push({to:name,from:user.name,text,read:false});
 notifications.push("새 DM");
 save();
 renderChat(name);
}

function renderChat(name){
 const c=document.getElementById("chat");
 c.innerHTML="";
 dms.filter(m=>m.to==name||m.from==name).forEach(m=>{
  m.read=true;
  c.innerHTML+=`
  <div class="${m.from==user.name?"msgme":"msgother"}">
   ${m.text} ${m.read?"✔":""}
  </div>
  `;
 });
 save();
}

function renderDMList(){
 const s=document.getElementById("screen");
 let html="<h2>DM</h2>";
 dms.forEach(m=>{
  html+=`<div onclick="openDM('${m.from}')">${m.from}</div>`;
 });
 s.innerHTML=html;
}

show("home");
