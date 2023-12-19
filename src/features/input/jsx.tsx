import { createSignal } from "solid-js";

interface Props {
    onSubmit: (input: string) => void;
}

export default function ({ onSubmit }: Props) {
  const [input, setInput] = createSignal("");

  return (
    <form onSubmit={evt => {
      evt.preventDefault();
      onSubmit(input());
      setInput("");
    }}>
      <input
        placeholder="Input new title"
        required
        value={input()}
        onInput={event => setInput(event.currentTarget.value)}
      />
    </form>
  );
}
