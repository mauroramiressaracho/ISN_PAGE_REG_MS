# Mapa Nacional integrado

Origem: https://github.com/mauroramiressaracho/insanosmc_mapa

- `locais.json`: dados importados sem alterar nomes, coordenadas ou regionais.
- `mapa.js`: filtros, marcadores, agrupamento, resultados e compartilhamento adaptados do original.
- `mapa.css`: estilos limitados ao componente para preservar o portal.
- `vendor/`: Leaflet 1.9.4 e MarkerCluster 1.5.3 locais, com suas licenças.

`mapa.html` renderiza diretamente, sem iframe ou dependência da hospedagem original. Os mosaicos do OpenStreetMap precisam de internet; sua atribuição foi preservada.

Atualizações do repositório original não são automáticas. Atualize `locais.json` para publicar novos dados no portal. Use GitHub Pages ou um servidor HTTP local (`python -m http.server 8765`), pois os dados são carregados com fetch.

O service worker original não foi importado para evitar interferência no cache do portal.
