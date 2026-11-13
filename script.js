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

// Case Study File Upload Status
const caseStudyUpload = document.getElementById("caseStudyUpload");
const caseStudyUploadStatus = document.getElementById("caseStudyUploadStatus");

if (caseStudyUpload && caseStudyUploadStatus) {
  caseStudyUpload.addEventListener("change", function () {
    if (this.files.length) {
      const file = this.files[0];
      const sizeKB = (file.size / 1024).toFixed(1);
      caseStudyUploadStatus.textContent = `✓ Selected new replacement: ${file.name} (${sizeKB} KB)`;
      caseStudyUploadStatus.className = "message success";
    } else {
      caseStudyUploadStatus.textContent = "";
      caseStudyUploadStatus.className = "message";
    }
  });
}

// Case Study Report Toggle
const toggleCaseStudyReport = document.getElementById("toggleCaseStudyReport");
const caseStudyReportContent = document.getElementById("caseStudyReportContent");

if (toggleCaseStudyReport && caseStudyReportContent) {
  toggleCaseStudyReport.addEventListener("click", () => {
    const isHidden = caseStudyReportContent.classList.toggle("hidden");
    toggleCaseStudyReport.setAttribute("aria-expanded", String(!isHidden));
    toggleCaseStudyReport.textContent = isHidden ? "Read Online ▾" : "Collapse Report ▴";
  });
}

// ==========================================================================
// COA INSTRUCTION SET SIMULATOR (0, 1, 2, 3 ADDRESS ARCHITECTURES)
// ==========================================================================

const simOpMap = {
  '+': { name: 'ADD', symbol: '+' },
  '-': { name: 'SUB', symbol: '-' },
  '*': { name: 'MUL', symbol: '*' },
  '/': { name: 'DIV', symbol: '/' }
};

