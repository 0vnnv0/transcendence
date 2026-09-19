import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { getProjectImage } from '../utils/projectImages';
import PageLayout from './PageLayout.tsx';
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFullSearch } from '../hooks/useGlobalSearch.ts';

const ITEMS_PER_PAGE = 12;

function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [sortBy, setSortBy] = useState<'title' | 'type'>('title');

	const [currentPage, setCurrentPage] = useState<number>(1);
    const { data: results, isLoading, isError } = useFullSearch(query);

    // const availableTypes = useMemo(() => {
    //     if (!results) return [];
    //     const types = new Set(results.map((r) => r.type));
    //     return Array.from(types);
    // }, [results]);

	useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, sortBy, query]);

    const processedResults = useMemo(() => {
        if (!results) return [];

        let filtered = [...results];

        // if (selectedType !== 'ALL') {
        //     filtered = filtered.filter((item) => item.type === selectedType);
        // }

		if (selectedType === 'PROJECT') {
			filtered = filtered.filter(
				(item) => item.type === 'project'
			);
		} else if (selectedType === 'USER') {
			filtered = filtered.filter(
				(item) => item.type === 'login' || item.type === 'name'
			);
		} else if (selectedType === 'LOGIN') {
			filtered = filtered.filter(
				(item) => item.type === 'login'
			);
		} else if (selectedType === 'NAME') {
			filtered = filtered.filter(
				(item) => item.type === 'name'
			);
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

	const totalPages = Math.ceil(processedResults.length / ITEMS_PER_PAGE);

    const paginatedResults = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [processedResults, currentPage]);

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
                {paginatedResults.map((result: any) => {
					if (result.type === 'login' || result.type === 'name') {
						return (
							<ProjectCard
								key={`${result.type}-${result.id}`}
								layout="portrait"
								title={result.title}
								tags={['USER']}
								image={result.custumAvatar || result.avatarUrl}
								route={result.url}
							/>
						);
                }
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
	const disabledTagStyle = "opacity-30 cursor-not-allowed bg-gray-100 border-gray-300 text-gray-400";
	return (
		<PageLayout>
				
				<div className="flex flex-col flex-1 gap-10">
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

									{/* {availableTypes.map((type) => (
										<button
											key={type}
											onClick={() => setSelectedType(type)}
											className={`${baseTagStyle} ${selectedType === type ? activeTagStyle : inactiveTagStyle}`}>
											{type.toUpperCase()}
										</button>
									))} */}

									<button
										onClick={() => setSelectedType('PROJECT')}
										className={`${baseTagStyle} ${selectedType === 'PROJECT' ? activeTagStyle : inactiveTagStyle}`}
									>
										PROJECT
									</button>

									<button
										onClick={() => setSelectedType('USER')}
										className={`${baseTagStyle} ${selectedType === 'USER' ? activeTagStyle : inactiveTagStyle}`}
									>
										USER
									</button>

									<button
										onClick={() => setSelectedType('NAME')}
										className={`${baseTagStyle} ${selectedType === 'NAME' ? activeTagStyle : inactiveTagStyle}`}
									>
										NAME
									</button>

									<button
										onClick={() => setSelectedType('LOGIN')}
										className={`${baseTagStyle} ${selectedType === 'LOGIN' ? activeTagStyle : inactiveTagStyle}`}
									>
										LOGIN
									</button>
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

					{totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className={`${baseTagStyle} ${currentPage === 1 ? disabledTagStyle : inactiveTagStyle}`}
                        >
                            &laquo; Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`${baseTagStyle} ${currentPage === pageNumber ? activeTagStyle : inactiveTagStyle}`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className={`${baseTagStyle} ${currentPage === totalPages ? disabledTagStyle : inactiveTagStyle}`}
                        >
                            Next &raquo;
                        </button>
                    </div>
                )}
				</div>
		</PageLayout>
    );
}

export default SearchResultsPage;
