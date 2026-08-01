import Logo from "./Logo";
import LoginForm from "./LoginForm";
import LoginIllustration from "./LoginIllustration";


const Login=()=>{


return(

<div className="
min-h-screen
bg-slate-50
flex
items-center
justify-center
p-6
">


<div className="
max-w-6xl
w-full
grid
lg:grid-cols-2
gap-10
bg-white
rounded-3xl
shadow-xl
p-8
">


<LoginIllustration/>


<div className="
flex
flex-col
justify-center
px-4
">


<Logo/>


<h2 className="
text-3xl
font-bold
text-slate-900
mt-10
">

Welcome Back

</h2>


<p className="
text-slate-500
mt-2
mb-8
">

Login to your doctor dashboard

</p>



<LoginForm/>


</div>



</div>


</div>


)

}


export default Login;