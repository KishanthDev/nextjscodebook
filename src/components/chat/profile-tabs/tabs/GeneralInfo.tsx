'use client';

import React, { useEffect } from "react";
import { useContactProfileStore } from "@/stores/contactProfileStore";
import ProfileSection from "../ProfileSection"; // your existing section component

export default function GeneralInfo() {
  const { generalData, setGeneralField } = useContactProfileStore();
  return (
    <ProfileSection
      title="General Info"
      data={generalData}
      fields={[
        "subject",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "preferredContactTime",
        "summary",
        "isLeadQualified"
      ]}
      setField={setGeneralField}
      fieldTypes={{ leadQualified: "boolean", summary: "textarea", email: "email", phone: "tel" }}
    />
  );
}
