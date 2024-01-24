document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("generate-card-containers");
  const isOpenContainer = document.getElementById("isOpenToggle");
  const isNewContainer = document.getElementById("isNewToggle");
  const selectElements = document.querySelectorAll("select");

  const capitaliseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const createCard = (restaurant) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.name = restaurant.name.toLowerCase();
    cardDiv.dataset.photo = `./assets/images/${restaurant.bgImage}`;
    cardDiv.dataset.icon = `./assets/images/${restaurant.logo}`;

    cardDiv.innerHTML = `
      <div>
        <div class="takeaway-photo-container">
          <img class="takeaway-photo" src="${cardDiv.dataset.photo}">
        </div>
        <img class="takeway-icon" src="${cardDiv.dataset.icon}">
      </div>
      <div class="takeaway-text">
        <h3 class="card-name">${restaurant.name}</h3>
        <p><span class="fa fa-star checked"></span> &nbsp;<span class="rating-count"> ${restaurant.rating.starRating}</span> &nbsp; <span class="count" id="reviews">(${restaurant.rating.count})</span> &nbsp; <span class="cuisine"> ${restaurant.cuisines.map(capitaliseFirstLetter).join(', ')}</span></p>
        <p class="delivery-time"><span class="material-symbols-outlined">schedule</span>${restaurant.deliveryTime.min} - ${restaurant.deliveryTime.max} min</p>
        <p class="isOpen">${restaurant.isOpen ? 'Open' : 'Closed'}</p>
        <p class="isNew">${restaurant.isNew ? 'New' : 'Old'}</p>
      </div>
    `;
    cardContainer.appendChild(cardDiv);
  };

  const toggleCards = () => {
    const isNewChecked = isNewContainer.checked;
    const isOpenChecked = isOpenContainer.checked;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const isNew = card.querySelector('.isNew').innerText === 'New';
      const isOpen = card.querySelector('.isOpen').innerText === 'Open';

      const shouldShowCard = (isNewChecked && isNew) || (isOpenChecked && isOpen);
      card.style.height = shouldShowCard ? 'auto' : '0';
      card.style.visibility = shouldShowCard ? 'visible' : 'hidden';
    });

    if (!isNewChecked && !isOpenChecked) {
      cards.forEach(card => {
        card.style.height = 'auto';
        card.style.visibility = 'visible';
      });
    }
  };

  const sortByReviewCount = () => {
    const cards = Array.from(cardContainer.querySelectorAll('.card'));
    cards.sort((a, b) => {
      const countA = parseInt(a.querySelector('.count').innerText.match(/\d+/)[0]);
      const countB = parseInt(b.querySelector('.count').innerText.match(/\d+/)[0]);
      return countB - countA;
    });
    cards.forEach(card => cardContainer.appendChild(card));
  };

  const sortByDeliveryTime = () => {
    const cards = Array.from(cardContainer.querySelectorAll('.card'));
    cards.sort((a, b) => {
      const deliveryTimeA = parseFloat(a.querySelector('.delivery-time').innerText.match(/\d+(\.\d+)?/)[0]);
      const deliveryTimeB = parseFloat(b.querySelector('.delivery-time').innerText.match(/\d+(\.\d+)?/)[0]);
      const timeComparison = deliveryTimeA - deliveryTimeB;

      if (timeComparison === 0) {
        const ratingCountA = parseInt(a.querySelector('.rating-count').innerText.match(/\d+/)[0]);
        const ratingCountB = parseInt(b.querySelector('.rating-count').innerText.match(/\d+/)[0]);
        return ratingCountB - ratingCountA;
      }

      return timeComparison;
    });

    cards.forEach(card => cardContainer.appendChild(card));
  };

  // Fetch data and create cards
  fetch("./assets/src/Restaurant-Information.json")
    .then(response => response.json())
    .then(data => {
      data.forEach(createCard);

      // Add event listeners to toggle checkboxes
      isOpenContainer.addEventListener('change', toggleCards);
      isNewContainer.addEventListener('change', toggleCards);

      // Add event listeners for sorting
      selectElements.forEach(selectElement => {
        selectElement.addEventListener('change', () => {
          if (selectElement.value === 'Review count') {
            sortByReviewCount();
          } else if (selectElement.value === 'Delivery Time') {
            sortByDeliveryTime();
          } 
        });
      });
    });
});


