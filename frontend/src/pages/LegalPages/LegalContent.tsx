import type { FC } from 'react';
import PageLayout from '../PageLayout';

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
	<PageLayout>
		<div className="mx-auto">
			<h1 className="text-title mb-2">{title}</h1>
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
	</PageLayout>
  );
};

export default LegalContent;
