import React from "react";
import "./AuroraTrapezoid.css";

const AuroraTrapezoid = ({
  children,
  width = "400px",
  height = "300px",
}: {
  children: React.ReactNode;
  width: string;
  height: string;
}) => {
  // We allow width and height to be passed in, default to a reasonable size
  const dynamicStyle = {
    "--container-width": width,
    "--container-height": height,
  };

  return (
    <div className="aurora-container" style={dynamicStyle}>
      {/* These three divs create the overlapping light layers */}
      <div className="aurora-layer layer-1-blue"></div>
      <div className="aurora-layer layer-2-green"></div>
      <div className="aurora-layer layer-3-red"></div>

      {/* Content sits on top, inside the trapezoid shape */}
      <div className="aurora-content">{children}</div>
    </div>
  );
};

export default AuroraTrapezoid;
