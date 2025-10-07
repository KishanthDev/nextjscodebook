'use client';

import { useContactProfileStore } from '@/stores/contactProfileStore';
import ProfileSection from '../ProfileSection';

export default function GeneralInfo() {
  const { generalData, setGeneralField } = useContactProfileStore();
  return (
    <ProfileSection
      title="General Info"
      data={generalData}
      fields={[
        "chatSubject",
        "firstName",
        "lastName",
        "email",
        "phone",
        "preferredContactTime",
        "summary",
        "leadQualified"
      ]}
      setField={setGeneralField}
      fieldTypes={{ leadQualified: "boolean", summary: "textarea", email: "email", phone: "tel" }}
    />
  );
}
