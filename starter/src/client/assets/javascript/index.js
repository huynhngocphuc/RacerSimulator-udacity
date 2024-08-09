// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
  track_id: undefined,
  track_name: undefined,
  player_id: undefined,
  player_name: undefined,
  race_id: undefined,
};

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  onPageLoad();
  setupClickHandlers();
});

async function onPageLoad() {
  console.log("Getting form info for dropdowns!");
  try {
    getTracks().then((tracks) => {
      const html = renderTrackCards(tracks);
      renderAt("#tracks", html);
    });

    getRacers().then((racers) => {
      const html = renderRacerCars(racers);
      renderAt("#racers", html);
    });
  } catch (error) {
    console.log("🚀 ~ onPageLoad ~ error:", error);
  }
}

function setupClickHandlers() {
  document.addEventListener(
    "click",
    function (event) {
      const { target } = event;
      console.log("🚀 ~ setupClickHandlers ~ target:", target);

      let parent = target.parentElement;

      // Race track form field
      if (target.matches(".card.track")) {
        handleSelectTrack(target);
        store.track_id = target.id;
        store.track_name = target.innerHTML;
      }

      // Racer form field
      if (target.matches(".card.racer")) {
        handleSelectRacer(target);
        store.player_id = target.id;
        store.player_name = target.innerHTML;
      }

      // Submit create race form
      if (target.matches("#submit-create-race")) {
        event.preventDefault();

        // start race
        handleCreateRace();
      }

      // Handle acceleration click
      if (target.matches("#gas-peddle")) {
        handleAccelerate();
      }

      console.log("Store updated :: ", store);
    },
    false
  );
}

async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here");
    console.log(error);
  }
}

// ^ PROVIDED CODE ^ DO NOT REMOVE

// BELOW THIS LINE IS CODE WHERE STUDENT EDITS ARE NEEDED ----------------------------
// TIP: Do a full file search for TODO to find everything that needs to be done for the game to work

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
  console.log("in create race");

  // TODO - Get player_id and track_id from the store
  const playerId = store.player_id;
  const trackId = store.track_id;
  if (!playerId || !trackId) {
    alert("You dont have track and racer, Please select to play a game!");
    return;
  }
  try {
    const race = await createRace(playerId, trackId);
    console.log("createRace::", race);
    renderAt("#race", renderRaceStartView(race.Track));

    store.race_id = parseInt(race.ID);
    await runCountdown();
    await startRace(store.race_id - 1);
    await runRace(store.race_id - 1);
  } catch (error) {
    console.log("🚀 ~ handleCreateRace ~ error:", error);
  }

  // renderAt('#race', renderRaceStartView(store.track_name))
  // const race = TODO - call the asynchronous method createRace, passing the correct parameters

  // TODO - update the store with the race id in the response
  // TIP - console logging API responses can be really helpful to know what data shape you received
  console.log("RACE: ", race);
  // store.race_id =

  // The race has been created, now start the countdown
  // TODO - call the async function runCountdown

  // TODO - call the async function startRace
  // TIP - remember to always check if a function takes parameters before calling it!

  // TODO - call the async function runRace
}

function runRace(raceID) {
  return new Promise((resolve) => {
    const intervalRunRace = setInterval(async () => {
      const dataRace = await getRace(raceID);

      if (dataRace.status == "in-progress") {
        renderAt("#leaderBoard", raceProgress(dataRace.positions));
      } else if (dataRace.status == "finished") {
        renderAt("#race", resultsView(dataRace.positions));
        clearInterval(intervalRunRace);
        resolve(dataRace);
      }
    }, 1000);
    // TODO - use Javascript's built in setInterval method to get race info (getRace function) every 500ms
    /* 
		TODO - if the race info status property is "in-progress", update the leaderboard by calling:

		renderAt('#leaderBoard', raceProgress(res.positions))
	*/
    /* 
		TODO - if the race info status property is "finished", run the following:

		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		resolve(res) // resolve the promise
	*/
  }).catch((error) => {
    console.log("🚀 ~ runRace ~ error:", error);
  });
  // remember to add error handling for the Promise
}

async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);
    let timer = 3;

    return new Promise((resolve) => {
      // TODO - use Javascript's built in setInterval method to count down once per second
      const timerCountdownDone = setInterval(() => {
        console.log("🚀 ~ timerCountdownDone ~ timerCountdownDone:", !timer);

        if (!timer) {
          clearInterval(timerCountdownDone);
          resolve();
        } else {
          document.getElementById("big-numbers").innerHTML = --timer;
        }
      }, 1000);
      // run this DOM manipulation inside the set interval to decrement the countdown for the user

      // TODO - when the setInterval timer hits 0, clear the interval, resolve the promise, and return
    });
  } catch (error) {
    console.log(error);
  }
}

function handleSelectRacer(target) {
  console.log("selected a racer", target.id);

  // remove class selected from all racer options
  const selected = document.querySelector("#racers .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");
}

