import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/auth/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BrainwaveLogo from "./logo";

const loginSchema = z.object({
	username: z.string().min(2).max(50),
	password: z.string().min(5).max(50),
});

export default function Signup() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		const hashed_password = bcrypt.hashSync(values.password);
		try {
			await signup(values.username, hashed_password);
			await navigate({ to: "/" });
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="w-full h-full flex items-center justify-center flex-col text-center space-y-5 max-w-96">
			<BrainwaveLogo className="h-44 w-44" />
			<div className="mt-5">
				<h1 className="text-center text-3xl font-bold">Create your account</h1>
				<p>
					or{" "}
					<Link to="/login" className="font-semibold">
						sign in
					</Link>
				</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="text-left w-full space-y-4"
				>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="Username" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="Password" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full">
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
}
