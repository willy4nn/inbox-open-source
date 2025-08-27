import { app } from "./infra/http/server";

const PORT = process.env.PORT || 3000;

app.listen({ port: Number(PORT) }, () => {
  console.log(`🚀 Servidor HTTP rodando em http://localhost:${PORT}`);
});
