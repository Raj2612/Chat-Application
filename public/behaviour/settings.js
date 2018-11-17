window.onload=init;

function init(){
	var post=document.getElementById('post');
	var remember=document.getElementById('remember');
	post.addEventListener('click',updateServer);
	remember.addEventListener('click',updateServer,false);
}
function updateServer(e){
	e.stopPropagation();
	console.log(e.target);
	var id=e.target.id;
	var str='id='+id;
	var req=new XMLHttpRequest();
	req.open('POST','/settings',true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(str);

}