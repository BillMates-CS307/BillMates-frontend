import { fieldData } from "..";

export default function TextField({ id, label }) {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}:</label>
        <div style={{ display: "contents", margin: "0" }}>
          <input type="text" id={id} name={id} />
        </div>
        <span></span>
      </div>
    </>
  );
}