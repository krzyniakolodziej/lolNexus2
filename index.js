document.addEventListener('DOMContentLoaded', () => {
    let apiKey = 'RGAPI-7d42855e-c907-4438-a6e2-20dc15e33910';
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
    const unrankedImg = './images/Season_2019_-Unranked.png';
    const ironImg = './images/Season_2019_-_Iron_1.png';
    const bronzeImg = './images/Season_2019_-_Bronze_1.png';
    const silverImg = './images/Season_2019_-_Silver_1.png';
    const goldImg = './images/Season_2019_-_Gold_1.png';
    const platinumImg = './images/Season_2019_-_Platinum_1.png';
    const diamondImg = './images/Season_2019_-_Diamond_1.png';
    const masterImg = './images/Season_2019_-_Master_1.png';
    const grandmasterImg = './images/Season_2019_-_Grandmaster_1.png';
    const challengerImg = './images/Season_2019_-_Challenger_1.png';
    const summonersTeams = [];
    const arrayOfLinksAndIds = [];
    const firstTeamIds = [];
    const secondTeamIds = [];
    const soloName = 'SoloQ';
    const flexName = 'Flex';
    const treelineName = '3v3';

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
    })

    regenerateApiKeyButton.addEventListener('click', () => {
        window.open("https://developer.riotgames.com/");
    });

    submitButton.addEventListener('click', () => {
        disableSubmit();
        displayTeamsInformationMainFunction();
    });
    input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
            disableSubmit();
            displayTeamsInformationMainFunction();
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
    function displayTeamsInformationMainFunction() {
        clearFieldsSetLoading();
        summonerName = input.value;
        const summonerDataUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
        return fetchData(summonerDataUrl)
            .then(getCurrentGameInfo)
            .then(fetchData)
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

        function createLeagueFromFirstResponse(response) {
            return `<section class="content-section">
        <div class="name">${getSummonerName(response)}</div>
        <div class="queue-icon-league-div">
        <div class="queue">${displayEasyLeagues(response[0].queueType)}</div>
        ${insertLeagueIcon(response[0].tier)}
        <div class="league">${response[0].tier} ${response[0].rank}</div>
     </div>`
        }
        function createLeagueFromSecondResponse(response) {
            return `<div class="queue-icon-league-div">
            <div class="queue">${displayEasyLeagues(response[1].queueType)}</div>
            ${insertLeagueIcon(response[1].tier)}
            <div class="league">${response[1].tier} ${response[1].rank}</div>
        </div>`
        }
        function createLeagueFromThirdResponse(response) {
            return `<div class="queue-icon-league-div">
            <div class="queue">${displayEasyLeagues(response[2].queueType)}</div>
            ${insertLeagueIcon(response[2].tier)}
            <div class="league">${response[2].tier} ${response[2].rank}</div>
        </div>`
        }
        function createLeagueFromNoResponse(tier) {
            return `<div class="queue-icon-league-div">
                <div class="queue">${tier}</div>
                ${insertLeagueIcon()}
                <div class="league">Unranked</div>
            </div>`
        }

        function createThreeLeaguesAndNoUnrankeds(response) {
            return `<section class="content-section">
            ${createLeagueFromFirstResponse(response)}
            ${createLeagueFromSecondResponse(response)}
            ${createLeagueFromThirdResponse(response)}
        </section>`
        }
        function createTwoLeaguesAndOneUnranked(response) {
            if (response[0].queueType === 'RANKED_SOLO_5x5' && response[1].queueType === 'RANKED_FLEX_SR') {
                return `<section class="content-section">
           ${createLeagueFromFirstResponse(response)}
            ${createLeagueFromSecondResponse(response)}
            ${createLeagueFromNoResponse(treelineName)}
        </section>`
            } else if (response[0].queueType === 'RANKED_FLEX_SR' && response[1].queueType === 'RANKED_SOLO_5x5') {
                return `<section class="content-section">
               ${createLeagueFromFirstResponse(response)}
               ${createLeagueFromSecondResponse(response)}
                ${createLeagueFromNoResponse(treelineName)}
            </section>`
            } else if (response[0].queueType === 'RANKED_SOLO_5x5' && response[1].queueType === 'RANKED_FLEX_TT') {
                return `<section class="content-section">
               ${createLeagueFromFirstResponse(response)}
                ${createLeagueFromSecondResponse(response)}
                ${createLeagueFromNoResponse(flexName)}
            </section>`
            } else if (response[0].queueType === 'RANKED_FLEX_TT' && response[0].queueType === 'RANKED_SOLO_5x5') {
                return `<section class="content-section">
                ${createLeagueFromFirstResponse(response)}
                ${createLeagueFromSecondResponse(response)}
                ${createLeagueFromNoResponse(flexName)}
            </section>`
            } else if (response[0].queueType === 'RANKED_FLEX_SR' && response[1].queueType === 'RANKED_FLEX_TT') {
                return `<section class="content-section">
                ${createLeagueFromFirstResponse(response)}
                ${createLeagueFromSecondResponse(response)}
                ${createLeagueFromNoResponse(soloName)}
            </section>`
            } else if (response[0].queueType === 'RANKED_FLEX_TT' && response[1].queueType === 'RANKED_FLEX_SR') {
                return `<section class="content-section">
                ${createLeagueFromFirstResponse(response)}
                ${createLeagueFromSecondResponse(response)}
                ${createLeagueFromNoResponse(soloName)}
            </section>`
            }
        }
        function createOneLeagueAndTwoUnrankeds(response) {
            if (response[0].queueType === 'RANKED_SOLO_5x5') {
                return `<section class="content-section">
                ${createLeagueFromFirstResponse(response)}
                ${createLeagueFromNoResponse(flexName)}
                ${createLeagueFromNoResponse(treelineName)}
        </section>`
            } else if (response[0].queueType === 'RANKED_FLEX_SR') {
                return `<section class="content-section">
                ${createLeagueFromFirstResponse(response)}
                ${createLeagueFromNoResponse(soloName)}
                ${createLeagueFromNoResponse(treelineName)}
        </section>`
            } else {
                return `<section class="content-section">
                ${createLeagueFromFirstResponse(response)}
                ${createLeagueFromNoResponse(soloName)}
            ${createLeagueFromNoResponse(flexName)}
        </section>`
            }
        }
        function createZeroLeaguesAndThreeUnrankeds() {
            return `<section class="content-section">
            <div class="name">Unknown</div>
            ${createLeagueFromNoResponse('SoloQ')}
            ${createLeagueFromNoResponse('Flex')}
            ${createLeagueFromNoResponse('3v3')}
            </section>`
        }
        function getSummonerName(response) {
            return `<strong ${colorRedSearchedPlayer(response[0].summonerName)}>${response[0].summonerName}</strong>`
        }
        function colorRedSearchedPlayer(name) {
            if (name.toLowerCase() === summonerName.toLowerCase()) {
                return 'style="color:red;"';
            } else {
                return 'style="color:black;"';
            }
        }
        function pushFirstTeamInfo(response) {
            team1.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                team1.innerHTML += createThreeLeaguesAndNoUnrankeds(response);
            } else if (response[0] && response[1]) {
                team1.innerHTML += createTwoLeaguesAndOneUnranked(response);
            } else if (response[0]) {
                team1.innerHTML += createOneLeagueAndTwoUnrankeds(response);
            } else if (!response[0]) {
                team1.innerHTML += createZeroLeaguesAndThreeUnrankeds();
            }
            loader1.style.display = "none";
        }
        function displayEasyLeagues(response) {
            if (response === 'RANKED_SOLO_5x5') {
                return `<span class="easy-leagues">${soloName}</span>`;
            } else if (response === 'RANKED_FLEX_SR') {
                return `<span class="easy-leagues">${flexName}</span>`;
            } else {
                return `<span class="easy-leagues">${treelineName}</span>`;
            }
        }
        function pushSecondTeamInfo(response) {
            team2.style.display = "block";
            if (response[0] && response[1] && response[2]) {
                team2.innerHTML += createThreeLeaguesAndNoUnrankeds(response);
            } else if (response[0] && response[1]) {
                team2.innerHTML += createTwoLeaguesAndOneUnranked(response);
            } else if (response[0]) {
                team2.innerHTML += createOneLeagueAndTwoUnrankeds(response);
            } else if (!response[0]) {
                team2.innerHTML += `Unranked`
            }
            loader2.style.display = "none";
        }

        function getFirstTeamSummonerInfo() {
            const firstTeamDataUrl = `https://eun1.api.riotgames.com/lol/league/v4/positions/by-summoner/${firstTeamIds[firstTeamIds.length - 1]}?api_key=${apiKey}`;
            fetchData(firstTeamDataUrl)
                .then(pushFirstTeamInfo)
        }

        function getSecondTeamSummonerInfo() {
            const secondTeamDataUrl = `https://eun1.api.riotgames.com/lol/league/v4/positions/by-summoner/${secondTeamIds[secondTeamIds.length - 1]}?api_key=${apiKey}`;
            fetchData(secondTeamDataUrl)
                .then(pushSecondTeamInfo)
        }

        function getSummonerId(arrayOfSummonerLinks) {
            console.log(arrayOfSummonerLinks, 'summlinks');
            arrayOfSummonerLinks.forEach(element => {
                if (element.id < arrayOfSummonerLinks.length / 2) {
                    fetchData(element.link)
                        .then(createFirstArrayOfSummonerIds)
                        .then(getFirstTeamSummonerInfo)
                        .then(enableSumbmit)
                } else {
                    fetchData(element.link)
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
            return arrayOfLinksAndIds;
        }

        function getPlayersNames(currentGameData) {
            let playerNames = [];
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
        }

        function getCurrentGameInfo(summonerData) {
            const summonerId = summonerData.id;
            const currentGameLink = `https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${apiKey}`;
            console.log(summonerId);
            return currentGameLink;
        }
        function hideLoadersClearTeamsAndDisplayErrorDiv(resp) {
            console.log(resp.status)
            errorField.style.display = 'block';
            loader1.style.display = "none";
            loader2.style.display = "none";
            team1.innerHTML = '';
            team2.innerHTML = '';
        }
        function fetchData(url) {
            return new Promise((resolve, reject) => {
                fetch(`https://cors.io/?${url}`)
                    .then(resp => {
                        return resp.json();
                    })
                    .then(resp => {
                        if (resp.status) {
                            if (resp.status.status_code === 403) {
                                hideLoadersClearTeamsAndDisplayErrorDiv(resp);
                                submitKeyDiv.style.display = 'block';
                                regenerateApiKeyButton.style.display = 'inline-block'
                                errorField.innerHTML = 'Invalid API key';
                                enableSumbmit();
                                reject(resp.status.message);
                            } else if (resp.status.status_code === 400) {
                                hideLoadersClearTeamsAndDisplayErrorDiv(resp);
                                errorField.innerHTML = 'Enter a valid summoner name';
                                enableSumbmit();
                                reject(resp.status.message);
                            }
                            else if (resp.status.status_code === 429) {
                                hideLoadersClearTeamsAndDisplayErrorDiv(resp);
                                errorField.innerHTML = 'API limit exceeded';
                                enableSumbmit();
                                reject(resp.status.message);
                            }
                            else {
                                hideLoadersClearTeamsAndDisplayErrorDiv(resp)
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

