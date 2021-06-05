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
    console.log(valueArray)
    return valueArray;
}

async function fillDomTable() {
    let dataContainer = document.getElementById("data-container");

    let tableContent = '';

    let arrayConteudo = await objectToArray()

    arrayConteudo.map((item, index) => {
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

fillDomTable()