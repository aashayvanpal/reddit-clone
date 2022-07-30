import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'


const HomeComponent = (props) => {

    const [selectedId, setSelectedId] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [selectedArticle, setSelectedArticle] = useState('')
    const [subscribers, setSubscribers] = useState([])
    const [posts, setPosts] = useState([])
    const [postId, setPostId] = useState('')
    const [comments, setComments] = useState([])
    const [count, setCount] = useState(props.count + 5)

    useEffect(async () => {
        console.log('redux check :', props)
        setCount(props.count)
        await getToken()
        await getSubscribers()
    }, [])

    useEffect(() => {
        console.log('redux check only props :', props)
        setCount(props.count)
    }, [props])



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
            <h1>Hi this is home component - {count}</h1>
            <button onClick={getPosts}>get Posts</button>
            <button onClick={getComment}>get comment</button>
            <Link to='/'>back</Link>
            <br />
            <br />
            <hr />
            <button onClick={() => props.increment(10)}>increment count</button>
            <hr />
            <hr />
            selected id - {selectedId} /
            selected name - {selectedName} /
            selected Article - {selectedArticle}
            <hr />

            You have subscribed to these reddits :-
            {subscribers.map(subscriber => <div key={subscriber.data.id}>
                {/* ::: {subscriber.data.name}<br /> */}
                <button onClick={() => {
                    setSelectedId(subscriber.data.name)
                    setSelectedName(subscriber.data.display_name_prefixed)
                }}>
                    {subscriber.data.title}
                </button>
            </div>)
            }

            full string - {`https://oauth.reddit.com/${selectedName}/comments/${postId}/${selectedArticle}`}
            <hr />
            Posts - {posts.length}
            {posts.filter(post => post.data.subreddit_id === selectedId).map(post => {
                // {/* {post.data.id}--? / */}
                // {/* {post.data.subreddit_name_prefixed}/ */}
                // {/* {post.data.subreddit_id} */}
                return <div><button onClick={() => {
                    setPostId(post.data.id)
                    setSelectedArticle(post.data.title.replaceAll(' ', '_'))
                }}>

                    {post.data.title}
                </button><br /></div>
            })}



            <hr />
            Comments - {customElements.length}
            {comments.map(comment => <div key={comment.id}>
                {comment.data.id}--? {comment.data.body} - {comment.data.subreddit_id}
                <br />
            </div>)
            }

        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        count: state.count
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        increment: (num) => { return dispatch({ type: 'INCREMENT', payload: num }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent)