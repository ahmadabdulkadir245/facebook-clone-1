import { app } from "../firebase";
import { useRouter } from "next/router";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import Head from "next/head";
import { RiEyeCloseFill, RiEyeLine, RiFacebookFill } from "react-icons/ri";
import {AuthContext} from '../context/authContext'
import axios from "axios";
import Loading from "../components/Loading";

function Login() {
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();
  const signInGoogle = async () => {
    signInWithPopup(auth, googleProvider)
      .then((response) => {
        router.push("/");
        sessionStorage.setItem("Token", response.user.accessToken);
      })
      .catch((err) => console.log(err));
  };

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordVissble, setPasswordVissible] = useState(false)
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  })
  const signIn = async () => {};

  const emailInputHandler = (e) => {
    const content = e.target.value;
    setEmail(content);
  };
  const passwordInputHandler = (e) => {
    const content = e.target.value;
    setPassword(content);
  };
  const emailIsValid = inputs.email.includes("@");
  const passwordIsValid = inputs.password.length >= 6;

  const inputHandler = (e) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    if (emailIsValid && passwordIsValid) {
      signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
          console.log(response.user);
          sessionStorage.setItem("Token", response.user.accessToken);
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

    // context
    const {login} = useContext(AuthContext)

    const submitHandler = async (e) => {
      e.preventDefault()
      setLoading(true)
      // if (emailIsValid && passwordIsValid ) {
        try{
        login(inputs, setInputs, setError, setLoading)
        }catch(err) {
          console.log(err)
          
        }
    }
  // useEffect(() => {
  //   let token = sessionStorage.getItem("Token");
  //   if (token) {
  //     router.push("/");
  //   }
  // }, []);

  if(loading) {
    return <Loading/>
  }


  return (
  <div className="relative ">
    
   <div className="py-10 md:py-0 grid grid-cols-1 place-content-center overflow-y-scroll xs:h-screen xs:palce-items-center xs:my-0  scrollbar-hide  text-gray-700 max-w-4xl m-auto text-sm">
          <Head>
           <title>Login</title>
           <meta name="description" content="Generated by create next app" />
           <link rel="icon" href="/favicon.ico" />
         </Head>
         
        <h2 className="sm:mt-24 md:mt-0 text-2xl text-center font-bold mb-2  ">Login</h2>
         <h2 className="text-2xl text-center font-bold mb-2">Welcome Back
         </h2>

        {error && <p className="text-red-500 text-xs lg:text-lg text-center">{error}</p>}
       <form >
         <input
                 type='email'
                 className='border-[0.5px] lg:border-[1px] rounded-lg  border-gray-500] outline-none px-4 py-[16px] w-[90%]  m-auto flex my-5 lg:my-5'
                 placeholder='Enter email '
                 required
                 name="email"
                 onChange={inputHandler}
               />

       <div className="flex items-center border-[1px] lg:border-[1px] rounded-lg   outline-none px-4 py-[16px] w-[90%]  m-auto  my-5 lg:my-5 bg-white">
      <input
              type={passwordVissble ? 'text' : 'password'}
              className='w-full h-full outline-none'
              placeholder='Password'
              required
              onChange={inputHandler}
              name="password"
              value={inputs.password}
              />
              {passwordVissble ?
              <>
                <RiEyeLine className="h-4 w-5 cursor-pointer" onClick={() => setPasswordVissible(!passwordVissble)}/>

              </>
                :
              <RiEyeCloseFill className="h-4 w-5 cursor-pointer" onClick={() => setPasswordVissible(!passwordVissble)}/>
                 }
              </div>
           </form>
   
           <Link href="/forgot-password">
            <p  className="text-[#2F89FC] capitalize text-center font-poppins">forgot password?</p>
           </Link>
   
           <button className="capitalize w-[90%] h-[48px] rounded-md text-white bg-[#0E64D2] block mt-4 m-auto" onClick={submitHandler}>login</button>
   
           <p className="font-poppins text-center mt-4">Dont have an account?
           <Link href="/signup" className="font-poppins text-[#2F89FC] ml-4">Signup</Link>
           </p>
   
           <div className="flex items-center justify-between px-4 mt-4">
             <span className="w-[44%] h-[1px] bg-gray-700"></span>
             <p className="font-poppins  text-lg">or</p>
             <span className="w-[44%] h-[1px] bg-gray-700"></span>
           </div>
   
           <button className=" w-[90%] h-[48px] rounded-md text-white bg-[#1877F2]  mt-4 m-auto flex items-center justify-between px-2">
           <RiFacebookFill className="w-7 h-7 "/>
             Login with Facebook
             <div></div>
             </button>
   
           <button className=" w-[90%] h-[48px] rounded-md text-gray-500 border-[1px] bg-white mt-4 m-auto flex items-center justify-between px-2 mb-4 sm:mb-0"   onClick={signInGoogle}>
           <FcGoogle className="w-7 h-7 "/>
             Login with Google
             <div></div>
             </button>
             </div>
         </div>
  );
}

export default Login;

Login.getLayout = function pageLayout(page) {
  return <>{page}</>;
};
