import Navbar from '../components/ui/Navbar/Navbar'
import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { getProjectImage } from '../utils/projectImages';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFullSearch } from '../hooks/useGlobalSearch.ts';

function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [sortBy, setSortBy] = useState<'title' | 'type'>('title');

    const { data: results, isLoading, isError } = useFullSearch(query);

    const availableTypes = useMemo(() => {
        if (!results) return [];
        const types = new Set(results.map((r) => r.type));
        return Array.from(types);
    }, [results]);

    const processedResults = useMemo(() => {
        if (!results) return [];

        let filtered = [...results];

        if (selectedType !== 'ALL') {
            filtered = filtered.filter((item) => item.type === selectedType);
        }

        filtered.sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortBy === 'type') {
                return a.type.localeCompare(b.type);
            }
            return 0;
        });

        return filtered;
    }, [results, selectedType, sortBy]);

	let content;
    if (isLoading) {
        content = <p className="text-subtitle text-purple">Searching for results...</p>;
    } else if (isError) {
        content = <p className="text-subtitle text-red-500">[404] Error loading search results</p>;
    } else if (!processedResults || processedResults.length === 0) {
        content = <p className="text-subtitle">No matching results found</p>;
    } else {
        content = (
            <>
                {processedResults.map((result: any) => {
                if (result.type === 'USER' || result.type === 'user') {
                    return (
                        <ProjectCard
                            key={`${result.type}-${result.id}`}
                            layout="portrait"
                            title={result.title}
							tags={[result.type]}
                            image={result.avatarUrl}
                            route={result.url}
                            username={result.title}
                            isOnline={result.isOnline}
                        />
                    );
                }
				console.log("PROJECT SLUG: ", result.slug)
				console.log("PROJECT ID: ", result.id)
				console.log("PROJECT TYPE: ", result.type)
                return (
                    <ProjectCard
                        key={`${result.type}-${result.id}`}
                        layout="portrait"
                        image={getProjectImage(result.slug)}
                        title={result.title}
                        subtitle={`Rank ${result.projectRank}`}
                        tags={[result.type]}
                        route={result.url}
                    />
                );
				})}
            </>
        );
    }

	const baseTagStyle = "px-1.5 py-0.75 text-tag w-fit rounded-4xl border inline-flex items-center gap-1 h-fit cursor-pointer transition-colors";
    const inactiveTagStyle = "bg-mild-purple border-gray-500 hover:bg-purple-200";
    const activeTagStyle = "bg-purple text-white border-purple";
	
	return (
		<section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
				<div className="w-70 flex-none">
					<Navbar />
				</div>
				
				<div className="flex flex-col flex-1 p-10 gap-10">
					<h1 className="text-title text-black">
						Search Results
					</h1>

				<CardSection title={`Filter & Options for: "${query}"`}>
                    <CardSection.Body viewMode="list">
						<div className="p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow w-full">
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">                            	
								<div className="flex flex-wrap items-center gap-2">
                                	<span className="text-subtitle text-purple">Filter:</span>
                                
                                	<button
                                    	onClick={() => setSelectedType('ALL')}
                                    	className={`${baseTagStyle} ${selectedType === 'ALL' ? activeTagStyle : inactiveTagStyle}`}>
										ALL
									</button>

									{availableTypes.map((type) => (
										<button
											key={type}
											onClick={() => setSelectedType(type)}
											className={`${baseTagStyle} ${selectedType === type ? activeTagStyle : inactiveTagStyle}`}>
											{type.toUpperCase()}
										</button>
									))}
								</div>

								<div className="flex items-center gap-2">
									<span className="text-subtitle text-purple">Sort:</span>   
									<button
										onClick={() => setSortBy('title')}
										className={`${baseTagStyle} ${sortBy === 'title' ? activeTagStyle : inactiveTagStyle}`}>
										Title
									</button>

									<button
										onClick={() => setSortBy('type')}
										className={`${baseTagStyle} ${sortBy === 'type' ? activeTagStyle : inactiveTagStyle}`}>
										Type
									</button>
									</div>
								</div>
							</div>
						</CardSection.Body>
					</CardSection>

					<CardSection title={`Results (${processedResults.length})`}>
						<CardSection.Body viewMode="grid">
							{content}
						</CardSection.Body>
					</CardSection>
				</div>
			</section>
    );
}

export default SearchResultsPage;