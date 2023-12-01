import loginController from "@/application/controllers/login-controller";
import { NextFunction, Request, Response, Router } from "express";
import cadastroController from "@/application/controllers/cadastro-controller";
import pedidoController from "@/application/controllers/pedido-controller";
import produtoController from "@/application/controllers/produto-controller";
import storeController from "@/application/controllers/store-controller";
import usuarioController from "@/application/controllers/usuario-controller";

const routes = Router();

routes.post("/cadastro", cadastroController.cadastro);
routes.post("/login", loginController.login);
routes.post("/usuario", usuarioController.getUser);

routes.get("/pedidos", pedidoController.getAllProducts);
routes.put("/pedidos/:pedidoId", pedidoController.updateStatusPedido);
routes.get("/pedido/:id", pedidoController.getPedidoById);
routes.delete("/pedido/:id", pedidoController.deletePedido);
routes.post("/pedido", pedidoController.criarPedido);
routes.post("/pedido-status", pedidoController.getPedidoByClientId);
routes.post("/pedido/:pedidoId/atualizar-item/:itemId", pedidoController.updatePedido);
routes.get("/produtos", produtoController.findAll);
routes.get("/todos-produtos", produtoController.allProducts);
routes.post("/produto", produtoController.cadastrarProduto);
routes.get("/produtosDetaques", produtoController.getAllProdutosDestaques);

routes.get("/cupom/:id", storeController.checkCupom);
routes.post("/cupom", storeController.createCupom);

routes.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({ message: "Essa rota não existe!" });
	next();
});

export default routes;
