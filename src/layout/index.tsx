type Props = {
	router: JSX.Element;
	noteList: JSX.Element;
	addNote: JSX.Element;
	paragraphList: JSX.Element;
	addParagraph: JSX.Element;
}

export function MainLayout({ router, noteList, paragraphList, addNote, addParagraph }: Props) {
	return <div className="flex">
		<aside>
			{noteList}
			{addNote}
		</aside>

		<main>
			{router}
			{paragraphList}
			{addParagraph}
		</main>
	</div>
}