function handleSelectTrack(target) {
  console.log("selected track", target.id);

  // remove class selected from all track options
  const selected = document.querySelector("#tracks .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");
}

function handleAccelerate() {
  accelerate(store.race_id - 1)
    .then(() => console.log("accelerate clicked"))
    .catch((error) => {
      console.log("🚀 ~ handleAccelerate ~ error:", error);
    });
  // TODO - Invoke the API call to accelerate
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`;
  }

  const results = racers.map(renderRacerCard).join("");

  return `
		<ul id="racers">
			${results}
		</ul>
	`;
}

function renderRacerCard(racer) {
  const { id, driver_name, top_speed, acceleration, handling } = racer;
  // OPTIONAL: There is more data given about the race cars than we use in the game, if you want to factor in top speed, acceleration,
  // and handling to the various vehicles, it is already provided by the API!
  return `
  <h4 class="card racer" id="${id}">${driver_name}
    <span >Top Speed: ${top_speed}</span>
    <span >acceleration: ${acceleration}</span>
    <span >handling: ${handling}</span>
  </h4>
  `;
}

function renderTrackCards(tracks) {
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`;
  }

  const results = tracks.map(renderTrackCard).join("");

  return `
		<ul id="tracks">
			${results}
		</ul>
	`;
}

function renderTrackCard(track) {
  const { id, name } = track;

  return `<h4 id="${id}" class="card track">${name}</h4>`;
}

function renderCountdown(count) {
  return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;
}

function renderRaceStartView(track) {
  return `
		<header>
			<h1>Race: ${track.name}</h1>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`;
}

function resultsView(positions) {
  positions.sort((a, b) => (a.final_position > b.final_position ? 1 : -1));

  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
		<div class="restart">
			<a href="/race" class="reStartRace">Start a new race</a>
		</div>
		</main>
	`;
}

function raceProgress(positions) {
  let userPlayer = positions.find((e) => e.id === parseInt(store.player_id));
  userPlayer.driver_name += " (you)";

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<table>
			${results.join("")}
		</table>
	`;
}

function renderAt(element, html) {
  const node = document.querySelector(element);

  node.innerHTML = html;
}

// ^ Provided code ^ do not remove

// API CALLS ------------------------------------------------

const SERVER = "http://localhost:3001";
const URL_API = {
  ALL_TRACKS: "/api/tracks",
  ALL_CARS: "/api/cars",
  CREATE_RACE: "/api/races",
};

function defaultFetchOpts() {
  return {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": SERVER,
    },
  };
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints

async function getTracks() {
  // GET request to `${SERVER}/api/tracks`
  try {
    const response = await fetch(`${SERVER}/${URL_API.ALL_TRACKS}`, {
      ...defaultFetchOpts(),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("🚀 ~ getTracks ~ error:", error);
  }
  // TODO: Fetch tracks
  // TIP: Don't forget a catch statement!
}

async function getRacers() {
  // GET request to `${SERVER}/api/cars`
  try {
    const response = await fetch(`${SERVER}/${URL_API.ALL_CARS}`, {
      ...defaultFetchOpts(),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("🚀 ~ getTracks ~ error:", error);
  }
  // TODO: Fetch racers
  // TIP: Do a file search for "TODO" to make sure you find all the things you need to do! There are even some vscode plugins that will highlight todos for you
}

function createRace(player_id, track_id) {
  player_id = parseInt(player_id);
  track_id = parseInt(track_id);
  const body = { player_id, track_id };

  return fetch(`${SERVER}/api/races`, {
    method: "POST",
    ...defaultFetchOpts(),
    dataType: "jsonp",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log("🚀 ~ createRace ~ err:", err);
    });
}

async function getRace(id) {
  // GET request to `${SERVER}/api/races/${id}`
  const raceId = parseInt(id);
  try {
    const response = await fetch(`${SERVER}${URL_API.CREATE_RACE}/${raceId}`, {
      ...defaultFetchOpts(),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("🚀 ~ getRace ~ error:", error);
  }
}

async function startRace(id) {
  const raceId = parseInt(id);
  try {
    const data = await fetch(`${SERVER}/api/races/${raceId}/start`, {
      method: `POST`,
      ...defaultFetchOpts(),
    });
    return data;
  } catch (err) {
    console.log("🚀 ~ startRace ~ err:", err);
  }
}

async function accelerate(id) {
  // POST request to `${SERVER}/api/races/${id}/accelerate`
  // options parameter provided as defaultFetchOpts
  // no body or datatype needed for this request
  const raceId = parseInt(id);
  try {
    await fetch(`${SERVER}/api/races/${raceId}/accelerate`, {
      method: "POST",
      ...defaultFetchOpts(),
    });
  } catch (error) {
    console.log("🚀 ~ accelerate ~ error:", error);
  }
}
