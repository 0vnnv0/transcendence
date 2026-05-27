
interface EditButtonProps {
	onClick: () => void;
}

function EditButton({ onClick }: EditButtonProps) {
	return (
		<button
			onClick={onClick}
			className="p-2rounded-full transition-all hover:scale-110 cursor-pointer flex items-center justify-center"
		>
		<img src="edit.svg" alt="Edit" />
		</button>	
	);
}

export default EditButton