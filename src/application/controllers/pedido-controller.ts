import { Request, Response } from "express";
import prisma from "../infra/config/prismaCliente";
import {
	deletePedidoById,
	getAllPedidosWithConteudo,
} from "../repositories/pedido.repository";

class PedidoController {
	async criarPedido(req: Request, res: Response) {
		const { clienteId, itens, cartTotal, observacao, modoEntrega } = req.body;

		try {
			const pedido = await prisma.pedido.create({
				data: {
					dataPedido: new Date(),
					statusPedido: "Em andamento",
					clienteId,
					total: cartTotal,
					observacao,
					modoEntrega,
					itens: {
						create: itens.map((item) => ({
							quantidade: item.quantidade,
							precoUnitario: item.preco,
							subtotal: item.quantidade * item.preco,
							produtoId: item.id,
						})),
					},
				},
				include: {
					itens: true,
				},
			});

			return res.status(201).json(pedido);
		} catch (error) {
			console.error("Erro ao criar o pedido:", error);

			return res.status(500).json({ error: "Erro ao criar o pedido" });
		}
	}
	async getPedidoByClientId(req: Request, res: Response) {
		const clienteId = parseInt(req.body.clienteId);

		try {
			const pedidosEmAndamento = await prisma.pedido.findMany({
				where: {
					clienteId: clienteId,
				},
				orderBy: {
					dataPedido: "desc",
				},
			});

			return res.json(pedidosEmAndamento);
		} catch (error) {
			console.error("Erro ao buscar pedido:", error);
			return res.status(500).json({ error: "Erro ao buscar pedido" });
		}
	}

	async updatePedido(req: Request, res: Response) {
		try {
			const pedidoId = parseInt(req.params.pedidoId);
			const itemId = parseInt(req.params.itemId);
			const { quantidade, precoUnitario } = req.body;

			const pedido = await prisma.pedido.findUnique({
				where: { id: pedidoId },
			});

			if (!pedido) {
				return res.sendStatus(404).json({ error: "Pedido não encontrado" });
			}

			const item = await prisma.itemPedido.findUnique({
				where: { id: itemId, pedidoId },
			});

			if (!item) {
				return res.sendStatus(404).json({ error: "Item não encontrado no pedido" });
			}

			const subtotal = quantidade * precoUnitario;
			const itemAtualizado = await prisma.itemPedido.update({
				where: { id: itemId },
				data: {
					quantidade,
					precoUnitario,
					subtotal,
				},
			});

			return res.status(200).json(itemAtualizado);
		} catch (error) {
			console.error("Erro ao atualizar o item do pedido:", error);
			return res.status(500).json({ error: "Erro ao atualizar o item do pedido" });
		}
	}

	async getPedidoById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const pedidoAchado = await prisma.itemPedido.findFirst({
				where: { id: parseInt(id) },
				include: {
					produto: true,
				},
			});
			if (!pedidoAchado) return res.status(404).json({ message: "Pedido não cadastrado" });

			return res.status(200).json(pedidoAchado);
		} catch (error) {
			return res.status(500).json({ message: "erro ao buscar pedido" });
		}
	}

	async getAllProducts(req: Request, res: Response) {
		try {
			const pedidosComConteudo = await getAllPedidosWithConteudo();
			return res.status(200).json(pedidosComConteudo);
		} catch (error) {
			return res.status(500).json({ message: "erro ao buscar pedido" });
		}
	}

	async deletePedido(req: Request, res: Response) {
		const { id } = req.params;

		try {
			// // Exclua os itens de pedido relacionados a este pedido
			// await prisma.itemPedido.deleteMany({
			// 	where: {
			// 		pedidoId: parseInt(id),
			// 	},
			// });

			// // Agora você pode excluir o pedido principal
			// await prisma.pedido.delete({
			// 	where: {
			// 		id: parseInt(id),
			// 	},
			// });

			await deletePedidoById(id);

			return res.status(204).send();
		} catch (error) {
			return res.status(500).json({ message: "erro ao deletar pedido" });
		}
	}

	async updateStatusPedido(req: Request, res: Response) {
		try {
			const pedidoId = parseInt(req.params.pedidoId);
			const statusPedido = req.body.statusPedido;
			console.log(
				"🚀 ~ file: pedido-controller.ts:138 ~ PedidoController ~ statusPedido:",
				statusPedido
			);

			// Primeiro, verifique se o pedido existe
			const pedido = await prisma.pedido.findUnique({
				where: { id: pedidoId },
			});

			if (!pedido) {
				return res.status(404).json({ error: "Pedido não encontrado" });
			}

			// Em seguida, atualize o status do pedido para "Entregue"
			const pedidoAtualizado = await prisma.pedido.update({
				where: { id: pedidoId },
				include: {
					itens: {
						include: {
							produto: true,
						},
					},
				},
				data: {
					statusPedido: statusPedido,
				},
			});

			return res.status(200).json(pedidoAtualizado);
		} catch (error) {
			console.error("Erro ao atualizar o status do pedido:", error);
			return res.status(500).json({ error: "Erro ao atualizar o status do pedido" });
		}
	}
}

export default new PedidoController();
