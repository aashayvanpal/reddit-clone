import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useState, useEffect } from 'react'

const HomeComponent = () => {

    const [selectedId, setSelectedId] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [selectedArticle, setSelectedArticle] = useState('')
    const [subscribers, setSubscribers] = useState([])
    const [posts, setPosts] = useState([])
    const [postId, setPostId] = useState('')
    const [comments, setComments] = useState([])

    useEffect(() => {
        getToken()
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
                        return subscriber
                    })
                    console.log(subscribersArray)

                    setSubscribers(subscribersArray)
                    setSelectedId(subscribersArray[0].data.name)
                    setSelectedName(subscribersArray[0].data.display_name_prefixed)

                })

        }
        catch (e) { console.log('wrong', e) }

    }

    const getPosts = async () => {
        try {
            axios.get('https://oauth.reddit.com/best?limit=100', {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    console.log('best response:', response)
                    // console.log('data:', response.data.data.children)
                    const posts = response.data.data.children.map(post => {
                        return post
                    })
                    console.log(posts)
                    setPosts(posts)
                })

        }
        catch (e) { console.log('wrong', e) }

    }

    const getComment = async () => {
        try {
            axios.get(`https://oauth.reddit.com/${selectedName}/comments/${postId}/${selectedArticle}?dept=1`, {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    console.log('comment response:', response)
                    // console.log('data:', response.data.data.children)
                    const comments = response.data[1].data.children.map(comment => {
                        return comment
                    })
                    console.log(comments)
                    setComments(comments)

                })

        }
        catch (e) { console.log('wrong', e) }
    }
    return (
        <div>
            <h1>Hi this is home component</h1>
            <button onClick={getSubscribers}>get Subscribers</button>
            <button onClick={getPosts}>get Posts</button>
            <button onClick={getComment}>get comment</button>
            <Link to='/'>back</Link>
            <br />
            <br />
            <hr />
            selected id - {selectedId} /
            selected name - {selectedName} /
            selected Article - {selectedArticle}
            <hr />

            Subscribers - {subscribers.length}
            {subscribers.map(subscriber => <div key={subscriber.data.id}>
                <button onClick={() => {
                    setSelectedId(subscriber.data.name)
                    setSelectedName(subscriber.data.display_name_prefixed)
                }}>
                    {subscriber.data.title} ::: {subscriber.data.name}<br />
                </button>
            </div>)
            }

            full string - {`https://oauth.reddit.com/${selectedName}/comments/${postId}/${selectedArticle}`}
            <hr />
            Posts - {posts.length}
            {posts.filter(post => post.data.subreddit_id === selectedId).map(post => {
                return <div><button onClick={() => {
                    setPostId(post.data.id)
                    setSelectedArticle(post.data.title.replaceAll(' ', '_'))
                }}>
                    {post.data.id}--? /{post.data.subreddit_name_prefixed}/ {post.data.title} - {post.data.subreddit_id}
                </button><br /></div>
            })}



            <hr />
            Comments - {customElements.length}
            {comments.filter(comment => comment.data.subreddit_id === selectedId)
                .map(comment => <div key={comment.id}>
                    {comment.data.id}--? {comment.data.body} - {comment.data.subreddit_id}
                    <br />
                </div>)
            }

        </div >
    )
}

export default HomeComponent