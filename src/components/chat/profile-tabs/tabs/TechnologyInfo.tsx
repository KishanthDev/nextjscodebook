'use client';

import { useContactProfileStore } from '@/stores/contactProfileStore';
import ProfileSection from '../ProfileSection';

export default function TechnologyInfo() {
  const { technologyInfo, setTechnologyFields } = useContactProfileStore();
  return (
    <ProfileSection
      title="Technology Info"
      data={technologyInfo}
      fields={Object.keys(technologyInfo)}
      setField={setTechnologyFields}
    />
  );
}
