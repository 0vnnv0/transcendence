import PageLayout from "./PageLayout";
import Button from "../components/ui/Button/Button";

// pages/NotFound.jsx
export default function NotFound() {
  return (
	<PageLayout>
		<div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
			<h1 className="text-title">404</h1>
			<p className="text-subtitle my-4">Page not found</p>
			<Button href="/dashboard">
				Back to dashboard
			</Button>
		</div>
	</PageLayout>
  );
}
