document.addEventListener('DOMContentLoaded', () => {
    let apiKey = 'RGAPI-5f129fee-a745-4c5e-8be0-4fb6726639a4';
    let summonerName;
    const input = document.getElementById('input');
    const submitButton = document.getElementById('btn');
    const errorField = document.getElementById('error');
    const team1 = document.getElementById('team1');
    const team2 = document.getElementById('team2');
    const regenerateApiKeyButton = document.getElementById('regenerate-api-key');
    const loader1 = document.getElementById('loader1');
    const loader2 = document.getElementById('loader2');
    const submitKeyDiv = document.getElementById('submit-new-key-div');
    const apiKeyInput = document.getElementById('api-input');
    const apiKeyButton = document.getElementById('submit-api-key-button');
    const unrankedImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/unranked-season-rewards-lol.png';
    const ironImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Iron_1.png';
    const bronzeImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Bronze_1.png';
    const silverImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Silver_1.png';
    const goldImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Gold_1.png';
    const platinumImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Platinum_1.png';
    const diamondImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Diamond_1.png';
    const masterImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Master_1.png';
    const grandmasterImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Grandmaster_1.png';
    const challengerImg = 'https://img.rankedboost.com/wp-content/uploads/2014/09/Season_2019_-_Challenger_1.png';
    const playerNames = [];
    const summonersTeams = [];
    const arrayOfLinksAndIds = [];
    const firstTeamIds = [];
    const secondTeamIds = [];

    function loadImage(source) {
        return `<img class="league-img" src="${source}" alt="${source}"/>`;
    }
    function insertLeagueIcon(tier) {
        if (tier) {
            switch (tier) {
                case 'IRON': return loadImage(ironImg);
                case 'BRONZE': return loadImage(bronzeImg);
                case 'SILVER': return loadImage(silverImg);
                case 'GOLD': return loadImage(goldImg);
                case 'PLATINUM': return loadImage(platinumImg);
                case 'DIAMOND': return loadImage(diamondImg);
                case 'MASTER': return loadImage(masterImg);
                case 'GRANDMASTER': return loadImage(grandmasterImg);
                case 'CHALLENGER': return loadImage(challengerImg);
            }
        } else {
            return loadImage(unrankedImg);
        }
    }

    apiKeyButton.addEventListener('click', () => {
        apiKey = apiKeyInput.value;
        console.log(apiKeyInput.value);
        console.log(apiKey);
    })

    regenerateApiKeyButton.addEventListener('click', () => {
        window.open("https://developer.riotgames.com/");
    });

    submitButton.addEventListener('click', () => {
        disableSubmit();
        displayTeamsInformation();
    });
    input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
            disableSubmit();
            displayTeamsInformation();
        };
    });
    function disableSubmit() {
        submitButton.disabled = true;
        input.disabled = true;
    }
    function enableSumbmit() {
        submitButton.disabled = false;
        input.disabled = false;
    }

    function clearFieldsSetLoading() {
        team1.innerHTML = '';
        team1.style.display = "none";
        loader1.style.display = "inline-block";
        team2.innerHTML = '';
        team2.style.display = "none";
        loader2.style.display = "inline-block";
        errorField.innerHTML = '';
        submitKeyDiv.style.display = "none";
        regenerateApiKeyButton.style.display = "none";
    }
    function displayTeamsInformation() {
        clearFieldsSetLoading();
        summonerName = input.value;
        const summonerDataUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
        return getPlayerData(summonerDataUrl)
            .then(getCurrentGameInfo)
            .then(getPlayerData)
            .then(getPlayersNames)
            .then(setPlayerTeams)
            .then(createArrayOfNameLinks)
            .then(getSummonerId)

        function colorTier(tier) {
            switch (tier) {
                case 'IRON': return 'color:#6D6B6B';
                case 'BRONZE': return 'color:#7E5307';
                case 'SILVER': return 'color:#A2A28D';
                case 'GOLD': return 'color:#F0B600';
                case 'PLATINUM': return 'color:#19AD41';
                case 'DIAMOND': return 'color:#6CD5FC';
                case 'MASTER': return 'color:#5F863E';
                case 'GRANDMASTER': return 'colorB40B25';
                case 'CHALLENGER': return 'color:#869800';
                default: return 'color:black';
            }
        }
        function createThreeLeagues(response) {
            return `<section class="content-section">
            <div class="name">${getSummonerName(response)}</div>
            <div class="queue-icon-league-div">
                <div class="queue">${displayEasyLeagues(response[0].queueType)}</div>
                ${insertLeagueIcon(response[0].tier)}
                <div class="league">${response[0].tier} ${response[0].rank}</div>
            </div>
            <div class="queue-icon-league-div">
            <div class="queue">${displayEasyLeagues(response[1].queueType)}</div>
            ${insertLeagueIcon(response[1].tier)}
            <div class="league">${response[1].tier} ${response[1].rank}</div>
        </div>
        <div class="queue-icon-league-div">
        <div class="queue">${displayEasyLeagues(response[2].queueType)}</div>
        ${insertLeagueIcon(response[2].tier)}
        <div class="league">${response[2].tier} ${response[2].rank}</div>
    </div>
        </section>`
        }
        function createTwoLeagues(response) {
            return `<section class="content-section">
            <div class="name">${getSummonerName(response)}</div>
            <div class="queue-icon-league-div">
                <div class="queue">${displayEasyLeagues(response[0].queueType)}</div>
                ${insertLeagueIcon(response[0].tier)}
                <div class="league">${response[0].tier} ${response[0].rank}</div>
            </div>
            <div class="queue-icon-league-div">
            <div class="queue">${displayEasyLeagues(response[1].queueType)}</div>
            ${insertLeagueIcon(response[1].tier)}
            <div class="league">${response[1].tier} ${response[1].rank}</div>
            </div>
        </section>`
        }
        function createOneLeague(response) {
            return `<section class="content-section">
            <div class="name">${getSummonerName(response)}</div>
            <div class="queue-icon-league-div">
                <div class="queue">${displayEasyLeagues(response[0].queueType)}</div>
                ${insertLeagueIcon(response[0].tier)}
                <div class="league">${response[0].tier} ${response[0].rank}</div>
            </div>
        </section>`
        }
        function getSummonerName(response) {
            return `<strong ${colorRedSearchedPlayer(response[0].summonerName)}>${response[0].summonerName}</strong>`;
        }
        function colorRedSearchedPlayer(name) {
            if (name === summonerName) {
                return 'style="color:red;"';
            } else {
                return 'style="color:black;"';
            }
        }
        function pushFirstTeamInfo(response) {
            team1.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                team1.innerHTML += createThreeLeagues(response);
            } else if (response[0] && response[1]) {
                team1.innerHTML += createTwoLeagues(response);
            } else if (response[0]) {
                team1.innerHTML += createOneLeague(response);
            } else if (!response[0]) {
                team1.innerHTML += `Unranked`
            }
            loader1.style.display = "none";
        }
        function displayEasyLeagues(response) {
            if (response === 'RANKED_SOLO_5x5') {
                return '<span class="easy-leagues">SoloQ</span>';
            } else if (response === 'RANKED_FLEX_SR') {
                return '<span class="easy-leagues">Flex</span>';
            } else {
                return '<span class="easy-leagues">3v3</span>';
            }
        }
        function pushSecondTeamInfo(response) {
            team2.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                team2.innerHTML += createThreeLeagues(response);
            } else if (response[0] && response[1]) {
                team2.innerHTML += createTwoLeagues(response);
            } else if (response[0]) {
                team2.innerHTML += createOneLeague(response);
            } else if (!response[0]) {
                team2.innerHTML += `Unranked`
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
            arrayOfSummonerLinks.forEach(element => {
                if (element.id < arrayOfSummonerLinks.length / 2) {
                    getPlayerData(element.link)
                        .then(createFirstArrayOfSummonerIds)
                        .then(getFirstTeamSummonerInfo)
                        .then(enableSumbmit)
                } else {
                    getPlayerData(element.link)
                        .then(createSecondArrayOfSummonerIds)
                        .then(getSecondTeamSummonerInfo)
                        .then(enableSumbmit)
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
                                submitKeyDiv.style.display = 'block';
                                loader1.style.display = "none";
                                loader2.style.display = "none";
                                regenerateApiKeyButton.style.display = 'inline-block'
                                errorField.innerHTML = 'Invalid API key';
                                enableSumbmit();
                                reject(resp.status.message);
                            } else if (resp.status.status_code === 400) {
                                console.log(resp.status.status_code);
                                console.log(resp.status)
                                errorField.style.display = 'block';
                                loader1.style.display = "none";
                                loader2.style.display = "none";
                                errorField.innerHTML = 'Enter a valid summoner name';
                                enableSumbmit();
                            }
                            else if (resp.status.status_code === 429) {
                                console.log(resp.status.status_code);
                                console.log(resp.status)
                                errorField.style.display = 'block';
                                loader1.style.display = "none";
                                loader2.style.display = "none";
                                team1.innerHTML = '';
                                team2.innerHTML = '';
                                errorField.innerHTML = 'API limit exceeded';
                                enableSumbmit();
                                reject(resp.status.message);
                            }
                            else {
                                console.log(resp.status.status_code);
                                console.log(resp.status)
                                errorField.style.display = 'block';
                                loader1.style.display = "none";
                                loader2.style.display = "none";
                                errorField.innerText = `${resp.status.message}`;
                                enableSumbmit();
                                reject(resp.status.message);
                            }
                        }
                        enableSumbmit();
                        resolve(resp);
                    })
                    .catch(error => {
                        console.error(`Error: ${error}`)
                        reject(error);
                    })
            });
        }
    }
});

