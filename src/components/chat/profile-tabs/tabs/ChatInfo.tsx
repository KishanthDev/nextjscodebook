'use client';

import { useContactProfileStore } from '@/stores/contactProfileStore';
import ProfileSection from '../ProfileSection';

export default function ChatInfo() {
  const { chatInfo, setChatField } = useContactProfileStore();
  return (
    <ProfileSection
      title="Chat Info"
      data={chatInfo}
      fields={[
        "visitorType",
        "chatToken",
        "apiToken",
        "websiteDomain",
        "startedOn",
        "visitorStartTime",
        "startTime"
      ]}
      setField={setChatField}
    />
  );
}
