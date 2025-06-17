const form = document.getElementById("countryForm");
const input = document.getElementById("countryInput");
const message = document.getElementById("message");
const countryInfo = document.getElementById("countryInfo");
const clearBtn = document.getElementById("clearBtn");
const randomBtn = document.getElementById("randomBtn");

// Fetch country by name
function fetchCountry(name) {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(res => {
      if (!res.ok) throw new Error("Country not found");
      return res.json();
    })
    .then(data => {
      message.textContent = `Showing results for "${name}"`;
      message.style.color = "green";
      displayCountry(data[0]);
    })
    .catch(() => {
      message.textContent = "Invalid country name. Try again.";
      message.style.color = "red";
    });
}

// Fetch random country
function fetchRandomCountry() {
  fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      const random = data[Math.floor(Math.random() * data.length)];
      message.textContent = `Showing random country: ${random.name.common}`;
      message.style.color = "green";
      displayCountry(random);
    });
}

// Display using the template
function displayCountry(country) {
  const template = document.querySelector(".country-card.template");
  const card = template.cloneNode(true);
  card.classList.remove("template");
  card.hidden = false;

  const flag = card.querySelector(".country-flag");
  flag.src = country.flags.png;
  flag.alt = `Flag of ${country.name.common}`;

  card.querySelector(".country-name").textContent = country.name.common;
  card.querySelector(".country-capital").textContent = country.capital?.[0] || "N/A";
  card.querySelector(".country-region").textContent = country.region;
  card.querySelector(".country-population").textContent = country.population.toLocaleString();

  const languagesContainer = card.querySelector(".languages");
  languagesContainer.innerHTML = ""; // Clear previous
  const languages = country.languages ? Object.values(country.languages) : ["Unknown"];
  languages.forEach(lang => {
  const span = document.createElement("span");
  span.className = "language-tag";
  span.textContent = lang;
  languagesContainer.appendChild(span);
  });

  const mapLink = card.querySelector(".map-link");
  mapLink.href = country.maps?.googleMaps || "#";

  // Double-click to remove
  card.addEventListener("dblclick", () => card.remove());

  countryInfo.appendChild(card);
}

// Form Submit
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = input.value.trim();
  if (name === "") {
    message.textContent = "Please enter a country name.";
    message.style.color = "red";
  } else {
    fetchCountry(name);
  }
});

// Clear All Cards
clearBtn.addEventListener("click", () => {
  countryInfo.querySelectorAll(".country-card:not(.template)").forEach(card => card.remove());
  message.textContent = "All countries are cleared.";
  message.style.color = "black";
});

// Random Country
randomBtn.addEventListener("click", () => {
  fetchRandomCountry();
});

// Submit on Enter Key
input.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    form.dispatchEvent(new Event("submit"));
  }
});
