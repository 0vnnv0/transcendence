import { type ReactNode } from 'react'
import Navbar from '../components/ui/Navbar/Navbar'
import Footer from '../components/ui/Footer/Footer'

interface PageLayoutProps {
	children: ReactNode
}

interface PageLayoutProps {
	children: ReactNode
}

function PageLayout({ children }: PageLayoutProps) {
	return (
		<section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
			<div className="md:w-56 xl:w-70 flex-none z-10">
				<Navbar />
			</div>
			<div className="flex flex-col items-between w-full">
				<div className="flex flex-col flex-1 w-full p-5 md:p-10 gap-10">
					{children}
				</div>
				<Footer />
			</div>
		</section>
	)
}

export default PageLayout
