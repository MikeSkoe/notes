type Props = {
	noteList: JSX.Element;
	addNote: JSX.Element;
	paragraphList: JSX.Element;
	addParagraph: JSX.Element;
}

export function MainLayout({ noteList, paragraphList, addNote, addParagraph }: Props) {
	return <div className="flex">
		<aside>
			{noteList}
			{addNote}
		</aside>

		<main>
			{paragraphList}
			{addParagraph}
		</main>
	</div>
}
