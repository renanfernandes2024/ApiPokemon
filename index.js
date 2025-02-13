function pesquisarPokemon() {
    let nomePokemon = document.getElementById('pokemonInput').value.toLowerCase().trim();

    // Verifica se o campo está vazio
    if (!nomePokemon) {
        alert("Digite o nome de um Pokémon.");
        return;
    }

    let finalURL = `https://pokeapi.co/api/v2/pokemon/${nomePokemon}`;
    console.log(finalURL);
    
    fetch(finalURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            // Atualizando as informações do Pokémon no HTML
            let nome = document.getElementById('Nome');
            let imagem = document.getElementById('bandeira');
            let classe = document.getElementById('classePokemon');
            let peso = document.getElementById('pesoPokemon');
            let evolucoes = document.getElementById('evolucoesPokemon');

            // Atualizando os elementos com as informações do Pokémon
            nome.innerHTML = data.name.charAt(0).toUpperCase() + data.name.slice(1);  // Nome do Pokémon
            imagem.src = data.sprites.front_default;  // Imagem do Pokémon
            peso.innerHTML = (data.weight / 10).toFixed(2);  // Convertendo peso para kg
            classe.innerHTML = data.types.map(type => type.type.name).join(", ");  // Tipos (Classe)

            // Buscar evoluções do Pokémon
            fetch(data.species.url)
                .then(response => response.json())
                .then(speciesData => {
                    const evolucoesURL = speciesData.evolution_chain.url;
                    fetch(evolucoesURL)
                        .then(response => response.json())
                        .then(evolutionData => {
                            const evolutionsList = evolutionData.chain;
                            let evolucoesText = "";
                            let currentEvolution = evolutionsList;
                            while (currentEvolution) {
                                evolucoesText += currentEvolution.species.name.charAt(0).toUpperCase() + currentEvolution.species.name.slice(1) + ", ";
                                currentEvolution = currentEvolution.evolves_to.length > 0 ? currentEvolution.evolves_to[0] : null;
                            }
                            evolucoes.innerHTML = evolucoesText.slice(0, -2);  // Remover a última vírgula
                        });
                });

            // Exibe as informações do Pokémon
            document.getElementById("card").style.display = "block";
        })
        .catch(function (error) {
            console.error(error);
            document.getElementById("erroPokemon").style.display = "block";  // Exibe mensagem de erro
            document.getElementById("card").style.display = "none";  // Esconde o card caso erro
        });
}
