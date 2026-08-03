import React from "react";

const UserSetup = ({ onReady }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Inserisci il tuo nome per continuare");
      return;
    }
    if (trimmed.length < 2) {
      setError("Il nome deve avere almeno 2 caratteri");
      return;
    }
    onReady(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return <div></div>;
};

export default UserSetup;
