import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useState, useEffect } from 'react'

const HomeComponent = () => {

    const [subscribers, setSubscribers] = useState([])
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getToken()
        console.log('useEffect check')
    }, [])

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


            var clientID = ""
            var clientSecret = ""
            var returnCode = ""

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
            // console.log(body)
            console.log('token', body.access_token)

            localStorage.setItem('token', body.access_token)

        }
        catch (e) { console.log('wrong', e) }
    }

    const getSubscribers = async () => {
        try {

            axios.get('https://oauth.reddit.com/subreddits/mine/subscriber', {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.data.data.children)
                .then(subscribers => {
                    const subscribersArray = subscribers.map(subscriber => {
                        console.log(subscriber)
                        return subscriber.data.title
                    })

                    setSubscribers(subscribersArray)

                })

        }
        catch (e) { console.log('wrong', e) }

    }

    const getPosts = async () => {
        try {
            axios.get('https://oauth.reddit.com/best', {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    console.log('best response:', response)
                    // console.log('data:', response.data.data.children)
                    const posts = response.data.data.children.map(post => {
                        return post.data.title
                    })
                    console.log(posts)
                    setPosts(posts)
                })

        }
        catch (e) { console.log('wrong', e) }

    }
    return (
        <div>
            <h1>Hi this is home component</h1>
            {/* <button onClick={getToken}>get access token</button> */}
            <button onClick={getSubscribers}>get Subscribers</button>
            <button onClick={getPosts}>get Posts</button>
            <Link to='/'>back</Link>
            <br />
            <br />

            Subsriber - {subscribers.length}
            {subscribers.map(subscriber => <div key={subscriber}>{subscriber}<br /></div>)
            }

            Posts - {posts.length}
            {posts.map(post => <div key={post}>{post}<br /></div>)}
        </div >
    )
}

export default HomeComponent