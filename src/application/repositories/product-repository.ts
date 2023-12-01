import prisma from "../infra/config/prismaCliente";

class ProductRepository {
	async create(data) {
		const novoProduto = await prisma.produto.create({
			data: {
				...data,
			},
		});
		return novoProduto;
	}

	// async findALl() {
	// 	const produtos = await prisma.produto.findMany({
	// 		where: {
	// 			status: true,
	// 		},
	// 	});
	// 	return produtos;
	// }

	async findALl() {
		const categoriasPermitidas = ["BQS", "BF", "SLG", "DC"];

		const produtosPorCategoria = await prisma.produto.findMany({
			where: {
				status: true,
				categoria: {
					in: categoriasPermitidas,
				},
			},
			orderBy: {
				categoria: "asc",
			},
		});

		const produtosAgrupados = categoriasPermitidas.map((categoria) => {
			const produtosCategoria = produtosPorCategoria.filter(
				(produto) => produto.categoria === categoria
			);
			return {
				categoria,
				produtos: produtosCategoria.slice(0, 6),
			};
		});

		return produtosAgrupados;
	}

	async allProducts() {
		const todosProdutos = await prisma.produto.findMany({
			where: {
				status: true,
			},
		});

		return todosProdutos;
	}

	async getAllPedidosDestaque() {
		try {
			const produtosDestaque = await prisma.produto.findMany({
				where: {
					isDestaque: true,
				},
			});
			const produtosDestaqueIds = produtosDestaque.map((produto) => produto.id);

			const pedidos = await prisma.pedido.findMany({
				where: {
					itens: {
						some: {
							produtoId: {
								in: produtosDestaqueIds,
							},
						},
					},
				},
				include: {
					itens: {
						include: {
							produto: true,
						},
					},
				},
			});

			return produtosDestaque;
		} catch (error) {
			throw new Error("Erro ao buscar pedidos");
		}
	}
}

export default new ProductRepository();
