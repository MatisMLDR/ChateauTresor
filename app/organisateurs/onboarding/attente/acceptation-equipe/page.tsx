import React from 'react'

const AttenteAcceptationEquipe = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold mb-2'>En attente de validation</h1>
      <h2 className='text-xl mb-4'>Vous avez bien envoyé une demande pour rejoindre une équipe, mais elle est en attente de validation.</h2>
      <h2 className='text-xl mb-4'>Vous recevrez un mail dès que votre équipe sera validée.</h2>
    </div>
  )
}

export default AttenteAcceptationEquipe
