import React from "react";

const INPUT_CLASSES = "bg-gray-800 border border-border rounded-lg p-2 focus:ring focus:ring-ring";
const LABEL_CLASSES = "text-muted-foreground";
const FLEX_COL_CLASSES = "flex flex-col";

const FormField = ({ label, type, placeholder, value }) => (
  <div className={FLEX_COL_CLASSES}>
    <label className={LABEL_CLASSES}>{label}</label>
    <input type={type} className={INPUT_CLASSES} placeholder={placeholder} value={value} />
  </div>
);

export default FormField;
