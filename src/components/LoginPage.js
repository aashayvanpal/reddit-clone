

// clientid= 	"Dx-o-uwCoHe3vK_QYyrAPA"
var clientID = "UljU99t3hulMhdrVGKjN1w"
var clientSecret = "o7vuAK_Ph6pOB06N2rM3gJRt3Qplpw"
var returnCode = "statecheck"

const LoginForm = () => {
    const redirectUser = async (e) => {
        e.preventDefault()
        const account = window.open(`https://www.reddit.com/api/v1/authorize?client_id=${clientID}&response_type=code&state=statecheck&redirect_uri=http://localhost:3000/home&duration=permanent&scope=identity,save,edit,submit`, "_self")

    }
    return (
        <div>
            Login with reddit<br />
            <button onClick={redirectUser}> Login</button>
        </div>
    )
}

export default LoginForm