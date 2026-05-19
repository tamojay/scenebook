import type { RenderElementProps } from "slate-react";

export function renderElement(props: RenderElementProps) {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "scene_heading":
      return (
        <p
          {...attributes}
          className="font-['Courier_Prime'] uppercase font-bold tracking-wide mt-6 mb-2"
        >
          {children}
        </p>
      );

    case "action":
      return (
        <p {...attributes} className="font-['Courier_Prime'] my-2">
          {children}
        </p>
      );

    case "character":
      return (
        <p
          {...attributes}
          className="font-['Courier_Prime'] uppercase mt-4 mb-0 ml-[38%]"
        >
          {children}
        </p>
      );

    case "parenthetical":
      return (
        <p
          {...attributes}
          className="font-['Courier_Prime'] italic text-muted-foreground my-0 ml-[30%]"
        >
          {children}
        </p>
      );

    case "dialogue":
      return (
        <p
          {...attributes}
          className="font-['Courier_Prime'] mb-2 ml-[20%] mr-[20%]"
        >
          {children}
        </p>
      );

    case "transition":
      return (
        <p
          {...attributes}
          className="font-['Courier_Prime'] uppercase text-right my-4"
        >
          {children}
        </p>
      );

    case "shot":
      return (
        <p
          {...attributes}
          className="font-['Courier_Prime'] uppercase mt-4 mb-2"
        >
          {children}
        </p>
      );

    default:
      return (
        <p {...attributes} className="font-['Courier_Prime']">
          {children}
        </p>
      );
  }
}
