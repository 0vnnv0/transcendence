import PageLayout from "./PageLayout";
import Button from "../components/ui/Button/Button";

// pages/Forbidden.jsx
export default function Forbidden() {
  return (
	<div className="bg-background-neutral flex flex-col items-center justify-center min-h-screen text-center px-4">
		<h1 className="text-title">403</h1>
		<p className="text-subtitle my-4">Forbidden</p>
		<Button href="/dashboard">
			Back go dashboard
		</Button>
	</div>
  );
}
