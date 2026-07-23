        const API_URL = "https://dummyjson.com/recipes";
        const recipesContainer = document.getElementById("recipes-container");
        const searchInput = document.getElementById("search-input");
        let debounceTimer;
        async function fetchRecipes(url) {
            recipesContainer.innerHTML = '<div class="text-center text-amber-800 text-lg">Loading recipes...</div>';
            try {
                const response = await fetch(url);
                const data = await response.json();
                renderRecipes(data.recipes);
            } catch (error) {
                console.error("Error fetching recipes:", error);
                recipesContainer.innerHTML = '<div class="text-center text-red-600">Error loading recipes. Please try again.</div>';
            }
        }
        function renderRecipes(recipes) {
            if (!recipes || recipes.length === 0) {
                recipesContainer.innerHTML = '<div class="text-center text-gray-500">No recipes found.</div>';
                return;
            }
            recipesContainer.innerHTML = recipes.map(recipe => `
                <div class="relative border-b-amber-600 border-b-2 p-5 flex sm:flex-row flex-col items-center justify-start gap-[20px]">
                    <div class="flex justify-center items-center relative mb-3">
                        <img class="relative rounded-full object-cover mx-auto w-[200px] h-[200px]" src="${recipe.image}" alt="${recipe.name}" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <h2 class="font-semibold text-xl text-amber-950">${recipe.name}</h2>
                        <h4 class="text-gray-600">
                            <span class="font-semibold text-gray-700">Ingredients: </span>
                            ${recipe.ingredients.join(', ')}
                        </h4>
                        <button class="text-amber-700 hover:font-bold w-[100px]" onclick="showRecipe(${recipe.id})">
    See Recipe >
</button>
                    </div>
                </div>
            `).join('');
        }
        fetchRecipes(API_URL);
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (query) {
                    fetchRecipes(`${API_URL}/search?q=${query}`);
                } else {
                    fetchRecipes(API_URL);
                }
            }, 300); 
        });

        async function showRecipe(id) {
    const response = await fetch(`https://dummyjson.com/recipes/${id}`);
    const recipe = await response.json();

    recipesContainer.innerHTML = `
        <div>
            <img src="${recipe.image}" class="w-[250px] rounded-full">
            <h2 class="text-xl font-bold">${recipe.name}</h2>

            <h3>Ingredients:</h3>
            <p>${recipe.ingredients.join(", ")}</p>

            <h3>Instructions:</h3>
            <p>${recipe.instructions.join("<br>")}</p>

            <button onclick="fetchRecipes(API_URL)">
                Back to Recipes
            </button>
        </div>
    `;
}