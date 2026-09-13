import type { FC } from 'react';
import Navbar from '../components/ui/Navbar/Navbar';

interface Section {
  heading: string;
  paragraph?: string;
  list?: string[];
}

interface LegalContentProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
}

const LegalContent: FC<LegalContentProps> = ({ title, lastUpdated, sections }) => {
  return (
	<section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
		<div className="md:w-70 flex-none">
			<Navbar />
		</div>
		<div className="mx-auto px-8 py-8">
			<h1 className="text-title">{title}</h1>
			<p className="text-paragraph-bold italic text-neutral-500">
				Last Updated: {lastUpdated}
			</p>

			{sections.map((section, index) => (
				<section key={index} className="mt-6">
				<h2 className="text-subtitle">{section.heading}</h2>

				{section.paragraph && (
					<p className="text-paragraph-bold mt-2">{section.paragraph}</p>
				)}

				{section.list && (
					<ul className="mt-2 list-disc pl-5">
					{section.list.map((item, i) => (
						<li key={i} className="text-paragraph-bold">
						{item}
						</li>
					))}
					</ul>
				)}
				</section>
			))}
		</div>
	</section>
  );
};

export default LegalContent;
