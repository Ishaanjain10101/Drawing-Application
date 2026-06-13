const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//buttons
const modal = document.querySelector(".save-dialog");
const nameInput = document.getElementById("nameOfFile");
const confirmButton = document.getElementById("confirm");
const cancelButton = document.getElementById("cancel");
const eraser = document.getElementById("eraser");
const circle = document.getElementById("circle");
const draw = document.getElementById("draw");
const rectangle = document.getElementById("rectangle");
const open = document.getElementById("open");
const line = document.getElementById("line");
const clear = document.getElementById("clear");
const undo = document.getElementById("undo");
const redo = document.getElementById("redo");

//colors
const redColor = document.getElementById("red-color");
const whiteColor = document.getElementById("white-color");
const blackColor = document.getElementById("black-color");
const orangeColor = document.getElementById("orange-color");
const blueColor = document.getElementById("blue-color");
const yellowColor = document.getElementById("yellow-color");
const greenColor = document.getElementById("green-color");
const purpleColor = document.getElementById("purple-color");
const anyColorDiv = document.getElementById("any-color");
const anyColor = document.getElementById("color-picker");


//sizing of the brush
const size = document.getElementById("size");
const sizeNo = document.getElementById("size-no");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");

const optionSelected = {
    "draw":true,
    "erase":false,
    "circle":false,
    "rectangle":false,
    "line":false
}



//tempcanvas for resizing purposes (ps not working)
const tempCanvas = document.createElement("canvas");
const tempCtx = tempCanvas.getContext("2d");

tempCanvas.height = innerHeight;
tempCanvas.width = innerWidth;
canvas.height = innerHeight;
canvas.width = innerWidth;


function restoreCanvas(){

    let width = canvas.width;
    let height = canvas.height;

    tempCtx.width = width;
    tempCtx.height = height;
    tempCtx.drawImage(canvas,0,0);

    canvas.width = innerWidth;
    canvas.height= innerHeight;
    ctx.drawImage(tempCanvas,0,0);
    ctx.lineCap = "round";
    ctx.lineJoin="round";
    ctx.lineWidth = 15;

}


window.addEventListener("resize",restoreCanvas);

restoreCanvas();
//end of resizing

//initial styling
ctx.beginPath();
ctx.fillStyle = "#ffffff";
ctx.fillRect(0,0,innerWidth,innerHeight);
ctx.closePath();

let isDragging = false;
let lineCap = "round";
let lineJoin = "round";
let lineWidth = 15;
let backgroundColor = "white";
let penColor = "black";

ctx.lineCap = lineCap;
ctx.lineJoin= lineJoin;
ctx.lineWidth = lineWidth;

//temporary canvas for drawing shapes
class TempCanvas{
    constructor(){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.height = innerHeight;
        this.canvas.width = innerWidth;
        this.ctx.drawImage(canvas,0,0);
    }
    
}

let tCanvas=new TempCanvas();
let stackCanvas = [];

stackCanvas.push(tCanvas);


plus.addEventListener("click",()=>{
    if(size.value < 100){
        size.value++;
        lineWidth = size.value;
        sizeNo.innerHTML = `${lineWidth}px`;
    }
})
window.addEventListener("keydown",(e)=>{
    if(e.ctrlKey && e.key === "="){
        e.preventDefault();
        if(size.value < 100){
            size.value++;
            lineWidth = size.value;
            sizeNo.innerHTML = `${lineWidth}px`;
        }
    }
})

minus.addEventListener("click",()=>{
    if(size.value > 1){
        size.value--;
        lineWidth = size.value;
        sizeNo.innerHTML = `${lineWidth}px`;
    }
})
window.addEventListener("keydown",(e)=>{
    if(e.ctrlKey && e.key === "-"){
        e.preventDefault();
        if(size.value > 1){
            size.value--;
            lineWidth = size.value;
            sizeNo.innerHTML = `${lineWidth}px`;
        }
    }
})

size.addEventListener("input",()=>{
    lineWidth = size.value;
    sizeNo.innerHTML = `${lineWidth}px`;
})



