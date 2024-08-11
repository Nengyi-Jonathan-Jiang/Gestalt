import type {Metadata} from "next";
import "./globals.css";
import "../_assets/katex/katex.min.css"

import React from "react";


export const metadata: Metadata = {
    title: "Gestalt",
    description: "A note-taking tool",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    // noinspection JSUnresolvedLibraryURL,HtmlRequiredTitleElement
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/x-icon" href="./favicon.ico"/>
            </head>
            <body>{children}</body>
        </html>
    );
}
