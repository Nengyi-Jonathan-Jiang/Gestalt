"use client"

import {useEffect} from "react";

export default function HomePage() {
    // Redirects the user to /edit.
    useEffect(() => {
        // Strip the trailing '/' and any query parameters or hash off the current url
        let currURL = window.location.href.replace(/\/([?#].*)?$/, '');
        // Redirect to /edit.
        window.location.href = `${currURL}/edit`
    }, []);

    return <></>
}