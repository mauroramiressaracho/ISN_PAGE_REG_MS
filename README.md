# INSANOS MC — Regional Mato Grosso do Sul

Portal regional do Insanos MC em Mato Grosso do Sul.

## Versão inicial

A primeira versão é uma landing page estática, responsiva e preparada para publicação rápida no GitHub Pages.

### Seções implementadas

- Hero / capa da Regional MS
- Apresentação da Regional
- Indicadores da Regional
- Comando Regional
- Divisões
- Ações Sociais
- Galeria
- Últimas Missões / Notícias
- Faça Parte
- Contato
- Link para o Portal Nacional

## Identidade visual

A implementação usa uma linguagem visual escura e institucional inspirada na presença oficial do Insanos MC, mas com código próprio e conteúdo regional.

Nesta primeira versão, brasão, fotografias oficiais, nomes, cargos e quantitativos reais foram deixados como placeholders para evitar publicação de informação não confirmada.

## Próximos arquivos recomendados

Crie uma pasta `assets/` e adicione, quando disponíveis:

```text
assets/
├── logo-insanos.png
├── logo-regional-ms.png
├── hero-regional-ms.jpg
├── comando/
│   ├── diretor-regional.jpg
│   └── subdiretor-regional.jpg
├── divisoes/
│   └── campo-grande.jpg
├── galeria/
└── noticias/
```

Depois, os placeholders em `index.html` podem ser substituídos pelas imagens oficiais.

## Dados que ainda precisam ser confirmados

- Logo/brasão oficial autorizado para o portal da Regional MS
- Nome e foto do Diretor Regional
- Nome e foto do Subdiretor Regional
- Demais cargos que podem ser divulgados
- Lista oficial das divisões da Regional MS
- Quantidade de integrantes, divisões e cidades
- Instagram oficial da Regional
- WhatsApp/e-mail institucional
- Procedimento oficial para "Faça Parte"
- Fotografias e vídeos da Regional MS

## Executar localmente

Por ser uma aplicação estática, basta abrir `index.html` no navegador ou iniciar um servidor local simples.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Portal Nacional

Referência institucional: https://www.insanosmc.com.br/
