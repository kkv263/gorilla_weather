## Design
Live Link: https://gorilla-weather.vercel.app/

Before reading on, I recommend you have the live link open to compare and have as a visual reference.

## Structure
#### Folder Structure and Relevant files
```
├── public
│   ├── [images and icons]
├── src
│   ├── scripts
│   │   ├── util.js
│   │   ├── main.js
│   ├── styles
│   │   ├── *.scss
│   │   ├── normalize.css
├── .env
├── ...
└── README.md
```

- `scripts`: Utility functions that is reused throughout project, and main javascript lives here.
- `styles`: styling files live in here.
	- `normalize.css` a stylesheet that creates consistency across all browsers.
- `public`: assets
- `.env`: file with API key

## Code Implementation 
#### Tech Stack:
- Vanilla JS
- HTML
- SCSS
	- I used SCSS for this project since I believe it's easier to organize and manage styling. SCSS allows you to code split into different files, variables, nest, and works very well with BEM naming. 
- Vite
	- Vite is a tool that makes it fast to setup a frontend project. I used the vanilla template so it comes as a minimal barebones project. All HTML/CSS and JS are vanilla and no frameworks were used.

#### Location Search:
There is a search bar once you load the page to look up weather information about a location. Because we use Foreca's API valid values will depend on what gets put through their API. 

Blank values and invalid values will throw an error with red text stating so. Once a valid location is placed, we cache that value in `localStorage` and fetch information about that location's weather. The search button text changes from "Search" to "Loading" to indicate the API working.

The next time the user visits the page, the last searched result will immediately populate without the user having to search.

#### Weather:
Because we depend on a lot of information from Foreca's API, we have a utility function called `waitForElement`  to make sure elements we are changing exist in the DOM. We wait for all API calls to finish and all waitForElement promises to finish. 

Once they finish, all the information about the weather is displayed on the page. As a bonus, we use OpenAI to generate us a summary of the weather.

User's can repeat with a new search to replace the current content on the page with new information from the API


## UI/UX
- Wanted to go with a retro "newspaper" design with very neutral colors and a saturated eye catching yellow.
- Only interactive element is the search form which is accessible (keyboard)
- A lot of distinction and important information are conveyed through the black or yellow colors.
- Symbols are from Foreca API and adjusted slight grayscale to fit the theme.
- Code and Assets are minified and mostly SVG's which are a very small in filesize.
