import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <div className="w-full h-full">
      <div className="h-32 w-25 bg-red-500" />
      <div>
        <h1>Sign in to your account</h1>
        <p>or <a>create an account</a></p>
      </div>
      <div>
        <form>
          <Input />
          <Input />
          <Button>Log in</Button>
          <p>Forgot password? <a>Reset it</a></p>
        </form>
      </div>
    </div>
  )
}
