async function getDatabaseValues() {
    let response = await fetch('https://pi8sem-6dd50-default-rtdb.firebaseio.com/dados.json');
    let data = await response.json();
    return data;
}

async function objectToArray() {
    let databaseData = await getDatabaseValues();
    var valueArray = []

    for (var key in databaseData) {
        if (!databaseData.hasOwnProperty(key)) continue;

        var obj = databaseData[key];

        valueArray.push(obj);
    }
    return valueArray;
}

async function fillDomTable() {
    let dataContainer = document.getElementById("data-container");

    let tableContent = '';

    let contentArray = await objectToArray()

    contentArray.map((item, index) => {
        tableContent += `
        <tr>
            <th scope="row">${index}</th>
            <td>${item.nome}</td>
            <td>${item.idade}</td>
            <td>${item.rg}</td>
            <td>${item.diaehora}</td>
            <td>${item.soma}</td>
        </tr>`
    })

    dataContainer.innerHTML = tableContent;
}

async function getPerAgeArrays() {
    let contentArray = await objectToArray()

    let perAgeArray = []

    perAgeArray = [
        contentArray.filter(value => {
            return value.idade < 50;
        }),
        contentArray.filter(value => {
            return value.idade >= 50 && value.idade <= 59;
        }),
        contentArray.filter(value => {
            return value.idade >= 60 && value.idade <= 69;
        }),
        contentArray.filter(value => {
            return value.idade >= 70 && value.idade <= 79;
        }),
        contentArray.filter(value => {
            return value.idade >= 80 && value.idade <= 89;
        }),
        contentArray.filter(value => {
            return value.idade >= 90 && value.idade <= 99;
        }),]

    return perAgeArray;
}

async function getPontuationAveragesArray() {
    let perAgeArray = await getPerAgeArrays();

    let pontuationArray = [0, 0, 0, 0, 0, 0];

    for (let i = 0; i <= 5; i++) {
        perAgeArray[i].forEach(element => {
            pontuationArray[i] += element.soma;
        })

        if (perAgeArray[i].length) {
            pontuationArray[i] = pontuationArray[i] / perAgeArray[i].length;
        }
    }

    return pontuationArray;
}

async function getAgesArray() {
    let perAgeArray = await getPerAgeArrays();

    let agesArray = [0, 0, 0, 0, 0, 0];

    for (let i = 0; i <= 5; i++) {
        agesArray[i] = perAgeArray[i].length;
    }

    return agesArray;
}

async function fillSummary(){
    let summaryElement = document.getElementById("summary");
    let pontuationAveragesArray = await getPontuationAveragesArray();
    let agesArray = await getAgesArray();

    let content = ` <h3>O estudo teve:</h3> <br/>
    <h4>${agesArray[0]} participantes até 50 anos e tiveram a média de ${pontuationAveragesArray[0].toFixed(3)}</h4> <br/>
    <h4>${agesArray[1]} participantes entre 50 e 59 anos e tiveram a média de ${pontuationAveragesArray[1].toFixed(3)}</h4><br/>
    <h4>${agesArray[2]} participantes entre 60 e 69 anos e tiveram a média de ${pontuationAveragesArray[2].toFixed(3)}</h4><br/>
    <h4>${agesArray[3]} participantes entre 70 e 79 anos e tiveram a média de ${pontuationAveragesArray[3].toFixed(3)}</h4><br/>
    <h4>${agesArray[4]} participantes entre 80 e 89 anos e tiveram a média de ${pontuationAveragesArray[4].toFixed(3)}</h4><br/>
    <h4>${agesArray[5]} participantes entre 90 e 99 anos e tiveram a média de ${pontuationAveragesArray[5].toFixed(3)}</h4><br/> <br/>
    <h4>Contando com ${agesArray[0] + agesArray[1] + agesArray[2] + agesArray[3] + agesArray[4] + agesArray[5]} participantes`

    summaryElement.innerHTML=content;
}

async function generatePontuationchart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var ctx2 = document.getElementById('myChart2').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Menores de 50', '50-59', '60-69', '70-79', '80-89', '90-99'],
            datasets: [{
                label: 'Pontuação média por faixa etária',
                data: await getPontuationAveragesArray(),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Menores de 50', '50-59', '60-69', '70-79', '80-89', '90-99'],
            datasets: [{
                label: 'Numero de participantes por idade',
                data: await getAgesArray(),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function selectTable() {
    document.getElementById("nav-table").classList.add("selected");
    document.getElementById("nav-graph").classList.remove("selected");
    document.getElementById("nav-sumary").classList.remove("selected");
    document.getElementById("myChart").classList.add("d-none");
    document.getElementById("myChart2").classList.add("d-none");
    document.getElementById("dataTable").classList.remove("d-none");
    document.getElementById("summary").classList.add("d-none");
}

function selectGraph() {
    document.getElementById("nav-table").classList.remove("selected");
    document.getElementById("nav-graph").classList.add("selected");
    document.getElementById("nav-sumary").classList.remove("selected");
    document.getElementById("myChart").classList.remove("d-none");
    document.getElementById("myChart2").classList.remove("d-none");
    document.getElementById("dataTable").classList.add("d-none");
    document.getElementById("summary").classList.add("d-none");

}

function selectSumary() {
    document.getElementById("nav-table").classList.remove("selected");
    document.getElementById("nav-graph").classList.remove("selected");
    document.getElementById("nav-sumary").classList.add("selected");
    document.getElementById("myChart").classList.add("d-none");
    document.getElementById("myChart2").classList.add("d-none");
    document.getElementById("dataTable").classList.add("d-none");
    document.getElementById("summary").classList.remove("d-none");
}

fillDomTable();
generatePontuationchart()
fillSummary();