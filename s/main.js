

const TASK_ALL_DONE = {title:"NICE", text:"You've done everything!", description:"Scroll all the way to the bottom!", node:null}
const CLASS_TASK = "task";
const CLASS_CATEGORY = "category";
const CLASS_TITLE = "listTitle";

var nowTitleField;
var nowTextField;
var status;
var taskLists;
var doneList;

var nextTasks = [];
var allDone = false;

var nowCategory;
var now;

const DONE_BUTTON_PAUSE = 200; // Anti double-click protection
var doneClicked = 0;

window.onload = function() {
	
	newTask("Hello!", "Click DONE");
	
	parsePage();
	
	loadNext();
	
}

function nah() {
	// unshift now into later
	// add a new task into now
}

function parsePage() {
	
	nowTitleField = document.getElementById("nowTitle");
	nowTextField = document.getElementById("nowText");
	
	doneList = document.getElementById("doneList");
	
	taskLists = document.getElementsByClassName("taskList");
	var i = 0;
	var tl = taskLists.length;
	var taskList;
	var taskListProperties;
	var ttl;
	var j;
	var nc;
	var taskNode;
	var taskData;
	var taskListTitle;
	

	for(i = 0; i < tl; i++) {
	
		taskList = taskLists[i];
		taskListProperties = {uncompleted:0, node:taskList};
		ttl = taskList.childNodes.length;
		
		for (j = 0; j < ttl; j++) {
			
			if (taskList.childNodes[j].classList) {
				taskNode = taskList.childNodes[j];
				nc = taskNode.classList[0];
				taskListTitle = "";
			
				if (nc === CLASS_TITLE) {
					taskListTitle = taskNode.textContent;
				}
				if (taskNode.classList[0] === CLASS_TASK) {
					
					if (isCategory(taskNode)) {
						// do something extra;
					}
					taskData = parseTask(taskNode);
					taskListProperties.uncompleted++;
					newTask(taskListTitle, taskData.text, taskData.description, taskNode, taskListProperties);
					
				}
			}

		} // tasks within a task list loop

	} // task lists loop
	
}

function parseTask(taskNode) {
	var text = "";
	var desc = "";
	var i;
	var n = taskNode.childNodes.length;
	for (i = 0; i < n; i++) {
		if (taskNode.childNodes[i].className === "description") {
			if (desc) {
				desc += " - ";
			}
			desc += taskNode.childNodes[i].textContent;
		} else {
			if (text) {
				text += " - ";
			}
			text += taskNode.childNodes[i].textContent;
		}
	}
	return {text:text, description:desc};
}

function isCategory(node) {
	//taskNode.classList.includes(CLASS_CATEGORY) // doesn't work
}

function newTask(listTitle, taskText, taskDesc, node, list) {
	nextTasks.push({title:listTitle, text:taskText, description:taskDesc, node:node, list:list});
}

function flashStatus() {
	nowTitleField.classList.remove("fadeInText");
	nowTextField.classList.remove("fadeInText");
	nowTitleField.classList.add("clearText");
	nowTextField.classList.add("clearText");
	setInterval(clearStatus, 100);

}
function clearStatus() {
	nowTitleField.classList.remove("clearText");
	nowTextField.classList.remove("clearText");
	nowTitleField.classList.add("fadeInText");
	nowTextField.classList.add("fadeInText");
}

function done() {
	if (!allDone && Date.now() - doneClicked > DONE_BUTTON_PAUSE) {
		doneClicked = Date.now();
		clearNow();
		if (now.list) {
			now.list.uncompleted--;
			if(now.list.uncompleted === 0) {
				now.list.node.remove();
			}
		}
	}
}

function clearNow() {
	recordDone();
	flashStatus();
	loadNext();
}

function recordDone() {
	var time = new Date(Date.now());
	var timeStamp = " - (Completed at " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + ")";
	now.text += timeStamp;
	if (now.node) {
		now.node.textContent += timeStamp;
		doneList.appendChild(now.node);
	}
}

function loadNext() {
	var nt;
	if (nextTasks.length > 0) {
		nt = nextTasks.shift();
	} else {
		nt = TASK_ALL_DONE;
		allDone = true;
	}
	
	if (nt.node) {
		nt.node.remove();
	}
	now = nt;
	nowTitleField.textContent = nt.text;
	nowTextField.textContent = nt.description;
}