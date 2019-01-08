document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'RGAPI-ce29fd76-c740-4e18-92d8-421af92d2c3b';
    let summonerName;
    const input = document.getElementById('input');
    const submitButton = document.getElementById('btn');
    const errorField = document.getElementById('error');
    const team1 = document.getElementById('team1');
    const team2 = document.getElementById('team2');
    const regenerateApiKeyButton = document.getElementById('regenerate-api-key');
    const loader1 = document.getElementById('loader1');
    const loader2 = document.getElementById('loader2');
    const playerNames = [];
    const summonersTeams = [];
    const arrayOfLinksAndIds = [];
    const firstTeamIds = [];
    const secondTeamIds = [];

    regenerateApiKeyButton.addEventListener('click', () => {
        window.open("https://developer.riotgames.com/");
    })

    submitButton.addEventListener('click', () => {
        team1.innerHTML = '';
        team1.style.display = "none"
        loader1.style.display = "inline-block";
        team2.innerHTML = '';
        team2.style.display = "none"
        loader2.style.display = "inline-block";
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

        function colorRedSearchedPlayer(name) {
            // console.log(summonerName, 'summ')
            // console.log(name, 'resp name')
            if (name === summonerName) {
                console.log(summonerName, 'summ')
                console.log(name, 'resp name')
                return "color:red;"
            } else {
                console.log(summonerName, 'summ')
                console.log(name, 'resp name')
                return "color:black;"
            }
        }

        function setLeagueColor(tier) {
            if (tier === 'GOLD') {

            }
        }

        function colorTier(tier) {
            if (tier === 'IRON') {
                return 'color:#7E5307';
            } else if (tier === 'SILVER') {
                return 'color:#A2A28D';
            } else if (tier === 'GOLD') {
                return 'color:#F0B600';
            } else if (tier === 'PLATINUM') {
                return 'color:#19AD41';
            } else if (tier === 'DIAMOND') {
                return 'color:#6CD5FC';
            } else if (tier === 'MASTER') {
                return 'color:#5F863E';
            } else if (tier === 'CHALLENGER') {
                return 'color:#869800'
            }
            else {
                return 'color:black';
            }
        }

        function getFirstLeague(response) {
            return `<strong>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: <mark id="league-color" style="${colorTier(response[0].tier)}">${response[0].tier} ${response[0].rank}</mark>;`
        }
        function getSecondLeague(response) {
            return ` ${displayEasyLeagues(response[1].queueType)}: <mark id="league-color" style="${colorTier(response[0].tier)}">${response[0].tier} ${response[0].rank}</mark>;`
        }
        function getThirdLeague(response) {
            return ` ${displayEasyLeagues(response[2].queueType)}: <mark id="league-color" style="${colorTier(response[2].tier)}">${response[2].tier} ${response[2].rank}</mark>`
        }

        function pushFirstTeamInfo(response) {
            team1.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                // add black!!! color for player with 3 rankedQs and input name != summoner name
                // team1.innerHTML += `<strong style = ${colorRedSearchedPlayer(response[0].summonerName)}>${response[0].summonerName}</strong> ${displayEasyLeagues(response[0].queueType)}: ` + `<mark id="league-color" style="${colorTier(response[0].tier)}">${response[0].tier}</mark>` + `${response[0].rank} ; ${displayEasyLeagues(response[1].queueType)}: ` + `<mark id="league-color" style="${colorTier(response[0].tier)}">${response[0].tier} ${response[0].rank}</mark><br>` `; ${displayEasyLeagues(response[2].queueType)}: ` + `<mark id="league-color" style="${colorTier(response[2].tier)}">${response[2].tier} ${response[2].rank}</mark><br>`;
                team1.innerHTML += getFirstLeague(response) + getSecondLeague(response) + getThirdLeague(response) + '<br>';
            } else if (response[0] && response[1]) {
                team1.innerHTML += getFirstLeague(response) + getSecondLeague(response) + '<br>';
            } else if (response[0]) {
                team1.innerHTML += getFirstLeague(response) + '<br>';
            } else if (!response[0]) {
                team1.innerHTML += `Unranked<br>`
            }
            loader1.style.display = "none";
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
            team2.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                team2.innerHTML += getFirstLeague(response) + getSecondLeague(response) + getThirdLeague(response) + '<br>';
            } else if (response[0] && response[1]) {
                team2.innerHTML += getFirstLeague(response) + getSecondLeague(response) + '<br>';
            } else if (response[0]) {
                team2.innerHTML += getFirstLeague(response) + '<br>';
            } else if (!response[0]) {
                team2.innerHTML += `Unranked<br>`
            }
            loader2.style.display = "none";
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
                                loader1.style.display = "none";
                                loader2.style.display = "none";
                                regenerateApiKeyButton.style.display = 'inline-block'
                                errorField.innerHTML = 'Invalid API key';
                                reject(resp.status.message);
                            } else if (resp.status.status_code === 429) {
                                console.log(resp.status.status_code);
                                console.log(resp.status)
                                errorField.style.display = 'block';
                                loader1.style.display = "none";
                                loader2.style.display = "none";
                                team1.innerHTML = '';
                                team2.innerHTML = '';
                                regenerateApiKeyButton.style.display = 'inline-block'
                                errorField.innerHTML = 'API limit exceeded';
                                reject(resp.status.message);
                            }
                            else {
                                console.log(resp.status.status_code);
                                console.log(resp.status)
                                errorField.style.display = 'block';
                                loader1.style.display = "none";
                                loader2.style.display = "none";
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

