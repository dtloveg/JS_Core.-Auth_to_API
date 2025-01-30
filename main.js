const searchInput = document.querySelector('.wrapper__search-input')
const textInput = searchInput.querySelector('.wrapper__text')
const autocomLists = searchInput.querySelector('.wrapper__autocom-lists')
const container = document.querySelector('.container')

const debouncedGetRepo = debounce(getRepo, 500);

textInput.onkeyup = (e) => {
  let userData = e.target.value.trim();
  if (userData) {
    debouncedGetRepo(userData);
  } else {
    autocomLists.classList.remove('active');
    autocomLists.innerHTML = '';
  }
};

function getRepo(userData) {
  return fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(userData)}&per_page=5`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Доступ к запрошенному ресурсу запрещен');
      }
      return response.json();
    })
    .then(data => {
      let allItems = data.items;
      const listItems = allItems.map((elem) => {
        return '<li class="wrapper__autocom-list">' + elem.name + '</li>';
      });

      showResult(listItems);
     

      let allList = autocomLists.querySelectorAll('li');
      createCard(allList, allItems);
      autocomLists.classList.add('active')
      
    }
    ).catch(error => {
      console.error('Ошибка:', error);
    });
}

function showResult(list) {
  let listData;
  if (!list.length) {
    listData = '';
    autocomLists.style.display = 'none';

  } else {
    listData = list.join('');
    autocomLists.style.display = 'block';
  }
  autocomLists.innerHTML = listData;
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  }
}

function cardTemplate({ name, owner, stars }) {
  container.insertAdjacentHTML("beforeEnd", 
    `<div class="container__card">
    <div class="container__table">
      <div>Name: ${name}</div>
      <div>Owner: ${owner}</div>
      <div>Stars: ${stars}</div>
    </div>
    <button class="container__delete-card">&#10006</button>
  </div>`
);
}

function createCard(lists, items) {
  lists.forEach((list, index) => {
    list.addEventListener('click', function () {
      cardTemplate({
        name: items[index].name,
        owner: items[index].owner.login,
        stars: items[index].stargazers_count
      });
    
      textInput.value = '';
      autocomLists.classList.remove('active');
      autocomLists.style.display = 'none';
    })
  })
}

container.onclick = function (event) {
  if (event.target.className != 'container__delete-card') return;

  let cardClose = event.target.closest('.container__card');
  cardClose.remove();
};
