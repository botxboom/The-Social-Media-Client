import React, { useEffect, useState } from 'react'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'



function LikeButton({user, post: {id, likeCount, likes}}) {

    const [liked, setLiked ] = useState(false)

    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        }else setLiked(false)
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    })

    const likeButton = user ? (
        liked ? (
            <Popup
                content="unlike post"
                inverted
                trigger={
                <Button className="custom-button" icon>
                    <Icon name='heart blue' />
                </Button>}/>
        ) : (
            <Popup
            content="like post"
            inverted
            trigger={<Button className="custom-button" icon>
            <Icon name='heart outline blue basic' />
        </Button>} />
        )
    ) : (
        <Popup
        inverted
        content="like post"
        trigger={
            <Button as={Link} to="/login" className="custom-button" icon>
                <Icon name='heart outline blue basic' />
            </Button>
        } />
    )


    
    return (
        <div class="ui labeled button" tabIndex="0">
            {user ? (<div onClick={likePost}>
                {likeButton}
                {likeCount}
            </div>): (<div>{likeButton} {likeCount}</div>)}
        </div>
    )
} 

const LIKE_POST_MUTATION = gql `
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`

export default LikeButton
