const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const status = document.querySelector("#status");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository";

    const link = document.createElement("a");
    link.href = repository.url;
    link.textContent = repository.repository;

    const date = document.createElement("time");
    date.dateTime = repository.starred_at;
    date.textContent = `Starred ${formatDate(repository.starred_at)}`;

    const description = document.createElement("p");
    description.textContent = repository.description;

    item.append(link, date, description);
    repositoryList.append(item);
  }

  repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;
  status.textContent = repositories.length ? "" : "No starred repositories yet.";
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new TypeError("Repository data must be a list.");
    }

    renderRepositories(repositories);
  } catch (error) {
    status.textContent = "Could not load starred repositories. Run this page from a local web server and try again.";
    console.error("Failed to load repositories:", error);
  }
}

loadRepositories();