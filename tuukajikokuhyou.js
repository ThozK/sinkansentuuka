document.addEventListener("DOMContentLoaded", function () {
    async function loadCSV(filename) {
        const response = await fetch(filename);
        const data = await response.text();
        return data;
    }

    const csvFilePath = 'jikoku.csv';
    let countLoad = 0;
    let alldata;

    function arrangeData() {
        const lines = alldata.split('\r\n'); //or\r 
        const headers = lines[0].split(',');
        const siteIndex = headers.indexOf('site');

        for (let i = 1; i < 64; i++) {  // site number 64
            const filteredLines = lines.filter(line => {
                const columns = line.split(',');
                const site = parseInt(columns[siteIndex]);
                return site === i;
            });

            const names = L.marker([filteredLines[0].split(',')[1], lines[i].split(',')[2]]).addTo(map);

            let hoursNobori = Array(18).fill("").map(() => "");
            let hoursKudari = Array(18).fill("").map(() => "");

            filteredLines.forEach(line => {
                const columns = line.split(',');
                const direction = columns[3].substr(0, 1);
                const hour = parseInt(columns[4]);
                const time = columns[5].toString();
                const isStar = columns[6] == 1 ? "*" : "";

                if (direction === "u") {
                    hoursNobori[hour - 6] += time + isStar + "  ";
                } else if (direction === "d") {
                    hoursKudari[hour - 6] += time + isStar + "  ";
                }
            });

            const createTableRow = (hour, nobori, kudari) => {
                return `<tr><td>${nobori}</td><td>${hour}時</td><td>${kudari}</td></tr>`;
            };

            const popupContent = `
             <table>
              <tr><th>金沢行（上り）</th><th></th><th>敦賀行（下り）</th></tr>
               ${[...Array(18).keys()].map(hour => createTableRow(hour + 6, hoursNobori[hour], hoursKudari[hour])).join('')}
             </table>
             <span style="font-size:small">*のマークは、臨時列車や土日運行列車<span>
            `;

            names.bindPopup(popupContent);
        }

    }


    loadCSV(csvFilePath)
        .then(csvData => {
            alldata = csvData;
            arrangeData();
            if (countLoad === 0) {
            }
        })
        .catch(error => {
            console.error('CSV読み込みエラー:', error);
        });

}
)

var map = L.map('map').setView([36.0041090565548, 136.1610991969648], 9); // sabae

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


