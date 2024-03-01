document.addEventListener("DOMContentLoaded", () => {
    const githubForm = document.querySelector("#github-form");
    const userList = document.querySelector("#user-list");
    const reposList = document.querySelector("#repos-list");

    githubForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const searchInput = document.querySelector("#search").value;
        const searchUrl = `https://api.github.com/search/users?q=${searchInput}`;

        try {
            const response = await fetch(searchUrl, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            displayUsers(data.items);
        } catch (error) {
            console.error("Error searching for users:", error);
        }
    });

    function displayUsers(users) {
        userList.innerHTML = ""; // Clear previous search results

        users.forEach(user => {
            const listItem = document.createElement("li");
            const username = document.createElement("span");
            username.textContent = user.login;
            const avatar = document.createElement("img");
            avatar.src = user.avatar_url;
            avatar.alt = `${user.login}'s avatar`;

            listItem.appendChild(avatar);
            listItem.appendChild(username);
            userList.appendChild(listItem);

            // Add click event listener to each user
            listItem.addEventListener("click", () => {
                getUserRepos(user.login);
            });
        });
    }

    async function getUserRepos(username) {
        const reposUrl = `https://api.github.com/users/${username}/repos`;

        try {
            const response = await fetch(reposUrl, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            displayRepos(data);
        } catch (error) {
            console.error("Error fetching user repos:", error);
        }
    }

    function displayRepos(repos) {
        reposList.innerHTML = ""; // Clear previous repo results

        repos.forEach(repo => {
            const listItem = document.createElement("li");
            const repoName = document.createElement("span");
            repoName.textContent = repo.name;
            listItem.appendChild(repoName);
            reposList.appendChild(listItem);
        });
    }
});
