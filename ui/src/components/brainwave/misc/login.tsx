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
import { login } from "@/lib/auth/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BrainwaveLogo from "./logo";

const loginSchema = z.object({
	username: z.string().min(2).max(50),
	password: z.string().min(5).max(50),
});

export default function Login() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		try {
			await login(values.username, values.password);
			await navigate({ to: "/" });
		} catch (e: string) {
			if (e.includes("Username")) {
				form.setError("username", {message: e as string})
			} else {
				form.setError("password", {message: e as string})
			}

		}
	};

	return (
		<div className="w-full h-full flex items-center justify-center flex-col text-center space-y-5 max-w-96">
			<BrainwaveLogo className="h-44 w-44" />
			<div className="mt-5">
				<h1 className="text-center text-3xl font-bold">
					Sign into your account
				</h1>
				<p>
					or{" "}
					<Link className="font-semibold" to="/signup">
						create an account
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
							<FormItem className="w-full ">
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
									<Input placeholder="Password" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full">
						Submit
					</Button>
					<p className="w-full text-center">
						Forgot password?{" "}
						<Link className="font-semibold" disabled>
							Reset it
						</Link>
					</p>
					<FormMessage />
				</form>
			</Form>
		</div>
	);
}
