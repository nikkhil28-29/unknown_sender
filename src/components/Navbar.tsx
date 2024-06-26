'use client'
import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import {User} from 'next-auth'
// import { Button } from '@react-email/components'
import { Button } from './ui/button';



const Navbar=()=> {
            
    const {data:session}=useSession() ; //extracting data form session, bt info abt user will get from user itself

    const user:User=session?.user  //A/q to docs, data.user is not reccominede

  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='conatiner mx-auto flex flex-col md:flex-row justify-between items-centre'>
            <a href='#'>hg</a>
            {
                session ? (
                    <><span>Welcome ,{user?.username || user?.email}
                      </span>
                      <Button  className ='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button></>
                ):(
                    <Link href='/sign-in'>
                    <Button className ='w-full md:w-auto'>Login</Button>
                    </Link>
                )
            }
        </div>
      
    </nav>
  )
}


export default Navbar