//Drawing functions
function freeClickDraw(e){
    if(e.clientY > 140){
        ctx.beginPath();    
        ctx.strokeStyle=penColor;
        ctx.lineWidth=lineWidth;
        tCanvas = new TempCanvas();
        
        stackCanvas.push(tCanvas);
        ctx.lineTo(e.clientX,e.clientY);
        ctx.stroke();
   }
}
function freeMouseDownDraw(e){
    if(e.clientY>140){
        ctx.beginPath();    
        isDragging=true;
        ctx.lineWidth=lineWidth;
        ctx.strokeStyle=penColor;
    }
}
function freeMouseDragDraw(e){
    if(isDragging){
        ctx.lineTo(e.clientX,e.clientY);
        ctx.stroke();
    }
}
function freeMouseUpDraw(e){
    isDragging=false;

}


function freeDraw(){
    window.addEventListener("click",freeClickDraw)

    window.addEventListener("mousedown",freeMouseDownDraw);

    window.addEventListener("mousemove",freeMouseDragDraw);

    window.addEventListener("mouseup",freeMouseUpDraw);

}
function removeFreeDraw(){
    window.removeEventListener("click",freeClickDraw);

    window.removeEventListener("mousedown",freeMouseDownDraw);

    window.removeEventListener("mousemove",freeMouseDragDraw);

    window.removeEventListener("mouseup",freeMouseUpDraw);
}


//Erasing functions
function freeClickEraser(e){
    if(e.clientY > 140){
        ctx.beginPath();
        tCanvas = new TempCanvas();
        
        stackCanvas.push(tCanvas);
        ctx.lineWidth=lineWidth;
        ctx.arc(e.clientX,e.clientY,lineWidth/2,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    } 
}
function freeMouseDownEraser(e){
    if(e.clientY > 140){
        ctx.beginPath();    
        isDragging=true;
    }
}
function freeMouseDragEraser(e){
    if(isDragging){
        ctx.lineTo(e.clientX,e.clientY);
        ctx.strokeStyle=backgroundColor;
        ctx.lineWidth=lineWidth;
        ctx.stroke();
    }
}
function freeMouseUpEraser(e){
    isDragging=false;
}


function freeErase(){
    window.addEventListener("click",freeClickEraser)

    window.addEventListener("mousedown",freeMouseDownEraser);

    window.addEventListener("mousemove",freeMouseDragEraser);

    window.addEventListener("mouseup",freeMouseUpEraser);
}
function removeFreeErase(){
    window.removeEventListener("click",freeClickEraser)

    window.removeEventListener("mousedown",freeMouseDownEraser);

    window.removeEventListener("mousemove",freeMouseDragEraser);

    window.removeEventListener("mouseup",freeMouseUpEraser);
}

freeDraw();
draw.classList.add("isSelectedOption");

//Downloading canvas
let isNameConfirm = false;
let nameCustomEventEnter;
let nameCustomEventButton;

function enterSaveEventHandler(e){
    if(e.key === "Enter"){
        e.preventDefault();
        isNameConfirm = true;
        if(isNameConfirm && nameInput.value){
            const name = nameInput.value;
            nameInput.value="";
            modal.close();
            isNameConfirm=false;
            nameCustomEventEnter = new CustomEvent("enter",{
                detail:{
                    name
                }
            });
            document.dispatchEvent(nameCustomEventEnter);
        }
    }
}

function confirmButtonSaveEventHandler(e){
    isNameConfirm = true;
    if(isNameConfirm && nameInput.value){
        const name = nameInput.value;
        nameInput.value="";
        modal.close();
        isNameConfirm=false;
        nameCustomEventButton = new CustomEvent("confirm",{
            detail:{
                name
            }
        });
        document.dispatchEvent(nameCustomEventButton);
    }
}



function saveModalShow(){
    
    return new Promise((resolve,reject)=>{
        modal.showModal();
        document.addEventListener("enter",(e)=>{
            resolve(e.detail.name);
        },{once:true});
        window.addEventListener("keydown",enterSaveEventHandler);

        document.addEventListener("confirm",(e)=>{
            resolve(e.detail.name);
        },{once:true});
        confirmButton.addEventListener("click",confirmButtonSaveEventHandler);
        cancelButton.addEventListener("click",()=>{
            modal.close();
            reject();
        });
        
    })
}

function savingMechanism(){
    removeOtherOptions("");
    const response = saveModalShow();
    response
        .then(name=>{
            window.removeEventListener("keydown",enterSaveEventHandler);
            const canvasDownload = document.createElement("a");
            let tCanvas2 = document.createElement("canvas");
            tCanvas2ctx = tCanvas2.getContext("2d");
            tCanvas2.height = innerHeight-140;
            tCanvas2.width = innerWidth;
            tCanvas2ctx.drawImage(canvas, 0, 140, innerWidth, innerHeight-140, 0, 0,innerWidth, innerHeight-140);
            const canvasUrl = tCanvas2.toDataURL("image/png");
            canvasDownload.href = canvasUrl;
            canvasDownload.download = name + ".png";

            canvasDownload.click();
            canvasDownload.remove();
            freeDraw();
            ctx.clearRect(0,0,innerWidth,innerHeight);
            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0,0,innerWidth,innerHeight);
            ctx.fill();
            ctx.closePath();
            
            tCanvas=new TempCanvas();
            stackCanvas = [];
            
            stackCanvas.push(tCanvas);
            size.value = 15;
            lineWidth = 15;
            isNameConfirm = false;
            sizeNo.innerHTML = `${lineWidth}px`;
            draw.classList.add("isSelectedOption");
        })
        .catch(()=>{
            freeDraw();
        })
}

