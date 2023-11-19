import * as React from "react";

function LoadingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="prefix__icon"
      viewBox="0 0 1024 1024"
      width={"1em"}
      height={"1em"}
      {...props}
    >
      <path
        fill="currentColor"
        d="M512 170.667c-188.523 0-341.333 152.81-341.333 341.333S323.477 853.333 512 853.333 853.333 700.523 853.333 512h85.334c0 235.648-191.019 426.667-426.667 426.667S85.333 747.648 85.333 512 276.352 85.333 512 85.333v85.334z"
      />
    </svg>
  );
}

const MemoLoadingIcon = React.memo(LoadingIcon);
export default MemoLoadingIcon;
