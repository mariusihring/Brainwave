import { createFileRoute } from '@tanstack/react-router'
import Texteditor from "@/components/brainwave/editor/texteditor.tsx"
export const Route = createFileRoute('/_authenticated/test')({
  component: () => <Component />
})



function Component () {
    return <Texteditor spellcheck={false}/>
}