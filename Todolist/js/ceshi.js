//main()
load();
judgeDone();
//初始化函数
function init(){
	localStorage.clear();
	alert("Todolist已重置");
	if(!window.localStorage){
		alert("浏览器不支持localstorage");
	}
	else{
		var data=[];
		data=JSON.stringify(data);
		localStorage.setItem("todolist",data);
	}
	load();
}
//添加函数，从表单获取事件，加入数组，然后转化存入本地
function add(){
	var input=document.getElementById("input");
	var time=document.getElementById("time");
	if(input.value===""){
		alert("待办事项为空，请重新输入。");
		return false;
	}
	var temp={
		content:input.value,
		deadline:time.value,
		done:false,
		expire:false
	}
	var data=getData();
	data.push(temp);
	saveData(data);
	load();
}
//判断事件是否完成
function judgeDone(){
	var todo_ul=document.getElementById("todoarea-list");
	var todo_li=todo_ul.children;
	for(let i=0;i<todo_li.length;i++){
		
	}
	//addEventListener("click",function(){alert("测试完成函数");});
	//alert("测试完成函数");
}
//从本地获取数据，转化为数组
function getData(){
	//console.log("case2");
	var data=localStorage.getItem("todolist");
	return JSON.parse(data);
}
//数组内容更新后，保存入本地
function saveData(data){
	localStorage.setItem("todolist",JSON.stringify(data));
}
//利用数据更新页面
function load(){
	var todo_ul_node=document.getElementById("todoarea-list");
	var expire_ul_node=document.getElementById("expirearea-list");
	var done_ul_node=document.getElementById("donearea-list");
	var data=getData();
	judgeExpire();
	//清空页面上已有元素，方便重新加载
	todo_ul_node.innerHTML="";
	if(data.length===0){
		return false;
	}
	for(let i=0;i<data.length;i++){
		var new_li=document.createElement("li");
		
		var new_checkbox=document.createElement("input");
		new_checkbox.setAttribute("type","checkbox");
		new_li.appendChild(new_checkbox);
		var new_text=document.createTextNode(data[i].deadline+" : "+data[i].content);
		new_li.appendChild(new_text);
		

		//new_li.innerText=data[i].deadline+" : "+data[i].content;
		if(data[i].expire===true){
			expire_ul_node.appendChild(new_li);
		}
		else if(data[i].done===true){
			done_ul_node.appendChild(new_li);
		}
		else todo_ul_node.appendChild(new_li);
	}
}
//判断事件是否过期
function judgeExpire(){
	var data=getData();
	var now=new Date();
	for(let i=0;i<data.length;i++){
		let time=Date.parse(data[i].deadline);
		if(time<now.getTime()){
			data[i].expire=true;
		}
	}
	saveData(data);
}