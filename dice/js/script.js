document.addEventListener("DOMContentLoaded", function(){
    createMainBox();
    initChart();
});

var numDice = 1;
var diceBox = null;
var myChart = null;
var autoRolling = false;
var interval = null;
var updateChartInterval = null;

const outputClass = [
    "fa-solid fa-dice-one fa-4x",
    "fa-solid fa-dice-two fa-4x",
    "fa-solid fa-dice-three fa-4x",
    "fa-solid fa-dice-four fa-4x",
    "fa-solid fa-dice-five fa-4x",
    "fa-solid fa-dice-six fa-4x"
]

function createMainBox(){
    diceBox = document.getElementById("diceBox");
    document.getElementById("roll-button").onclick = function(){rollClick()};
    document.getElementById("auto-roll-button").onclick = function(){autoRollClick()};
    document.getElementById("dice-num-button").onclick = function(){newDiceNum()};
    blankDice();
}

function roll(){
    removeAllChildNodes(diceBox);
    let total = 0;
    for (let i = 0; i < numDice; i++){
        //random number between 0 and 5
        let num = Math.floor(Math.random()* 6);
        let die = document.createElement("i");
        die.classList = outputClass[num];
        diceBox.appendChild(die);
        total += num + 1;
    }
    document.getElementById("total").innerText = `Total:${total}`;
    addTotal(total);
}

function rollClick(){
    roll();
    updateChart();
}

function autoRollClick(){
    if(autoRolling){
        document.getElementById("auto-roll-button").innerText = "Auto-Roll";
        autoRolling = false;
        clearInterval(interval);
        clearInterval(updateChartInterval);
        updateChart();
    }
    else{
        document.getElementById("auto-roll-button").innerText = "Stop";
        autoRolling = true;
        interval = setInterval(function() {
            roll();
        }, 0);
        updateChartInterval = setInterval(function() {
            updateChart();
        }, 100);
    }
}

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
    for (let i = 0; i < numDice; i++){
        let die = document.createElement("i");
        die.classList = "fa-solid fa-square fa-4x";
        diceBox.appendChild(die);
    }
    document.getElementById("total").innerText = `Total:0`;
}


//chart stuff
function initChart(){
    const minTotal = numDice;
    const maxTotal = numDice*6;
    const labels = [];
    const data = [];
    for (var i = minTotal; i <= maxTotal; i++) {
        labels.push(i);
        data.push(0);
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Rolls',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true//,
                    // ticks: {
                    //     stepSize: 1
                    // }
                }
            },
            animation: {
                duration: 0
            }
        }
    });
}

function addTotal(total) {
    myChart.data.datasets.forEach((dataset) => {
        dataset.data[total-numDice] ++;
    });
}

function updateChart(){
    myChart.update();
}
