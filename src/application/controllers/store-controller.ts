import { Request, Response } from "express";
import prisma from "../infra/config/prismaCliente";

class StoreController {
	async createCupom(req: Request, res: Response) {
		const { porcentagem, cupom, clienteId } = req.body;
		try {
			await prisma.desconto.create({
				data: {
					porcentagem,
					cupom,
				},
			});
			res.status(201).json({ created: clienteId, createAt: new Date() });
		} catch (error) {
			res.status(500).json({ error: "Erro ao criar cupom de desconto." });
		}
	}

	async checkCupom(req: Request, res: Response) {
		const { id } = req.params;

		try {
			const existeCupom = await prisma.desconto.findFirst({
				where: { cupom: id },
			});
			if (!existeCupom) return res.status(404).json({ error: "Não foi achado o cupom" });

			return res.status(200).json({ porcentagem: existeCupom?.porcentagem });
		} catch (error) {
			return res.status(500).json({ mensagme: "O cupom não existe" });
		}
	}
}

export default new StoreController();
