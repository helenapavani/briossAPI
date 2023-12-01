import { Request, Response } from "express";
import usuarioRepository from "../repositories/usuarioRepository";

class UsuarioController {
	async getUser(req: Request, res: Response) {
		try {
			const { email } = req.body;
			const existingUser = await usuarioRepository.getUser(email);

			if (!existingUser) {
				return res.status(404).json({ message: "Usuário não encontrado" });
			}
			return res.status(200).json(existingUser);
		} catch (error) {
			return res.status(500).json({ message: "Erro interno do servidor" });
		}
	}
}

export default new UsuarioController();
