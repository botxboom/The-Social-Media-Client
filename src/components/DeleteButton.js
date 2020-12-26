import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import {Button, Confirm, Icon, Popup } from 'semantic-ui-react'

import {FETCH_POSTS_QUERY} from '../util/graphql'

function DeleteButton({postId, commentId, callback}) {


    const [confirm, setConfirm ] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
    
    const [deletePostOrMutation] = useMutation(mutation, {
        variables: {
            postId,
            commentId
        },
        update(proxy){
            setConfirm(false)
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data});
            } else {

            }
            if(callback) callback()
        }
    })

    return (
        <div style={{float: 'right'}} class="ui labeled button" tabIndex="0">
            <div>
                <Popup
                content="delete"
                inverted
                trigger={
                    <Button className="custom-button" onClick={() => setConfirm(true)} icon>
                    <Icon name='trash red' />
                </Button>
                }/>
                <Confirm
                    open={confirm}
                    onCancel={() => setConfirm(false)}
                    onConfirm={deletePostOrMutation}
                    />
            </div>  
        </div>   
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`


export default DeleteButton
