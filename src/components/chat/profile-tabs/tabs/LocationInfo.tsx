'use client';

import { useContactProfileStore } from '@/stores/contactProfileStore';
import ProfileSection from '../ProfileSection';

export default function LocationInfo() {
  const { locationInfo, setLocationField } = useContactProfileStore();
  return (
    <ProfileSection
      title="Location Info"
      data={locationInfo}
      fields={Object.keys(locationInfo)}
      setField={setLocationField}
      fieldTypes={{ isCountryInEU: "boolean" }}
    />
  );
}
