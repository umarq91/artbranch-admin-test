export const getStatusBadge = (status: string) => {
  let badgeText;
  let borderColor;
  let textColor;

  switch (status) {
    case "active":
      badgeText = "Active";
      borderColor = "#008E28";
      textColor = "#008E28";
      break;
    case "disabled":
      badgeText = "Disabled";
      borderColor = "#8E0000";
      textColor = "#8E0000";
      break;
    case "verification_pending":
      badgeText = "Verification Pending";
      borderColor = "#800080";
      textColor = "#800080";
      break;
    case "rejected":
      badgeText = "Rejected";
      borderColor = "#4B0082";
      textColor = "#4B0082";
      break;
    case "not_applied":
      badgeText = "Not Applied";
      borderColor = "#4B0082";
      textColor = "#4B0082";
      break;
    case "verified":
      badgeText = "Verified";
      borderColor = "#008E28";
      textColor = "#008E28";
      break;
    case "pending":
      badgeText = "Pending";
      borderColor = "#800080";
      textColor = "#800080";
      break;
    default:
      badgeText = "Unknown Status";
      borderColor = "#333333";
      textColor = "white";
      break;
    case "featured":
      badgeText = "Featured Artists";
      borderColor = "#008E28";
      textColor = "#008E28";
  }

  return (
    <span
      style={{
        border: `1px solid ${borderColor}`,
        color: textColor,
        padding: "5px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        display: "inline-block",
      }}
    >
      {badgeText}
    </span>
  );
};