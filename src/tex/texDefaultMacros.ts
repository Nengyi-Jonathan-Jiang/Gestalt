// noinspection SpellCheckingInspection
export const defaultTexMacros = {
    abs: `\\left|#1\\right|`,
    parens: `\\left(#1\\right)`,
    bracketed: `\\left[#1\\right]`,
    set: `\\left\\{#1\\right\\}`,
    bra: `\\left<#1\\right|`,
    ket: `\\left|#1\\right>`,
    braket: `\\left<#1\\middle|#2\\right>`,
    norm: `\\left|\\left|#1\\right|\\right|`,
    mat: `\\bracketed{\\begin{array}{#1} #2 \\end{array}}`,
    colvec: `\\mat{c}{#1}`,
    piecewise: `\\left\\{\\begin{array}{ll} #1 \\end{array}\\right.`
};