import { A, ComponentProps, ComponentType } from "@hydrophobefireman/ui-lib";
import { css } from "catom";

interface DashboardLinkProps extends Omit<ComponentProps<"a">, "icon"> {
  location: string;
  text: string;
  icon: (...a: any) => JSX.Element;
}

export function DashboardLink(_props: DashboardLinkProps) {
  const { location, text, icon: Icon, ...props } = _props;
  const isActive = location === props.href;

  return (
    <A
      title={text}
      {...props}
      style={
        isActive
          ? {
              backgroundColor: "var(--current-fg)",
              color: "var(--current-bg)",
            }
          : null
      }
    >
      {<Icon invert={isActive} />}
      <span class={css({ marginLeft: ".5rem" })}>{text}</span>
    </A>
  );
}
