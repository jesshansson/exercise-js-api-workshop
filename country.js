const APIURL = "https://restcountries.com/v3.1";

async function fetchCountries() {
  let response = await fetch(`${APIURL}/all`);
  let data = await response.json();

  // Render the name of the countries in the DOM
  const countryList = document.getElementById("country-list");
  data.forEach((country) => {
    const encodedName = encodeURIComponent(country.name.common);
    let listItem = document.createElement("li");
    listItem.innerHTML = `<a href="#" onclick="showCountryInfo('${encodedName}')">${country.name.common}</a>`;
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

  // Render the country info in the DOM
  const countryInfo = document.getElementById("country-info");
  countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
        <p>Population: ${country.population}</p>
        <p>Region: ${country.region}</p>
        <p>Language: ${country.languages} </p>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
        <br><br>
        <a href="#" onclick="goBack()">Back to list of countries</a>
    `;
}

function goBack() {
  // Show the country list and hide the country info
  document.getElementById("country-list").style.display = "block";
  document.getElementById("country-info").style.display = "none";
}

// Initial fetch of the countries
fetchCountries();
