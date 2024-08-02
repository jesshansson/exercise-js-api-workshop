const APIURL = "https://restcountries.com/v3.1";

async function fetchCountries() {
  let response = await fetch(`${APIURL}/all`);
  let data = await response.json();

  //Sorterar länder alfabetiskt
  data.sort((a, b) => {
    if (a.name.common < b.name.common) {
      return -1;
    }
    if (a.name.common > b.name.common) {
      return 1;
    }
    return 0;
  });

  // Render the name of the countries in the DOM
  const countryList = document.getElementById("country-list");
  data.forEach((country) => {
    const flagElement = `<img src = ${country.flags.svg} alt="Flag of ${country.name.common}" style="height: 1.25rem">`;
    const encodedName = encodeURIComponent(country.name.common);
    let listItem = document.createElement("li");
    listItem.innerHTML = `<a href="#" onclick="showCountryInfo('${encodedName}')">${flagElement} ${country.name.common}</a>`;
    countryList.appendChild(listItem);
  });
}

async function showCountryInfo(countryName) {
  // Fetch the country info
  let response = await fetch(`${APIURL}/name/${countryName}`);
  let data = await response.json();
  const country = data[0]; // Eftersom API returnerar en array med ett land, hämtar vi det första (och enda) elementet.

  // Hide the country list and show the country info
  document.getElementById("country-list").style.display = "none";
  document.getElementById("country-info").style.display = "block";

  //Get native name of country
  const nativeNames = Object.values(country.name.nativeName);
  const nativeName = nativeNames[0].common;

  // Render the country info in the DOM
  const countryInfo = document.getElementById("country-info");
  countryInfo.innerHTML = `
        <a href="#" onclick="goBack()">Back to list of countries</a>
        <h2>${country.name.common}</h2>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}"> <br>
        <p><b>Native name: ${nativeName} </b></p>
        <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
        <p>Population: ${country.population}</p>
        <p>Region: ${country.region}</p>
        <p>Language(s): ${Object.values(country.languages).join(", ")}</p>
        <div id="map" style="height: 300px;"></div>
        <br><br>
        <a href="#" onclick="goBack()">Back to list of countries</a>
    `;

  //Object.values(country.languages) extraherar alla värden (språknamn) från languages-objektet. .join(", ") sammanfogar språknamnen till en sträng separerad med kommatecken.

  // Skapa kartan
  const map = L.map("map").setView([country.latlng[0], country.latlng[1]], 4);
  //latitud och longitud från vår API, ex Sverige: "latlng": [62.0, 15.0]. En array med två värden. Kartan tar dessa koordinater för att centrera kartan och placera markören.
  // Zoomnivå 4

  // Set up the OpenStreetMap layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Lägg till markör för landets position
  L.marker([country.latlng[0], country.latlng[1]])
    .addTo(map) //Lägger till markören till kartan (map).
    .bindPopup(`<b>${country.name.common}</b>`) //Binder en popup till markören med landets namn.
    .openPopup(); //Öppnar popupen direkt när markören läggs till.
}

function goBack() {
  // Show the country list and hide the country info
  document.getElementById("country-list").style.display = "block";
  document.getElementById("country-info").style.display = "none";
}

//Sökfunktion - improved search proposal fromGroup 7
async function searchCountry() {
  const searchInput = document.getElementById("search-input").value.trim();
  if (searchInput.length < 2) {
    alert("Please enter at least 2 characters");
    return;
  }

  try {
    let response = await fetch(`${APIURL}/name/${encodeURIComponent(searchInput)}`);
    if (!response.ok) {
      throw new Error("Country not found");
    }

    let data = await response.json();

    if (data.length === 0) {
      throw new Error("Country not found");
    }

    // Filter the results to match more precisely
    let matchingCountries = data.filter((country) =>
      country.name.common.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (matchingCountries.length === 0) {
      throw new Error("Country not found");
    }

    showCountryInfo(encodeURIComponent(matchingCountries[0].name.common));
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById("searchButton").addEventListener("click", (e) => {
  searchCountry();
});

fetchCountries();
