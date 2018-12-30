document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'RGAPI-463e979d-ff3c-4414-81e7-a72f5654491';
    let summonerName;
    const input = document.getElementById('input');
    const submitButton = document.getElementById('btn');
    const errorField = document.getElementById('error');

    submitButton.addEventListener('click', () => {
        summonerName = input.value;
        const summonerInfoUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
        console.log(summonerName);

        getPlayerData(summonerInfoUrl);

        function getPlayerData(url) {
            return new Promise((resolve, reject) => {
                fetch(`https://cors.io/?${url}`)
                    .then(resp => {
                        return resp.json();
                    })
                    .then(resp => {
                        if (resp.status) {
                            if (resp.status.status_code === 403) {
                                console.log(resp.status.status_code);
                                console.log(resp.status)
                                errorField.style.display = 'block';
                                errorField.innerHTML = 'Invalid API key';
                                reject(resp.status.message);
                            } else {
                                console.log(resp.status.status_code);
                                console.log(resp.status)
                                errorField.style.display = 'block';
                                errorField.innerText = `${resp.status.message}`;
                                reject(resp.status.message);
                            }
                        }
                        resolve(resp);
                    })
                    .catch(error => {
                        console.error(`Error: ${error}`)
                        reject(error);
                    })
            });
        }
    })

});