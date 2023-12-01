import prisma from "../infra/config/prismaCliente";

class UsuarioRepository {
	async getUser(email: string) {
		const existingUser = await prisma.cliente.findUnique({
			where: { email: email },
			select: {
				id: true,
				nomeCompleto: true,
				email: true,
			},
		});
		console.log(
			"🚀 ~ file: usuarioRepository.ts:13 ~ UsuarioRepository ~ getUser ~ existingUser:",
			existingUser
		);
		return existingUser;
	}
}

export default new UsuarioRepository();
