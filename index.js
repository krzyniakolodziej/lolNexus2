document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'RGAPI-ce29fd76-c740-4e18-92d8-421af92d2c3b';
    let summonerName;
    const input = document.getElementById('input');
    const submitButton = document.getElementById('btn');
    const errorField = document.getElementById('error');
    const team1 = document.getElementById('team1');
    const team2 = document.getElementById('team2');
    const regenerateApiKeyButton = document.getElementById('regenerate-api-key');
    const team1DataElements = document.getElementById('team1');
    const team2DataElements = document.getElementById('team2');
    const playerNames = [];
    const summonersTeams = [];
    const arrayOfLinksAndIds = [];
    const firstTeamIds = [];
    const secondTeamIds = [];

    regenerateApiKeyButton.addEventListener('click', () => {
        window.open("https://developer.riotgames.com/");
    })

    submitButton.addEventListener('click', () => {
        errorField.innerHTML = ''
        regenerateApiKeyButton.style.display = "none";
        summonerName = input.value;
        const summonerDataUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
        // console.log(summonerName);

        return getPlayerData(summonerDataUrl)
            .then(getCurrentGameInfo)
            .then(getPlayerData)
            .then(getPlayersNames)
            .then(setPlayerTeams)
            .then(createArrayOfNameLinks)
            .then(getSummonerId)

        function pushFirstTeamInfo(response) {
            console.log(response[3])
            team1DataElements.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                team1.innerHTML += `<strong>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: ${response[0].tier} ${response[0].rank} ; ${displayEasyLeagues(response[1].queueType)}: ${response[1].tier} ${response[1].rank} ; ${displayEasyLeagues(response[2].queueType)}: ${response[2].tier} ${response[2].rank}<br>`;
            } else if (response[0] && response[1]) {
                team1.innerHTML += `<strong>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: ${response[0].tier} ${response[0].rank} ; ${displayEasyLeagues(response[1].queueType)}: ${response[1].tier} ${response[1].rank}<br>`;
            } else if (response[0]) {
                team1.innerHTML += `<strong>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: ${response[0].tier} ${response[0].rank}<br>`;
            } else if (!response[0]) {
                team1.innerHTML += `Unranked ${console.log(response)}`
            }
        }
        function displayEasyLeagues(response) {
            if (response === 'RANKED_SOLO_5x5') {
                return 'SoloQ'
            } else if (response === 'RANKED_FLEX_SR') {
                return 'Flex'
            } else {
                return '3v3'
            }
        }
        function pushSecondTeamInfo(response) {
            team2DataElements.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                team2.innerHTML += `<strong>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: ${response[0].tier} ${response[0].rank}; ${displayEasyLeagues(response[1].queueType)}: ${response[1].tier} ${response[1].rank}; ${displayEasyLeagues(response[2].queueType)}: ${response[2].tier} ${response[2].rank} <br>`;
            } else if (response[0] && response[1]) {
                team2.innerHTML += `<strong>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: ${response[0].tier} ${response[0].rank} ; ${displayEasyLeagues(response[1].queueType)}: ${response[1].tier} ${response[1].rank}<br>`;
            } else if (response[0]) {
                team2.innerHTML += `<strong>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: ${response[0].tier} ${response[0].rank}<br>`;
            } else if (!response[0]) {
                team2.innerHTML += `Unranked ${console.log(response)}`
            }
        }

        function getFirstTeamSummonerInfo() {
            // console.log('firstteamids', firstTeamIds);
            const firstTeamDataUrl = `https://eun1.api.riotgames.com/lol/league/v4/positions/by-summoner/${firstTeamIds[firstTeamIds.length - 1]}?api_key=${apiKey}`;
            getPlayerData(firstTeamDataUrl)
                .then(pushFirstTeamInfo)
            // .then(console.log)
        }

        function getSecondTeamSummonerInfo() {
            const secondTeamDataUrl = `https://eun1.api.riotgames.com/lol/league/v4/positions/by-summoner/${secondTeamIds[secondTeamIds.length - 1]}?api_key=${apiKey}`;
            getPlayerData(secondTeamDataUrl)
                .then(pushSecondTeamInfo)
            // .then(console.log)
        }

        function getSummonerId(arrayOfSummonerLinks) {
            // console.log('dupa', firstTeamLinks)
            arrayOfSummonerLinks.forEach(element => {
                if (element.id < arrayOfSummonerLinks.length / 2) {
                    getPlayerData(element.link)
                        .then(createFirstArrayOfSummonerIds)
                        .then(getFirstTeamSummonerInfo)
                } else {
                    getPlayerData(element.link)
                        .then(createSecondArrayOfSummonerIds)
                        .then(getSecondTeamSummonerInfo)
                }
            })
            return;
        }

        function createFirstArrayOfSummonerIds(summonerResponse) {
            firstTeamIds.push(summonerResponse.id);
            return summonerResponse;
        }

        function createSecondArrayOfSummonerIds(summonerResponse) {
            secondTeamIds.push(summonerResponse.id);
            return summonerResponse;
        }

        function createArrayOfNameLinks() {
            summonersTeams.forEach((name, i) => {
                let summonerLink = new Object();
                summonerLink["link"] = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`;
                summonerLink["id"] = i;
                arrayOfLinksAndIds.push(summonerLink)
                console.log(summonerLink);
            })
            // console.log(firstTeamLinks, 'firstteamlinks')
            return arrayOfLinksAndIds;
        }

        function getPlayersNames(currentGameData) {
            // console.log(currentGameData.participants)
            currentGameData.participants.forEach(element => {
                playerNames.push(element.summonerName)
            });
            return playerNames;
        }

        function setPlayerTeams(allPlayerNames) {
            for (let i = 0; i < 10; i++) {
                summonersTeams.push(allPlayerNames[i]);
            }
            // for (let i = 5; i < 10; i++) {
            //     secondTeam.push(allPlayerNames[i]);
            // }
            console.log('summonerTeams', summonersTeams)
            // console.log('second', secondTeam)
        }

        function getCurrentGameInfo(summonerData) {
            const summonerId = summonerData.id;
            const currentGameLink = `https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${apiKey}`;
            console.log(summonerId);
            return currentGameLink;
        }

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
                                regenerateApiKeyButton.style.display = 'inline-block'
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

