'use client';

import { useContactProfileStore } from '@/stores/contactProfileStore';
import ProfileSection from '../ProfileSection';

export default function SecurityInfo() {
  const { securityInfo, setSecurityFields } = useContactProfileStore();
  return (
    <ProfileSection
      title="Security Info"
      data={securityInfo}
      fields={Object.keys(securityInfo)}
      setField={setSecurityFields}
      fieldTypes={Object.fromEntries(Object.keys(securityInfo).map(key => [key, "boolean"]))}
    />
  );
}
