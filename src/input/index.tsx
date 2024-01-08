import { useState } from "react";

interface Props {
   onSubmit: (input: string) => void;
   initialValue?: string;
}

export function JSX({ onSubmit, initialValue = "" }: Props) {
   const [input, setInput] = useState(initialValue);

   return (
      <form onSubmit={evt => {
         evt.preventDefault();
         onSubmit(input);
         setInput("");
      }}>
         <input
            placeholder="Input new title"
            required
            value={input}
            onInput={event => setInput(event.currentTarget.value)}
         />
      </form>
   );
}
