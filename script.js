// Base definitions and strict regex validation patterns
const BASE_CONFIG = {
  decimal: {
    base: 10,
    pattern: /^[0-9]+$/,
    prefix: "",
    name: "Decimal",
    allowed: "0–9"
  },
  binary: {
    base: 2,
    pattern: /^[01]+$/,
    prefix: "0b",
    name: "Binary",
    allowed: "0 or 1"
  },
  hexadecimal: {
    base: 16,
    pattern: /^[0-9a-fA-F]+$/,
    prefix: "0x",
    name: "Hexadecimal",
    allowed: "0–9, A–F"
  },
  octal: {
    base: 8,
    pattern: /^[0-7]+$/,
    prefix: "0o",
    name: "Octal",
    allowed: "0–7"
  }
};

const inputType = document.getElementById("inputType");
const outputType = document.getElementById("outputType");
const inputValue = document.getElementById("inputValue");
const outputValue = document.getElementById("outputValue");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const conversionMessage = document.getElementById("conversionMessage");

// Clean input by removing whitespace and optional base prefixes (0x, 0b, 0o)
function sanitizeInput(raw, type) {
  let val = raw.trim();
  if (type === "hexadecimal") val = val.replace(/^0x/i, "");
  if (type === "binary") val = val.replace(/^0b/i, "");
  if (type === "octal") val = val.replace(/^0o/i, "");
  return val;
}

function convert(silent = false) {
  const inType = inputType.value;
  const outType = outputType.value;
  const configIn = BASE_CONFIG[inType];
  const configOut = BASE_CONFIG[outType];
  const cleanedVal = sanitizeInput(inputValue.value, inType);

  if (!cleanedVal) {
    outputValue.value = "";
    if (!silent) {
      conversionMessage.textContent = "Please enter a value to convert.";
      conversionMessage.className = "message error";
    } else {
      conversionMessage.textContent = "";
      conversionMessage.className = "message";
    }
    return;
  }

  // Strict pattern validation
  if (!configIn.pattern.test(cleanedVal)) {
    outputValue.value = "";
    conversionMessage.textContent = `Invalid ${configIn.name} input. Allowed digits: ${configIn.allowed}.`;
    conversionMessage.className = "message error";
    return;
  }

  try {
    const decimalNumber = parseInt(cleanedVal, configIn.base);
    if (Number.isNaN(decimalNumber)) {
      throw new Error(`Could not parse ${configIn.name} value.`);
    }

    const converted = decimalNumber.toString(configOut.base).toUpperCase();
    outputValue.value = converted;
    conversionMessage.textContent = `${cleanedVal} (${configIn.name}) = ${converted} (${configOut.name})`;
    conversionMessage.className = "message success";
  } catch (err) {
    outputValue.value = "";
    conversionMessage.textContent = err.message || "Conversion error.";
    conversionMessage.className = "message error";
  }
}

// Event Listeners for Converter
if (convertBtn) convertBtn.addEventListener("click", () => convert(false));

if (inputValue) {
  inputValue.addEventListener("input", () => {
    if (inputValue.value.trim() === "") {
      outputValue.value = "";
      conversionMessage.textContent = "";
      conversionMessage.className = "message";
    } else {
      convert(true);
    }
  });

  inputValue.addEventListener("keydown", (e) => {
    if (e.key === "Enter") convert(false);
  });
}

if (inputType) {
  inputType.addEventListener("change", () => {
    if (inputValue.value.trim()) convert(true);
  });
}

if (outputType) {
  outputType.addEventListener("change", () => {
    if (inputValue.value.trim()) convert(true);
  });
}

// Swap Functionality
if (swapBtn) {
  swapBtn.addEventListener("click", () => {
    const prevIn = inputType.value;
    const prevOut = outputType.value;
    inputType.value = prevOut;
    outputType.value = prevIn;

    if (outputValue.value) {
      inputValue.value = outputValue.value;
    }
    convert(false);
  });
}

// Copy to Clipboard Functionality
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    if (!outputValue.value) {
      conversionMessage.textContent = "No result to copy yet!";
      conversionMessage.className = "message error";
      return;
    }
    try {
      await navigator.clipboard.writeText(outputValue.value);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove("copied");
      }, 1800);
    } catch {
      outputValue.select();
      document.execCommand("copy");
      conversionMessage.textContent = "Result copied to clipboard.";
      conversionMessage.className = "message success";
    }
  });
}

// Mobile Navigation Toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    navToggle.classList.toggle("active");
  });

  // Close menu upon navigation link click
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
    });
  });
}

// Assignment File Upload Status
const assignmentUpload = document.getElementById("assignmentUpload");
const uploadStatus = document.getElementById("uploadStatus");

if (assignmentUpload && uploadStatus) {
  assignmentUpload.addEventListener("change", function () {
    if (this.files.length) {
      const file = this.files[0];
      const sizeKB = (file.size / 1024).toFixed(1);
      uploadStatus.textContent = `✓ Selected new replacement: ${file.name} (${sizeKB} KB)`;
      uploadStatus.className = "message success";
    } else {
      uploadStatus.textContent = "";
      uploadStatus.className = "message";
    }
  });
}
