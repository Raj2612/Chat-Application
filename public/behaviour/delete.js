window.onload=init;

function init(){
	var buttons=document.getElementsByClassName('deleteMessage');
	for(var i=0;i<buttons.length;i++)
		buttons[i].addEventListener('click',deleteMessage);
}
function deleteMessage(e){
	var button=e.target;
	e.stopPropagation();
	var id=button.name;
	console.log(id);
	id=encodeURIComponent(id);
	var str='id='+id;
	var req=new XMLHttpRequest();
	req.open('POST','/deletePost',true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(str);
	e.preventDefault();
	var parent=button.parentNode;
	var grandparent=parent.parentNode;
	grandparent.removeChild(parent);
	
}