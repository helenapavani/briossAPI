import prisma from "../infra/config/prismaCliente";
type CreateUser = {
	nomeCompleto: string;
	email: string;
	hashedPassword: string;
};

class CadastroRepository {
	async findUser(email: string) {
		const user = await prisma.cliente.findUnique({ where: { email: email } });

		return user;
	}

	async createUser({ nomeCompleto, email, hashedPassword }: CreateUser) {
		const novoUsuario = await prisma.cliente.create({
			data: {
				nomeCompleto,
				email,
				senha: hashedPassword,
			},
		});
		return novoUsuario;
	}
}

export default new CadastroRepository();
