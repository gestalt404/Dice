document.addEventListener("DOMContentLoaded", function(){
    createMainBox();
    initChart();
});

var numDice = 1;
var diceSides = 6;
var numRolls = 0;
var autoRolling = false;

var updateChartInterval, diceBox, myChart, interval = null;

var labels, data, probArr, pred;

const outputClass = [
    "fa-solid fa-dice-one fa-4x fa-shake",
    "fa-solid fa-dice-two fa-4x fa-shake",
    "fa-solid fa-dice-three fa-4x fa-shake",
    "fa-solid fa-dice-four fa-4x fa-shake",
    "fa-solid fa-dice-five fa-4x fa-shake",
    "fa-solid fa-dice-six fa-4x fa-shake"
]

function createMainBox(){
    diceBox = document.getElementById("diceBox");
    diceBox.onclick = function(){rollClick()};
    // document.getElementById("roll-button").onclick = function(){rollClick()};
    document.getElementById("auto-roll-button").onclick = function(){autoRollClick()};
    // document.getElementById("dice-num-button").onclick = function(){newDiceNum()};
    // document.getElementById("dice-type-button").onclick = function(){newDiceType()};
    document.getElementById("chart-dropdown-button").onclick = function(){dropChart()};

    document.getElementById("set-d-6").onclick = function(){setD6()};
    document.getElementById("set-d-20").onclick = function(){setD20()};
    document.getElementById("reset").onclick = function(){reset()};

    document.getElementById("addDie").onclick = function(){addDie()};
    document.getElementById("removeDie").onclick = function(){removeDie()};
    blankDice();
}

function reset(){
    autoRolling = false;
    clearInterval(interval);
    clearInterval(updateChartInterval);
    diceSides = 6;
    numDice = 1;
    myChart.destroy();
    initChart();
    blankDice();
}

function setD6(){
    diceSides = 6;
    myChart.destroy();
    initChart();
    blankDice();
}

function setD20(){
    diceSides = 20;
    myChart.destroy();
    initChart();
    blankDice();
}

function addDie(){
    numDice++;
    myChart.destroy();
    initChart();
    blankDice();
}

function removeDie(){
    if(numDice <= 1) return;
    numDice--;
    myChart.destroy();
    initChart();
    blankDice();
}

function dropChart(){
    let chartDiv = document.getElementById("chartDiv");
    let button = document.getElementById("chart-dropdown-button");
    if(chartDiv.classList.contains("hidden")){
        chartDiv.classList.remove("hidden");
        button.classList.remove("fa-square-caret-down");
        button.classList.add("fa-square-caret-up");
    }
    else{
        chartDiv.classList.add("hidden");
        button.classList.add("fa-square-caret-down");
        button.classList.remove("fa-square-caret-up");
    }
}

function createDiceViz(num, diceSides){
    let die = document.createElement("i");
    if(diceSides == 6){
       die.classList = outputClass[num]; 
       diceBox.appendChild(die);
    }
    else{
        let div = document.createElement("div");
        let span = document.createElement("span");
        span.classList = "fa-layers fa-fw";

        let text = document.createElement("span");
        text.classList = "fa-layers-text fa-inverse";
        text.innerText = num;

        die.classList = "fa-solid fa-square fa-4x fa-shake";

        span.appendChild(die);
        span.appendChild(text);
        div.appendChild(span);
        diceBox.appendChild(div);
    }
}

function roll(){
    numRolls++;
    removeAllChildNodes(diceBox);
    let total = 0;
    for (let i = 0; i < numDice; i++){
        //random number between 0 and 5
        let num = Math.floor(Math.random()* diceSides);
        createDiceViz(num, diceSides);
        total += num + 1;
    }
    document.getElementById("total").innerText = `Total: ${total}`;
    document.getElementById("rolls").innerText = `#Rolls: ${numRolls}`;
    addTotal(total);
}

function rollClick(){
    roll();
    myChart.update();
}

function autoRollClick(){
    let button = document.getElementById("auto-roll-button");
    if(autoRolling){
        button.classList.remove("fa-pause");
        button.classList.add("fa-play");
        autoRolling = false;
        clearInterval(interval);
        clearInterval(updateChartInterval);
        myChart.update();
    }
    else{
        button.classList.remove("fa-play");
        button.classList.add("fa-pause");
        autoRolling = true;
        interval = setInterval(function() {
            roll();
        }, 0);
        updateChartInterval = setInterval(function() {
            myChart.update();
        }, 100);
    }
}

// function newDiceType(){
//     diceSides = document.getElementById("typeDice").value;
//     myChart.destroy();
//     initChart();
//     blankDice();
// }

function newDiceNum(){
    numDice = document.getElementById("numDice").value;
    myChart.destroy();
    initChart();
    blankDice();
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function blankDice(){
    removeAllChildNodes(diceBox);
    if(diceSides == 6){
        for (let i = 0; i < numDice; i++){
            let die = document.createElement("i");
            die.classList = "fa-solid fa-square fa-4x";
            diceBox.appendChild(die);
        }
    }
    else if(diceSides == 20){
        for (let i = 0; i < numDice; i++){
            let die = document.createElement("i");
            die.classList = "fa-solid fa-circle fa-4x";
            diceBox.appendChild(die);
        }
    }
    
    document.getElementById("total").innerText = `Total:`;
    document.getElementById("rolls").innerText = `#Rolls:0`;
}

function doComb(data){
    let ret = [];
    for(i=0;i<data.length;i++){
        ret.push(probSumY(data[i], numDice, diceSides))
    }
    return ret;
}

function initChartData(){
    data = [];
    labels = [];
    for (var i = numDice; i <= numDice*diceSides; i++) {
        labels.push(i);
        data.push(0);
    }
    pred = doComb(labels);
    probArr = [...pred];
}


//chart stuff
function initChart(){
    numRolls = 0;
    initChartData();

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: [{
                type: 'bar',
                label: '# of Rolls',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                type: 'line',
                label: 'Prediction',
                data: pred
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            animation: {
                duration: 0
            }
        }
    });
}

function addTotal(total) {
    data[total-numDice] ++; 

    for(let i = 0; i < pred.length; i++){
        pred[i] = probArr[i] * numRolls;
    }
}
