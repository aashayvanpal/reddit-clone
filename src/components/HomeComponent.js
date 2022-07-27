import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'

const HomeComponent = () => {
    const getToken = async () => {
        var code = ''
        var urlParams;
        (window.onpopstate = function () {
            var match,
                pl = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query = window.location.search.substring(1);

            urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
        })();
        code = urlParams.code
        console.log(code)

        try {

            
            var clientID = "UljU99t3hulMhdrVGKjN1w"
            var clientSecret = "o7vuAK_Ph6pOB06N2rM3gJRt3Qplpw"
            var returnCode = "statecheck"

            const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString("base64")
            console.log(credentials)

            let response = await fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/home`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            })

            let body = await response.json()
            console.log(body)
        }
        catch (e) { console.log('wrong', e) }
    }

    return (
        <div>
            <h1>Hi this is home component</h1>
            <button onClick={getToken}>get access token</button>
            <Link to='/'>back</Link>
        </div>
    )
}

export default HomeComponent