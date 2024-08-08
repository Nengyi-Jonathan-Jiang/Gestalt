"use client"

import {DisplayMathTex, MathTex, TexMacroProvider} from "@/tex/Tex";
import React from "react";
import {defaultTexMacros} from "@/tex/texDefaultMacros";

export default function Home() {
    // noinspection SpellCheckingInspection
    return (
        <main>
            <div>
                <TexMacroProvider macros={defaultTexMacros}>
                    <p> Have some Tex: </p>
                    <DisplayMathTex>{`f(x) = \\int_{-\\infty}^\\infty \\hat f (\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi`}</DisplayMathTex>
                    <p>
                        Remember that matrices can represent a bunch of different operations, like rotation, scaling,
                        shearing, reflection, etc. However, any given matrix <MathTex>{`\\mathbf{M}`}</MathTex> has a
                        set of vectors <MathTex>{`\\set{\\vec e_i}`}</MathTex> for
                        which <MathTex>{`\\mathbf{M}\\vec e_i`}</MathTex> only <i>scales</i>
                        <MathTex>{`\\vec e_i`}</MathTex> by a certain factor. These
                        vectors <MathTex>{`\\vec e_i`}</MathTex> are called <i>eigenvectors</i> of the matrix and the
                        factors <MathTex>{`\\lambda_i`}</MathTex> are called the <i>eigenvalues</i> corresponding to
                        each eigenvector.
                    </p>
                    <p>
                        For example, let's take the matrix
                    </p>
                    <DisplayMathTex>
                        {`\\mathbf{M} = \\mat{cc}{1 & 1 \\\\ 1 & -1}`}
                    </DisplayMathTex>
                    <p>
                        What are its eigenvectors?
                    </p>
                    <p>
                        Well, the eigenvectors <MathTex>{`\\vec e_i`}</MathTex> have the
                        property <MathTex>{`\\mathbf M \\vec e_i = \\lambda_i \\vec e_i = (\\lambda_i \\mathbf I) \\vec e_i`}</MathTex> (where
                        <MathTex>{`\\mathbf I`}</MathTex> is the identity matrix),
                        so <MathTex>{`(\\mathbf M - \\lambda_i \\mathbf I) \\vec e_i = 0`}</MathTex>. Expanding this
                        out, we
                        have

                    </p>
                    <DisplayMathTex>
                        {`\\parens{\\mat{cc}{1 & 1 \\\\ 1 & -1} - \\lambda_i \\mat{cc}{1 & 0 \\\\ 0 & 1}} \\colvec{\\alpha \\\\ \\beta} = \\colvec{0 \\\\ 0}`}
                    </DisplayMathTex>

                    <DisplayMathTex>
                        {`\\mat{cc}{1 - \\lambda_i & 1 \\\\ 1 & -1 - \\lambda_i} \\colvec{\\alpha \\\\ \\beta} = \\colvec{0 \\\\ 0}`}
                    </DisplayMathTex>
                    <p>
                        After doing the matrix multiplication, we are left with a system of linear
                        equations <MathTex>{`(1 - \\lambda_i) \\alpha + \\beta = 0, \\alpha - (1 + \\lambda_i) \\beta = 0`}</MathTex> Now
                        we have a system of linear equations. I'll solve this one manually:
                    </p>
                </TexMacroProvider>
            </div>
        </main>
    );
}
