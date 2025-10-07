'use client';

import { useContactProfileStore } from '@/stores/contactProfileStore';
import ProfileSection from '../ProfileSection';

export default function SecurityInfo() {
  const { securityInfo, setSecurityField } = useContactProfileStore();
  return (
    <ProfileSection
      title="Security Info"
      data={securityInfo}
      fields={Object.keys(securityInfo)}
      setField={setSecurityField}
      fieldTypes={Object.fromEntries(Object.keys(securityInfo).map(key => [key, "boolean"]))}
    />
  );
}
