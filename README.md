## Github repositories test

Small fullstack application designed to pull Github repositories with most stars in descending order and save them in MongoDB in an interval.
Can search for repositories by name and id . Supports refresh of existing repositories. Supports pagination

## Routes :

    /repos/getAllRepos - pulls repositories, saves them in database and returns to frontend client
    /repos/getSingleRepo - searches for repositories with provided name or id and returns to frontend client
    /repos/syncRepos - refreshes existing repositories

## How to use:

    npm install -> npm run build -> npm start
