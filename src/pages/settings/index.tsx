import dynamic from 'next/dynamic'
import React from 'react'
import SettingLayout from 'src/components/Layouts/Setting'
import LoadingSetting from 'src/components/pages/settings/LoadingSetting'

const ProfilePage = dynamic(() => import('src/components/pages/settings'), { ssr: false, loading: LoadingSetting })

function SettingPage() {
  return (
    <SettingLayout>
      <ProfilePage />
    </SettingLayout>
  )
}

export default SettingPage