//shortcut Ctrl + S for saving
window.addEventListener("keydown",(e)=>{
    if(e.ctrlKey && e.key.toLowerCase()==="s"){
        e.preventDefault();
        savingMechanism();
    }
})


document.querySelector("#save").addEventListener("click",()=>{
    savingMechanism();
})
//end of downloading


//switching between Different Modes
const removeOptionFunction =  {
    "draw":removeFreeDraw,
    "erase":removeFreeErase,
    "circle":removeDrawOval,
    "rectangle":removeDrawRectangle,
    "line":removeDrawLine
}
const optionElement = {
    "draw" : draw,
    "erase": eraser,
    "circle": circle,
    "rectangle": rectangle,
    "line": line
}

function removeOtherOptions(option){
    for (let i in removeOptionFunction){
        if(i!==option){
            removeOptionFunction[i]();
            optionSelected.i=false;
            if(optionElement[i].classList.contains("isSelectedOption")){
                optionElement[i].classList.remove("isSelectedOption");
            }
        }
    }
}


//Erase button listener
eraser.addEventListener("click",()=>{
    optionSelected.erase = true;
    eraser.classList.add("isSelectedOption");
    ctx.lineWidth=lineWidth;
    removeOtherOptions("erase");
    freeErase();
});

//Draw button listener
draw.addEventListener("click",()=>{   
    optionSelected.draw = true;
    draw.classList.add("isSelectedOption");
    removeOtherOptions("draw");
    freeDraw();
})


//oval shape class
class Oval{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
        
    }
    update(newX,newY){
        ctx.clearRect(0,0,innerWidth,innerHeight);
        let a = Math.abs(this.x - newX)/2;
        let b = Math.abs(this.y - newY)/2;
        let centerX = (this.x + newX)/2;
        let centerY = (this.y + newY)/2;
        ctx.drawImage(tCanvas.canvas,0,0);
        ctx.beginPath();
        ctx.lineWidth=lineWidth;
        ctx.ellipse(centerX,centerY,a,b,0,0,Math.PI*2);
        ctx.stroke();
        ctx.closePath();
    }

}

let circleInst;
let circleClicked = false;

function freeMouseDownOval(e){
    if(e.clientY>140){
        circleInst = new Oval(e.clientX,e.clientY,penColor);
        ctx.strokeStyle=penColor;
        circleClicked = true;
    }    
}

function freeMouseDragOval(e){
    if(circleClicked){
        circleInst.update(e.clientX,e.clientY);
    }
}

function freeMouseUpOval(e){
    if(e.clientY>140){
        circleClicked = false;
        tCanvas = new TempCanvas();
        
        stackCanvas.push(tCanvas);
    }
    
}

function drawOval(){    
    window.addEventListener("mousedown",freeMouseDownOval);

    window.addEventListener("mousemove",freeMouseDragOval);

    window.addEventListener("mouseup",freeMouseUpOval);
}

function removeDrawOval(){
    window.removeEventListener("mousedown",freeMouseDownOval);

    window.removeEventListener("mousemove",freeMouseDragOval);

    window.removeEventListener("mouseup",freeMouseUpOval);
}

circle.addEventListener("click",()=>{
    optionSelected.circle = true;
    circle.classList.add("isSelectedOption");
    removeOtherOptions("circle");
    drawOval();
})


