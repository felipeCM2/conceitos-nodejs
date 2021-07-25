const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, techs, url } = request.body;

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Invalid id."});
  }  

  const repository = {
    id,
    title,
    techs,
    url,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Invalid id."});
  }  

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json("Ok");
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Invalid id."});
  }  

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
