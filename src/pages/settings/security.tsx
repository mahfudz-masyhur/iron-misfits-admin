import dynamic from 'next/dynamic'
import React from 'react'
import SettingLayout from 'src/components/Layouts/Setting'
import LoadingSetting from 'src/components/pages/settings/LoadingSetting'
const SecurityPage = dynamic(() => import('src/components/pages/settings/security'), {
  ssr: false,
  loading: LoadingSetting
})

function Security() {
  return (
    <SettingLayout>
      <SecurityPage />
    </SettingLayout>
  )
}

export default Security
