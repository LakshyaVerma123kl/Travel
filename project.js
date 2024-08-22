document.addEventListener("DOMContentLoaded", function () {
  const homeButton = document.getElementById("home");
  const aboutButton = document.getElementById("about");
  const contactButton = document.getElementById("contact");
  const textContent = document.querySelector(".text");
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.querySelector(".search-button");
  const clearButton = document.querySelector(".clear-button");
  const searchResults = document.getElementById("search-results");

  const originalContent = textContent.innerHTML;

  let apiData = null;
  let isDataLoaded = false;

  // Fetch data from the API
  fetch("project_api.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      apiData = data;
      isDataLoaded = true;
      console.log("API data loaded successfully");
    })
    .catch((error) => {
      console.error("Error loading API data:", error);
      textContent.innerHTML =
        "<p>Error loading data. Please try again later.</p>";
    });

  homeButton.addEventListener("click", function (event) {
    event.preventDefault();
    textContent.innerHTML = originalContent;
    showSearchElements();
    searchResults.style.display = "none";
  });

  aboutButton.addEventListener("click", function (event) {
    event.preventDefault();
    textContent.innerHTML = `
      <div class="about-box">
        <span>ABOUT US</span>
        <p class="text1">
          Welcome to TravelBloom! We are passionate about helping you explore the world. 
          Our mission is to make travel accessible and enjoyable for everyone. 
          Discover new places, meet new people, and create unforgettable memories with us.
        </p>
      </div>
      <div class="team">
        <h3>Our Team</h3>
        <div class="team-member">
          <p><strong>John Doe</strong><br>Founder & CEO</p>
        </div>
        <div class="team-member">
          <p><strong>Jane Smith</strong><br>Chief Marketing Officer</p>
        </div>
        <div class="team-member">
          <p><strong>Emily Davis</strong><br>Lead Developer</p>
        </div>
      </div>
    `;
    hideSearchElements();
    searchResults.style.display = "none";
  });

  contactButton.addEventListener("click", function (event) {
    event.preventDefault();
    textContent.innerHTML = `
      <div class="about-box">
        <span>CONTACT US</span>
        <p class="text1">
          We're here to help! If you have any questions or need assistance, 
          please reach out to us using the form below or contact us directly at:
          <br/><br/>
        </p>
        <div class="contact-form">
          <form id="contact-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" name="phone" required>
            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="4" required></textarea>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    `;
    hideSearchElements();
    searchResults.style.display = "none";
  });

  searchButton.addEventListener("click", function () {
    performSearch();
  });

  searchBar.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  clearButton.addEventListener("click", function () {
    searchBar.value = "";
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    textContent.style.display = "block";
  });

  function performSearch() {
    const searchTerm = searchBar.value.toLowerCase();
    if (searchTerm) {
      if (!isDataLoaded) {
        searchResults.innerHTML =
          "<p>Data is still loading. Please try again in a moment.</p>";
        searchResults.style.display = "block";
        textContent.style.display = "none";
        return;
      }

      let results = [];

      // Search in countries and cities
      apiData.countries.forEach((country) => {
        if (country.name.toLowerCase().includes(searchTerm)) {
          results.push({ type: "Country", ...country });
        }
        country.cities.forEach((city) => {
          if (
            city.name.toLowerCase().includes(searchTerm) ||
            city.description.toLowerCase().includes(searchTerm)
          ) {
            results.push({ type: "City", ...city });
          }
        });
      });

      // Search in temples
      apiData.temples.forEach((temple) => {
        if (
          temple.name.toLowerCase().includes(searchTerm) ||
          temple.description.toLowerCase().includes(searchTerm)
        ) {
          results.push({ type: "Temple", ...temple });
        }
      });

      // Search in beaches
      apiData.beaches.forEach((beach) => {
        if (
          beach.name.toLowerCase().includes(searchTerm) ||
          beach.description.toLowerCase().includes(searchTerm)
        ) {
          results.push({ type: "Beach", ...beach });
        }
      });

      displaySearchResults(results);
    }
  }

  function displaySearchResults(results) {
    console.log("Search results:", results);
    if (results.length === 0) {
      searchResults.innerHTML = "<p>No results found.</p>";
    } else {
      let resultsHTML = "<h2>Search Results:</h2>";
      results.forEach((item) => {
        resultsHTML += `
          <div class="search-result-item">
            <h3>${item.name} (${item.type})</h3>
            <p>${item.description || ""}</p>
            ${
              item.imageUrl
                ? `<img src="${item.imageUrl}" alt="${item.name}">`
                : ""
            }
          </div>`;
      });
      searchResults.innerHTML = resultsHTML;
    }
    searchResults.style.display = "block";
    textContent.style.display = "none";
  }

  function hideSearchElements() {
    searchBar.style.display = "none";
    searchButton.style.display = "none";
    clearButton.style.display = "none";
  }

  function showSearchElements() {
    searchBar.style.display = "inline-block";
    searchButton.style.display = "inline-block";
    clearButton.style.display = "inline-block";
  }
});
