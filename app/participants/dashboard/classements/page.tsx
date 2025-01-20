import React from 'react'

const Classements = () => {
  return (
    <div className='p-4'>
      <h1 className="text-3xl font-bold mb-8">
        Classements
      </h1>
      <h2>
        Classement général du nombre de points total par participant
      </h2>
      {/* <ClassementGeneralPoint /> */}
      <h2>
        Classement général du nombre de chasses réalisées par participant
      </h2>
      {/* <ClassementGeneralChasseRealisees /> */}

      <h2>
        Classement général du nombre de chasses terminées par participant
      </h2>
      {/* <ClassementGeneralChasseTerminees /> */}
    </div>
  )
}

export default Classements
