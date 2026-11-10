import React from "react";

const STEPS = ["Количка", "Доставка", "Потвърждение"];

const CheckoutSteps = ({ current }) => (
  <nav className="steps" aria-label="Стъпки на поръчката">
    <ol>
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={i === current ? "is-current" : i < current ? "is-done" : ""}
          aria-current={i === current ? "step" : undefined}
        >
          <span className="steps__num">{i < current ? "✓" : i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  </nav>
);

export default CheckoutSteps;