//Rectangle shape class
class Rect{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
        
    }
    update(newX,newY){
        ctx.clearRect(0,0,innerWidth,innerHeight);
        ctx.drawImage(tCanvas.canvas,0,0);
        ctx.beginPath();
        ctx.lineWidth=lineWidth;
        let width = Math.abs(this.x-newX);
        let height = Math.abs(this.y - newY);
        if(this.x < newX && this.y < newY){
            ctx.rect(this.x,this.y,width,height);
        }
        else if(this.x < newX && this.y > newY){
            ctx.rect(this.x,newY,width,height);
        }
        else if(this.x > newX && this.y < newY){
            ctx.rect(newX,this.y,width,height);
        }
        else if(this.x > newX && this.y > newY){
            ctx.rect(newX,newY,width,height);
        }
        ctx.stroke();
        ctx.closePath();
    }

}

let rectangleInst;
let rectangleClicked = false;

function freeMouseDownRectangle(e){
    if(e.clientY>140){
        rectangleInst = new Rect(e.clientX,e.clientY,penColor);
        ctx.strokeStyle=penColor;
        rectangleClicked = true;
    }
}

function freeMouseDragRectangle(e){
    if(rectangleClicked){
        rectangleInst.update(e.clientX,e.clientY);
    }
}

function freeMouseUpRectangle(e){
    if(e.clientY > 140){
        tCanvas = new TempCanvas();
        
        stackCanvas.push(tCanvas);
        rectangleClicked = false;
    }
}

function drawRectangle(){    
    window.addEventListener("mousedown",freeMouseDownRectangle);

    window.addEventListener("mousemove",freeMouseDragRectangle);

    window.addEventListener("mouseup",freeMouseUpRectangle);
}

function removeDrawRectangle(){
    window.removeEventListener("mousedown",freeMouseDownRectangle);

    window.removeEventListener("mousemove",freeMouseDragRectangle);

    window.removeEventListener("mouseup",freeMouseUpRectangle);
}

rectangle.addEventListener("click",()=>{
    optionSelected.rectangle = true;
    rectangle.classList.add("isSelectedOption");
    removeOtherOptions("rectangle");
    drawRectangle();
})

//line class
class Line{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
        
    }
    update(newX,newY){
        ctx.clearRect(0,0,innerWidth,innerHeight);
        ctx.drawImage(tCanvas.canvas,0,0);
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineWidth=lineWidth;
        ctx.lineTo(newX,newY);
        ctx.stroke();
        ctx.closePath();
    }

}

let lineInst;
let lineClicked = false;

function freeMouseDownLine(e){
    if(e.clientY>140){
        lineInst = new Line(e.clientX,e.clientY,penColor);
        ctx.strokeStyle=penColor;
        lineClicked = true;
    }
}

function freeMouseDragLine(e){
    if(lineClicked){
        lineInst.update(e.clientX,e.clientY);
    }
}

function freeMouseUpLine(e){
    if(e.clientY > 140){
        tCanvas = new TempCanvas();
          
        stackCanvas.push(tCanvas);
        lineClicked = false;
    }
}

function drawLine(){    
    window.addEventListener("mousedown",freeMouseDownLine);

    window.addEventListener("mousemove",freeMouseDragLine);

    window.addEventListener("mouseup",freeMouseUpLine);
}

function removeDrawLine(){
    window.removeEventListener("mousedown",freeMouseDownLine);

    window.removeEventListener("mousemove",freeMouseDragLine);

    window.removeEventListener("mouseup",freeMouseUpLine);
}

line.addEventListener("click",()=>{
    optionSelected.line = true;
    line.classList.add("isSelectedOption");
    removeOtherOptions("line");
    drawLine();
})


