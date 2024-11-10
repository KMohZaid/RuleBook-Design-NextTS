interface TabButtonProps {
	title: string;
	onClick: () => void;
	isActive: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ title, onClick, isActive }) => {
	return (
		<button className={`tab-button ${isActive ? 'active' : ''}`} onClick={onClick}>
			{title}
		</button>
	);
};

export default TabButton;

