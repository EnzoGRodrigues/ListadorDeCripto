const buttonSearchCrypto = document.getElementById('update-btn')
const tableBody = document.getElementById('crypto-table-body')
const statusMessage = document.getElementById('status-message');

const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
const cryptoDataMap = new Map()



function convertCrypoApi(crypoDetail) { //converte os dados da API para o formato da classe Crypto
    let listCoins = [] //array que vai armazenar as criptomoedas convertidas
    for (let i = 0; crypoDetail.length && i < 10; i++) { //percorre o array de criptomoedas retornado pela API, mas limita a 10 itens
        const crypto = new Crypto() //cria um novo objeto da classe Crypto
        
        //atribui os valores retornados pela API para os atributos do objeto
        crypto.name = crypoDetail[i].name 
        crypto.img = crypoDetail[i].image 
        crypto.currentPrice = crypoDetail[i].current_price
        crypto.symbol = crypoDetail[i].symbol ? crypoDetail[i].symbol.toUpperCase() : 'N/A' //verifica se o símbolo existe, se não existir atribui 'N/A'

        listCoins.push(crypto) //adiciona o objeto ao array
    }
    return listCoins
}

function getCryptoDetails() { //função que busca os dados da API
    return fetch(url)
        .then((response) => response.json())
        .then(convertCrypoApi) //converte os dados retornados pela API para o formato da classe Crypto
}

function renderCryptoTable() {
    statusMessage.textContent = 'Carregando dados...' // Mensagem de status
    statusMessage.className = 'message loading' // estilo de carregamento
    tableBody.innerHTML = '' // Limpa o conteúdo da tabela
    getCryptoDetails() // Obtém os detalhes das criptomoedas, chamando a função getCryptoDetails
        .then((cryptoList) => { //cryptoList esta recebendo o array retornado pela função getCryptoDetails
            statusMessage.textContent = '' // Limpa a mensagem de status
            cryptoList.forEach((crypto, index) => { //para cada elemento do array ele cria uma linha na tabela
                const row = document.createElement('tr') // cria uma nova linha na tabela. tr = table row

                //coluna do ranking
                const rankCell = document.createElement('td'); // cria uma nova célula para o ranking. td = table data
                rankCell.textContent = index + 1;

                //coluna do nome com imagem
                const nameCell = document.createElement('td'); // cria uma nova célula para o nome
                const nameContainer = document.createElement('div'); // cria um container para o nome e a imagem
                nameContainer.className = 'name-container'; // adiciona uma classe para estilização

                const img = document.createElement('img'); // cria o elemento de imagem
                img.src = crypto.img; // seta a fonte da imagem
                img.alt = crypto.name; // texto alternativo da imagem
                img.className = 'crypto-icon'; // classe para estilização
                img.width = 24; // define a largura da imagem
                img.height = 24; // define a altura da imagem

                const nameText = document.createElement('span'); // cria um span para o nome
                nameText.textContent = crypto.name; // seta o texto do nome

                nameContainer.appendChild(img); // adiciona a imagem ao container
                nameContainer.appendChild(nameText); // adiciona o nome ao container
                nameCell.appendChild(nameContainer); // adiciona o container à célula de nome

                // Coluna do símbolo
                const symbolCell = document.createElement('td'); // cria uma nova célula para o símbolo
                symbolCell.textContent = crypto.symbol; // seta o texto do símbolo
                symbolCell.className = 'symbol-cell'; // classe para estilização

                // Coluna do preço
                const priceCell = document.createElement('td'); // cria uma nova célula para o preço
                priceCell.textContent = `$${crypto.currentPrice.toLocaleString('en-US', { // formata o preço
                    minimumFractionDigits: 2, // define o número mínimo de casas decimais
                    maximumFractionDigits: 6 // define o número máximo de casas decimais
                })}`;
                priceCell.className = 'price-cell'; // classe para estilização
                
                // Adiciona todas as células à linha
                row.appendChild(rankCell);
                row.appendChild(nameCell);
                row.appendChild(symbolCell);
                row.appendChild(priceCell);
                // Adiciona a linha ao corpo da tabela
                tableBody.appendChild(row);
            })
            statusMessage.textContent = 'Dados atualizados com sucesso!';
            statusMessage.className = 'message success';
        })
}

document.addEventListener('DOMContentLoaded', renderCryptoTable); // Chama a função renderCryptoTable quando o conteúdo do DOM estiver carregado
buttonSearchCrypto.addEventListener('click', renderCryptoTable); // Chama a função renderCryptoTable quando o botão de busca é clicado
