window.onload=init;

function init(){
	var postbuttons=document.getElementsByClassName('postStatus');
	for(var i=0;i<postbuttons.length;i++) postbuttons[i].addEventListener('click',changeStatus);
	var delbuttons=document.getElementsByClassName('deleteUser')
	for(var i=0;i<delbuttons.length;i++) delbuttons[i].addEventListener('click',deleteUser);
}

function deleteUser(e){
	var button=e.target;
	e.stopPropagation();
	var id=button.name;
	id=encodeURIComponent(id);
	var str='id='+id;
	var req=new XMLHttpRequest();
	req.open('POST','/deleteUser',true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(str);
	e.preventDefault();
	var parent=button.parentNode;
	var grandparent=parent.parentNode;
	grandparent.removeChild(parent);
	
}
function changeStatus(e){
	var status=true;
	var button=e.target;
	e.stopPropagation();
	var id=button.name;
	if(button.value=="RW"){
		button.value="R";
		status=false;
	} 
	else button.value="RW";
	id=encodeURIComponent(id);
	var str='id='+id+'&'+'status='+status;
	console.log(str);
	var req=new XMLHttpRequest();
	req.open('POST','/changeStatus',true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(str);
	e.preventDefault();
	
}