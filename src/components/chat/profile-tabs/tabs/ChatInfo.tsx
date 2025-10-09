'use client';

import { useContactProfileStore } from '@/stores/contactProfileStore';
import ProfileSection from '../ProfileSection';

export default function ChatInfo() {
  const { chatInfo, setChatFields } = useContactProfileStore();
  return (
    <ProfileSection
      title="Chat Info"
      data={chatInfo}
      fields={Object.keys(chatInfo)}
      setField={setChatFields}
    />
  );
}