function parseExpression(input) {
  if (!input || !input.trim()) {
    throw new Error('Please enter an arithmetic expression.');
  }

  let target = 'X';
  let exprStr = input.trim();
  if (exprStr.includes('=')) {
    const parts = exprStr.split('=');
    const cand = parts[0].trim();
    target = /^[a-zA-Z0-9_]+$/.test(cand) ? cand : 'X';
    exprStr = parts.slice(1).join('=').trim();
  }

  if (!exprStr) {
    throw new Error('Expression cannot be empty.');
  }

  // Tokenize: identifiers/numbers or operators/parens
  const rawTokens = exprStr.match(/([a-zA-Z0-9_]+|[\+\-\*\/\(\)])/g);
  if (!rawTokens || rawTokens.length === 0) {
    throw new Error('Could not parse any valid operands or operators.');
  }

  // Check for syntax issues
  let lastType = 'start';
  let openParenCount = 0;
  for (let i = 0; i < rawTokens.length; i++) {
    const t = rawTokens[i];
    const isOp = ['+', '-', '*', '/'].includes(t);
    const isParenOpen = t === '(';
    const isParenClose = t === ')';
    const isOperand = /^[a-zA-Z0-9_]+$/.test(t);

    if (isParenOpen) openParenCount++;
    if (isParenClose) {
      openParenCount--;
      if (openParenCount < 0) throw new Error('Unbalanced closing parenthesis ")" encountered.');
    }

    if (isOp && (lastType === 'op' || lastType === 'start' || lastType === 'parenOpen')) {
      throw new Error(`Invalid syntax near operator "${t}".`);
    }
    if (isOperand && lastType === 'operand') {
      throw new Error(`Missing operator between "${rawTokens[i - 1]}" and "${t}".`);
    }

    if (isOperand) lastType = 'operand';
    else if (isOp) lastType = 'op';
    else if (isParenOpen) lastType = 'parenOpen';
    else if (isParenClose) lastType = 'parenClose';
  }

  if (lastType === 'op') {
    throw new Error('Expression cannot end with an operator.');
  }
  if (openParenCount !== 0) {
    throw new Error('Unbalanced parentheses in expression.');
  }

  // Shunting-Yard Algorithm to generate RPN
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const outputQueue = [];
  const opStack = [];

  for (const token of rawTokens) {
    if (/^[a-zA-Z0-9_]+$/.test(token)) {
      outputQueue.push({ type: 'operand', val: token });
    } else if (['+', '-', '*', '/'].includes(token)) {
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== '(' &&
        precedence[opStack[opStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push({ type: 'op', val: opStack.pop() });
      }
      opStack.push(token);
    } else if (token === '(') {
      opStack.push(token);
    } else if (token === ')') {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        outputQueue.push({ type: 'op', val: opStack.pop() });
      }
      if (opStack.length === 0) throw new Error('Mismatched parentheses.');
      opStack.pop(); // discard '('
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop();
    if (top === '(' || top === ')') throw new Error('Mismatched parentheses.');
    outputQueue.push({ type: 'op', val: top });
  }

  return { target, infix: exprStr, rpn: outputQueue };
}

function buildAST(rpnTokens) {
  const stack = [];
  for (const token of rpnTokens) {
    if (token.type === 'operand') {
      stack.push({ type: 'operand', val: token.val, isLeaf: true });
    } else {
      const right = stack.pop();
      const left = stack.pop();
      if (!left || !right) throw new Error('Malformed expression syntax.');
      stack.push({ type: 'op', op: token.val, left, right, isLeaf: false });
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression structure.');
  return stack[0];
}

// 0-Address Generator (Stack Architecture)
function genZeroAddress(rpnTokens, target) {
  const code = [];
  for (const token of rpnTokens) {
    if (token.type === 'operand') {
      code.push({
        inst: `PUSH  ${token.val}`,
        comment: `TOS <- M[${token.val}]`,
        op: 'PUSH',
        args: [token.val]
      });
    } else {
      const opName = simOpMap[token.val].name;
      code.push({
        inst: `${opName.padEnd(5)}`,
        comment: `TOS <- (second ${token.val} top)`,
        op: opName,
        args: []
      });
    }
  }
  code.push({
    inst: `POP   ${target}`,
    comment: `M[${target}] <- TOS`,
    op: 'POP',
    args: [target]
  });
  return code;
}

// 1-Address Generator (Accumulator AC Architecture)
function genOneAddress(ast, target) {
  const code = [];
  let tempCounter = 1;

  function evaluate(node) {
    if (node.isLeaf) {
      code.push({
        inst: `LOAD  ${node.val}`,
        comment: `AC <- M[${node.val}]`,
        op: 'LOAD',
        args: [node.val]
      });
      return;
    }

    const opName = simOpMap[node.op].name;

    // Case 1: Right child is a simple operand
    if (node.right.isLeaf) {
      evaluate(node.left);
      code.push({
        inst: `${opName.padEnd(5)} ${node.right.val}`,
        comment: `AC <- AC ${node.op} M[${node.right.val}]`,
        op: opName,
        args: [node.right.val]
      });
      return;
    }

    // Case 2: Left child is a simple operand, right is compound
    if (node.left.isLeaf) {
      if (node.op === '+' || node.op === '*') {
        evaluate(node.right);
        code.push({
          inst: `${opName.padEnd(5)} ${node.left.val}`,
          comment: `AC <- AC ${node.op} M[${node.left.val}]`,
          op: opName,
          args: [node.left.val]
        });
      } else {
        evaluate(node.right);
        const t = `T${tempCounter++}`;
        code.push({
          inst: `STORE ${t}`,
          comment: `M[${t}] <- AC (save right operand)`,
          op: 'STORE',
          args: [t]
        });
        code.push({
          inst: `LOAD  ${node.left.val}`,
          comment: `AC <- M[${node.left.val}]`,
          op: 'LOAD',
          args: [node.left.val]
        });
        code.push({
          inst: `${opName.padEnd(5)} ${t}`,
          comment: `AC <- AC ${node.op} M[${t}]`,
          op: opName,
          args: [t]
        });
      }
      return;
    }

    // Case 3: Both left and right are compound subexpressions
    if (node.op === '-' || node.op === '/') {
      evaluate(node.right);
      const t = `T${tempCounter++}`;
      code.push({
        inst: `STORE ${t}`,
        comment: `M[${t}] <- AC (save right subexpression)`,
        op: 'STORE',
        args: [t]
      });
      evaluate(node.left);
      code.push({
        inst: `${opName.padEnd(5)} ${t}`,
        comment: `AC <- AC ${node.op} M[${t}] (left ${node.op} right)`,
        op: opName,
        args: [t]
      });
    } else {
      evaluate(node.left);
      const t = `T${tempCounter++}`;
      code.push({
        inst: `STORE ${t}`,
        comment: `M[${t}] <- AC (save left subexpression)`,
        op: 'STORE',
        args: [t]
      });
      evaluate(node.right);
      code.push({
        inst: `${opName.padEnd(5)} ${t}`,
        comment: `AC <- AC ${node.op} M[${t}]`,
        op: opName,
        args: [t]
      });
    }
  }

  evaluate(ast);
  code.push({
    inst: `STORE ${target}`,
    comment: `M[${target}] <- AC`,
    op: 'STORE',
    args: [target]
  });
  return code;
}

// 2-Address Generator (Register-Memory Architecture)
function genTwoAddress(ast, target) {
  const code = [];
  let regCounter = 1;

  function traverse(node) {
    if (node.isLeaf) return node.val;
    const opName = simOpMap[node.op].name;

    // Both children are leaves
    if (node.left.isLeaf && node.right.isLeaf) {
      const r = `R${regCounter++}`;
      code.push({
        inst: `MOV   ${r}, ${node.left.val}`,
        comment: `${r} <- M[${node.left.val}]`,
        op: 'MOV',
        args: [r, node.left.val]
      });
      code.push({
        inst: `${opName.padEnd(5)} ${r}, ${node.right.val}`,
        comment: `${r} <- ${r} ${node.op} M[${node.right.val}]`,
        op: opName,
        args: [r, node.right.val]
      });
      return r;
    }

    // Left is compound, right is leaf
    if (!node.left.isLeaf && node.right.isLeaf) {
      const rLeft = traverse(node.left);
      code.push({
        inst: `${opName.padEnd(5)} ${rLeft}, ${node.right.val}`,
        comment: `${rLeft} <- ${rLeft} ${node.op} M[${node.right.val}]`,
        op: opName,
        args: [rLeft, node.right.val]
      });
      return rLeft;
    }

    // Left is leaf, right is compound
    if (node.left.isLeaf && !node.right.isLeaf) {
      const rRight = traverse(node.right);
      if (node.op === '+' || node.op === '*') {
        code.push({
          inst: `${opName.padEnd(5)} ${rRight}, ${node.left.val}`,
          comment: `${rRight} <- ${rRight} ${node.op} M[${node.left.val}]`,
          op: opName,
          args: [rRight, node.left.val]
        });
        return rRight;
      } else {
        const rNew = `R${regCounter++}`;
        code.push({
          inst: `MOV   ${rNew}, ${node.left.val}`,
          comment: `${rNew} <- M[${node.left.val}]`,
          op: 'MOV',
          args: [rNew, node.left.val]
        });
        code.push({
          inst: `${opName.padEnd(5)} ${rNew}, ${rRight}`,
          comment: `${rNew} <- ${rNew} ${node.op} ${rRight}`,
          op: opName,
          args: [rNew, rRight]
        });
        return rNew;
      }
    }

    // Both children are compound
    const rLeft = traverse(node.left);
    const rRight = traverse(node.right);
    code.push({
      inst: `${opName.padEnd(5)} ${rLeft}, ${rRight}`,
      comment: `${rLeft} <- ${rLeft} ${node.op} ${rRight}`,
      op: opName,
      args: [rLeft, rRight]
    });
    return rLeft;
  }

  if (ast.isLeaf) {
    code.push({
      inst: `MOV   ${target}, ${ast.val}`,
      comment: `M[${target}] <- M[${ast.val}]`,
      op: 'MOV',
      args: [target, ast.val]
    });
  } else {
    const finalReg = traverse(ast);
    code.push({
      inst: `MOV   ${target}, ${finalReg}`,
      comment: `M[${target}] <- ${finalReg}`,
      op: 'MOV',
      args: [target, finalReg]
    });
  }
  return code;
}

// 3-Address Generator (General Register Architecture)
function genThreeAddress(ast, target) {
  const code = [];
  let regCounter = 1;

  function traverse(node, isRoot) {
    if (node.isLeaf) return node.val;
    const leftRep = traverse(node.left, false);
    const rightRep = traverse(node.right, false);
    const opName = simOpMap[node.op].name;

    if (isRoot) {
      code.push({
        inst: `${opName.padEnd(5)} ${target}, ${leftRep}, ${rightRep}`,
        comment: `M[${target}] <- ${leftRep} ${node.op} ${rightRep}`,
        op: opName,
        args: [target, leftRep, rightRep]
      });
      return target;
    } else {
      const reg = `R${regCounter++}`;
      code.push({
        inst: `${opName.padEnd(5)} ${reg}, ${leftRep}, ${rightRep}`,
        comment: `${reg} <- ${leftRep} ${node.op} ${rightRep}`,
        op: opName,
        args: [reg, leftRep, rightRep]
      });
      return reg;
    }
  }

  if (ast.isLeaf) {
    code.push({
      inst: `MOV   ${target}, ${ast.val}`,
      comment: `M[${target}] <- ${ast.val}`,
      op: 'MOV',
      args: [target, ast.val]
    });
  } else {
    traverse(ast, true);
  }
  return code;
}

function escapeSimHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderCodeOutput(codeList) {
  const plainText = codeList.map(item => `${item.inst.padEnd(20)} ; ${item.comment}`).join('\n');
  const html = codeList.map(item => {
    const parts = item.inst.trim().split(/\s+/);
    const op = parts[0] || '';
    const rest = item.inst.substring(item.inst.indexOf(op) + op.length);
    return `<span class="sim-code-op">${escapeSimHtml(op.padEnd(6))}</span>${escapeSimHtml(rest).padEnd(16)}  <span class="sim-code-comment">; ${escapeSimHtml(item.comment)}</span>`;
  }).join('\n');

  return { plainText, html };
}

function runSimulator() {
  const inputEl = document.getElementById('simExprInput');
  const errorEl = document.getElementById('simError');
  const targetVarEl = document.getElementById('simTargetVar');
  const infixEl = document.getElementById('simInfixDisplay');
  const postfixEl = document.getElementById('simPostfixDisplay');

  const out3El = document.getElementById('simOut3');
  const out2El = document.getElementById('simOut2');
  const out1El = document.getElementById('simOut1');
  const out0El = document.getElementById('simOut0');

  const count3El = document.getElementById('simCount3');
  const count2El = document.getElementById('simCount2');
  const count1El = document.getElementById('simCount1');
  const count0El = document.getElementById('simCount0');

  const tableBody = document.getElementById('simSummaryTableBody');

  if (!inputEl) return;

  const rawExpr = inputEl.value;

  try {
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }

    const { target, infix, rpn } = parseExpression(rawExpr);
    const ast = buildAST(rpn);
    const postfixStr = rpn.map(t => t.val).join(' ');

    if (targetVarEl) targetVarEl.textContent = target;
    if (infixEl) infixEl.textContent = infix;
    if (postfixEl) postfixEl.textContent = postfixStr;

    // Generate instructions
    const code3 = genThreeAddress(ast, target);
    const code2 = genTwoAddress(ast, target);
    const code1 = genOneAddress(ast, target);
    const code0 = genZeroAddress(rpn, target);

    const res3 = renderCodeOutput(code3);
    const res2 = renderCodeOutput(code2);
    const res1 = renderCodeOutput(code1);
    const res0 = renderCodeOutput(code0);

    if (out3El) {
      out3El.innerHTML = res3.html;
      out3El.setAttribute('data-plain', res3.plainText);
    }
    if (out2El) {
      out2El.innerHTML = res2.html;
      out2El.setAttribute('data-plain', res2.plainText);
    }
    if (out1El) {
      out1El.innerHTML = res1.html;
      out1El.setAttribute('data-plain', res1.plainText);
    }
    if (out0El) {
      out0El.innerHTML = res0.html;
      out0El.setAttribute('data-plain', res0.plainText);
    }

    if (count3El) count3El.textContent = `${code3.length} Inst`;
    if (count2El) count2El.textContent = `${code2.length} Inst`;
    if (count1El) count1El.textContent = `${code1.length} Inst`;
    if (count0El) count0El.textContent = `${code0.length} Inst`;

    // Populate Comparison Table
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td><span class="sim-badge tag-3">3-Address</span> <strong>General Register</strong></td>
          <td>None (explicit <code>Dest, Src1, Src2</code>)</td>
          <td><strong>${code3.length}</strong> instructions</td>
          <td>~48 bits (3 address fields)</td>
          <td>Minimal memory; mostly register file transfers</td>
          <td>Shortest program size in instruction count; requires wider instruction word decoding.</td>
        </tr>
        <tr>
          <td><span class="sim-badge tag-2">2-Address</span> <strong>Register-Memory</strong></td>
          <td><code>Dest</code> register acts as 1st source operand</td>
          <td><strong>${code2.length}</strong> instructions</td>
          <td>~32 bits (2 address fields)</td>
          <td>Moderate memory access; register-to-register or memory-to-register</td>
          <td>Balanced instruction length and count; industry standard CISC (x86 architecture).</td>
        </tr>
        <tr>
          <td><span class="sim-badge tag-1">1-Address</span> <strong>Accumulator (AC)</strong></td>
          <td>Accumulator register (<code>AC</code>)</td>
          <td><strong>${code1.length}</strong> instructions</td>
          <td>~16–24 bits (1 address field)</td>
          <td>Frequent memory traffic (intermediate stores and loads via <code>T1, T2...</code>)</td>
          <td>Simplest CPU control logic; minimal bit-width per instruction, higher instruction count.</td>
        </tr>
        <tr>
          <td><span class="sim-badge tag-0">0-Address</span> <strong>Stack Architecture</strong></td>
          <td>Top of Stack (<code>TOS</code>, <code>TOS-1</code>)</td>
          <td><strong>${code0.length}</strong> instructions</td>
          <td>~8–16 bits (Opcode only for ALU)</td>
          <td>Stack memory traffic (PUSH/POP pushdowns and popups)</td>
          <td>Compact bytecodes (e.g. Java Bytecode, Forth, PostScript); highest instruction count.</td>
        </tr>
      `;
    }
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = `Error: ${err.message}`;
      errorEl.style.display = 'block';
    }
  }
}

// Simulator Event Listeners
const simGenerateBtn = document.getElementById('simGenerateBtn');
const simExprInput = document.getElementById('simExprInput');

if (simGenerateBtn && simExprInput) {
  simGenerateBtn.addEventListener('click', runSimulator);
  simExprInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSimulator();
    }
  });
}

// Preset Buttons
document.querySelectorAll('.sim-preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expr = btn.getAttribute('data-expr');
    if (expr && simExprInput) {
      simExprInput.value = expr;
      runSimulator();
    }
  });
});

// Copy Assembly Buttons
document.querySelectorAll('.sim-copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const targetId = btn.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const plainText = targetEl.getAttribute('data-plain') || targetEl.textContent;
    try {
      await navigator.clipboard.writeText(plainText);
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1800);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = plainText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1800);
    }
  });
});

// Initial run on load
if (document.getElementById('simExprInput')) {
  runSimulator();
}
