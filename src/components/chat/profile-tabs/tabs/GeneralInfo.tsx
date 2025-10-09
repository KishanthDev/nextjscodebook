'use client';

import React, { useEffect } from "react";
import { useContactProfileStore } from "@/stores/contactProfileStore";
import ProfileSection from "../ProfileSection"; // your existing section component

export default function GeneralInfo() {
  const { generalData, setGeneralFields } = useContactProfileStore();
  return (
    <ProfileSection
      title="General Info"
      data={generalData}
      fields={Object.keys(generalData)}
      setField={setGeneralFields}
      fieldTypes={{ leadQualified: "boolean", summary: "textarea", email: "email", phone: "tel" }}
    />
  );
}
