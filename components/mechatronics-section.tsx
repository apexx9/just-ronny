"use client";

import RoboticArm from "./robotic-arm";
import SectionHead from "./section-head";
import SectionIcon from "./section-icon";
import { site } from "@/lib/content";

export default function MechatronicsSection() {
  return (
    <section
      id="mechatronics"
      className="middle-section mechatronics-section"
      aria-labelledby="mechatronics-heading"
      data-analytics-section="mechatronics"
    >
      <SectionHead
        title="Mechatronics"
        id="mechatronics-heading"
        icon={<SectionIcon name="cpu" />}
        lead={site.mechatronics.description}
      />

      <div className="arm-figure" data-arm-stage>
        <RoboticArm />
      </div>
    </section>
  );
}
