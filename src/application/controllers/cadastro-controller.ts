import { Request, Response } from "express";
import bcrypt from "bcrypt";
import cadastroRepository from "../repositories/cadastroRepository";

class CadastroController {
	async cadastro(req: Request, res: Response) {
		try {
			const { nomeCompleto, email, senha } = req.body;

			if (!email || !senha || !nomeCompleto) {
				return res.status(400).json({ error: "Todos os campos são obrigatórios." });
			}

			const existingUser = await cadastroRepository.findUser(email);

			if (existingUser) {
				return res.status(400).json({ error: "O usuário já existe." });
			}

			const hashedPassword = await bcrypt.hash(senha, 10);
			const newUser = {
				nomeCompleto,
				email,
				hashedPassword,
			};

			await cadastroRepository.createUser(newUser);

			return res.json({ message: "Usuário criado com sucesso." });
		} catch (error: any) {
			console.error(error);
			return res.status(500).json({ error: error.message });
		}
	}
}

export default new CadastroController();
