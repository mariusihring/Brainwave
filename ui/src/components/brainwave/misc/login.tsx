import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrainwaveLogo from "./logo";
import { Label } from "@/components/ui/label";
import {Link} from "@tanstack/react-router"

export default function Login() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col text-center space-y-5 max-w-96">
      <BrainwaveLogo className="h-44 w-44" />
      <div className="mt-5">
        <h1 className="text-center text-3xl font-bold">Sign into your account</h1>
        <p>or <Link className="font-semibold">create an account</Link></p>
      </div>
      <form className="space-y-5 w-full">
        <div className="justify-start text-start">
          <Label htmlFor="email" >Email</Label>
          <Input id="email" className="w-full" />
        </div>
        <div className="justify-start text-start">
          <Label htmlFor="password">Password</Label>
          <Input id="password" className="w-full" />
        </div>
        <Button className="w-full">Log in</Button>
        <p>Forgot password? <Link className="font-semibold">Reset it</Link></p>
      </form>

    </div>
  )
}
