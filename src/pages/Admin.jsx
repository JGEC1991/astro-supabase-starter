import React, { useState } from 'react'
    import { supabase } from '../../supabaseClient'
    import { useTranslation } from 'react-i18next'
    
    function Admin() {
      const [email, setEmail] = useState('')
      const [invitationToken, setInvitationToken] = useState('')
      const { t } = useTranslation()
    
      const handleGenerateInvitation = async () => {
        const token = crypto.randomUUID();
    
        try {
          const { data, error } = await supabase
            .from('invitations')
            .insert([{ token: token, email: email }]);
    
          if (error) {
            console.error('Error inserting invitation:', error)
            alert(error.message)
          } else {
            console.log('Invitation token:', token)
            setInvitationToken(token)
            alert(`Invitation token generated: ${token}`)
          }
        } catch (error) {
          console.error('Error generating invitation:', error.message)
          alert(error.message)
        }
      }
    
      return (
        <div className="page">
          <h1 className="text-3xl font-semibold mb-4">{t('admin')}</h1>
          <p className="text-gray-700">{t('adminPanel')}</p>
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">{t('generateInvitation')}</h2>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              placeholder={t('enterEmail')}
            />
            <button
              onClick={handleGenerateInvitation}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {t('generateInvitationToken')}
            </button>
            {invitationToken && <p className="text-gray-700">{t('invitationToken')}: {invitationToken}</p>}
          </div>
        </div>
      )
    }
    
    export default Admin
