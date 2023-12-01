import cors from "cors";
import express, { json } from "express";
import nodemailer from "nodemailer";
import routes from "./routes/rotas.route";
import { rateLimit } from "express-rate-limit";

const app = express();
const corsOptions = {
	origin: "http://localhost:4200", // Substitua com a origem permitida
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
	credentials: true, // Para permitir cookies e autenticação
};

// const apiLimiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// 	standardHeaders: "draft-7", // Set `RateLimit` and `RateLimit-Policy` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

app.use(cors(corsOptions));
// app.options("*", cors());
app.use(json());

// const transporter = nodemailer.createTransport({
// 	service: "Gmail",
// 	auth: {
// 		user: "tiagolazarinidev@gmail.com",
// 		pass: "sua-senha",
// 	},
// });

// app.post("/codigoRecuperacao", (req, res) => {
// 	const { destinatario, assunto, corpo } = req.body;

// 	const mailOptions = {
// 		from: "tiagolazarinidev@gmail.com",
// 		to: destinatario,
// 		subject: assunto,
// 		text: corpo,
// 	};

// 	transporter.sendMail(mailOptions, (error, info) => {
// 		if (error) {
// 			console.log(`Erro ao enviar o e-mail: ${error}`);
// 			res.status(500).json({ message: "Erro ao enviar o e-mail" });
// 		} else {
// 			console.log(`E-mail enviado: ${info.response}`);
// 			res.status(200).json({ message: "E-mail enviado com sucesso" });
// 		}
// 	});
// });

app.use("/api", routes);

export default app;