//opening other images with canvas to change
open.addEventListener("click",async ()=>{
    
    const pickerOpts = {
        types: [
            {
                description: "Images",
                accept: 
                {
                    "image/*": [".png"],
                },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
        startIn:'downloads'
    };
    try{
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        const file = await fileHandle.getFile();
        const temp = URL.createObjectURL(file);
        const img = document.querySelector("img");
        img.src = temp;
        img.addEventListener("load",()=>{
            ctx.drawImage(img, 0,140,innerWidth,innerHeight-140);
            URL.revokeObjectURL(file);
        })
    }
    catch{
        
    }
    
})

//clearing the page
clear.addEventListener("click",()=>{
    ctx.clearRect(0,0,innerWidth,innerHeight);
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,innerWidth,innerHeight);
    ctx.closePath();
    tCanvas = new TempCanvas();
    stackCanvas.push(tCanvas);
})



//Changing Colors
blackColor.classList.add("isSelected");

const isSelectedList = {
    "black":blackColor,
    "white": whiteColor,
    "red": redColor,
    "orange":orangeColor,
    "blue": blueColor,
    "yellow": yellowColor,
    "green":greenColor,
    "purple":purpleColor,
    "any":anyColorDiv,
}

function removeOtherColor(color){
    for (let [key,value] of Object.entries(isSelectedList)){
        if(key!==color && value.classList.contains("isSelected")){
            value.classList.remove("isSelected");
        }
    }
}


redColor.addEventListener("click",()=>{
    removeOtherColor("red");
    redColor.classList.add("isSelected");
    penColor = "red"
})
whiteColor.addEventListener("click",()=>{
    removeOtherColor("white");
    whiteColor.classList.add("isSelected");
    penColor = "white"
})
blackColor.addEventListener("click",()=>{
    removeOtherColor("black");
    blackColor.classList.add("isSelected");
    penColor = "black"
})
orangeColor.addEventListener("click",()=>{
    removeOtherColor("orange");
    orangeColor.classList.add("isSelected");
    penColor = "orange"
})
blueColor.addEventListener("click",()=>{
    removeOtherColor('blue');
    blueColor.classList.add("isSelected");
    penColor = "blue"
})
yellowColor.addEventListener("click",()=>{
    removeOtherColor("yellow");
    yellowColor.classList.add("isSelected");
    penColor = "yellow"
})
greenColor.addEventListener("click",()=>{
    removeOtherColor("green");
    greenColor.classList.add("isSelected");
    penColor = "green"
})
purpleColor.addEventListener("click",()=>{
    removeOtherColor("purple");
    purpleColor.classList.add("isSelected");
    penColor = "purple";
})
anyColor.addEventListener("input",()=>{
    removeOtherColor("any");
    penColor = anyColor.value;
})

anyColorDiv.addEventListener("click",()=>{
    anyColorDiv.classList.add("isSelected");

})


//Undo & Redo
let currentStackDisplacement=1;
window.addEventListener("keydown",(e)=>{
    if(e.ctrlKey && e.key.toLowerCase() === 'z'){
        
        try{
            ctx.drawImage(stackCanvas[stackCanvas.length-currentStackDisplacement-1].canvas,0,0);
            currentStackDisplacement ++;
        }
        catch{};
    }  
})

window.addEventListener("keydown",(e)=>{
    
    if(e.ctrlKey && e.key.toLowerCase() === 'y'){
       
        try{
            currentStackDisplacement --;
            ctx.drawImage(stackCanvas[stackCanvas.length-currentStackDisplacement].canvas,0,0);
        }
        catch{
            currentStackDisplacement++;
        }
    }  
})

undo.addEventListener("click",()=>{
    try{
        ctx.drawImage(stackCanvas[stackCanvas.length-currentStackDisplacement-1].canvas,0,0);
        currentStackDisplacement ++;
    }
    catch{};
})
undo.addEventListener("mousedown",()=>{
    undo.classList.add("isSelectedOption");
})
undo.addEventListener("mouseup",()=>{
    undo.classList.remove("isSelectedOption");
})

redo.addEventListener("click",()=>{
    try{
        currentStackDisplacement --;
        ctx.drawImage(stackCanvas[stackCanvas.length-currentStackDisplacement].canvas,0,0);
    }
    catch{
        currentStackDisplacement++;
    }
})
redo.addEventListener("mousedown",()=>{
    redo.classList.add("isSelectedOption");
})
redo.addEventListener("mouseup",()=>{
    redo.classList.remove("isSelectedOption");
})


window.addEventListener("mousedown",(e)=>{
    if(e.clientY > 140){
        if(currentStackDisplacement!==1){
            for(currentStackDisplacement;currentStackDisplacement!==0;currentStackDisplacement--){
                stackCanvas.pop();
            }
            tCanvas = new TempCanvas();
            stackCanvas.push(tCanvas);
            currentStackDisplacement = 1; 
        }
    }
})
clear.addEventListener("click",()=>{
    if(currentStackDisplacement!==1){
        for(currentStackDisplacement;currentStackDisplacement!==0;currentStackDisplacement--){
            stackCanvas.pop();
        }
        tCanvas = new TempCanvas();
        stackCanvas.push(tCanvas);
        currentStackDisplacement = 1; 
    }
})