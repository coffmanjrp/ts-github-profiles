const APIURL = 'https://api.github.com/users/';
const form = document.getElementById('form') as HTMLFormElement;
const search = document.getElementById('search') as HTMLInputElement;
const main = document.getElementById('main') as HTMLElement;

function createErrorCard(msg: string) {
  const cardHTML = `<div class="card">
    <h1>${msg}</h1>
  </div>`;

  main.innerHTML = cardHTML;
}

type Repo = {
  html_url: string;
  name: string;
};

function addReposToCard(repos: Repo[]) {
  const reposEl = document.getElementById('repos') as HTMLDivElement;

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement('a') as HTMLAnchorElement;
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

async function getRepos(username: string) {
  try {
    const res = await fetch(`${APIURL + username}/repos?sort=created`);
    const data = await res.json();

    addReposToCard(data);
  } catch (err) {
    createErrorCard('Problem fetching repos.');
  }
}

type User = {
  avatar_url: string;
  login: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
};

function createUserCard(user: User) {
  const cardHTML = `<div class="card">
  <div>
    <img
      src="${user.avatar_url}"
      alt="${user.login}"
      class="avatar"
    />
  </div>
  <div class="user-info">
    <h2>${user.login}</h2>
    <p>
    ${user.bio ? user.bio : ''}
    </p>
    <ul>
      <li>${user.followers} <strong>Followers</strong></li>
      <li>${user.following} <strong>Following</strong></li>
      <li>${user.public_repos} <strong>Repos</strong></li>
    </ul>

    <div id="repos"></div>
  </div>
</div>`;

  main.innerHTML = cardHTML;
}

async function getUser(username: string) {
  try {
    const res = await fetch(APIURL + username);
    const data = await res.json();

    createUserCard(data);
    getRepos(username);
  } catch (err: any) {
    if (err.response.status === 404) {
      createErrorCard('No profile with this user name.');
    }
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
});
