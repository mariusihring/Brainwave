import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/university/")({
  component: () => <div>Here goes an overview over the university</div>,
  errorComponent: () => <div>oh no there was an error</div>,
});
