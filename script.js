const APIURL = "https://restcountries.com/v3.1";

async function fetchCountries() {
	fetch(`${APIURL}/name/deutschland`)
		.then((response) => response.json())
		.then((data) => {
			data.forEach((country) => {
				console.log(country);
			});
		})
		.catch((error) => console.log(error));
}

async function fetchCountriesAlternative() {
	let response = await fetch(`${APIURL}/all`);
	let data = await response.json();

	// let strToAdd = "";
	// strToAdd += `${country.name.common} <br>`;
	// strToAdd = `${country.name.common} <br>`;

	// data.forEach((country) => (document.body.innerHTML += strToAdd));
	data.forEach((country) => {
		const encodedName = encodeURIComponent(country.name.common);

		// let strToAdd = `<li><a href = ${APIURL}/name/${encodedName}>${country.name.common}</a></li>`;

		let strToAdd = `<li><a href = ${APIURL}/name/${encodedName}>${country.name.common}
		<img src ="${country.flags.svg}" style="width: 1.25rem"></a>
		</li>`;
		console.log(strToAdd);
		console.log(encodeURIComponent(strToAdd));
		document.body.innerHTML += strToAdd;
	});
}

fetchCountriesAlternative();

// document.body.innerHTML = "";

//country.flags.svg
