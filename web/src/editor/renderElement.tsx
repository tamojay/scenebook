import type { RenderElementProps } from "slate-react";

export function renderElement(props: RenderElementProps) {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "scene_heading":
      return (
        <p
          {...attributes}
          className="uppercase font-bold mt-6 mb-2 tracking-wide"
        >
          {children}
        </p>
      );

    case "action":
      return (
        <p {...attributes} className="my-2">
          {children}
        </p>
      );

    case "character":
      return (
        <p
          {...attributes}
          // Mobile: ~35% from left (proportional industry feel)
          // Desktop: true industry indent of 2.2in
          className="uppercase mt-4 mb-0 ml-[35%] md:ml-[2.2in]"
        >
          {children}
        </p>
      );

    case "parenthetical":
      return (
        <p
          {...attributes}
          className="italic text-muted-foreground my-0 ml-[25%] max-w-[55%] md:ml-[1.6in] md:max-w-[2in]"
        >
          {children}
        </p>
      );

    case "dialogue":
      return (
        <p
          {...attributes}
          className="mb-2 ml-[15%] mr-[15%] md:ml-[1in] md:mr-0 md:max-w-[3.5in]"
        >
          {children}
        </p>
      );

    case "transition":
      return (
        <p {...attributes} className="uppercase text-right my-4">
          {children}
        </p>
      );

    case "shot":
      return (
        <p {...attributes} className="uppercase mt-4 mb-2">
          {children}
        </p>
      );

    default:
      return <p {...attributes}>{children}</p>;
  }
}
