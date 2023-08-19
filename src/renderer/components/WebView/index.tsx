import React, { useEffect, useImperativeHandle, useRef } from "react";
import styles from "./index.module.css";
import type { WebviewTag } from "electron";
import classNames from "classnames";

type WebViewProps = React.DetailedHTMLProps<React.WebViewHTMLAttributes<WebviewTag>, WebviewTag>

// interface Props {
//     src: string;
// }

export const WebView = React.forwardRef<WebviewTag, WebViewProps>(({className, ...props}, ref) => {
    const webviewRef = useRef<WebviewTag>(null);
    useImperativeHandle(ref, () => webviewRef.current)
    const onReady = () => {
        const iframe = webviewRef.current.shadowRoot.childNodes.item(
            1
        ) as HTMLIFrameElement;
        iframe.style.height = "100%";
    };
    useEffect(() => {
        webviewRef.current?.addEventListener("dom-ready", onReady);
        return () => {
            webviewRef.current?.removeEventListener("dom-ready", onReady);
        };
    }, [open, webviewRef.current]);
    return (
        <webview ref={webviewRef} className={classNames(styles.webview, className)} {...props} />
    );
});