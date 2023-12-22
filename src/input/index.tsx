import { useState } from "react";

interface Props {
   onSubmit: (input: string) => void;
}

export function JSX({ onSubmit }: Props) {
   const [input, setInput] = useState("");

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
