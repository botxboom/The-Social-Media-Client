import React, { useContext, useRef, useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Image, Form, Button, Icon, Card, Grid } from 'semantic-ui-react'
import LikeButton from '../components/LikeButton'
import { AuthContext } from "../context/auth"
import moment from 'moment'
import DeleteButton from '../components/DeleteButton'


function SinglePost(props) {

    const { user } = useContext(AuthContext)
    const [comment, setComment] = useState('')
    const commentInputRef = useRef(null)

    const postId = props.match.params.postId
    console.log(postId)


    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
        variables: {
            postId,
            body: comment
        },
        update(){
            setComment('')
            commentInputRef.current.blur()

        }

    })

    function deletePostCallback(){
        props.history.push('/')
    }


    let postMarkup;

    if(!data){ 
        postMarkup = <p>Loading</p>

    }else{
        const { id, body, createdAt, username, comments,
                likes, likeCount, commentCount} = data.getPost
            
        postMarkup = (
            data.getPost && 
            (<Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                        src="https://semantic-ui.com/images/avatar/small/matt.jpg"
                        size="small"
                        float="right" />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}} />
                                <div class="ui labeled button" tabIndex="0">
                                    <div style={{ float: 'right'}}>
                                            <Button  className="custom-button" icon>
                                                <Icon name='comment blue' />
                                            </Button>
                                            {commentCount}
                                    </div>
                                </div>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                <p>Add Comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                            type="text"
                                            placeholder="add comment"
                                            name="comment"
                                            value={comment}
                                            onChange={event => setComment(event.target.value)}
                                            ref={commentInputRef}
                                        />
                                        <button type="submit"
                                        className="ui button blue"
                                        disabled={comment.trim() === ''}
                                        onClick={submitComment}
                                        >Submit</button>
                                    </div>
                                </Form>
                                </Card.Content>
                            </Card>
                        )}
                        { comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>)
        )
    }

    return postMarkup

}

const FETCH_POST_QUERY = gql`
     query($postId: ID!){
         getPost(postId: $postId){
             id body createdAt username likeCount
             likes{
                username
             }
             commentCount
             comments{
                id username createdAt body
             }
         }
     }
`

const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id 
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

export default SinglePost
