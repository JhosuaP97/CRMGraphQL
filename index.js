const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const jwt = require("jsonwebtoken");
const conectarDB = require("./config/db");

// Conectar la base de datos
conectarDB();

// Servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";

    if (token) {
      try {
        const usuario = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.SECRETA
        );
        return {
          usuario,
        };
      } catch (error) {
        console.log("Hubo un error", error);
      }
    }
  },
});

// Iniciar servidor
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready in url ${url}`);
});
