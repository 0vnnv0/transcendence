import { useRef, useState, useEffect } from 'react'
import { useUpdateAvatar, useUpdateProfile } from '../hooks/useUsers'
import Navbar from '../components/ui/Navbar/Navbar'
import Button from '../components/ui/Button/Button'
import CardSection from '../components/sections/CardSection'
import InfoCard from '../components/ui/Cards/InfoCard'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext'
import { useUserProfile } from '../hooks/useUsers';
import { useRecommendedProjects } from '../hooks/useProjects'
import { useNextProject } from '../hooks/useProjects'
import { useForm } from 'react-hook-form'
import { Controller } from "react-hook-form";
import Toggle from '../components/ui/Toggle/Toggle'
import MultiSelect from '../components/ui/Multiselect/Multiselect'

type ProfileFormValues = {
	days: string[];
	location: 'campus' | 'remote';
};

function renderProjects(data: any, isLoading: boolean, isError: boolean, label: string) {
	if (isLoading) {
		return <p className="text-subtitle text-purple">Loading ...</p>;
	}
	if (isError || !data) {
		return <p className="text-subtitle text-red-500">[404] Error trying to load {label}</p>;
	}
	return (
		<>
			{data.projects.map((project: any) => (
				<ProjectCard 
					key={project.id}
					layout="portrait"
					image="/success.png"
					title={project.name}
					subtitle={`Rank ${project.projectRank}`}
					tags={project.keywords}
					route={`/project/${project.slug}`}
					description={project.description}
				/>
			))}
		</>
	);
}

function MyProfile() {

	const { userName } = useAuth();
	const userKey = userName !== "Guest" ? userName : null;
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const { data: profile, isLoading, isError } = useUserProfile(userKey);
	const { data: currentProject, isLoading: currentProjectLoading, isError: currentProjectError } = useNextProject(userKey);
	const { data: recProjects, isLoading: recProjectsLoading, isError: recProjectsError } = useRecommendedProjects(userKey);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const updateAvatar = useUpdateAvatar(userKey);

	const { handleSubmit, control, reset, formState: { errors } } = useForm<ProfileFormValues>({ defaultValues: { days: [], location: 'campus' } });
	const updateProfileMutation = useUpdateProfile(userName);
	const [isEditing, setIsEditing] = useState(false);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		updateAvatar.mutate(file)
		e.target.value = '' // allow re-selecting the same file later
	}

	const updateUserData = (formData: any) => {
		updateProfileMutation.mutate(
			{
				days: formData.days,
				location: formData.location,
			},
			{
				onSuccess: () => {
					setIsEditing(false);
					setErrorMsg(null); // clear any previous error on a fresh success
				},
				onError: (error) => {
					setErrorMsg(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
				},
			}
		);
	};

	// we need this cause the controller's defaultValue only fires on first mount
	useEffect(() => {
		if (!profile) return;
		reset({
			days: profile.preferredDays ?? [],
			location: profile.isRemote ? 'remote' : 'campus',
		});
	}, [profile, reset]);

	const hasSavedData: boolean = (profile?.preferredDays?.length ?? 0) > 0;
	const disabled = hasSavedData && !isEditing;

	let error;
	if (isLoading) {
		error = <p className="text-subtitle text-purple">Loading ...</p>;
	} else if (isError) {
		error = <p className="text-subtitle text-red-500">[404] Error trying to load current project</p>;
	}
	const content = renderProjects(currentProject, currentProjectLoading, currentProjectError, "current project");
	const recContent = renderProjects(recProjects, recProjectsLoading, recProjectsError, "recommended projects");

  return (
		<section
			className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat"
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			{error && error}
			<div className="flex flex-col flex-1 p-10 gap-16">
				<div className="flex flex-row gap-8 w-full">
					<div className="group relative h-50 w-50 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
						style={{ backgroundImage: `url(${profile?.avatarUrl})` }}>
						<Button 
							className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
							size="sm"
							variant="secondary"
							icon="edit"
							onClick={() => fileInputRef.current?.click()}
						>Edit</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleFileChange}
						/>
					</div>
					<div className="flex flex-col justify-center gap-3">
						<h1 className="text-title">{userName}</h1>
						<p className="text-subtitle mb-4">{profile?.firstName} {profile?.lastName}</p>
						<div className="flex gap-2">
							{userName === profile?.login &&
								<Button size="md" icon="message">Message</Button>
							}
							<Button 
								size="md"
								variant="tertiary"
								href={profile?.intraUrl}
								externalLink
							>Intra Profile</Button>
						</div>
					</div>
				</div>
				<div>
					<h2 className="text-lead mb-2">Your availability</h2>
					<div className="group relative p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
						{!isEditing && hasSavedData && (
							<Button
								className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								size="sm"
								variant="secondary"
								icon="edit"
								onClick={() => setIsEditing(true)}
							>Edit</Button>
						)}

						<form 
							onSubmit={handleSubmit(updateUserData)} 
							className="flex flex-row justify-between"
						>
							<div className="flex flex-row gap-6">
								<div>
									<label className="text-black block text-xs font-medium mb-2">Days per week</label>
									<Controller
										name="days"
										control={control}
										defaultValue={profile?.preferredDays ?? []}
										rules={{ validate: (value) => value.length > 0 || "Select at least one day" }}
										render={({ field: { value, onChange } }) => (
											<MultiSelect
												options={[
													{ label: "Mon", value: "monday" },
													{ label: "Tue", value: "tuesday" },
													{ label: "Wed", value: "wednesday" },
													{ label: "Thu", value: "thursday" },
													{ label: "Fri", value: "friday" },
													{ label: "Sat", value: "saturday" },
													{ label: "Sun", value: "sunday" },
												]}
												value={value}
												onChange={onChange}
												disabled={disabled}
											/>
										)}
									/>
								</div>

								<div>
									<label className="text-black block text-xs font-medium mb-2">Working from</label>
									<Controller
										name="location"
										control={control}
										defaultValue={profile?.isRemote ? "remote" : "campus"}
										render={({ field: { value, onChange } }) => (
											<Toggle
												value={value}
												onChange={onChange}
												options={[
													{ value: 'campus', label: 'Campus' },
													{ value: 'remote', label: 'Remote' },
												]}
												disabled={disabled}
											/>
										)}
									/>
								</div>
							</div>

							{(isEditing || !hasSavedData) && (
								<div className="flex gap-2 h-min self-end">
									<Button 
										type="submit" 
										size='sm'
										disabled={updateProfileMutation.isPending}
									>
										{updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
									</Button>
								</div>
							)}
						</form>
						{errors.days && <p className="text-red-500 text-xs mt-2">{String(errors.days.message)}</p>}
						{errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
					</div>
				</div>
				<CardSection title="User Info">
					<CardSection.Body viewMode="grid" columns={4}>
						<InfoCard
							image="rank.jpg"
							title="Rank"
							description={`${profile?.currentRank}`}
						/>
						<InfoCard
							image="arctos.png"
							title="Coalition"
							description={`${profile?.coalitionName}`}
						/>
					</CardSection.Body>
				</CardSection>

				{currentProject &&
					<CardSection title="Current projects">
						<CardSection.Body viewMode="grid" columns={2}>
							{content}
						</CardSection.Body>
					</CardSection>
				}
				{recProjects?.projects.length !== 0 &&				
					<CardSection title="Recommended next projects">
						<CardSection.Body viewMode="grid" columns={2}>
							{recContent}
						</CardSection.Body>
					</CardSection>
				}
			</div>
		</section>
  )
}

export default MyProfile
