import { Request, Response } from "express";
import productRepository from "../repositories/product-repository";

class ProdutoController {
	async cadastrarProduto(req: Request, res: Response) {
		try {
			// const { nomeProduto, descricao, preco, estoqueDisponivel, status, imageUrl } =
			// 	req.body;

			const novoProduto = await productRepository.create({
				...req.body,
				ativo: true,
			});

			return res.status(201).json(novoProduto);
		} catch (error) {
			console.error("Erro ao cadastrar o produto:", error);
			return res.status(500).json({ error: "Erro ao cadastrar o produto" });
		}
	}

	async findAll(req: Request, res: Response) {
		try {
			const produtos = await productRepository.findALl();
			return res.status(200).json(produtos);
		} catch (error) {
			console.error("Erro ao listar os produtos:", error);
			return res.status(500).json({ error: "Erro ao listar os produtos" });
		}
	}

	async allProducts(req: Request, res: Response) {
		try {
			const produtos = await productRepository.allProducts();
			return res.status(200).json(produtos);
		} catch (error) {
			console.error("Erro ao listar os produtos:", error);
			return res.status(500).json({ error: "Erro ao listar os produtos" });
		}
	}

	async getAllProdutosDestaques(req: Request, res: Response) {
		try {
			const produtosDestaques = await productRepository.getAllPedidosDestaque();

			return res.status(200).json(produtosDestaques);
		} catch (error) {
			return res.status(500).json({ error: "Erro ao listar os produtos destaques" });
		}
	}
}

export default new ProdutoController();
