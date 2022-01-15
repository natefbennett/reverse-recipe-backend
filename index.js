require('dotenv').config({ path: './.env' })

const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT;

app.use(express.json()) // for parsing application/json

app.get('/api/v1/recipes', (req, res) => {

    let ingredients = req.body.ingredients;
    findRecipes(ingredients).then(result => {
        res.send(result);
    })
    .catch(error => {
        console.log(error);
    });
    
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})

// ask spoonacular for recipes and transform returned data
async function getSpoonacularRecipes(ingredients) {
    let api_key = process.env.SPOONACULAR_API_KEY;
    let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',+')}&number=1&apiKey=${api_key}`;

    return axios.get(url)
    .then(response => {

        let recipes = [];
        
        for (const recipe of response.data) {
            let recipe_data = {
                "title": recipe.title,
                "image": recipe.image
            };
            recipes.push(recipe_data);
        }
        return recipes;
    })
    .catch(error => {
        console.log(error);
        return [];
    });
}

// gets possible recipe from spoonacular API with given ingredients
async function findRecipes(ingredients) {

    return new Promise((resolve, reject) => {
        const data = getSpoonacularRecipes(ingredients);
        resolve(data);
        // TODO: implement error case handling
     }).then(data => {
        return { "recipes": data };
    });
}