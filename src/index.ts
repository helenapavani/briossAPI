/* eslint-disable @typescript-eslint/no-var-requires */
import "./application/infra/config/module-alias";

import app from "./app";
import { env } from "./application/infra/config/env";
app.listen(env.port, () => console.log("Rodando na porta 3000"));
