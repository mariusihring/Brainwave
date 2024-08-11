import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrainwaveLogo from "./logo";
import {Link} from "@tanstack/react-router"
import { signup } from "@/lib/auth/functions";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate} from "@tanstack/react-router"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const loginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(5).max(50)
})

export default function Login() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
   try {
    await signup(values.username, values.password)
    await navigate({to: "/"})
   } catch (e) {
    console.error(e)
   }
    
  }


  return (
    <div className="w-full h-full flex items-center justify-center flex-col text-center space-y-5 max-w-96">
      <BrainwaveLogo className="h-44 w-44" />
      <div className="mt-5">
        <h1 className="text-center text-3xl font-bold">Sign into your account</h1>
        <p>or <Link className="font-semibold">create an account</Link></p>
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
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
                <Input placeholder="password" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <p>Forgot password? <Link className="font-semibold">Reset it</Link></p>
      </form>
    </Form>



      {/* <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
        <div className="justify-start text-start">
          <Label htmlFor="email" >Email</Label>
          <Input id="email" className="w-full" />
        </div>
        <div className="justify-start text-start">
          <Label htmlFor="password">Password</Label>
          <Input id="password" className="w-full" />
        </div>
        <Button className="w-full" onClick={() => signup("marius", "password")}>Log in</Button>
        
      </form> */}

    </div>
  )
}
