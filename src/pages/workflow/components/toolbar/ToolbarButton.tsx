// import type { ToolbarButtonProps } from "../../../../types/workFlowTypes";

// export default function ToolbarButton({
//   icon: Icon,
//   active = false,
//   title,
//   onClick,
// }: ToolbarButtonProps) {
//   return (
//     <button
//       title={title}
//       onClick={onClick}
//       className={`
//         h-7
//         w-7
//         rounded
//         flex
//         items-center
//         justify-center
//         transition-all
//         duration-150
//         ${
//           active
//             ? "bg-component-action-primary text-white"
//             : "text-text-muted hover:bg-app-surface-elevated"
//         }
//       `}
//     >
//       <Icon size={15} />
//     </button>
//   );
// }

import type { ToolbarButtonProps } from "../../../../types/workFlowTypes";

export default function ToolbarButton({
  icon: Icon,
  active = false,
  title,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`
        flex
        h-7
        w-7
        items-center
        justify-center
        rounded-[3px]
        transition-colors
        duration-150

        ${
          active
            ? "bg-[#315D7A] text-white"
            : "text-[#8F8F8F] hover:bg-[#292929] hover:text-white"
        }
      `}
    >
      <Icon size={13} strokeWidth={1.8} />
    </button>
  );
}
