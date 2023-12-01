import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../infra/config/env";
import bcrypt from "bcrypt";
import prisma from "../infra/config/prismaCliente";

class LoginController {
	async login(req: Request, res: Response): Promise<any> {
		const { email, senha } = req.body;

		try {
			const user = await prisma.cliente.findUnique({ where: { email } });

			if (!user) {
				return res.status(401).json({ error: "Campo de usuário/senha errados" });
			}

			const passwordMatch = await bcrypt.compare(senha, user.senha);

			if (!passwordMatch) {
				return res.status(401).json({ error: "Credenciais inválidas." });
			}

			const token = jwt.sign(
				{ userId: user.id, cliente: user.nomeCompleto, email: user.email },
				env.jwtSecret,
				{ expiresIn: "1h" }
			);

			return res.json({ token: token.toString() });
		} catch (error: any) {
			return res.json({ error: error.message });
		}
	}
}

export default new LoginController();
