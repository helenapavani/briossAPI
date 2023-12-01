import prisma from "../infra/config/prismaCliente";

export async function getAllPedidosWithConteudo() {
	try {
		const pedidos = await prisma.pedido.findMany({
			include: {
				itens: {
					include: {
						produto: true,
					},
				},
			},
		});

		const pedidosComConteudo = pedidos.map((pedido) => ({
			...pedido,
			conteudo: pedido.itens.map((item) => item.produto.nomeProduto),
		}));
		return pedidos;
	} catch (error) {
		throw new Error("Erro ao buscar pedidos");
	}
}

export async function deletePedidoById(id: any) {
	try {
		await prisma.itemPedido.deleteMany({
			where: {
				pedidoId: parseInt(id),
			},
		});

		await prisma.pedido.delete({
			where: {
				id: parseInt(id),
			},
		});
	} catch (error) {
		throw new Error("Erro ao deletar pedido");
	}
}
