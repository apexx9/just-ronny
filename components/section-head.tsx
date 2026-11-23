import type { ReactNode } from "react";

interface Props {
  title: string;
  id?: string;
  icon?: ReactNode;
  lead?: ReactNode;
}

export default function SectionHead({ title, id, icon, lead }: Props) {
  return (
    <header className="section-head">
      <h2 className="section-title" id={id}>
        {icon ? (
          <span className="section-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{title}</span>
      </h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </header>
  );
}
