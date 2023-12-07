
async function fetchData() {
    try {
        const response = await fetch('table.json');
        const jsonData = await response.json();

        function createTableElement(table) {
            const tableElement = document.createElement('table');
            tableElement.className = 'table';
            tableElement.color = table.color;
            for (let i = 0; i < table.size; i++) {
                const row = document.createElement('tr');
                for (let j = 0; j < table.size; j++) {
                    const cell = document.createElement('td');
                    row.appendChild(cell);
                }
                tableElement.appendChild(row);
            }

            let animationPaused = false;
            let count = 0;
            let direction = 1;
            let currentPerimeterIndices = [];
            const cells = tableElement.querySelectorAll('td');

            function colorCells() {
                const perimeterIndices = [];

                for (let i = count; i <= table.size - count - 1; i++) {
                    perimeterIndices.push(count * table.size + i, (table.size - count - 1) * table.size + i);
                    perimeterIndices.push(i * table.size + count, i * table.size + table.size - count - 1);
                }

                perimeterIndices.push(count * table.size + count, count * table.size + table.size - count - 1);
                perimeterIndices.push((table.size - count - 1) * table.size + count, (table.size - count - 1) * table.size + table.size - count - 1);

                perimeterIndices.forEach(index => {
                    cells[index].style.backgroundColor = table.color;
                });

                currentPerimeterIndices.forEach(index => {
                    if (!perimeterIndices.includes(index)) {
                        cells[index].style.backgroundColor = 'rgb(195, 195, 190)';
                    }
                });

                currentPerimeterIndices = [...perimeterIndices];

                count += direction;

                if (table.size % 2 !== 0) {
                    if (count >= (table.size - 1) / 2 || count <= 0) {
                        direction *= -1;
                    }
                } else {
                    if (count >= table.size / 2 || count <= 0) {
                        direction *= -1;
                    }
                }
            }

            tableElement.addEventListener('click', () => {
                animationPaused = !animationPaused;
                if (!animationPaused) {
                    startAnimation();
                }
            });

            function startAnimation() {
                if (!animationPaused) {
                    colorCells();
                    setTimeout(startAnimation, 500); // Set the timeout to control the animation speed
                }
            }

            startAnimation();

            return tableElement;
        }

        const randomIndex = Math.floor(Math.random() * jsonData.tables.length);
        const randomTable = jsonData.tables[randomIndex];

        const body = document.body;
        const tableElement = createTableElement(randomTable);

        body.appendChild(tableElement);
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
    }
}

function refreshPage() {
    location.reload();
}

fetchData();