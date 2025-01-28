const searchInput = document.querySelector('.wrapper__search-input')
const textInput = searchInput.querySelector('.wrapper__text')
const autocomLists = searchInput.querySelector('.wrapper__autocom-lists')
const container = document.querySelector('.container')

const debouncedGetRepo = debounce(getRepo, 500);

  textInput.onkeyup = (e) => {
    let userData = e.target.value;    
    if(userData) {  
        debouncedGetRepo(userData);
        } else {
        autocomLists.classList.remove('active')
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

        showResult(listItems)
        autocomLists.classList.add('active')
        let allList = autocomLists.querySelectorAll('li');
        createCard(allList, allItems)

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
        let timeout
        return function (...args) {
          clearTimeout(timeout)
          timeout = setTimeout(() => func.apply(this, args), delay)
        }
      }

    function cardTemplate({ name, owner, stars }) {
        const card = document.createElement('div');
        card.classList.add('container__card')
        const table = document.createElement('div');
        table.classList.add('container__table')
        const cardName = document.createElement('div');
        cardName.textContent = `Name: ${name}`;
     
        const cardOwner = document.createElement('div');
        cardOwner.textContent = `Owner: ${owner}`;
        const cardStars = document.createElement('div');
        cardStars.textContent = `Stars: ${stars}`;
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('container__delete-card')
        btnDelete.innerHTML = '&#10006;'
        
        table.appendChild(cardName)
        table.appendChild(cardOwner)
        table.appendChild(cardStars)
        card.appendChild(table)
        card.appendChild(btnDelete)
        return card
      }

      function createCard(lists, items) {
        lists.forEach((list,index) => {
            list.addEventListener('click', function() {
                const card = cardTemplate({
                    name: items[index].name, 
                    owner: items[index].owner.login, 
                    stars: items[index].stargazers_count 
                });
                container.appendChild(card);
                textInput.value = '';
                autocomLists.classList.remove('active');
                autocomLists.style.display = 'none';
            })
        })
      }

      container.onclick = function(event) {
        if (event.target.className != 'container__delete-card') return;
  
        let cardClose = event.target.closest('.container__card');
        cardClose.remove();
      };
